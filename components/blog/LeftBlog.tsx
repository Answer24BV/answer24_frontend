import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  description: string;
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}

type LeftBlogProps = {
  post: Post;
  className?: string;
};

const LeftBlog = ({ post, className }: LeftBlogProps) => {
  return (
    <article className={cn("group relative overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-300 hover:shadow-md", className)}>
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
          sizes="(max-width: 768px) 100vw, 80vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>
      
      <div className="p-6 md:p-8">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
              {post.category}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          
          <h2 className="text-2xl font-bold leading-tight tracking-tight md:text-3xl lg:text-4xl">
            <Link 
              href={`/blog/${post.id}`}
              className="hover:text-primary transition-colors duration-300"
            >
              {post.title}
            </Link>
          </h2>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            {post.description}
          </p>
          
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-foreground">{post.author}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{post.readTime} min read</span>
                  <span>•</span>
                  <Clock className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
            <Link 
              href={`/blog/${post.id}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all duration-300"
            >
              Read more
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export { LeftBlog, type Post };