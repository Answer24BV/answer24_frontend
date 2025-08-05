"use client";

import { Blog, BlogData, BlogResponse, BlogsResponse } from "@/types/blog.d";
import BLOGIMAGEPLACEHOLDER from "@/public/image.png";

const BASE_URL = "https://staging.answer24.nl/api/v1";

// Client-side function to delete a blog post
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
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete blog post");
    }

    // Revalidation is handled by the server action
    return { success: true };
  } catch (error) {
    console.error('Delete blog error:', error);
    return {
      errors: { 
        _form: [
          error instanceof Error 
            ? error.message 
            : "An unexpected error occurred while deleting the blog post."
        ] 
      },
    };
  }
}

// Client-side function to get all blog posts
export async function getAllBlogs(): Promise<BlogData> {
  try {
    const response = await fetch(`${BASE_URL}/blog`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch blogs");
    }

    const result: BlogsResponse = await response.json();
    return {
      ...result.data,
      data: result.data.data.map((blog) => ({
        ...blog,
        blog_image: blog.blog_image || BLOGIMAGEPLACEHOLDER.src,
      })),
    };
  } catch (error) {
    console.error('Get all blogs error:', error);
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

// Client-side function to get a single blog post by slug
export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    const response = await fetch(`${BASE_URL}/blog/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch blog post");
    }

    const result: BlogResponse = await response.json();
    return {
      ...result.data,
      blog_image: result.data.blog_image || BLOGIMAGEPLACEHOLDER.src,
    };
  } catch (error) {
    console.error(`Error fetching blog post ${slug}:`, error);
    return null;
  }
}
