'use client';
import React, { useState } from 'react';
import { clsx } from 'clsx';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[var(--surface-3)]',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[var(--surface-3)]',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[var(--surface-3)]',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[var(--surface-3)]',
  };

  return (
    <div
      className={clsx('relative inline-block', className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={clsx(
            'absolute z-[100] px-2 py-1.5 text-[11px] font-medium whitespace-nowrap',
            'bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text)]',
            'rounded-md shadow-lg pointer-events-none animate-in fade-in zoom-in-95 duration-150',
            positionClasses[position]
          )}
        >
          {content}
          <div
            className={clsx(
              'absolute border-4 border-transparent',
              arrowClasses[position]
            )}
          />
        </div>
      )}
    </div>
  );
}
