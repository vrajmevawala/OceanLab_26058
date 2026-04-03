'use client';

import React from 'react';
import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        padding: 20,
      }}
    >
      <SignIn signUpUrl="/sign-up" forceRedirectUrl="/dashboard" />
    </div>
  );
}
