'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { PricingGrid } from '@/components/landing/pricing-grid';
import { Zap } from 'lucide-react';

export default function BillingPage() {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 980, margin: '0 auto', width: '100%' }}>
      {/* Current plan banner */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderLeft: '3px solid var(--accent)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'var(--accent-dim)', border: '1px solid rgba(240,136,62,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Zap size={18} style={{ color: 'var(--accent)' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>Pro Plan</div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Next billing date: Apr 25, 2026 · 6,840 / 10,000 credits used this month</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 20, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text)' }}>$19</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>/month</div>
        </div>
        <Button variant="danger" size="sm">Cancel Plan</Button>
      </div>

      {/* Plans */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Change Plan</div>
        <PricingGrid />
      </div>
    </div>
  );
}
