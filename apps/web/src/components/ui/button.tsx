'use client';
import React from 'react';
import { clsx } from 'clsx';
import { Spinner } from './spinner';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'default' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const sizeMap: Record<ButtonSize, { height: string; padding: string; fontSize: string }> = {
  sm:      { height: '28px', padding: '0 10px', fontSize: '12px' },
  default: { height: '32px', padding: '0 14px', fontSize: '13px' },
  lg:      { height: '38px', padding: '0 18px', fontSize: '14px' },
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary:   { background: 'var(--accent)', color: '#0d1117', border: 'none', fontWeight: 600 },
  secondary: { background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' },
  ghost:     { background: 'transparent', color: 'var(--text-mid)', border: '1px solid transparent' },
  danger:    { background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid rgba(255,123,114,0.25)', fontWeight: 500 },
};

export function Button({
  variant = 'secondary',
  size = 'default',
  loading = false,
  icon,
  children,
  disabled,
  className,
  style,
  ...props
}: ButtonProps) {
  const sz = sizeMap[size];
  return (
    <button
      {...props}
      disabled={disabled || loading}
      style={{
        ...variantStyles[variant],
        height: sz.height,
        padding: sz.padding,
        fontSize: sz.fontSize,
        borderRadius: 'var(--radius-md)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: 'var(--font-ui)',
        fontWeight: variant === 'primary' ? 600 : 500,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'filter 0.15s, transform 0.1s, opacity 0.15s',
        whiteSpace: 'nowrap',
        ...style,
      }}
      className={clsx('btn', className)}
    >
      {loading ? <Spinner size={12} /> : icon}
      {children && <span>{children}</span>}
    </button>
  );
}
