'use client';
import React, { useState } from 'react';
import { ScoreRing } from '../ui/score-ring';
import { IssueList } from './issue-list';
import { DiffView } from './diff-view';
import { MetricsPanel } from './metrics-panel';
import type { AnalysisFile } from '@/types';

interface AnalysisPanelProps {
  file: AnalysisFile;
  activeIssueId?: string;
  onIssueClick: (id: string) => void;
}

type Tab = 'issues' | 'diff' | 'metrics';

export function AnalysisPanel({ file, activeIssueId, onIssueClick }: AnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('issues');

  return (
    <div style={{
      width: 'var(--panel-w)',
      height: '100%',
      background: 'var(--surface)',
      borderLeft: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <ScoreRing score={file.score} size={48} strokeWidth={4} />
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>Quality Score</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name.split('/').pop()}</div>
            <div style={{ fontSize: 11, color: 'var(--text-mid)' }}>{file.issueCount} issues · {file.fixedCount} fixable</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        padding: '0 16px',
        borderBottom: '1px solid var(--border)',
        height: 36,
        gap: 20,
      }}>
        {(['issues', 'diff', 'metrics'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              fontSize: 12,
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? 'var(--accent)' : 'var(--text-mid)',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
              textTransform: 'capitalize',
            }}
          >
            {tab} {tab === 'issues' && `(${file.issueCount})`}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'issues' && (
          <IssueList
            issues={file.issues}
            activeIssueId={activeIssueId}
            onIssueClick={onIssueClick}
          />
        )}
        {activeTab === 'diff' && <DiffView code={file.code} issues={file.issues} />}
        {activeTab === 'metrics' && <MetricsPanel file={file} />}
      </div>
    </div>
  );
}
