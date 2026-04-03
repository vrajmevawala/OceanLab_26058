'use client';
import React from 'react';

interface SpinnerProps { size?: number; color?: string; }

export function Spinner({ size = 16, color = 'currentColor' }: SpinnerProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        border: `2px solid rgba(255,255,255,0.15)`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        flexShrink: 0,
      }}
      aria-label="Loading"
    />
  );
}
