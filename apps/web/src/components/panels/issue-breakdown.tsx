'use client';
import React from 'react';
import { Progress } from '../ui/progress';

export function IssueBreakdown() {
  const categories = [
    { label: 'Security', count: 12, color: 'var(--red)' },
    { label: 'Performance', count: 8, color: 'var(--yellow)' },
    { label: 'Complexity', count: 15, color: 'var(--accent)' },
    { label: 'Maintainability', count: 24, color: 'var(--info)' },
  ];

  const total = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>Issue Distribution</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {categories.map((c) => (
          <div key={c.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
              <span style={{ color: 'var(--text-mid)' }}>{c.label}</span>
              <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{c.count}</span>
            </div>
            <Progress value={(c.count / total) * 100} color={c.color} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
