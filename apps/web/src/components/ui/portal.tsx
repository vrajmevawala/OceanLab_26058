'use client';
import { useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  to: string; // Element ID
}

export function Portal({ children, to }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const target = document.getElementById(to);
  if (!target) return null;

  return createPortal(children, target);
}
