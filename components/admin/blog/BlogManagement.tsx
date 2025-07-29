'use client';
import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PlusCircle, Edit, Trash2, Image as ImageIcon, X, Loader2, FileText } from 'lucide-react';
import Image from 'next/image';
import { toast } from "sonner"
import { Label } from '@/components/ui/label';
import BLOGIMAGE from '@/public/image.png';

const initialBlogs = [
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

interface BlogPost {
  id: string;
  title: string;
  description: string;
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}

const BlogManagement = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const { toast } = useToast();

  const handleNewBlog = () => {
    setEditingBlog(null);
    setPreviewImage(null);
    setIsFormOpen(true);
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setPreviewImage(blog.image);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setBlogToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (blogToDelete) {
      setBlogs(blogs.filter((blog) => blog.id !== blogToDelete));
      setIsDeleteDialogOpen(false);
      toast("Blog deleted", {
        description: 'The blog post has been successfully deleted.',
      });
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        title: formData.get('title') as string,
        description: formData.get('content') as string,
        category: formData.get('category') as string || 'General',
        readTime: formData.get('readTime') as string || '5',
        image: previewImage || BLOGIMAGE.src,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingBlog) {
        const updatedBlog = { 
          ...editingBlog, 
          ...data,
          date: new Date().toISOString().split('T')[0]
        } as BlogPost;
        setBlogs(blogs.map((b) => (b.id === editingBlog.id ? updatedBlog : b)));
        toast("Blog updated", {
          description: 'Your blog post has been successfully updated.',
        });
      } else {
        const newBlog = { 
          ...data, 
          id: Math.random().toString(), 
          date: new Date().toISOString().split('T')[0], 
          author: 'Admin'
        } as BlogPost;
        setBlogs([newBlog, ...blogs]);
        toast("Blog created", {
          description: 'Your new blog post has been successfully created.',
        });
      }
      
      setIsFormOpen(false);
      setEditingBlog(null);
      setPreviewImage(null);
    } catch (err) {
      setError('An error occurred while saving the blog post.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 pt-26">
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Admin Blog Management</h1>
          <p className="text-sm text-muted-foreground">
            Create, edit, and manage your blog posts
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={(open) => {
          if (!open) {
            setEditingBlog(null);
            setPreviewImage(null);
          }
          setIsFormOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button onClick={handleNewBlog} className="gap-2">
              <PlusCircle className="h-5 w-5" />
              <span>New Blog Post</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
              <DialogDescription>
                {editingBlog ? 'Update the details of your blog post.' : 'Fill in the details to create a new blog post.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-4">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Featured Image</Label>
                  <div 
                    onClick={triggerFileInput}
                    className="relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    {previewImage || editingBlog?.image ? (
                      <div className="relative w-full h-48 rounded-md overflow-hidden">
                        <Image
                          src={previewImage || editingBlog?.image || ''}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground text-center">
                          Click to upload an image or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      defaultValue={editingBlog?.title} 
                      placeholder="Enter blog title"
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        name="category"
                        defaultValue={editingBlog?.category || 'General'}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="General">General</option>
                        <option value="Technology">Technology</option>
                        <option value="Business">Business</option>
                        <option value="Lifestyle">Lifestyle</option>
                        <option value="Health">Health</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="readTime">Read Time (minutes)</Label>
                      <Input 
                        id="readTime" 
                        name="readTime" 
                        type="number" 
                        min="1"
                        defaultValue={editingBlog?.readTime || '5'}
                        placeholder="5"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea 
                      id="content" 
                      name="content" 
                      defaultValue={editingBlog?.description} 
                      placeholder="Write your blog content here..." 
                      required 
                      rows={8} 
                      className="min-h-[200px]"
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingBlog(null);
                    setPreviewImage(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingBlog ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>{editingBlog ? 'Update Post' : 'Create Post'}</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Blog Posts Grid */}
      {blogs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Card key={blog.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <div className="relative aspect-[16/9] overflow-hidden group">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-white/10 text-white hover:bg-white/20 border-white/20 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(blog);
                      }}
                    >
                      <Edit className="h-3.5 w-3.5 mr-1.5" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-red-500/10 text-red-100 hover:bg-red-500/20 border-red-500/20 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(blog.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg leading-tight line-clamp-2">{blog.title}</CardTitle>
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span>{blog.category}</span>
                  <span className="mx-2">•</span>
                  <span>{blog.readTime} min read</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{blog.description}</p>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground pt-0">
                Posted on {new Date(blog.date).toLocaleDateString()} by {blog.author}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No blog posts yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Get started by creating a new blog post</p>
          <Button onClick={handleNewBlog} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New Blog Post
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;