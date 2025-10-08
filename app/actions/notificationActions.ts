"use server";

import { getAuthHeadersAsync } from "@/utils/serverAuth";
import { API_CONFIG, getApiUrl, getApiHeaders } from "@/lib/api-config";

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

/**
 * Fetches notifications for the current user.
 * MOCK IMPLEMENTATION - Replace with real API when available
 */
export const getNotifications = async (
  page: number = 1,
  pageSize: number = 10,
  userType?: "admin" | "partner" | "client"
): Promise<Notification[]> => {
  // Mock API call - simulate network delay
  await new Promise((resolve) =>
    setTimeout(resolve, 300 + Math.random() * 500)
  );

  // Return mock data based on user type with pagination
  return getMockNotifications(userType, page, pageSize);
};

/**
 * Marks a specific notification as read.
 * MOCK IMPLEMENTATION - Replace with real API when available
 */
export const markAsRead = async (
  notificationId: string
): Promise<{ success: boolean }> => {
  // Mock API call - simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  return { success: true };
};

/**
 * Marks all unread notifications for the user as read.
 * MOCK IMPLEMENTATION - Replace with real API when available
 */
export const markAllAsRead = async (): Promise<{ success: boolean }> => {
  // Mock API call - simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  return { success: true };
};

/**
 * Get mock notifications based on user type with pagination support
 */
const getMockNotifications = (
  userType?: "admin" | "partner" | "client",
  page: number = 1,
  pageSize: number = 10
): Notification[] => {
  const baseNotifications = {
    admin: [
      {
        id: "admin-1",
        message: "New user registration requires approval.",
        read: false,
        createdAt: new Date().toISOString(),
        link: "/dashboard/admin/users",
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
        link: "/dashboard/admin/maintenance",
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
        link: "/dashboard/admin/reports",
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
        message: "Service package has been approved and is now active.",
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        link: "/partner/services",
        sender: {
          name: "Service Manager",
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

  const notifications = baseNotifications[userType || "client"];

  // Add more mock notifications for pagination testing
  const extendedNotifications = [...notifications];

  // Generate additional mock notifications if needed
  for (let i = notifications.length; i < pageSize * 3; i++) {
    const baseNotification = notifications[i % notifications.length];
    extendedNotifications.push({
      ...baseNotification,
      id: `${baseNotification.id}-${i}`,
      message: `${baseNotification.message} (${i + 1})`,
      createdAt: new Date(Date.now() - i * 3600000).toISOString(), // Spread over hours
      read: Math.random() > 0.3, // 70% chance of being read
    });
  }

  // Implement pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return extendedNotifications.slice(startIndex, endIndex);
};
