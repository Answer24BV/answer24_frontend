import React from 'react';
import WalletClient from './WalletClient';

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'nl' },
  ];
}

export default function WalletPage() {
  return <WalletClient />;
}