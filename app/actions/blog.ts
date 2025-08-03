// import { cookies } from 'next/headers';
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

// Zod schema for blog post
const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["published", "draft"]),
  excerpt: z.string().optional(),
  slug: z.string().optional(),
});

// Server action to create a blog post
export async function createBlog(
  data: Omit<Blog, "id" | "slug" | "status_name" | "published_at" | "is_published" | "is_draft" | "created_at" | "updated_at" | "sort_order">
) {
  const validatedFields = blogSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const token = tokenUtils.getToken();
    if (!token) {
      console.error('No authentication token found');
      return { 
        errors: { 
          _form: ["Authentication required. Please log in again."] 
        } 
      };
    }

    console.log('Using token for blog creation:', token);
    const response = await fetch(`${BASE_URL}/blog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(validatedFields.data),
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

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
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

// Server action to update a blog post
export async function updateBlog(
  id: string,
  data: Omit<Blog, "id" | "slug" | "status_name" | "published_at" | "is_published" | "is_draft" | "created_at" | "updated_at" | "sort_order">
) {
  const validatedFields = blogSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const token = tokenUtils.getToken();
    if (!token) {
      return { 
        errors: { 
          _form: ["Authentication required. Please log in again."] 
        } 
      };
    }

    const response = await fetch(`${BASE_URL}/blog/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(validatedFields.data),
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

    revalidatePath("/admin/blog");
    revalidatePath(`/blog/${result.data?.slug}`);
    revalidatePath("/blog");
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

// Server action to delete a blog post
export async function deleteBlog(id: string) {
  try {
    const token = tokenUtils.getToken();
    if (!token) {
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

// Function to get all blog posts
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
      data: result.data.data.map((blog) => ({
        ...blog,
        blog_image: BLOGIMAGEPLACEHOLDER.src, // Fallback image
      })),
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

// Function to get a single blog post by slug
export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    const response = await fetch(`${BASE_URL}/blog/${slug}`);

    if (!response.ok) {
      throw new Error("Failed to fetch blog post");
    }

    const result: BlogResponse = await response.json();
    return {
      ...result.data,
      blog_image: BLOGIMAGEPLACEHOLDER.src, // Fallback image
    };
    // return result.data
  } catch (error) {
    console.error(error);
    return null;
}
}