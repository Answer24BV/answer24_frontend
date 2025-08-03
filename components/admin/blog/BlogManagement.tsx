'use client';
import { useState, useRef, ChangeEvent, useEffect } from 'react';
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
import { Blog } from '@/types/blog.d';
import { createBlog, updateBlog, deleteBlog, getAllBlogs } from '@/app/actions/blog';
import BlogSkeleton from '@/components/blog/BlogSkeleton';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleNewBlog = () => {
    // Reset form state first
    setEditingBlog(null);
    setPreviewImage(null);
    // Then open the dialog
    setIsFormOpen(true);
  };

  const handleEdit = async (blog: Blog) => {
    try {
      const updatedBlog = await updateBlog(blog.slug, blog);
      if (updatedBlog.success && updatedBlog.data) {
        setBlogs(blogs.map((b) => (b.slug === blog.slug ? updatedBlog.data as Blog : b)));
        toast("Blog updated", {
          description: 'Your blog post has been successfully updated.',
        });
      }
    } catch (error) {
      setError('An error occurred while updating the blog post.');
      console.error(error);
    }
    setEditingBlog(blog);
    setPreviewImage(blog.blog_image || null);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setBlogToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (blogToDelete) {
      await deleteBlog(blogToDelete);
      setBlogs(blogs.filter((blog) => blog.slug !== blogToDelete));
      setIsDeleteDialogOpen(false);
      toast("The blog post has been successfully deleted.", {
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
    e.preventDefault();
    e.stopPropagation();
    
    // Clear the preview and file input
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      // Create a new input element to replace the current one
      const newInput = document.createElement('input');
      newInput.type = 'file';
      newInput.style.display = 'none';
      newInput.onchange = fileInputRef.current.onchange;
      fileInputRef.current.replaceWith(newInput);
      fileInputRef.current = newInput;
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const formData = new FormData(e.currentTarget);
      const data: Omit<Blog, 'id' | 'slug' | 'status_name' | 'published_at' | 'is_published' | 'is_draft' | 'created_at' | 'updated_at' | 'sort_order'> = {
        title: formData.get('title') as string,
        content: formData.get('content') as string,
        status: (formData.get('status') as 'draft' | 'published') || 'draft',
        excerpt: formData.get('excerpt') as string,
        blog_image: previewImage || '', // Ensure blog_image is always a string
      };

      if (editingBlog) {
        const result = await updateBlog(editingBlog.id, data);
        
        if ('errors' in result) {
          // Handle validation errors
          console.error('Update errors:', result.errors);
          
          // Format and display validation errors
          const errorMessages = Object.entries(result.errors)
            .flatMap(([field, messages]) => 
              Array.isArray(messages) 
                ? messages.map(msg => `${field}: ${msg}`) 
                : `${field}: ${messages}`
            );
            
          setError(errorMessages.join('\n'));
          return;
        }
        
        if (result.success && result.data) {
          setBlogs(blogs.map((b) => (b.id === editingBlog.id ? result.data as Blog : b)));
          toast.success("Blog updated", {
            description: 'Your blog post has been successfully updated.',
          });
          setIsFormOpen(false);
          setEditingBlog(null);
          setPreviewImage(null);
        }
      } else {
        const result = await createBlog(data);
        
        if ('errors' in result) {
          // Handle validation errors
          console.error('Create errors:', result.errors);
          
          // Format and display validation errors
          const errorMessages = Object.entries(result.errors)
            .flatMap(([field, messages]) => 
              Array.isArray(messages) 
                ? messages.map(msg => `${field}: ${msg}`) 
                : `${field}: ${messages}`
            );
            
          setError(errorMessages.join('\n'));
          return;
        }
        
        if (result.success && result.data) {
          setBlogs([result.data as Blog, ...blogs]);
          toast.success("Blog created", {
            description: 'Your new blog post has been successfully created.',
          });
          setIsFormOpen(false);
          setPreviewImage(null);
        }
      }
    } catch (err) {
      console.error('Error saving blog post:', err);
      setError('An unexpected error occurred while saving the blog post.');
      toast.error("Error", {
        description: 'Failed to save the blog post. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <BlogSkeleton/>;
  if (error) return <div className="p-4 text-red-500 flex item-center justify-center text-center">Error: {error}</div>;

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
            // Only reset form state when closing
            setEditingBlog(null);
            setPreviewImage(null);
          }
          // Always update the open state
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
                    {previewImage || editingBlog?.blog_image ? (
                      <div className="relative w-full h-48 rounded-md overflow-hidden">
                        <Image
                          src={previewImage || editingBlog?.blog_image || ''}
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

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      defaultValue={editingBlog?.excerpt || ''}
                      placeholder="Enter a short excerpt for the blog post..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea 
                      id="content" 
                      name="content" 
                      defaultValue={editingBlog?.content || ''} 
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
                  src={blog.blog_image || ''}
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
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{blog.excerpt}</p>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground pt-0">
                Posted on {new Date(blog?.published_at || '').toLocaleDateString()}
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
