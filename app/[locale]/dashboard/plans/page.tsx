import React from 'react';
import PlansPageClient from './PlansPageClient';

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'nl' },
  ];
}

export default function PlansPage() {
  return <PlansPageClient />;
}