import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Share2, MessageSquare, Tag, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import { Blog } from '@/types/blog.d';

interface BlogDetailsProps {
  post: Blog;
  relatedPosts?: Blog[];
  className?: string;
}

const BlogDetails = ({ 
  post,
  relatedPosts = [], 
  className 
}: BlogDetailsProps) => {
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
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(post.published_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
          {post.title}
        </h1>
        
        <div className="flex items-center">
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
          src={post.image!}
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
        
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
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
                <Link href={`/blog/${relatedPost.slug}`} className="block">
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                    <Image
                      src={relatedPost.image!}
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
                    <span>{new Date(relatedPost.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
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
