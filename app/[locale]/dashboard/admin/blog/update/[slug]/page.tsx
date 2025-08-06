'use client';
import { use, useEffect, useState } from 'react';
import { getBlogBySlug } from '@/app/[locale]/actions/blog-utils';
import BlogForm from '@/components/admin/blog/BlogForm';
import { Blog } from '@/types/blog.d';
import BlogSkeleton from '@/components/blog/BlogSkeleton';
import { useParams } from 'next/navigation';

const UpdateBlogPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      try {
        const blogData = await getBlogBySlug(slug);
        if (blogData.success) {
          setBlog(blogData.data);
        } else {
          setError(blogData.message);
        }
      } catch (err) {
        setError('Failed to fetch blog post.');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  if (isLoading) return <BlogSkeleton />;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
  if (!blog) return <div className="container mx-auto px-4 py-8">Blog post not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Edit Blog Post</h1>
      <BlogForm blog={blog} />
    </div>
  );
};

export default UpdateBlogPage;
