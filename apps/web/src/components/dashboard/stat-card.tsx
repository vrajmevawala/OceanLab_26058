'use client';
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
  accentColor?: string;
}

export function StatCard({ label, value, delta, trend = 'neutral', accentColor = 'var(--accent)' }: StatCardProps) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
      flex: 1,
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute',
        top: -20,
        right: -20,
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: accentColor,
        opacity: 0.07,
        filter: 'blur(20px)',
        pointerEvents: 'none',
      }} />

      <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{
        fontSize: 28,
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        color: 'var(--text)',
        letterSpacing: '-0.02em',
        marginBottom: 8,
      }}>
        {value}
      </div>
      {delta && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
          {trend === 'up' && <TrendingUp size={13} style={{ color: 'var(--green)' }} />}
          {trend === 'down' && <TrendingDown size={13} style={{ color: 'var(--red)' }} />}
          <span style={{ color: trend === 'up' ? 'var(--green)' : trend === 'down' ? 'var(--red)' : 'var(--text-dim)' }}>
            {delta}
          </span>
          <span style={{ color: 'var(--text-dim)' }}>vs last week</span>
        </div>
      )}
    </div>
  );
}
