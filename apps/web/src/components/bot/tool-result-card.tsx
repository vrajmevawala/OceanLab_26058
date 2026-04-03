'use client';
import React from 'react';
import { clsx } from 'clsx';
import { FileCode, AlertCircle, Search, History, Zap } from 'lucide-react';
import { Badge } from '../ui/badge';

interface ToolResultProps {
  result: {
    type: 'analysis' | 'issues' | 'search' | 'fix' | 'history';
    data: any;
  };
}

export function ToolResultCard({ result }: ToolResultProps) {
  const Icon = {
    analysis: FileCode,
    issues: AlertCircle,
    search: Search,
    fix: Zap,
    history: History,
  }[result.type];

  return (
    <div className="bg-[var(--surface-3)] border border-[var(--border)] rounded-lg p-2.5 mt-1 flex flex-col gap-2 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2 border-bottom border-[var(--border)] pb-2 mb-1">
        <Icon size={14} className="text-[var(--accent)]" />
        <span className="text-[11px] font-semibold text-[var(--text-mid)] uppercase tracking-tight">
          {result.type} Result
        </span>
      </div>
      
      {result.type === 'issues' && (
        <div className="flex flex-col gap-1.5">
          {result.data.map((issue: any, i: number) => (
            <div key={i} className="flex flex-col gap-1 bg-[var(--surface-2)] p-2 rounded border border-[var(--border)]">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[var(--text)] font-medium">Issue at Line {issue.line}</span>
                <Badge variant="dim" size="xs">{issue.rule}</Badge>
              </div>
              <p className="text-[11px] text-[var(--text-dim)] line-clamp-2">{issue.message}</p>
            </div>
          ))}
        </div>
      )}
      
      {result.type === 'analysis' && (
        <div className="flex items-center gap-3 bg-[var(--surface-2)] p-2 rounded border border-[var(--border)]">
          <div className="text-[20px] font-bold text-[var(--accent)]">{result.data.score}</div>
          <div className="flex flex-col">
            <span className="text-[12px] font-medium text-[var(--text)]">{result.data.name}</span>
            <span className="text-[10px] text-[var(--text-dim)]">{result.data.issueCount} issues detected</span>
          </div>
        </div>
      )}
      
      {/* Add more type renderers as needed */}
    </div>
  );
}
