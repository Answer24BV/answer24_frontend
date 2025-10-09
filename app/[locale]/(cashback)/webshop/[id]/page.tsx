import React from 'react';
import WebshopDetailClient from './WebshopDetailClient';

export async function generateStaticParams() {
  return [
    { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' },
  ];
}

const WebshopDetailPage = () => {
  return <WebshopDetailClient />;
};

export default WebshopDetailPage;