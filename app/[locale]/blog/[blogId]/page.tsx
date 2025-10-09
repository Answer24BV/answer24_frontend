import React from 'react';
import BlogPostClient from './BlogPostClient';

export async function generateStaticParams() {
  return [
    { blogId: '1' },
    { blogId: '2' },
    { blogId: '3' },
    { blogId: '4' },
    { blogId: '5' },
  ];
}

export default function BlogPostPage() {
  return <BlogPostClient />;
}