"use server";

import { getAuthHeadersAsync } from "@/utils/serverAuth";

// Define a standard Notification type
export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string; // ISO 8601 date string
  link?: string;
  sender?: {
    name: string;
    avatar: string;
  };
}

const API_BASE_URL = "https://api.lociq.nl/api/v1/notifications"; // Dummy base URL

/**
 * Fetches notifications for the current user.
 */
export const getNotifications = async (
  page: number = 1,
  pageSize: number = 10
): Promise<Notification[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}?page=${page}&limit=${pageSize}`, {
      headers: await getAuthHeadersAsync(),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error("Failed to fetch notifications.");
    }

    const result = await response.json();

    // Assuming the API returns a structure like { success: boolean, data: [...] }
    if (result.success && Array.isArray(result.data)) {
      return result.data;
    } else {
      // Handle cases where the API call is successful but there's no data
      return [];
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
    // In case of an error, return a default notification to show how it should look
    return [
      {
        id: "default-1",
        message: "Welcome! This is a default notification.",
        read: false,
        createdAt: new Date().toISOString(),
        link: "#",
        sender: { name: "Lociq System", avatar: "/images/avatars/Image-4.png" },
      },
    ];
  }
};

/**
 * Marks a specific notification as read.
 */
export const markAsRead = async (notificationId: string): Promise<{ success: boolean }> => {
  // This is a dummy endpoint.
  const response = await fetch(`${API_BASE_URL}/${notificationId}/mark-as-read`, {
    method: "PATCH",
    headers: await getAuthHeadersAsync()
  });

  if (!response.ok) {
    throw new Error("Failed to mark notification as read.");
  }
  
  console.log(`Notification ${notificationId} marked as read.`);
  return { success: true };
};

/**
 * Marks all unread notifications for the user as read.
 */
export const markAllAsRead = async (): Promise<{ success: boolean }> => {
  // This is a dummy endpoint.
  const response = await fetch(`${API_BASE_URL}/mark-all-read`, {
    method: "POST",
    headers: await getAuthHeadersAsync()
  });

  if (!response.ok) {
    throw new Error("Failed to mark all notifications as read.");
  }
  
  console.log("All notifications marked as read.");
  return { success: true };
};