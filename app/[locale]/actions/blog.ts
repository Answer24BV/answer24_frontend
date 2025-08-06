// Updated blog actions with proper file upload handling

"use server"
import { z } from "zod";
import {
  Blog,
  BlogData,
  BlogResponse,
  BlogsResponse,
} from "@/types/blog.d";
import { revalidatePath } from "next/cache";
import BLOGIMAGEPLACEHOLDER from "@/public/image.png"
import { tokenUtils } from "@/utils/auth";

const BASE_URL = "https://staging.answer24.nl/api/v1";

// Zod schema for blog post (updated to handle FormData)
const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["published", "draft"]),
  excerpt: z.string().optional(),
  slug: z.string().optional(),
});

// Server action to create a blog post with file upload
export async function createBlog(
  formData: FormData,
  token: string
) {
  try {
    if (!token) {
      console.error('No authentication token provided');
      return { 
        errors: { 
          _form: ["Authentication required. Please log in again."] 
        } 
      };
    }

    // Extract and validate form data
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const status = formData.get('status') as string;
    const excerpt = formData.get('excerpt') as string;
    const slug = formData.get('slug') as string;

    // Validate the extracted data
    const validatedFields = blogSchema.safeParse({
      title,
      content,
      status,
      excerpt,
      slug
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // Generate slug from title if not provided
    const finalSlug = slug || title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/--+/g, '-')      // Replace multiple hyphens with single hyphen
      .trim();

    // Prepare the FormData for the API request
    const apiFormData = new FormData();
    apiFormData.append('title', title.trim());
    apiFormData.append('content', content.trim());
    apiFormData.append('excerpt', excerpt?.trim() || '');
    apiFormData.append('status', status);
    apiFormData.append('slug', finalSlug);

    // Add the file if it exists
    const blogImage = formData.get('blog_image') as File;
    if (blogImage && blogImage.size > 0) {
      // Validate file type
      const validImageTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'image/svg+xml', 'image/bmp', 'image/tiff'
      ];
      
      if (!validImageTypes.includes(blogImage.type.toLowerCase())) {
        return {
          errors: { 
            blog_image: ["Please upload a valid image file (JPEG, PNG, GIF, WebP, etc.)"] 
          }
        };
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (blogImage.size > maxSize) {
        return {
          errors: { 
            blog_image: ["Image size should be less than 5MB"] 
          }
        };
      }

      apiFormData.append('blog_image', blogImage);
    }

    console.log('Sending blog creation request with FormData');
    
    const response = await fetch(`${BASE_URL}/admin/blogs`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        // Don't set Content-Type header - let the browser set it with boundary for multipart/form-data
      },
      body: apiFormData,
      cache: 'no-store',
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('API Error Response:', result);
      
      if (response.status === 401) {
        // Clear invalid token and redirect to login
        tokenUtils.removeToken();
        return { 
          errors: { 
            _form: ["Your session has expired. Please log in again."] 
          } 
        };
      }
      
      // If the API returns validation errors, return them
      if (response.status === 422 && result.errors) {
        return { errors: result.errors };
      }
      
      // For other errors, include the error message from the API if available
      throw new Error(result.message || `Failed to create blog post (Status: ${response.status})`);
    }

    // Revalidate the blog listing and individual blog page
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${result.data?.slug}`);
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Create blog error:', error);
    return {
      errors: { 
        _form: [
          error instanceof Error 
            ? error.message 
            : "An unexpected error occurred while creating the blog post."
        ] 
      },
    };
  }
}

// Server action to update a blog post with file upload
export async function updateBlog(
  id: string,
  formData: FormData,
  token: string
) {
  try {
    if (!token) {
      console.error('No authentication token provided for update');
      return { 
        errors: { 
          _form: ["Authentication required. Please log in again."] 
        } 
      };
    }

    // Extract and validate form data
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const status = formData.get('status') as string;
    const excerpt = formData.get('excerpt') as string;
    const slug = formData.get('slug') as string;

    // Validate the extracted data
    const validatedFields = blogSchema.safeParse({
      title,
      content,
      status,
      excerpt,
      slug
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // Prepare the FormData for the API request
    const apiFormData = new FormData();
    apiFormData.append('title', title.trim());
    apiFormData.append('content', content.trim());
    apiFormData.append('excerpt', excerpt?.trim() || '');
    apiFormData.append('status', status);
    apiFormData.append('slug', slug);
    apiFormData.append('_method', 'PUT');

    // Add the file if it exists (for updates, this is optional)
    const blogImage = formData.get('blog_image') as File;
    if (blogImage && blogImage.size > 0) {
      // Validate file type
      const validImageTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'image/svg+xml', 'image/bmp', 'image/tiff'
      ];
      
      if (!validImageTypes.includes(blogImage.type.toLowerCase())) {
        return {
          errors: { 
            blog_image: ["Please upload a valid image file (JPEG, PNG, GIF, WebP, etc.)"] 
          }
        };
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (blogImage.size > maxSize) {
        return {
          errors: { 
            blog_image: ["Image size should be less than 5MB"] 
          }
        };
      }

      apiFormData.append('blog_image', blogImage);
    }

    console.log('Updating blog with FormData for ID:', id);
    
    const response = await fetch(`${BASE_URL}/admin/blogs/${id}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        // Don't set Content-Type header - let the browser set it with boundary for multipart/form-data
      },
      body: apiFormData,
      cache: 'no-store',
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('API Error Response:', result);
      
      if (response.status === 401) {
        // Clear invalid token and redirect to login
        tokenUtils.removeToken();
        return { 
          errors: { 
            _form: ["Your session has expired. Please log in again."] 
          } 
        };
      }
      
      // If the API returns validation errors, return them
      if (response.status === 422 && result.errors) {
        return { errors: result.errors };
      }
      
      // For other errors, include the error message from the API if available
      throw new Error(result.message || `Failed to update blog post (Status: ${response.status})`);
    }

    // Revalidate the blog listing and individual blog page
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${result.data?.slug}`);
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Update blog error:', error);
    return {
      errors: { 
        _form: [
          error instanceof Error 
            ? error.message 
            : "An unexpected error occurred while updating the blog post."
        ] 
      },
    };
  }
}

export async function getAllBlogs(): Promise<BlogData> {
  try {
    const response = await fetch(`${BASE_URL}/blog`, {
      cache: "no-store", // or 'force-cache' depending on your needs
    });

    if (!response.ok) {
      throw new Error("Failed to fetch blogs");
    }

    const result: BlogsResponse = await response.json();
    return {
      ...result.data,
    };
    // console.log("blogs",result.data)
    // return result.data
  } catch (error) {
    console.error(error);
    return {
      data: [],
      links: { first: "", last: "", prev: null, next: null },
      meta: {
        current_page: 1,
        from: 1,
        last_page: 1,
        links: [],
        path: "",
        per_page: 10,
        to: 1,
        total: 0,
      },
    };
  }
}


// Server action to delete a blog post
export async function deleteBlog(id: string, token: string) {
  try {
    if (!token) {
      console.error('No authentication token provided for delete');
      return { 
        errors: { 
          _form: ["Authentication required. Please log in again."] 
        } 
      };
    }

    const response = await fetch(`${BASE_URL}/blog/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete blog post");
    }

    revalidatePath("/admin/blog");
    return { success: true };
  } catch (error) {
    return {
      errors: { _form: ["An unexpected error occurred."] },
    };
  }
}