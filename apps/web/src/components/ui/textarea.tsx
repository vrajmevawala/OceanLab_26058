'use client';
import React from 'react';
import { clsx } from 'clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  containerStyle?: React.CSSProperties;
}

export function Textarea({ label, containerStyle, className, style, ...props }: TextareaProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...containerStyle }}>
      {label && <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-mid)', marginLeft: '4px' }}>{label}</label>}
      <textarea
        {...props}
        className={clsx('textarea', className)}
        style={{
          width: '100%',
          minHeight: '120px',
          padding: '10px 12px',
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text)',
          fontSize: '13px',
          fontFamily: 'var(--font-mono)',
          outline: 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          resize: 'vertical',
          ...style,
        }}
      />
    </div>
  );
}
