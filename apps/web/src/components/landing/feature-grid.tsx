'use client';
import React from 'react';
import { Shield, Zap, BarChart2, GitBranch, Wrench, Users } from 'lucide-react';

const FEATURES = [
  {
    icon: Zap,
    color: 'var(--accent)',
    title: 'AI-Powered Analysis',
    desc: 'Multi-model AI (GPT-4o, Claude 3.5) detects bugs, complexity issues, and security vulnerabilities with AST-level precision.',
  },
  {
    icon: Shield,
    color: 'var(--red)',
    title: 'Security Scanning',
    desc: 'OWASP Top 10, SQL injection, exposed secrets, path traversal — all detected before they reach production.',
  },
  {
    icon: BarChart2,
    color: 'var(--green)',
    title: 'Performance Analysis',
    desc: 'Identify O(n²) loops, N+1 queries, memory leaks, and synchronous blocking calls with algorithmic fix suggestions.',
  },
  {
    icon: Wrench,
    color: 'var(--info)',
    title: 'One-Click Fixes',
    desc: 'Accept, reject, or modify AI-generated patches with full diff preview. Never blind auto-apply.',
  },
  {
    icon: GitBranch,
    color: 'var(--yellow)',
    title: 'GitHub Integration',
    desc: 'Automatic PR comments on every push. CI/CD gates with exit codes. VS Code live squiggles.',
  },
  {
    icon: Users,
    color: '#d2a8ff',
    title: 'Team Collaboration',
    desc: 'Shared workspaces, RBAC, async review threads, and team quality scores — all in one place.',
  },
];

export function FeatureGrid() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16,
    }}>
      {FEATURES.map((f) => {
        const Icon = f.icon;
        return (
          <div
            key={f.title}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = f.color;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = '';
            }}
          >
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: f.color + '18',
              border: `1px solid ${f.color}33`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}>
              <Icon size={17} style={{ color: f.color }} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>{f.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: '20px' }}>{f.desc}</div>
          </div>
        );
      })}
    </div>
  );
}
