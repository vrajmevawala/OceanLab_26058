'use client';
import React from 'react';

interface LineNumbersProps {
  lineCount: number;
  highlightLine?: number;
  onLineClick?: (line: number) => void;
}

export function LineNumbers({ lineCount, highlightLine, onLineClick }: LineNumbersProps) {
  return (
    <div style={{
      width: 48,
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      padding: '16px 0',
      userSelect: 'none',
      flexShrink: 0,
    }}>
      {Array.from({ length: lineCount }).map((_, i) => {
        const lineNum = i + 1;
        const isHighlighted = highlightLine === lineNum;
        return (
          <div
            key={lineNum}
            onClick={() => onLineClick?.(lineNum)}
            style={{
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: 10,
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              color: isHighlighted ? 'var(--text)' : 'var(--text-dim)',
              background: isHighlighted ? 'rgba(240,136,62,0.15)' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {lineNum}
          </div>
        );
      })}
    </div>
  );
}
