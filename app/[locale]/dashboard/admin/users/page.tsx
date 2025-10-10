import React from 'react';
import UsersManagementClient from './UsersManagementClient';

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'nl' },
  ];
}

export default function UsersManagement() {
  return <UsersManagementClient />;
}