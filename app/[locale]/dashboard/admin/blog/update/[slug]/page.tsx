import React from 'react';
import UpdateBlogClient from './UpdateBlogClient';

export async function generateStaticParams() {
  return [
    { slug: 'blog-post-1' },
    { slug: 'blog-post-2' },
    { slug: 'blog-post-3' },
    { slug: 'blog-post-4' },
    { slug: 'blog-post-5' },
  ];
}

export default function UpdateBlogPage() {
  return <UpdateBlogClient />;
}