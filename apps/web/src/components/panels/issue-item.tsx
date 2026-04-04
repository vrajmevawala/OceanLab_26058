'use client';
import React from 'react';
import { ChevronRight, ChevronDown, Zap } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import type { Issue } from '@/types';

interface IssueItemProps {
  issue: Issue;
  active?: boolean;
  onClick: () => void;
  onApplyFix?: (id: string) => void;
}

export function IssueItem({ issue, active, onClick, onApplyFix }: IssueItemProps) {
  const severityColor = {
    error:   'var(--red)',
    warning: 'var(--yellow)',
    info:    'var(--info)',
  }[issue.severity];

  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px 16px',
        cursor: 'pointer',
        background: active ? 'rgba(240,136,62,0.04)' : 'transparent',
        borderLeft: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--surface-2)'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <div style={{ marginTop: 2, color: severityColor }}>
          {active ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', lineHeight: 1.3 }}>
              {issue.message}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              Ln {issue.line}{issue.endLine && issue.endLine > issue.line ? `–${issue.endLine}` : ''}
            </span>
            <Badge variant="dim">{issue.rule}</Badge>
            {issue.metadata?.timeComplexity && <Badge variant="dim">{issue.metadata.timeComplexity}</Badge>}
            {issue.fixable && <Badge variant="accent">fixable</Badge>}
          </div>
        </div>
      </div>

      {active && (
        <div style={{ marginTop: 12, paddingLeft: 22 }}>
          <p style={{ fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.5, marginBottom: 12 }}>
            {issue.explanation || issue.message}
          </p>
          
          {issue.fix && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>Suggested fix (Diff):</div>
              <div style={{
                background: 'var(--bg)',
                borderRadius: 4,
                border: '1px solid var(--border)',
                overflow: 'hidden',
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
              }}>
                {/* Removals */}
                {(issue.originalCode || '').split('\n').map((line, i) => (
                  <div key={`rem-${i}`} style={{
                    padding: '2px 12px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#fca5a5',
                    display: 'flex',
                    gap: 8,
                  }}>
                    <span style={{ opacity: 0.5, userSelect: 'none', width: 12 }}>-</span>
                    <span style={{ whiteSpace: 'pre' }}>{line}</span>
                  </div>
                ))}
                {/* Additions */}
                {(issue.fix || '').split('\n').map((line, i) => (
                  <div key={`add-${i}`} style={{
                    padding: '2px 12px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    color: '#86efac',
                    display: 'flex',
                    gap: 8,
                  }}>
                    <span style={{ opacity: 0.5, userSelect: 'none', width: 12 }}>+</span>
                    <span style={{ whiteSpace: 'pre' }}>{line}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {issue.fixable && (
            <Button 
              variant="primary" 
              size="sm" 
              icon={<Zap size={13} fill="currentColor" />}
              onClick={(e) => {
                e.stopPropagation();
                onApplyFix?.(issue.id);
              }}
            >
              Quick Fix
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
