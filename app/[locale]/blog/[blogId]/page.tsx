"use client";
import React, { use, useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import BlogDetails from "@/components/blog/BlogDetails";
import { getBlogBySlug } from "@/app/[locale]/actions/blog-utils";
import { Blog } from "@/types/blog.d";

export default function BlogPostPage() {
  const [post, setPost] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { blogId } = useParams<{ blogId: string }>();
  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      try {
        const blogPost = await getBlogBySlug(blogId);
        setPost(blogPost.data);
      } catch (err) {
        setError("Failed to fetch blog post.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [blogId]);

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!post) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <BlogDetails post={post} relatedPosts={[]} />
    </main>
  );
}
