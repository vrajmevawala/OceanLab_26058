'use client';
import React from 'react';

interface ScanOverlayProps {
  scanning: boolean;
  progress?: number;
}

export function ScanOverlay({ scanning, progress = 0 }: ScanOverlayProps) {
  if (!scanning) return null;
  return (
    <>
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 10,
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '30%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(240,136,62,0.08), rgba(240,136,62,0.15), rgba(240,136,62,0.08), transparent)',
          animation: 'scanSweep 1.6s ease-in-out infinite',
        }} />
      </div>
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 2,
        background: 'var(--surface-3)',
        zIndex: 11,
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'var(--accent)',
          transition: 'width 0.3s ease',
        }} />
      </div>
    </>
  );
}
