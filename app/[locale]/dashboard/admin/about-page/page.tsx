import React from 'react';
import AboutPageManagementClient from './AboutPageManagementClient';

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'nl' },
  ];
}

export default function AboutPageManagement() {
  return <AboutPageManagementClient />;
}