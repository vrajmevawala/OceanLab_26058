'use client';
import React from 'react';
import { clsx } from 'clsx';

interface Segment {
  label: string | React.ReactNode;
  value: string;
}

interface SegmentControlProps {
  segments: Segment[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentControl({
  segments,
  value,
  onChange,
  className,
}: SegmentControlProps) {
  return (
    <div
      className={clsx(
        'flex p-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-md)] w-fit',
        className
      )}
    >
      {segments.map((segment) => {
        const isActive = segment.value === value;
        return (
          <button
            key={segment.value}
            onClick={() => onChange(segment.value)}
            className={clsx(
              'px-3 py-1 text-[12px] font-medium rounded-[var(--radius-sm)] transition-all flex items-center gap-2',
              isActive
                ? 'bg-[var(--surface-3)] text-[var(--text)] shadow-sm'
                : 'text-[var(--text-mid)] hover:text-[var(--text)]'
            )}
          >
            {segment.label}
          </button>
        );
      })}
    </div>
  );
}
