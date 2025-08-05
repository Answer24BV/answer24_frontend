// Updated BlogManagement.tsx with proper file upload handling

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
import { PlusCircle, Edit, Trash2, FileText, Image as ImageIcon, X, Loader2, FileImage, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { toast } from "sonner"
import { Label } from '@/components/ui/label';
import { Blog } from '@/types/blog.d';
import { createBlog, updateBlog } from "@/app/[locale]/actions/blog";
import { deleteBlog, getAllBlogs } from "@/app/[locale]/actions/blog-utils";
import BlogSkeleton from '@/components/blog/BlogSkeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import BLOGIMAGEPLACEHOLDER from "@/public/image.png"

const BlogManagement = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Add this state
  
  // Form state
  interface BlogFormData {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    status: 'draft' | 'published';
  }

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'draft'
  });

  // Update form data when editing a blog
  useEffect(() => {
    if (editingBlog) {
      setFormData({
        title: editingBlog.title,
        slug: editingBlog.slug || '',
        content: editingBlog.content,
        excerpt: editingBlog.excerpt || '',
        status: editingBlog.status as 'draft' | 'published'
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        status: 'draft'
      });
    }
  }, [editingBlog]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev: BlogFormData) => {
      const newData = {
        ...prev,
        [name]: name === 'status' ? value as 'draft' | 'published' : value
      };
      
      // If title changed and we're not editing, update the slug
      if (name === 'title' && !editingBlog) {
        const slug = value
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/--+/g, '-')
          .trim();
        newData.slug = slug;
      }
      
      return newData;
    });
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
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
    setSelectedFile(null); // Reset selected file
    // Then open the dialog
    setIsFormOpen(true);
  };

  const handleEdit = async (blog: Blog) => {
    setEditingBlog(blog);
    setPreviewImage(blog.blog_image || null);
    setSelectedFile(null); // Reset file when editing
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setBlogToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }
      const result = await deleteBlog(blogToDelete, token);
      
      if (result && 'errors' in result && result.errors) {
        console.error('Delete errors:', result.errors);
        const errorMessages = result.errors._form || [];
        setError(Array.isArray(errorMessages) ? errorMessages.join('\n') : 'An error occurred');
        return;
      }
      
      setBlogs(blogs.filter((blog) => blog.slug !== blogToDelete));
      setIsDeleteDialogOpen(false);
      toast("The blog post has been successfully deleted.", {
        description: "The blog post has been removed from the system.",
      });
    } catch (err) {
      console.error('Error deleting blog post:', err);
      setError('An unexpected error occurred while deleting the blog post.');
      toast.error("Error", {
        description: 'Failed to delete the blog post. Please try again.',
      });
    }
  };

  // Updated image change handler
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      setError('No file selected');
      return;
    }

    // Validate file type more strictly
    const validImageTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'image/svg+xml', 'image/bmp', 'image/tiff', 'image/x-icon'
    ];
    
    if (!validImageTypes.includes(file.type.toLowerCase())) {
      setError('Please upload a valid image file (JPEG, JPG, PNG, GIF, WebP, SVG, BMP, TIFF, or ICO)');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate file extension to match MIME type
    const fileName = file.name.toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tif', '.tiff', '.ico'];
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setError('Invalid file extension. Please upload a valid image file.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Image size should be less than 5MB');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Store the actual file object
    setSelectedFile(file);
    setError(null);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setPreviewImage(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Clear the preview and file input
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Updated form submit handler
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    // Validate required fields
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Get the token from localStorage
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Authentication required. Please log in again.');
        setIsSubmitting(false);
        return;
      }

      // Prepare the data for submission using FormData
      const formDataToSubmit = new FormData();
      
      formDataToSubmit.append('title', formData.title.trim());
      formDataToSubmit.append('slug', formData.slug);
      formDataToSubmit.append('content', formData.content.trim());
      formDataToSubmit.append('excerpt', formData.excerpt?.trim() || '');
      formDataToSubmit.append('status', formData.status);
      
      // Add the file if selected
      if (selectedFile) {
        formDataToSubmit.append('blog_image', selectedFile);
      }

      console.log('Submitting blog with FormData');

      if (editingBlog) {
        const result = await updateBlog(editingBlog.id, formDataToSubmit, token);
        
        if ('errors' in result) {
          console.error('Update errors:', result.errors);
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
          setSelectedFile(null);
        }
      } else {
        const result = await createBlog(formDataToSubmit, token);
        
        if (result && result.errors) {
          console.error('Create errors:', result.errors);
          const errorMessages = Object.entries(result.errors)
            .flatMap(([field, messages]) => 
              Array.isArray(messages) 
                ? messages.map(msg => `${field}: ${msg}`) 
                : `${field}: ${messages}`
            );
            
          setError(errorMessages.join('\n'));
          toast.error("Error creating blog", { description: errorMessages.join(', ') });
          return;
        }
        
        if (result.success && result.data) {
          setBlogs([result.data as Blog, ...blogs]);
          toast.success("Blog created", {
            description: 'Your new blog post has been successfully created.',
          });
          setIsFormOpen(false);
          setPreviewImage(null);
          setSelectedFile(null);
        }
      }
    } catch (err: any) {
      console.error('Error saving blog post:', err);
      const errorMessage = err?.message || 'An unexpected error occurred while saving the blog post.';
      setError(errorMessage);
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <BlogSkeleton/>;

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
        {error && (
          <Alert className='absolute top-20 right-6 w-72'>
            <AlertTitle>Something went wrong!</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
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
            setSelectedFile(null);
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

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter blog title"
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="slug">Slug</Label>
                      {!editingBlog && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-xs h-6 px-2"
                          onClick={() => {
                            const slug = formData.title
                              .toLowerCase()
                              .replace(/[^\w\s-]/g, '')
                              .replace(/\s+/g, '-')
                              .replace(/--+/g, '-')
                              .trim();
                            setFormData((prev: BlogFormData) => ({ ...prev, slug }));
                          }}
                          disabled={!formData.title}
                        >
                          Generate from title
                        </Button>
                      )}
                    </div>
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="blog-post-url"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      This will be used in the URL. Use hyphens between words.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      placeholder="Enter a short excerpt for the blog post..."
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea 
                      id="content" 
                      name="content" 
                      value={formData.content}
                      onChange={handleInputChange}
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
                    setSelectedFile(null);
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
                {blog.blog_image ? (
                  <Image
                    src={BLOGIMAGEPLACEHOLDER.src}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    // unoptimized={blog.blog_image?.includes('via.placeholder.com')}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <FileImage className="h-12 w-12 text-gray-400" />
                  </div>
                )}
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