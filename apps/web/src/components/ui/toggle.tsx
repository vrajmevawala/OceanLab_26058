'use client';
import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export function Toggle({ checked, onChange, disabled, label }: ToggleProps) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }}>
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        style={{
          position: 'relative',
          width: 36,
          height: 20,
          borderRadius: 10,
          background: checked ? 'var(--accent)' : 'var(--surface-3)',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s ease',
          flexShrink: 0,
          padding: 0,
        }}
      >
        <span style={{
          position: 'absolute',
          top: 2,
          left: checked ? 18 : 2,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: checked ? '#0d1117' : 'var(--text-mid)',
          transition: 'left 0.2s ease, background 0.2s ease',
        }} />
      </button>
      {label && <span style={{ fontSize: 13, color: 'var(--text)' }}>{label}</span>}
    </label>
  );
}
