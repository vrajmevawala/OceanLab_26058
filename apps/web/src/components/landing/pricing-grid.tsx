'use client';
import React from 'react';
import { Check } from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    credits: '500 credits',
    cta: 'Get Started',
    ctaVariant: 'secondary' as const,
    popular: false,
    features: ['Web UI only', '1 workspace', '7-day history', 'GPT-4o analysis', 'Community support'],
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    credits: '10,000 credits',
    cta: 'Start Free Trial',
    ctaVariant: 'primary' as const,
    popular: true,
    features: ['VS Code + CLI', 'GitHub App', '90-day history', 'Multi-model AI', 'Priority support'],
  },
  {
    name: 'Team',
    price: '$49',
    period: '/seat/month',
    credits: 'Unlimited',
    cta: 'Start Team Trial',
    ctaVariant: 'secondary' as const,
    popular: false,
    features: ['Full RBAC', 'Custom rules', 'Slack integration', '1-year history', 'Analytics dashboard'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    credits: 'Unlimited',
    cta: 'Contact Sales',
    ctaVariant: 'secondary' as const,
    popular: false,
    features: ['Self-hosted', 'SAML SSO', 'SLA guarantee', 'SOC 2 certified', 'Dedicated support'],
  },
];

export function PricingGrid({ onGetStarted }: { onGetStarted?: () => void }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16,
    }}>
      {PLANS.map((plan) => (
        <div
          key={plan.name}
          style={{
            background: 'var(--surface)',
            border: plan.popular ? '1px solid var(--accent)' : '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: plan.popular ? '0 0 0 1px var(--accent), 0 0 32px rgba(240,136,62,0.08)' : 'none',
            position: 'relative',
          }}
        >
          {plan.popular && (
            <div style={{
              position: 'absolute',
              top: -12,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--accent)',
              color: '#0d1117',
              fontSize: 10,
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 20,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
              whiteSpace: 'nowrap',
            }}>
              Most Popular
            </div>
          )}

          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{plan.name}</div>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 28, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text)' }}>{plan.price}</span>
            <span style={{ fontSize: 12, color: 'var(--text-mid)' }}>{plan.period}</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-mono)', marginBottom: 20 }}>{plan.credits}/mo</div>

          <button
            onClick={plan.cta === 'Get Started' || plan.cta === 'Start Free Trial' ? onGetStarted : undefined}
            style={{
              width: '100%',
              height: 36,
              borderRadius: 'var(--radius-md)',
              border: plan.ctaVariant === 'primary' ? 'none' : '1px solid var(--border)',
              background: plan.ctaVariant === 'primary' ? 'var(--accent)' : 'var(--surface-2)',
              color: plan.ctaVariant === 'primary' ? '#0d1117' : 'var(--text)',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
              marginBottom: 20,
              transition: 'filter 0.15s, transform 0.1s',
            }}
          >
            {plan.cta}
          </button>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {plan.features.map(feat => (
              <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Check size={12} style={{ color: 'var(--green)', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--text-mid)' }}>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
