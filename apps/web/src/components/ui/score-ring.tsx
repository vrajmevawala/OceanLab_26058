'use client';
import React, { useEffect, useRef } from 'react';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: boolean;
}

function scoreColor(score: number) {
  if (score >= 80) return 'var(--green)';
  if (score >= 60) return 'var(--yellow)';
  return 'var(--red)';
}

export function ScoreRing({ score, size = 64, strokeWidth = 5, label = true }: ScoreRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const color = scoreColor(score);
  const offset = circumference * (1 - score / 100);

  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;
    el.style.transition = 'none';
    el.style.strokeDashoffset = `${circumference}`;
    void el.getBoundingClientRect();
    el.style.transition = 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    el.style.strokeDashoffset = `${offset}`;
  }, [score, circumference, offset]);

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--surface-3)"
          strokeWidth={strokeWidth}
        />
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
      </svg>
      {label && (
        <div style={{
          position: 'absolute',
          fontSize: size * 0.26,
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          color,
        }}>
          {score}
        </div>
      )}
    </div>
  );
}
