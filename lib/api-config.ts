/**
 * Centralized API configuration
 * This ensures all API calls use the same base URL from environment variables
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1",
  
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
      LIST: "/plan",
      SUBSCRIBE: "/subscription/subscribe",
      DETAILS: "/subscription/details",
    },
    WALLET: {
      BALANCE: "/wallet/balance",
      TRANSACTIONS: "/wallet/transactions",
      DEPOSIT: "/wallet/deposit",
    },
    ADMIN: {
      USERS: "/admin/users",
      USER_STATUS: (userId: string) => `/admin/users/${userId}/status`,
    },
    BLOG: {
      LIST: "/blog",
      BY_ID: (id: string) => `/blog/${id}`,
    },
    FAQ: {
      LIST: "/faq",
    },
    DAISYCON: {
      CATEGORY: "/daisycon/category",
      CONNECT: "/daisycon/connect",
      MEDIA: "/daisycon/media",
    },
    NOTIFICATIONS: {
      LIST: "/notifications",
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
