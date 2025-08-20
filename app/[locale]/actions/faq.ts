import { FAQ } from "@/types/faq.d";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  viewCount: number;
  tags: string[];
}

export interface Subcategory {
  id: string;
  name: string;
  items: FAQItem[];
}

export interface FAQCategory {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface FAQResponse {
  success: boolean;
  message: string;
  data: FAQCategory[];
}

export interface AdminFAQResponse {
  success: boolean;
  message: string;
  data: FAQ | FAQ[];
}

const BASE_URL = "https://answer24.laravel.cloud/api/v1";

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Something went wrong");
  }
  return response.json();
}

export async function getFAQs(): Promise<FAQCategory[]> {
  try {
    const response = await fetch(`${BASE_URL}/faq`);
    const result: FAQResponse = await handleResponse<FAQResponse>(response);
    return result.data;
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    throw error;
  }
}

// Get single FAQ by ID
export async function getFAQById(id: string): Promise<FAQ> {
  try {
    const response = await fetch(`${BASE_URL}/faqs/${id}`);
    const result: AdminFAQResponse = await handleResponse<AdminFAQResponse>(
      response
    );

    return result.data as FAQ;
  } catch (error) {
    console.error(`Error fetching FAQ with ID ${id}:`, error);
    throw error;
  }
}

// Create new FAQ
export async function createFAQ(
  token: string,
  faqData: Omit<FAQ, "id" | "created_at" | "updated_at">
): Promise<FAQ> {
  try {
    const response = await fetch(`${BASE_URL}/admin/faqs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(faqData),
    });

    const result: AdminFAQResponse = await handleResponse<AdminFAQResponse>(
      response
    );
    return result.data as FAQ;
  } catch (error) {
    console.error("Error creating FAQ:", error);
    throw error;
  }
}

// Update existing FAQ
export async function updateFAQ(
  id: string,
  token: string,
  faqData: Partial<Omit<FAQ, "id" | "created_at" | "updated_at">>
): Promise<FAQ> {
  try {
    const response = await fetch(`${BASE_URL}/admin/faqs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(faqData),
    });

    const result: AdminFAQResponse = await handleResponse<AdminFAQResponse>(
      response
    );
    return result.data as FAQ;
  } catch (error) {
    console.error(`Error updating FAQ with ID ${id}:`, error);
    throw error;
  }
}

// Delete FAQ
export async function deleteFAQ(id: string): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${BASE_URL}/faqs/${id}`, {
      method: "DELETE",
    });

    const result = await handleResponse<{ success: boolean }>(response);
    return result;
  } catch (error) {
    console.error(`Error deleting FAQ with ID ${id}:`, error);
    throw error;
  }
}

// Toggle FAQ active status
export async function toggleFAQStatus(
  id: string,
  isActive: boolean
): Promise<FAQ> {
  try {
    const response = await fetch(`${BASE_URL}/faqs/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_active: isActive }),
    });

    const result: AdminFAQResponse = await handleResponse<AdminFAQResponse>(
      response
    );
    return result.data as FAQ;
  } catch (error) {
    console.error(`Error toggling status for FAQ with ID ${id}:`, error);
    throw error;
  }
}
