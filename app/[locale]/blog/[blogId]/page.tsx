import React from 'react'
import { notFound } from 'next/navigation';
import BlogDetails, { BlogPost } from '@/components/blog/BlogDetails';

// Mock data - replace with actual API calls
const getPost = async (id: string): Promise<BlogPost | null> => {
  // In a real app, you would fetch this from your API
  // const res = await fetch(`/api/blog/${id}`);
  // if (!res.ok) return null;
  // return res.json();
  
  // Mock data for demonstration
  const mockPosts = [
    {
      id: '1',
      title: 'The Future of Web Development in 2024',
      content: 'This is the full content of the blog post. It will be replaced with actual content from your CMS or API. This is just a placeholder to demonstrate the layout and styling of the blog post content.',
      excerpt: 'Exploring the latest trends and technologies that are shaping the future of web development in the coming year.',
      image: '/image.png',
      author: 'John Doe',
      authorImage: '',
      date: '2024-01-15T10:00:00Z',
      readTime: '5',
      category: 'Web Development',
      tags: ['React', 'Next.js', 'TypeScript', 'Frontend'],
    },
    {
      id: '2',
      title: 'Mastering React Hooks',
      excerpt: 'A comprehensive guide to understanding and using React Hooks effectively in your applications.',
      image: '/image.png',
      date: '2024-02-20T14:30:00Z',
      readTime: '8',
    },
    {
      id: '3',
      title: 'Building Scalable APIs with Next.js',
      excerpt: 'Learn how to build robust and scalable APIs using Next.js API routes.',
      image: '/image.png',
      date: '2024-03-10T09:15:00Z',
      readTime: '6',
    },
    {
      id: '4',
      title: 'The Power of TypeScript',
      excerpt: 'How TypeScript can improve your development experience and catch bugs early.',
      image: '/image.png',
      date: '2024-04-05T16:45:00Z',
      readTime: '7',
    },
  ];

  const post = mockPosts.find(post => post.id === id);
  if (!post) return null;
  
  // For demo purposes, we'll use the first post's content for all posts
  return {
    ...post,
    content: post.content || mockPosts[0].content || '',
    excerpt: post.excerpt || '',
    author: post.author || mockPosts[0].author || '',
    authorImage: post.authorImage || mockPosts[0].authorImage,
    category: post.category || mockPosts[0].category || '',
    tags: post.tags || mockPosts[0].tags || [],
    readTime: post.readTime || '5',
  } as const;
};

const getRelatedPosts = async (currentId: string) => {
  // In a real app, you would fetch related posts from your API
  // const res = await fetch(`/api/blog/related/${currentId}`);
  // if (!res.ok) return [];
  // return res.json();
  
  // Mock related posts
  return [
    {
      id: '2',
      title: 'Mastering React Hooks',
      excerpt: 'A comprehensive guide to understanding and using React Hooks effectively in your applications.',
      image: '/image.png',
      date: '2024-02-20T14:30:00Z',
      readTime: '8',
    },
    {
      id: '3',
      title: 'Building Scalable APIs with Next.js',
      excerpt: 'Learn how to build robust and scalable APIs using Next.js API routes.',
      image: '/image.png',
      date: '2024-03-10T09:15:00Z',
      readTime: '6',
    },
    {
      id: '4',
      title: 'The Power of TypeScript',
      excerpt: 'How TypeScript can improve your development experience and catch bugs early.',
      image: '/image.png',
      date: '2024-04-05T16:45:00Z',
      readTime: '7',
    },
  ];
};

export default async function BlogPostPage(
  props: { 
    params: Promise<{ blogId: string }> 
  }
) {
  const params = await props.params;
  const post = await getPost(params.blogId);
  const relatedPosts = await getRelatedPosts(params.blogId);

  if (!post) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <BlogDetails 
        post={post} 
        relatedPosts={relatedPosts} 
      />
    </main>
  );
}