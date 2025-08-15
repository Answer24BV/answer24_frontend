'use client';

import { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  // TODO: Implement actual authentication logic
  // For now, just render children to allow build to succeed
  return <>{children}</>;
};
