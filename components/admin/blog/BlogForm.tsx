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
  CardDescription 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ImageIcon, 
  X, 
  Loader2, 
  AlertCircle, 
  UploadCloud, 
  CheckCircle, 
  File as FileIcon 
} from 'lucide-react';
import Image from 'next/image';
import { toast } from "react-toastify";
import { Label } from '@/components/ui/label';
import { Blog } from '@/types/blog.d';
import { createBlog, updateBlog } from "@/app/[locale]/actions/blog";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface BlogFormProps {
  blog?: Blog;
}

const BlogForm: React.FC<BlogFormProps> = ({ blog }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(blog?.blog_image || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  interface BlogFormData {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    status: 'draft' | 'published';
  }

  const [formData, setFormData] = useState<BlogFormData>({
    title: blog?.title || '',
    slug: blog?.slug || '',
    content: blog?.content || '',
    excerpt: blog?.excerpt || '',
    status: blog?.status || 'draft'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev: BlogFormData) => {
      const newData = {
        ...prev,
        [name]: name === 'status' ? value as 'draft' | 'published' : value
      };
      
      if (name === 'title' && !blog) {
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

      if (blog) {
        const result = await updateBlog(blog.id, formDataToSubmit, token);
        
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
          toast.success("Blog updated successfully");
          window.location.href = '/nl/dashboard/admin/blog';
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
          toast.success("Blog created successfully");
          window.location.href = '/nl/dashboard/admin/blog';
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

  return (
    <form onSubmit={handleFormSubmit} className="space-y-8">
      {error && (
        <Alert variant="destructive" className='mb-6'>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Blog Content</CardTitle>
              <CardDescription>Write the main content of your blog post here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title" className="font-semibold">Title *</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. My First Blog Post"
                  required 
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="slug" className="font-semibold">URL Slug *</Label>
                <div className="relative mt-2">
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="e.g. my-first-blog-post"
                    required
                    className="pl-28"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">/blog/</span>
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt" className="font-semibold">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="A short summary of your post..."
                  rows={3}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="content" className="font-semibold">Content *</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Start writing your masterpiece..."
                  required 
                  rows={15}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-8">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status" className="font-semibold">Status</Label>
                  <Select value={formData.status} onValueChange={(value: 'draft' | 'published') => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                onClick={triggerFileInput}
                className="relative border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors aspect-video"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                {previewImage ? (
                  <div className="relative w-full h-full rounded-md overflow-hidden">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-slate-500">
                    <UploadCloud className="h-10 w-10 mx-auto mb-2" />
                    <p className="text-sm font-semibold">Click to upload</p>
                    <p className="text-xs">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
              </div>
              {selectedFile && (
                <div className="mt-4 flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileIcon className="h-5 w-5 text-slate-500" />
                    <span className="text-sm text-slate-700 truncate max-w-[180px]">{selectedFile.name}</span>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-8 sticky bottom-0 bg-white/80 backdrop-blur-sm py-4 px-8 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {blog ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>{blog ? 'Update Post' : 'Create Post'}</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default BlogForm;