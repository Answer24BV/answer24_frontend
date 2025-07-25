import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Clock, ArrowRight } from 'lucide-react';
import type { Post } from './LeftBlog';
import { Badge } from '../ui/badge';

type RightBlogProps = {
  posts: Post[];
  className?: string;
  variant?: 'list' | 'grid';
};

const RightBlog = ({ posts, className, variant = 'list' }: RightBlogProps) => {
  const isGrid = variant === 'grid';
  
  if (isGrid) {
    return (
      <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
        {posts.map((post) => (
          <article key={post.id} className="group relative overflow-hidden rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 text-xs">
                  {post.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              
              <h3 className="font-bold text-lg mb-2 line-clamp-2">
                <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </h3>
              
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {post.description}
              </p>
              
              <div className="mt-auto pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                      {post.author.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{post.author}</span>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}m
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  }

  // List view
  return (
    <div className={cn('space-y-6', className)}>
      {posts.map((post) => (
        <article key={post.id} className="group flex flex-col sm:flex-row gap-4">
          <Link 
            href={`/blog/${post.id}`}
            className="relative block w-full sm:w-40 h-40 rounded-xl overflow-hidden flex-shrink-0"
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 160px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </Link>
          
          <div className="flex-1">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 text-xs">
                  {post.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              
              <h3 className="font-bold text-lg">
                <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </h3>
              
              <p className="text-muted-foreground text-sm line-clamp-2">
                {post.description}
              </p>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                    {post.author.charAt(0)}
                  </div>
                  <span className="text-sm text-muted-foreground">{post.author}</span>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readTime}m read
                </span>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export { RightBlog };
export type { RightBlogProps };