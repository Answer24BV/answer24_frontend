import React from 'react';
import LegalPageClient from './LegalPageClient';

export async function generateStaticParams() {
  return [
    { slug: 'privacy-policy' },
    { slug: 'terms-of-service' },
    { slug: 'cookie-policy' },
  ];
}

export default function LegalPage() {
  return <LegalPageClient />;
}