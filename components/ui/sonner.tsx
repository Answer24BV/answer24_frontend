'use client';

import { ReactNode } from 'react';

interface ToasterProps {
  children?: ReactNode;
}

export const Toaster = ({ children }: ToasterProps) => {
  // TODO: Implement actual toast notifications
  // For now, just render children to allow build to succeed
  return <>{children}</>;
};
