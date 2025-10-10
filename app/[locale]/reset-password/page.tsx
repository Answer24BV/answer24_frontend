import React from 'react';
import ResetPasswordClient from './ResetPasswordClient';

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'nl' },
  ];
}

export default function ResetPassword() {
  return <ResetPasswordClient />;
}