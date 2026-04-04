import { Worker } from 'bullmq';
import Groq from 'groq-sdk';
import { sql, eq } from 'drizzle-orm';
import { db } from '@codeopt/db';
import { analyses, fixes, issues, users } from '@codeopt/db/schema';
import { Redis } from 'ioredis';
import { 
  buildAnalysisSystemPrompt, 
  buildAnalysisUserPrompt, 
  buildFixPrompt,
  buildASTContext
} from './prompts.js';
import { getTreeSitterAnalysis, snapToNode } from './utils/tree-sitter-analyzer.js';

const redisUrl = process.env.UPSTASH_REDIS_URL;
if (!redisUrl) {
  throw new Error('UPSTASH_REDIS_URL is required for worker startup.');
}

const connection = new Redis(redisUrl, { maxRetriesPerRequest: null });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY ?? '' });

type ReportedIssue = {
  line: number;
  endLine?: number;
  col?: number;
  severity: 'error' | 'warning' | 'info';
  category: string; // Accept any category from LLM, normalize later
  rule: string;
  message: string;
  suggestion?: string;
  codeSnippet?: string;
  fixable?: boolean;
  metricsImpact?: {
    timeComplexity?: string;
    spaceComplexity?: string;
  };
};

// Valid DB categories
const VALID_DB_CATEGORIES = ['security', 'performance', 'complexity', 'style', 'best-practice', 'bug'] as const;
type DbCategory = typeof VALID_DB_CATEGORIES[number];

// Map LLM-generated categories to valid DB categories
const CATEGORY_MAP: Record<string, DbCategory> = {
  // Direct matches
  security: 'security',
  performance: 'performance',
  complexity: 'complexity',
  style: 'style',
  'best-practice': 'best-practice',
  bug: 'bug',
  // Syntax / compilation → bug
  syntax: 'bug',
  'syntax-error': 'bug',
  compilation: 'bug',
  'compile-error': 'bug',
  error: 'bug',
  'type-error': 'bug',
  'type-safety': 'bug',
  'runtime-error': 'bug',
  logic: 'bug',
  // Memory → performance
  memory: 'performance',
  'memory-leak': 'performance',
  optimization: 'performance',
  efficiency: 'performance',
  // Redundancy / readability → style
  redundancy: 'style',
  readability: 'style',
  naming: 'style',
  formatting: 'style',
  convention: 'style',
  'code-smell': 'style',
  // Misc
  maintainability: 'complexity',
  refactoring: 'complexity',
  'dead-code': 'style',
};

// Categories that should always be treated as errors
const ERROR_CATEGORIES = new Set(['syntax', 'syntax-error', 'compilation', 'compile-error', 'type-error', 'runtime-error']);

function normalizeCategory(category: string): DbCategory {
  const lower = category.toLowerCase().trim();
  return CATEGORY_MAP[lower] ?? 'bug'; // Default unmapped categories to 'bug'
}

function normalizeSeverity(severity: string, category: string): 'error' | 'warning' | 'info' {
  const lowerCat = category.toLowerCase().trim();
  // Syntax and compilation issues are always errors
  if (ERROR_CATEGORIES.has(lowerCat)) {
    return 'error';
  }
  
  // As requested, ONLY syntax/compilation issues can be errors.
  // If the LLM returned 'error' for anything else, downgrade it to 'warning'.
  if (severity === 'error') {
    return 'warning';
  }
  
  // Keep the LLM's severity if it's warning or info
  if (severity === 'warning' || severity === 'info') {
    return severity;
  }
  
  return 'warning'; // Default to warning
}

