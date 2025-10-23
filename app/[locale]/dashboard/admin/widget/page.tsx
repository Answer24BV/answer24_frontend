import React from 'react';
import WidgetManagementClient from './WidgetManagementClient';

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'nl' },
  ];
}

export default function WidgetManagement() {
  return <WidgetManagementClient />;
}
