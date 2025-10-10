import React from 'react';
import PlansManagementClient from './PlansManagementClient';

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'nl' },
  ];
}

export default function PlansManagement() {
  return <PlansManagementClient />;
}