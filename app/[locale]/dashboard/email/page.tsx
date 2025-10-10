import React from 'react';
import EmailDashboardClient from './EmailDashboardClient';

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'nl' },
  ];
}

export default function EmailDashboard() {
  return <EmailDashboardClient />;
}