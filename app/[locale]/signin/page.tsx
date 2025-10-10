import React from 'react';
import SigninClient from './SigninClient';

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'nl' },
  ];
}

export default function Signin() {
  return <SigninClient />;
}