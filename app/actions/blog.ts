"use server";

import { z } from "zod";
import {
  Blog,
  BlogData,
  BlogResponse,
  BlogsResponse,
} from "@/types/blog.d";
import { revalidatePath } from "next/cache";
import BLOGIMAGEPLACEHOLDER from "@/public/image.png"

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
    const response = await fetch(`${BASE_URL}/admin/blogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer 2|Fw4Uo167tlqOE9wqSPgT55q4joQbMLlWCoWwpsHG8afbb11a`,
      },
      body: JSON.stringify(validatedFields.data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      // If the API returns validation errors, return them
      if (response.status === 422 && result.errors) {
        return { errors: result.errors };
      }
      // For other errors, include the error message from the API if available
      throw new Error(result.message || "Failed to create blog post");
    }

    revalidatePath("/admin/blog");
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Create blog error:', error);
    return {
      errors: { _form: [error instanceof Error ? error.message : "An unexpected error occurred."] },
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
    const response = await fetch(`${BASE_URL}/blog/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer 2|Fw4Uo167tlqOE9wqSPgT55q4joQbMLlWCoWwpsHG8afbb11a`,
      },
      body: JSON.stringify(validatedFields.data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      // If the API returns validation errors, return them
      if (response.status === 422 && result.errors) {
        return { errors: result.errors };
      }
      // For other errors, include the error message from the API if available
      console.log("error", result.message)
      throw new Error(result.message || "Failed to update blog post");
    }

    // revalidatePath("/admin/blog");

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Update blog error:', error);
    return {
      errors: { _form: [error instanceof Error ? error.message : "An unexpected error occurred."] },
    };
  }
}

// Server action to delete a blog post
export async function deleteBlog(id: string) {
  try {
    const response = await fetch(`${BASE_URL}/blog/${id}`, {
      method: "DELETE",
      headers: {
        // Add any necessary authentication headers
        "Authorization": `Bearer 2|Fw4Uo167tlqOE9wqSPgT55q4joQbMLlWCoWwpsHG8afbb11a`,
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