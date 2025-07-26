import { type Post } from './LeftBlog';
import BLOGIMAGE from '@/public/image.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight, Clock, Calendar, BookOpen } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

const Blog = () => {
  const posts: Post[] = [
    {
      id: '1',
      title: 'The Future of AI in Content Creation',
      description: 'Explore how artificial intelligence is revolutionizing content creation, from automated writing to AI-generated art and beyond.',
      image: BLOGIMAGE.src,
      author: 'Jane Doe',
      date: '2025-07-25',
      category: 'AI & ML',
      readTime: '5',
    },
    {
      id: '2',
      title: 'Top JavaScript Frameworks in 2025',
      description: 'A look at the most popular JavaScript frameworks and what makes them stand out in web development.',
      image: BLOGIMAGE.src,
      author: 'John Smith',
      date: '2025-07-24',
      category: 'Web Dev',
      readTime: '4',
    },
    {
      id: '3',
      title: 'Understanding Serverless Architecture',
      description: 'Learn the benefits and challenges of serverless computing in modern application development.',
      image: BLOGIMAGE.src,
      author: 'Emily Chen',
      date: '2025-07-23',
      category: 'Cloud',
      readTime: '6',
    },
    {
      id: '4',
      title: 'The Rise of Quantum Computing',
      description: 'How quantum computing is set to transform industries from cryptography to drug discovery.',
      image: BLOGIMAGE.src,
      author: 'Michael Brown',
      date: '2025-07-22',
      category: 'Tech',
      readTime: '7',
    },
    {
      id: '5',
      title: 'Sustainable Web Design',
      description: 'Latest trends in sustainable web design and reducing your website\'s carbon footprint.',
      image: BLOGIMAGE.src,
      author: 'Sarah Johnson',
      date: '2025-07-21',
      category: 'Design',
      readTime: '5',
    },
  ];

  const [featuredPost, ...otherPosts] = posts;
  const popularCategories = [
    { name: 'Web Development', count: 12 },
    { name: 'UI/UX Design', count: 8 },
    { name: 'Cloud Computing', count: 15 },
    { name: 'Machine Learning', count: 10 },
    { name: 'DevOps', count: 7 },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Featured Post - Large Card */}
      
          <div className="md:col-span-2 lg:row-span-2 group">
          <Link href={`/blog/${featuredPost.id}`} className='cursor-pointer'>
            <div className="h-full flex flex-col bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/90 text-white rounded-full">
                    {featuredPost.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(featuredPost.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {featuredPost.readTime} min read
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-3 line-clamp-2">
                    {featuredPost.title}
                </h2>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {featuredPost.description}
                </p>
                <div className="mt-auto pt-4 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {featuredPost.author.charAt(0)}
                  </div>
                  <span className="ml-2 text-sm font-medium">{featuredPost.author}</span>
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
              <Link href={`/blog/${post.id}`} className='cursor-pointer'>
              <div className="h-full flex flex-col bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary/90 text-white rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="mt-auto pt-3 flex items-center text-xs text-muted-foreground">
                    <span>{post.author}</span>
                    <span className="mx-1.5">•</span>
                    <span>{post.readTime} min read</span>
                  </div>
                </div>
              </div>
              </Link>
            </div>
          ))}
        </div>

        {/* More Articles */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">More Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPosts.slice(2).map((post) => (
              <div key={post.id} className="group">
              <Link href={`/blog/${post.id}`} className='cursor-pointer'>
                <div className="h-full flex flex-col bg-card rounded-xl overflow-hidden border border-border hover:shadow-md transition-shadow duration-300">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                      <span>{post.category}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime} min read</span>
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.description}
                    </p>
                  </div>
                </div>
              </Link>
                </div>
            ))}
          </div>
        </div>
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

export default Blog;