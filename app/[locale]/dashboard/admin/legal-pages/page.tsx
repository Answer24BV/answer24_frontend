import React from 'react';
import LegalPagesManagementClient from './LegalPagesManagementClient';

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'nl' },
  ];
}

export default function LegalPagesManagement() {
  return <LegalPagesManagementClient />;
}