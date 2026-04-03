'use client';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  containerStyle?: React.CSSProperties;
}

export function Input({ icon, containerStyle, style, ...props }: InputProps) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', ...containerStyle }}>
      {icon && (
        <span style={{
          position: 'absolute',
          left: 10,
          color: 'var(--text-dim)',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none',
        }}>
          {icon}
        </span>
      )}
      <input
        {...props}
        style={{
          width: '100%',
          height: 32,
          padding: icon ? '0 12px 0 32px' : '0 12px',
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text)',
          fontSize: 13,
          fontFamily: 'var(--font-ui)',
          outline: 'none',
          transition: 'border-color 0.15s',
          ...style,
        }}
      />
    </div>
  );
}