const COMPLETE_ANALYSIS_TOOL = {
  type: 'function' as const,
  function: {
    name: 'complete_analysis',
    description: 'Report all analysis findings including issues and overall code metrics',
    parameters: {
      type: 'object',
      properties: {
        issues: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              line: { type: 'number' },
              endLine: { type: 'number', description: 'The line number where the unoptimized section ends' },
              col: { type: 'number' },
              severity: { type: 'string', enum: ['error', 'warning', 'info'] },
              category: {
                type: 'string',
                enum: [
                  'security', 'performance', 'complexity', 'style', 'best-practice', 'bug',
                  'syntax', 'syntax-error', 'compilation', 'compile-error', 'error',
                  'memory', 'memory-leak', 'optimization', 'efficiency',
                  'redundancy', 'readability', 'naming', 'formatting', 'convention', 'code-smell',
                  'logic', 'type-error', 'type-safety', 'runtime-error',
                  'maintainability', 'refactoring', 'dead-code',
                ],
              },
              rule: { type: 'string' },
              message: { type: 'string' },
              suggestion: { type: 'string' },
              codeSnippet: { type: 'string' },
              fixable: { type: 'boolean' },
              metricsImpact: {
                type: 'object',
                properties: {
                  timeComplexity: { type: 'string' },
                  spaceComplexity: { type: 'string' },
                }
              },
            },
            required: ['line', 'severity', 'category', 'rule', 'message'],
          }
        },
        overallTimeComplexity: { type: 'string', description: 'Overall Big O time complexity (e.g., O(n))' },
        overallComplexityScore: { type: 'number', description: 'Score from 0-100 indicating how optimal the complexity is' },
      },
      required: ['issues', 'overallTimeComplexity', 'overallComplexityScore'],
    },
  },
};

// Removed buildAnalysisPrompt (moved to prompts.ts)

function extractCodeBlock(text: string): string | null {
  const match = text.match(/```[a-zA-Z]*\n([\s\S]*?)```/);
  return match?.[1]?.trim() ?? null;
}

