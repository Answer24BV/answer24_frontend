/**
 * Centralized API configuration
 * This ensures all API calls use the same base URL from environment variables
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  
  // Common endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/login",
      REGISTER: "/register",
      LOGOUT: "/logout",
      FORGOT_PASSWORD: "/forgot-password",
      RESET_PASSWORD: "/reset-password",
      VERIFY_RESET_TOKEN: "/verify-reset-token",
    },
    SSO: {
      GOOGLE_AUTH_URL: "/sso/google/auth-url",
      GOOGLE_CALLBACK: "/sso/google/callback",
    },
    USER: {
      PROFILE: "/profile",
      DASHBOARD: "/dashboard",
    },
    AVATAR: {
      LIST: "/avatar",
      BY_ID: (id: string) => `/avatar/${id}`,
      ADMIN_LIST: "/admin/avatars",
      ADMIN_BY_ID: (id: string) => `/admin/avatars/${id}`,
    },
    PLAN: {
      LIST: "/plans",
      SUBSCRIBE: "/subscription/subscribe",
      DETAILS: "/subscription/details",
    },
    SUBSCRIPTION: {
      DETAILS: "/subscriptions/details",
      CANCEL: "/subscriptions/cancel",
      RENEW: "/subscriptions/renew",
      EXTEND: "/subscriptions/extend",
      TRIAL: "/subscriptions/trial",
      UPDATE_PAYMENT: "/subscriptions/payment-method",
    },
    INVOICE: {
      LIST: "/invoices",
      DOWNLOAD: (invoiceId: string) => `/invoices/${invoiceId}/download`,
    },
    WALLET: {
      BALANCE: "/wallet/balance",
      TRANSACTIONS: "/wallet/transactions",
      DEPOSIT: "/wallet/deposit",
    },
    BLOG: {
      LIST: "/blog",
      BY_ID: (id: string) => `/blog/${id}`,
    },
    FAQ: {
      LIST: "/faqs",
    },
    DAISYCON: {
      CATEGORY: "/daisycon/category",
      CONNECT: "/daisycon/connect",
      MEDIA: "/daisycon/media",
    },
    NOTIFICATIONS: {
      LIST: "/notifications",
    },
    CHAT: {
      CHATS: "/chats",
      CHAT_BY_ID: (id: string) => `/chats/${id}`,
      MESSAGES: (chatId: string) => `/chats/${chatId}/messages`,
      MESSAGE_READ: (messageId: string) => `/messages/${messageId}/read`,
      AI_RESPONSE: (chatId: string) => `/chats/${chatId}/ai`,
      AI_STATUS: "/ai/status",
    },
    ADMIN: {
      USERS: "/admin/users",
      USER_STATUS: (userId: string) => `/admin/users/${userId}/status`,
      USER_AI_TOGGLE: (userId: string) => `/admin/users/${userId}/ai-toggle`,
      CHAT_ANALYTICS: "/admin/chat-analytics",
    },
  },
} as const;

/**
 * Helper function to get full API URL
 */
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

/**
 * Helper function to get common headers
 */
export const getApiHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};
