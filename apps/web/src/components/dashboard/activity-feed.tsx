'use client';
import React from 'react';

type ActivityItem = {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  color: string;
};

interface ActivityFeedProps {
  items: ActivityItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      flex: 1,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
        Recent Activity
      </div>
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {items.map((item, i) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              padding: '10px 16px',
              borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: item.color + '22',
              border: `1px solid ${item.color}44`,
              color: item.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              flexShrink: 0,
            }}>
              {item.user.split(' ').map(p => p[0]).join('')}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: '16px' }}>
                <span style={{ fontWeight: 600 }}>{item.user}</span>
                {' '}<span style={{ color: 'var(--text-mid)' }}>{item.action}</span>
                {' '}<span style={{ fontFamily: 'var(--font-mono)', color: 'var(--info)', fontSize: 11 }}>{item.target}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
