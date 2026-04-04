'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Info } from 'lucide-react';

export type PlanId = string;

export interface Feature {
  text: string;
  hasInfo?: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  priceMonthly: string;
  priceYearly: string;
  badge?: string;
  featuresLabel?: string;
  features: Feature[];
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Get started with the basics',
    priceMonthly: '$0',
    priceYearly: '$0',
    featuresLabel: 'Includes:',
    features: [
      { text: 'Web UI only' },
      { text: '1 workspace' },
      { text: '7-day history' },
      { text: 'GPT-4o analysis' },
      { text: 'Community support' },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Best for individuals & small teams',
    priceMonthly: '$19',
    priceYearly: '$15',
    badge: 'Popular',
    featuresLabel: 'Everything in Free, plus:',
    features: [
      { text: 'VS Code + CLI' },
      { text: 'GitHub App' },
      { text: '90-day history' },
      { text: 'Multi-model AI', hasInfo: true },
      { text: 'Priority support' },
    ],
  },
  {
    id: 'team',
    name: 'Team',
    description: 'Built for growing teams',
    priceMonthly: '$49',
    priceYearly: '$39',
    featuresLabel: 'Everything in Pro, plus:',
    features: [
      { text: 'Full RBAC', hasInfo: true },
      { text: 'Custom rules' },
      { text: 'Slack integration' },
      { text: '1-year history' },
      { text: 'Analytics dashboard' },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large orgs & regulated industries',
    priceMonthly: 'Custom',
    priceYearly: 'Custom',
    featuresLabel: 'Everything in Team, plus:',
    features: [
      { text: 'Self-hosted' },
      { text: 'SAML SSO' },
      { text: 'SLA guarantee', hasInfo: true },
      { text: 'SOC 2 certified' },
      { text: 'Dedicated support' },
    ],
  },
];

interface PricingGridProps {
  onGetStarted?: () => void;
}

export function PricingGrid({ onGetStarted }: PricingGridProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleContinue = () => {
    if (selectedPlan === 'free' || selectedPlan === 'pro') {
      onGetStarted?.();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 460,
          backgroundColor: '#f5f5f5',
          borderRadius: 24,
          padding: 6,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.07)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 12px 8px',
          }}
        >
          <h2
            style={{
              fontSize: 17,
              fontWeight: 500,
              color: '#1a1a1a',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            Select a plan
          </h2>

          {/* Billing toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#e4e4e4',
              padding: 4,
              borderRadius: 99,
              position: 'relative',
            }}
          >
            <motion.div
              style={{
                position: 'absolute',
                top: 4,
                bottom: 4,
                left: 4,
                width: 'calc(50% - 4px)',
                backgroundColor: '#ffffff',
                borderRadius: 99,
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              }}
              animate={{ x: billingCycle === 'monthly' ? 0 : '100%' }}
              transition={{ type: 'spring', bounce: 0.4, duration: 0.7 }}
            />
            {(['monthly', 'yearly'] as const).map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  width: 72,
                  padding: '6px 0',
                  borderRadius: 99,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: billingCycle === cycle ? '#1a1a1a' : '#999999',
                  transition: 'color 0.2s',
                  fontFamily: 'inherit',
                }}
              >
                {cycle === 'monthly' ? 'Monthly' : 'Yearly'}
              </button>
            ))}
          </div>
        </div>

        {/* Plans list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;

            return (
              <motion.div
                layout
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                transition={{ type: 'spring', bounce: 0.45, duration: 0.7 }}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  borderRadius: 18,
                  backgroundColor: '#ffffff',
                  border: isSelected ? '1.5px solid #e8452c' : '1px solid rgba(0,0,0,0.08)',
                  boxShadow: isSelected
                    ? '0 4px 16px rgba(232,69,44,0.10)'
                    : '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ padding: '14px 16px' }}>
                  {/* Plan top row */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 12,
                    }}
                  >
                    {/* Left: radio + name */}
                    <div style={{ display: 'flex', flex: 1, gap: 10, alignItems: 'flex-start' }}>
                      {/* Radio circle */}
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          border: isSelected ? '2px solid #e8452c' : '1.5px solid #d1d1d1',
                          backgroundColor: isSelected ? '#e8452c' : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: 2,
                          transition: 'all 0.2s',
                        }}
                      >
                        {isSelected && <Check size={10} strokeWidth={3.5} color="#ffffff" />}
                      </div>

                      {/* Name + description */}
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 15,
                              fontWeight: 500,
                              color: '#1a1a1a',
                              lineHeight: 1,
                            }}
                          >
                            {plan.name}
                          </span>
                          {plan.badge && (
                            <span
                              style={{
                                backgroundColor: '#dcfce7',
                                color: '#15803d',
                                fontSize: 9,
                                fontWeight: 700,
                                padding: '2px 7px',
                                borderRadius: 99,
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                lineHeight: 1,
                              }}
                            >
                              {plan.badge}
                            </span>
                          )}
                        </div>
                        <span
                          style={{
                            display: 'block',
                            fontSize: 11,
                            color: '#888888',
                            marginTop: 5,
                            lineHeight: 1.3,
                          }}
                        >
                          {plan.description}
                        </span>
                      </div>
                    </div>

                    {/* Right: price */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 500,
                          color: '#1a1a1a',
                          lineHeight: 1,
                          overflow: 'hidden',
                          height: 18,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={billingCycle}
                            initial={{
                              y: billingCycle === 'yearly' ? 16 : -16,
                              opacity: 0,
                              filter: 'blur(4px)',
                            }}
                            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                            exit={{
                              y: billingCycle === 'monthly' ? -16 : 16,
                              opacity: 0,
                              filter: 'blur(4px)',
                            }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                            style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
                          >
                            {price}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                      {plan.id !== 'enterprise' && (
                        <span
                          style={{
                            fontSize: 10,
                            color: '#aaaaaa',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            marginTop: 5,
                            lineHeight: 1,
                          }}
                        >
                          /month
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expandable features */}
                  <AnimatePresence initial={false}>
                    {isSelected && (
                      <motion.div
                        key="features"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          opacity: { duration: 0.2 },
                          height: { duration: 0.3, ease: 'easeOut' },
                        }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div
                          style={{
                            paddingTop: 14,
                            marginTop: 14,
                            marginBottom: 4,
                            borderTop: '1px dashed #e4e4e4',
                          }}
                        >
                          {plan.featuresLabel && (
                            <p
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                color: '#aaaaaa',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                margin: '0 0 10px 0',
                              }}
                            >
                              {plan.featuresLabel}
                            </p>
                          )}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {plan.features.map((feature, idx) => (
                              <div
                                key={idx}
                                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                              >
                                <Check
                                  size={14}
                                  strokeWidth={3}
                                  color="#22c55e"
                                  style={{ flexShrink: 0 }}
                                />
                                <span
                                  style={{
                                    fontSize: 12,
                                    color: '#555555',
                                    lineHeight: 1.3,
                                  }}
                                >
                                  {feature.text}
                                </span>
                                {feature.hasInfo && (
                                  <Info size={13} color="#cccccc" style={{ marginLeft: 2 }} />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 16,
            padding: '0 12px 8px',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: 10,
              color: '#aaaaaa',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              lineHeight: 1.6,
            }}
          >
            Cancel anytime. No long-term contract.
          </span>
          <button
            onClick={handleContinue}
            style={{
              backgroundColor: '#e8452c',
              color: '#ffffff',
              border: 'none',
              borderRadius: 99,
              padding: '10px 28px',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#d03a22';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#e8452c';
            }}
          >
            {selectedPlan === 'enterprise' ? 'Contact Sales' : 'Get Started'}
          </button>
        </div>
      </div>
    </div>
  );
}