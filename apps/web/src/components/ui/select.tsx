'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { clsx } from 'clsx';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  label,
  disabled,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={clsx('flex flex-col gap-1.5', className)} ref={containerRef}>
      {label && <label className="text-xs font-medium text-[var(--text-mid)] ml-1">{label}</label>}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            'flex items-center justify-between w-full h-9 px-3 text-[13px] rounded-[var(--radius-md)] border transition-all outline-none',
            'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)]',
            'hover:bg-[var(--surface-3)] focus:border-[var(--accent)]',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <span className={clsx(!selectedOption && 'text-[var(--text-dim)]')}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            size={14}
            className={clsx('text-[var(--text-dim)] transition-transform', isOpen && 'rotate-180')}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={clsx(
                  'flex items-center justify-between w-full px-3 py-2 text-left text-[13px] transition-colors',
                  'hover:bg-[var(--surface-3)]',
                  option.value === value ? 'text-[var(--accent)]' : 'text-[var(--text)]'
                )}
              >
                <span>{option.label}</span>
                {option.value === value && <Check size={14} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
