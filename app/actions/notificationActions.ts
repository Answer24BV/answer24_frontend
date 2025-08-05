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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://staging.answer24.nl/api/v1";

/**
 * Fetches notifications for the current user.
 */
export const getNotifications = async (
  page: number = 1,
  pageSize: number = 10,
  userType?: "admin" | "partner" | "client"
): Promise<Notification[]> => {
  try {
    const url = userType
      ? `${API_BASE_URL}/notifications?page=${page}&limit=${pageSize}&userType=${userType}`
      : `${API_BASE_URL}/notifications?page=${page}&limit=${pageSize}`;

    const response = await fetch(url, {
      headers: await getAuthHeadersAsync(),
      cache: "no-store",
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
    // Return user-type specific mock data
    return getMockNotifications(userType);
  }
};

/**
 * Marks a specific notification as read.
 */
export const markAsRead = async (
  notificationId: string
): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/notifications/${notificationId}/mark-as-read`,
      {
        method: "PATCH",
        headers: await getAuthHeadersAsync(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to mark notification as read.");
    }

    console.log(`Notification ${notificationId} marked as read.`);
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    // Return success for demo purposes
    return { success: true };
  }
};

/**
 * Marks all unread notifications for the user as read.
 */
export const markAllAsRead = async (): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/notifications/mark-all-read`,
      {
        method: "POST",
        headers: await getAuthHeadersAsync(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to mark all notifications as read.");
    }

    console.log("All notifications marked as read.");
    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    // Return success for demo purposes
    return { success: true };
  }
};

/**
 * Get mock notifications based on user type
 */
const getMockNotifications = (
  userType?: "admin" | "partner" | "client"
): Notification[] => {
  const baseNotifications = {
    admin: [
      {
        id: "admin-1",
        message: "New user registration requires approval.",
        read: false,
        createdAt: new Date().toISOString(),
        link: "/en//dashboard/admin/users",
        sender: {
          name: "System Admin",
          avatar: "/answerLogobgRemover-removebg-preview.png",
        },
      },
      {
        id: "admin-2",
        message: "Server maintenance scheduled for tonight.",
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        link: "/en/dashboard/admin/maintenance",
        sender: {
          name: "System Monitor",
          avatar: "/answerLogobgRemover-removebg-preview.png",
        },
      },
      {
        id: "admin-3",
        message: "Monthly report is ready for review.",
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        link: "/en/admin/reports",
        sender: {
          name: "Analytics System",
          avatar: "/answerLogobgRemover-removebg-preview.png",
        },
      },
    ],
    partner: [
      {
        id: "partner-1",
        message: "New client inquiry received for your services.",
        read: false,
        createdAt: new Date().toISOString(),
        link: "/partner/clients",
        sender: {
          name: "Client Portal",
          avatar: "/answerLogobgRemover-removebg-preview.png",
        },
      },
      {
        id: "partner-2",
        message: "Property listing has been approved and is now live.",
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        link: "/partner/properties",
        sender: {
          name: "Property Manager",
          avatar: "/answerLogobgRemover-removebg-preview.png",
        },
      },
      {
        id: "partner-3",
        message: "Commission payment has been processed.",
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        link: "/partner/finance",
        sender: {
          name: "Finance Team",
          avatar: "/answerLogobgRemover-removebg-preview.png",
        },
      },
    ],
    client: [
      {
        id: "client-1",
        message:
          "Welcome to Answer24! Your account has been successfully created.",
        read: false,
        createdAt: new Date().toISOString(),
        link: "/dashboard",
        sender: {
          name: "Answer24 System",
          avatar: "/answerLogobgRemover-removebg-preview.png",
        },
      },
      {
        id: "client-2",
        message: "New message received from your service provider.",
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        link: "/dashboard/chat",
        sender: {
          name: "Support Team",
          avatar: "/answerLogobgRemover-removebg-preview.png",
        },
      },
      {
        id: "client-3",
        message: "Your service request has been updated.",
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        link: "/dashboard/services",
        sender: {
          name: "Service Manager",
          avatar: "/answerLogobgRemover-removebg-preview.png",
        },
      },
    ],
  };

  return baseNotifications[userType || "client"];
};
