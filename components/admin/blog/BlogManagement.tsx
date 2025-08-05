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
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Edit, Trash2, FileText, Image as ImageIcon, X, Loader2, FileImage, AlertCircle, Calendar, Eye, Settings, Search, Filter, MoreHorizontal, ArrowUpDown, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { toast } from "react-toastify"
import { Label } from '@/components/ui/label';
import { Blog } from '@/types/blog.d';
import { createBlog, updateBlog } from "@/app/[locale]/actions/blog";
import { deleteBlog, getAllBlogs } from "@/app/[locale]/actions/blog-utils";
import BlogSkeleton from '@/components/blog/BlogSkeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import BLOGIMAGEPLACEHOLDER from "@/public/image.png"
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  
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

  // Filter blogs based on search and status
  useEffect(() => {
    let filtered = blogs;
    
    if (searchTerm) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(blog => blog.status === statusFilter);
    }
    
    setFilteredBlogs(filtered);
  }, [blogs, searchTerm, statusFilter]);

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
    setEditingBlog(null);
    setPreviewImage(null);
    setSelectedFile(null);
    setIsFormOpen(true);
  };

  const handleEdit = async (blog: Blog) => {
    setEditingBlog(blog);
    setPreviewImage(blog.blog_image || null);
    setSelectedFile(null);
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
      toast.success("Blog post deleted successfully");
    } catch (err) {
      console.error('Error deleting blog post:', err);
      setError('An unexpected error occurred while deleting the blog post.');
      toast.error("Failed to delete the blog post. Please try again.");
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      setError('No file selected');
      return;
    }

    const validImageTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'image/svg+xml', 'image/bmp', 'image/tiff', 'image/x-icon'
    ];
    
    if (!validImageTypes.includes(file.type.toLowerCase())) {
      setError('Please upload a valid image file (JPEG, JPG, PNG, GIF, WebP, SVG, BMP, TIFF, or ICO)');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const fileName = file.name.toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tif', '.tiff', '.ico'];
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setError('Invalid file extension. Please upload a valid image file.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Image size should be less than 5MB');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
    setError(null);

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
    
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
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
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Authentication required. Please log in again.');
        setIsSubmitting(false);
        return;
      }

      const formDataToSubmit = new FormData();
      
      formDataToSubmit.append('title', formData.title.trim());
      formDataToSubmit.append('slug', formData.slug);
      formDataToSubmit.append('content', formData.content.trim());
      formDataToSubmit.append('excerpt', formData.excerpt?.trim() || '');
      formDataToSubmit.append('status', formData.status);
      
      if (selectedFile) {
        formDataToSubmit.append('blog_image', selectedFile);
      }

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
          toast.success("Blog updated successfully");
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
          toast.error("Error creating blog: " + errorMessages.join(', '));
          return;
        }
        
        if (result.success && result.data) {
          setBlogs([result.data as Blog, ...blogs]);
          toast.success("Blog created successfully");
          setIsFormOpen(false);
          setPreviewImage(null);
          setSelectedFile(null);
        }
      }
    } catch (err: any) {
      console.error('Error saving blog post:', err);
      const errorMessage = err?.message || 'An unexpected error occurred while saving the blog post.';
      setError(errorMessage);
      toast.error("Error: " + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (blog: Blog) => {
    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }

      const formData = new FormData();
      formData.append('title', blog.title);
      formData.append('slug', blog.slug || '');
      formData.append('content', blog.content);
      formData.append('excerpt', blog.excerpt || '');
      formData.append('status', newStatus);

      const result = await updateBlog(blog.id, formData, token);
      
      if (result.success && result.data) {
        setBlogs(blogs.map((b) => (b.id === blog.id ? result.data as Blog : b)));
        toast.success(`Blog ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`);
      }
    } catch (err) {
      console.error('Error updating blog status:', err);
      toast.error('Failed to update blog status');
    }
  };

  if (isLoading) return <BlogSkeleton/>;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this blog post? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Error Alert */}
        {error && (
          <Alert className='mb-6 border-red-200 bg-red-50'>
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Error</AlertTitle>
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Blog Management</h1>
            <p className="text-slate-600 mt-1">Manage your blog posts and content</p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex gap-4">
            <div className="bg-white rounded-lg px-4 py-2 border shadow-sm">
              <div className="text-sm text-slate-600">Total Posts</div>
              <div className="text-2xl font-semibold text-slate-900">{blogs.length}</div>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 border shadow-sm">
              <div className="text-sm text-slate-600">Published</div>
              <div className="text-2xl font-semibold text-green-600">{blogs.filter(b => b.status === 'published').length}</div>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 border shadow-sm">
              <div className="text-sm text-slate-600">Drafts</div>
              <div className="text-2xl font-semibold text-amber-600">{blogs.filter(b => b.status === 'draft').length}</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg border shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-80"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={(value: 'all' | 'published' | 'draft') => setStatusFilter(value)}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Posts</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                Table
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              
              <Dialog open={isFormOpen} onOpenChange={(open) => {
                if (!open) {
                  setEditingBlog(null);
                  setPreviewImage(null);
                  setSelectedFile(null);
                }
                setIsFormOpen(open);
              }}>
                <DialogTrigger asChild>
                  <Button onClick={handleNewBlog} className="bg-blue-600 hover:bg-blue-700">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingBlog ? 'Update the blog post details below.' : 'Fill in the details to create a new blog post.'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title *</Label>
                          <Input 
                            id="title" 
                            name="title" 
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter blog title"
                            required 
                          />
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="slug">URL Slug *</Label>
                            {!editingBlog && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
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
                                Generate
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
                        </div>

                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Select value={formData.status} onValueChange={(value: 'draft' | 'published') => 
                            setFormData(prev => ({ ...prev, status: value }))
                          }>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="published">Published</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Right Column - Image Upload */}
                      <div>
                        <Label>Featured Image</Label>
                        <div 
                          onClick={triggerFileInput}
                          className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors h-64"
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                          />
                          {previewImage || editingBlog?.blog_image ? (
                            <div className="relative w-full h-full rounded-md overflow-hidden">
                              <img
                                src={previewImage || editingBlog?.blog_image || ''}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8"
                                onClick={removeImage}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="text-center">
                              <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                              <p className="text-sm text-slate-600">Click to upload image</p>
                              <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="excerpt">Excerpt *</Label>
                      <Textarea
                        id="excerpt"
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleInputChange}
                        placeholder="Brief description of the blog post..."
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="content">Content *</Label>
                      <Textarea 
                        id="content" 
                        name="content" 
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="Write your blog content here..."
                        required 
                        rows={12}
                      />
                    </div>
                    
                    <DialogFooter>
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
          </div>
        </div>

        {/* Content */}
        {filteredBlogs.length > 0 ? (
          viewMode === 'table' ? (
            /* Table View */
            <div className="bg-white rounded-lg border shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBlogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell>
                        <div className="w-10 h-10 rounded overflow-hidden bg-slate-100">
                          {blog.blog_image ? (
                            <img
                              src={blog.blog_image}
                              alt={blog.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileImage className="h-4 w-4 text-slate-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-slate-900 line-clamp-1">{blog.title}</div>
                          <div className="text-sm text-slate-500 line-clamp-1">{blog.excerpt}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={blog.status === 'published' ? 'default' : 'secondary'}
                          className={`cursor-pointer ${blog.status === 'published' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                          onClick={() => toggleStatus(blog)}
                        >
                          {blog.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {new Date(blog.created_at || '').toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {blog.published_at ? new Date(blog.published_at).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(blog)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleStatus(blog)}>
                              <Eye className="h-4 w-4 mr-2" />
                              {blog.status === 'published' ? 'Unpublish' : 'Publish'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteClick(blog.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            /* Grid View */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <Card key={blog.id} className="hover:shadow-lg transition-shadow">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
                    {blog.blog_image ? (
                      <Image
                        src={BLOGIMAGEPLACEHOLDER.src}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <FileImage className="h-12 w-12 text-slate-400" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge 
                        variant={blog.status === 'published' ? 'default' : 'secondary'}
                        className={`${blog.status === 'published' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-amber-600 hover:bg-amber-700'
                        } text-white`}
                      >
                        {blog.status}
                      </Badge>
                    </div>
                    
                    {/* Actions */}
                    <div className="absolute top-3 right-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="secondary" 
                            size="icon"
                            className="h-8 w-8 bg-white/90 hover:bg-white"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(blog)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleStatus(blog)}>
                            <Eye className="h-4 w-4 mr-2" />
                            {blog.status === 'published' ? 'Unpublish' : 'Publish'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteClick(blog.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg leading-tight line-clamp-2">
                      {blog.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-sm text-slate-600 line-clamp-3">
                      {blog.excerpt}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="pt-0 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(blog.created_at || '').toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(blog)}
                        className="h-7 px-2"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )
        ) : (
          /* Empty State */
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-slate-100 p-6 mb-4">
                <FileText className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No posts found' : 'No blog posts yet'}
              </h3>
              <p className="text-slate-600 mb-6 max-w-md">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                  : 'Get started by creating your first blog post to share your thoughts and ideas.'
                }
              </p>
              {(!searchTerm && statusFilter === 'all') && (
                <Button onClick={handleNewBlog} className="bg-blue-600 hover:bg-blue-700">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Your First Post
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;