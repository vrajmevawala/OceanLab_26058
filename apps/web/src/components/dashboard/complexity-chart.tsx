'use client';
import React from 'react';

export function ComplexityChart() {
  // Simple SVG-based complexity chart placeholder
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 20,
      height: 200,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>Cyclomatic Complexity</div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 8, padding: '10px 0' }}>
        {[4, 7, 3, 9, 2, 5, 8, 4, 6].map((h, i) => (
          <div key={i} style={{
            flex: 1,
            height: `${h * 10}%`,
            background: h > 7 ? 'var(--red)' : h > 4 ? 'var(--yellow)' : 'var(--accent)',
            borderRadius: '2px 2px 0 0',
            opacity: 0.8,
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-dim)' }}>
        <span>v1.0.2</span>
        <span>Current</span>
      </div>
    </div>
  );
}
