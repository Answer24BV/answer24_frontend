import React, { Suspense } from 'react';
import SignupClient from './SignupClient';

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'nl' },
  ];
}

export default function Signup() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupClient />
    </Suspense>
  );
}