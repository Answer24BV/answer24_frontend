import React from 'react';
import TranslationsManagementClient from './TranslationsManagementClient';


export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'nl' },
  ];
}

export default function TranslationManagementPage() {
  return <TranslationsManagementClient />;
}