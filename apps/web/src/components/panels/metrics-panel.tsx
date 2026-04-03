'use client';
import React from 'react';
import type { AnalysisFile, Metric } from '@/types';

interface MetricsPanelProps {
  file: AnalysisFile;
}

export function MetricsPanel({ file }: MetricsPanelProps) {
  const metrics: Metric[] = [
    { label: 'Complexity', value: 'High', sub: 'Cyclomatic: 24', color: 'var(--red)' },
    { label: 'Maintainability', value: '64/100', sub: 'Needs refactor', color: 'var(--yellow)' },
    { label: 'Reliability', value: 'A', sub: '0 bugs found', color: 'var(--green)' },
    { label: 'Security', value: 'D', sub: '2 vulnerabilities', color: 'var(--red)' },
    { label: 'Technical Debt', value: '4.2h', sub: 'Estimated fix time', color: 'var(--info)' },
    { label: 'Coverage', value: '82%', sub: 'Unit tests', color: 'var(--green)' },
  ];

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        {metrics.map(m => (
          <div key={m.label} style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            padding: '12px',
            borderRadius: 8,
          }}>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: m.color || 'var(--text)' }}>{m.value}</div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
        <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 12 }}>Complexity Breakdown</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {['processUserData', 'processTag', 'validateInput'].map(fn => (
            <div key={fn}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-mid)' }}>{fn}()</span>
                <span style={{ color: 'var(--text-dim)' }}>{fn === 'processTag' ? '86%' : '42%'}</span>
              </div>
              <div style={{ height: 4, background: 'var(--surface-3)', borderRadius: 2 }}>
                <div style={{
                  height: '100%',
                  background: fn === 'processTag' ? 'var(--red)' : 'var(--green)',
                  width: fn === 'processTag' ? '86%' : '42%',
                  borderRadius: 2
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