export const analysisWorker = new Worker(
  'analysis',
  async (job) => {
    const { analysisId } = job.data as { analysisId: string; workspaceId: string };

    try {
      const [analysis] = await db.select().from(analyses).where(eq(analyses.id, analysisId)).limit(1);
      const code = (analysis.metadata as Record<string, unknown> | null)?.sourceCode as string | undefined;
      
      if (!code) {
        throw new Error('No source code available for analysis');
      }

      await db.delete(issues).where(eq(issues.analysisId, analysisId));

      const astMetrics = ['python', 'cpp', 'c++'].includes(analysis.language.toLowerCase()) 
        ? await getTreeSitterAnalysis(code, analysis.language) 
        : null;
      const astContext = astMetrics ? buildASTContext(astMetrics) : undefined;
      
      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: buildAnalysisSystemPrompt(analysis.language) },
          { role: 'user', content: buildAnalysisUserPrompt(analysis.language, code, astContext) }
        ],
        tools: [COMPLETE_ANALYSIS_TOOL],
        tool_choice: { type: 'function', function: { name: 'complete_analysis' } },
      });

      const toolCall = response.choices[0]?.message?.tool_calls?.[0];
      if (!toolCall || toolCall.function.name !== 'complete_analysis') {
        throw new Error('LLM failed to provide a valid complete_analysis tool call.');
      }

      const args = JSON.parse(toolCall.function.arguments);
      const reportedIssues: ReportedIssue[] = args.issues || [];
      const overallComplexity = {
        timeComplexity: args.overallTimeComplexity,
        complexityScore: args.overallComplexityScore,
      };

      // Normalize severities and categories first
      const normalizedIssues = reportedIssues.map(issue => ({
        ...issue,
        severity: normalizeSeverity(issue.severity, issue.category),
        category: normalizeCategory(issue.category),
      }));

      const lineCount = code.split('\n').length;
      const densityFactor = Math.max(1, lineCount / 100);
      
      const errorCount = normalizedIssues.filter((i) => i.severity === 'error').length;
      const warningCount = normalizedIssues.filter((i) => i.severity === 'warning').length;
      const infoCount = normalizedIssues.filter((i) => i.severity === 'info').length;

      const rawDeductions = (errorCount * 12 + warningCount * 5 + infoCount);
      let score = Math.max(0, Math.round(100 - (rawDeductions / densityFactor)));

      if (errorCount > 0) {
        score = 0;
      }

      let insertedIssueRows: Array<{ id: string; message: string }> = [];
      if (normalizedIssues.length > 0) {
        const issueValues = await Promise.all(normalizedIssues.map(async (issue) => {
          // Coordinate Snapping Pass (Optional)
          const snapped = await snapToNode(code, issue.line, issue.col ?? 0);
          
          const startLine = snapped?.line ?? issue.line;
          const endLine = snapped?.endLine ?? (issue.endLine && issue.endLine >= issue.line ? issue.endLine : (snapped?.line ?? issue.line));
          
          const codeLines = code.split('\n');
          const originalCodeSnippet = codeLines.slice(startLine - 1, endLine).join('\n');

          return {
            analysisId,
            line: startLine,
            col: snapped?.col ?? issue.col ?? 0,
            endLine: endLine,
            severity: issue.severity,
            category: issue.category,
            rule: issue.rule,
            message: issue.message,
            suggestion: issue.suggestion,
            codeSnippet: originalCodeSnippet || codeLines[startLine - 1] || '',
            fixable: issue.fixable ?? false,
            metadata: (issue.metricsImpact?.timeComplexity || issue.metricsImpact?.spaceComplexity) 
              ? { timeComplexity: issue.metricsImpact.timeComplexity, spaceComplexity: issue.metricsImpact.spaceComplexity } 
              : null,
          };
        }));

        insertedIssueRows = await db
          .insert(issues)
          .values(issueValues)
          .returning({ id: issues.id, message: issues.message });

        const fixable = normalizedIssues.filter((i) => i.fixable);
        for (const fixableIssue of fixable) {
          const issueRow = insertedIssueRows.find((r) => r.message === fixableIssue.message);
          if (!issueRow) continue;

          console.log(`[Worker] Generating fix for issue at line ${fixableIssue.line}`);
          const fixResp = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
              {
                role: 'user',
                content: buildFixPrompt(
                  analysis.language,
                  fixableIssue.message,
                  fixableIssue.codeSnippet ?? code.split('\n')[fixableIssue.line - 1],
                ),
              },
            ],
          });

          const explanation = fixResp.choices[0]?.message?.content || '';
          const fixedCode = extractCodeBlock(explanation) || explanation;

          if (fixedCode) {
            await db.insert(fixes).values({
              issueId: issueRow.id,
              originalCode: fixableIssue.codeSnippet || code.split('\n')[fixableIssue.line - 1],
              fixedCode,
              explanation: 'AI generated fix.',
              confidenceScore: 90,
            });
          }
          
          // Small delay between fix requests to refill TPM on Groq
          await new Promise(res => setTimeout(res, 1000));
        }
      }

      await db
        .update(analyses)
        .set({
          status: 'complete',
          score,
          linesOfCode: lineCount,
          cyclomaticComplexity: astMetrics?.cyclomaticComplexity || null,
          cognitiveComplexity: astMetrics?.cognitiveComplexity || null,
          metadata: { 
            ...((analysis.metadata as any) || {}), 
            timeComplexity: overallComplexity?.timeComplexity || null, 
            complexityScore: overallComplexity?.complexityScore || null 
          },
          tokensUsed: response.usage?.total_tokens || 0,
          completedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(analyses.id, analysisId));

      await db
        .update(users)
        .set({
          creditsUsed: sql`${users.creditsUsed} + ${analysis.creditsCharged ?? 0}`,
          updatedAt: new Date(),
        })
        .where(eq(users.id, analysis.createdById));
        
    } catch (err) {
      console.error("[Groq] Analysis failed:", err);
      await db
        .update(analyses)
        .set({ status: 'failed', errorMessage: String(err), updatedAt: new Date() })
        .where(eq(analyses.id, analysisId));
      throw err;
    }
  },
  { connection, concurrency: 1 },
);
