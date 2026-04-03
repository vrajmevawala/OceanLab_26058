'use client';
import React from 'react';
import { clsx } from 'clsx';

interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Progress({
  value,
  max = 100,
  label,
  showValue = false,
  color = 'var(--accent)',
  size = 'md',
  className,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={clsx('flex flex-col gap-1.5 w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs font-medium">
          {label && <span className="text-[var(--text-mid)]">{label}</span>}
          {showValue && <span className="text-[var(--text-dim)] font-mono">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div
        className={clsx(
          'w-full bg-[var(--surface-3)] rounded-full overflow-hidden',
          sizeClasses[size]
        )}
      >
        <div
          className="h-full transition-all duration-500 ease-out rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: percentage > 0 ? `0 0 8px ${color}44` : 'none',
          }}
        />
      </div>
    </div>
  );
}
