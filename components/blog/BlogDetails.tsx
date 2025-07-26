import React from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Share2, MessageSquare, Tag, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/navigation';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  author: string;
  authorImage?: string;
  date: string;
  readTime: string;
  category: string;
  tags?: string[];
}

interface BlogDetailsProps {
  post: BlogPost;
  relatedPosts?: Omit<BlogPost, 'content' | 'excerpt' | 'author' | 'authorImage' | 'category' | 'tags'>[];
  className?: string;
}

const BlogDetails = ({ 
  post, 
  relatedPosts = [], 
  className 
}: BlogDetailsProps) => {
  // Mock content - replace with actual content from your API
  const content = Array(5).fill(post.content || 'This is a sample blog post content. It will be replaced with the actual content from the API when available. This section demonstrates how the blog post will be displayed to the readers.');
  
  return (
    <article className={cn('max-w-4xl mx-auto', className)}>
      {/* Back Button */}
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/blog" className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </Button>
      </div>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <span className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
            {post.category}
          </span>
          <span className="mx-3">•</span>
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span className="mx-3">•</span>
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {post.readTime} min read
          </span>
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
          {post.title}
        </h1>
        
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-3">
            {post.authorImage ? (
              <Image 
                src={post.authorImage} 
                alt={post.author} 
                width={40} 
                height={40} 
                className="rounded-full object-cover"
              />
            ) : (
              post.author.charAt(0)
            )}
          </div>
          <div>
            <p className="font-medium">{post.author}</p>
            <p className="text-sm text-muted-foreground">Author</p>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-10">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        <p className="text-xl text-muted-foreground mb-8">
          {post.excerpt}
        </p>
        
        {content.map((paragraph, index) => (
          <p key={index} className="mb-4 leading-relaxed">
            {paragraph}
          </p>
        ))}
        
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-border">
            <div className="flex flex-wrap gap-2">
              <Tag className="h-4 w-4 mt-1 mr-1 text-muted-foreground" />
              {post.tags.map((tag) => (
                <span 
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Author Bio */}
      <div className="bg-muted/30 p-6 rounded-xl mb-12">
        <div className="flex items-start">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xl flex-shrink-0 mr-4">
            {post.authorImage ? (
              <Image 
                src={post.authorImage} 
                alt={post.author} 
                width={64} 
                height={64} 
                className="rounded-full object-cover"
              />
            ) : (
              post.author.charAt(0)
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">About {post.author.split(' ')[0]}</h3>
            <p className="text-muted-foreground">
              {post.author} is a writer and content creator with a passion for sharing knowledge and insights.
              {/* This would come from the author's bio in your CMS */}
            </p>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Comments</h2>
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Leave a comment
          </Button>
        </div>
        
        <div className="space-y-6">
          {/* Comment form would go here */}
          <div className="p-6 border rounded-lg">
            <p className="text-muted-foreground text-center py-8">
              Comments will be displayed here once the API is integrated.
            </p>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <article key={relatedPost.id} className="group">
                <Link href={`/blog/${relatedPost.id}`} className="block">
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {relatedPost.title}
                  </h3>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span>{new Date(relatedPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span className="mx-1.5">•</span>
                    <span>{relatedPost.readTime} min read</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogDetails;