import { LeftBlog, type Post } from './LeftBlog';
import { RightBlog } from './RightBlog';
import BLOGIMAGE from '@/public/image.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight } from 'lucide-react';

const Blog = () => {
  const posts: Post[] = [
    {
      id: 1,
      title: 'The Future of AI in Content Creation',
      description: 'Explore how artificial intelligence is revolutionizing content creation, from automated writing to AI-generated art and beyond.',
      image: BLOGIMAGE.src,
      author: 'Jane Doe',
      date: '2025-07-25',
      category: 'AI & ML',
      readTime: '5',
    },
    {
      id: 2,
      title: 'Top JavaScript Frameworks in 2025',
      description: 'A look at the most popular JavaScript frameworks and what makes them stand out in web development.',
      image: BLOGIMAGE.src,
      author: 'John Smith',
      date: '2025-07-24',
      category: 'Web Dev',
      readTime: '4',
    },
    {
      id: 3,
      title: 'Understanding Serverless Architecture',
      description: 'Learn the benefits and challenges of serverless computing in modern application development.',
      image: BLOGIMAGE.src,
      author: 'Emily Chen',
      date: '2025-07-23',
      category: 'Cloud',
      readTime: '6',
    },
    {
      id: 4,
      title: 'The Rise of Quantum Computing',
      description: 'How quantum computing is set to transform industries from cryptography to drug discovery.',
      image: BLOGIMAGE.src,
      author: 'Michael Brown',
      date: '2025-07-22',
      category: 'Tech',
      readTime: '7',
    },
    {
      id: 5,
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
      <div className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Insights & Updates
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover the latest trends, tutorials, and expert opinions in web development and technology.
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles, tutorials, and more..."
                className="pl-12 pr-6 py-6 text-base rounded-full border-0 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/50"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        {/* Featured Post */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Story</h2>
            <Button variant="ghost" className="text-primary hover:bg-primary/10">
              View all featured
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <LeftBlog post={featuredPost} />
        </section>

        {/* Latest Articles */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">Latest Articles</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="rounded-full">
                Most Recent
              </Button>
              <Button variant="ghost" size="sm" className="text-primary">
                View all
              </Button>
            </div>
          </div>
          <RightBlog posts={otherPosts.slice(0, 3)} variant="grid" className="mb-12" />
          <div className="text-center">
            <Button variant="outline" className="rounded-full">
              Load More Articles
            </Button>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {popularCategories.map((category) => (
              <div 
                key={category.name}
                className="p-6 rounded-xl border bg-card hover:bg-accent/50 transition-colors cursor-pointer group"
              >
                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.count} articles
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter for the latest articles, tutorials, and exclusive content.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-background"
              />
              <Button className="whitespace-nowrap">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Blog;