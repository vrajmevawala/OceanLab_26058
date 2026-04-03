'use client';
import React from 'react';
import type { Issue, DiffLine } from '@/types';

interface DiffViewProps {
  code: string;
  issues: Issue[];
}

export function DiffView({ code, issues }: DiffViewProps) {
  const diffLines: DiffLine[] = [];
  const lines = code.split('\n');

  lines.forEach((line, i) => {
    const lineNum = i + 1;
    const issue = issues.find(iss => iss.line === lineNum && iss.fix);
    
    if (issue) {
      diffLines.push({ type: 'remove', lineNum, content: line });
      issue.fix?.split('\n').forEach(fixLine => {
        diffLines.push({ type: 'add', content: fixLine });
      });
    } else {
      diffLines.push({ type: 'context', lineNum, content: line });
    }
  });

  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
      {diffLines.map((line, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            background: line.type === 'add' ? 'rgba(63, 185, 80, 0.12)' : line.type === 'remove' ? 'rgba(255, 123, 114, 0.12)' : 'transparent',
            borderLeft: `3px solid ${line.type === 'add' ? 'var(--green)' : line.type === 'remove' ? 'var(--red)' : 'transparent'}`,
          }}
        >
          <div style={{
            width: 40,
            textAlign: 'right',
            padding: '0 8px',
            color: 'var(--text-dim)',
            flexShrink: 0,
            userSelect: 'none',
          }}>
            {line.lineNum || ''}
          </div>
          <div style={{
            width: 20,
            textAlign: 'center',
            color: line.type === 'add' ? 'var(--green)' : line.type === 'remove' ? 'var(--red)' : 'var(--text-dim)',
            flexShrink: 0,
            userSelect: 'none',
          }}>
            {line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '}
          </div>
          <pre style={{
            margin: 0,
            padding: '0 8px',
            color: line.type === 'add' ? 'var(--green)' : line.type === 'remove' ? 'var(--red)' : 'var(--text)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}>
            {line.content || ' '}
          </pre>
        </div>
      ))}
    </div>
  );
}
