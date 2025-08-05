'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight, Clock, Calendar, BookOpen } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Blog } from '@/types/blog.d';
import BlogSkeleton from './BlogSkeleton';
import BLOGIMAGEPLACEHOLDER from "@/public/image.png"
import { getAllBlogs } from '@/app/[locale]/actions/blog';

const BlogComponent = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const blogData = await getAllBlogs();
        setBlogs(blogData.data);
      } catch (err) {
        setError('Failed to fetch blogs.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (isLoading) return <BlogSkeleton/>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  const [featuredPost, ...otherPosts] = blogs;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mt-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              The Blog
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Insights, stories, and updates from our team
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-12 pr-6 py-5 text-base rounded-full border-0 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/50"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Bento Grid */}
        {blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Featured Post - Large Card */}
            <div className="md:col-span-2 lg:row-span-2 group">
              <Link href={`/blog/${featuredPost.slug}`} className='cursor-pointer'>
                <div className="h-full flex flex-col bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={featuredPost.blog_image || BLOGIMAGEPLACEHOLDER.src}
                      alt={featuredPost.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(featuredPost.published_at as any).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-3 line-clamp-2">
                        {featuredPost.title}
                    </h2>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="mt-auto pt-4 flex items-center">
                      <Button variant="ghost" size="sm" className="ml-auto text-primary">
                        Read more
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            {/* Other Posts */}
            {otherPosts.slice(0, 2).map((post) => (
              <div key={post.id} className="group">
                <Link href={`/blog/${post.slug}`} className='cursor-pointer'>
                <div className="h-full flex flex-col bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={post.blog_image || BLOGIMAGEPLACEHOLDER.src}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      // onError={(e) => {
                      //   e.currentTarget.src = BLOGIMAGEPLACEHOLDER.src;
                      // }}
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* More Articles */}
        {otherPosts.length > 2 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">More Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPosts.slice(2).map((post) => (
                <div key={post.id} className="group">
                <Link href={`/blog/${post.slug}`} className='cursor-pointer'>
                  <div className="h-full flex flex-col bg-card rounded-xl overflow-hidden border border-border hover:shadow-md transition-shadow duration-300">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={post.blog_image || BLOGIMAGEPLACEHOLDER.src}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
                  </div>
              ))}
            </div>
          </div>
        )}
        {/* Newsletter */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 text-center">
          <BookOpen className="h-10 w-10 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Stay in the loop</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Get the latest articles and resources sent straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              className="bg-background"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogComponent;
