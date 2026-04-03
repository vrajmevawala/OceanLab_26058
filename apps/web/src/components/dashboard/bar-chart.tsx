'use client';
import React from 'react';

type BarChartPoint = {
  day: string;
  files: number;
};

interface BarChartProps {
  data: BarChartPoint[];
}

export function BarChart({ data }: BarChartProps) {
  const maxVal = data.length > 0 ? Math.max(...data.map((d) => d.files)) : 1;

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      flex: 1,
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Files Analyzed — This Week</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
        {data.map((d) => {
          const height = maxVal > 0 && !isNaN(d.files) ? Math.max((d.files / maxVal) * 90, 8) : 8;
          return (
            <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
              <div
                style={{
                  width: '100%',
                  height,
                  background: 'var(--accent)',
                  borderRadius: '3px 3px 0 0',
                  opacity: 0.75,
                  transition: 'height 0.4s ease, filter 0.15s',
                  cursor: 'default',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.filter = 'brightness(1.3)'; (e.currentTarget as HTMLDivElement).style.opacity = '1'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.filter = ''; (e.currentTarget as HTMLDivElement).style.opacity = '0.75'; }}
                title={`${d.day}: ${d.files} files`}
              />
              <span style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{d.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
