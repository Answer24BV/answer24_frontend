// Token management utilities
export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'user_data';

export const tokenUtils = {
  // Store token in localStorage
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  // Get token from localStorage
   getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  // Remove token from localStorage
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  // Store user data
  setUser: (user: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  // Get user data
  getUser: () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!tokenUtils.getToken();
  },

  // Validate token with server (optional - for extra security)
  validateToken: async (): Promise<boolean> => {
    const token = tokenUtils.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://staging.answer24.nl/api/v1"}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        return true;
      } else {
        // Token is invalid, remove it
        tokenUtils.removeToken();
        return false;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  },

  // Logout function
  logout: () => {
    tokenUtils.removeToken();
    // Redirect to signin page
    if (typeof window !== 'undefined') {
      window.location.href = '/signin';
    }
  }
};

// API request helper
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://staging.answer24.nl/api/v1";
  const token = tokenUtils.getToken();

  const defaultHeaders: HeadersInit = {
    'Accept': 'application/json',
  };

  // Add authorization header if token exists
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  // Login
  login: async (email: string, password: string, remember: boolean = false) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        remember
      }),
    });
  },

  // Register (normal signup)
  register: async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    userType?: string;
    referral_token?: string;
  }) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('password', data.password);
    formData.append('password_confirmation', data.password_confirmation);
    formData.append('userType', data.userType || 'client');
    
    if (data.referral_token) {
      formData.append('referral_token', data.referral_token);
    }

    const endpoint = data.referral_token 
      ? `/auth/register/${data.referral_token}`
      : '/auth/register';

    return apiRequest(endpoint, {
      method: 'POST',
      body: formData,
    });
  },

  // Partner register
  registerPartner: async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    referral_token?: string;
  }) => {
    return authAPI.register({
      ...data,
      userType: 'partner'
    });
  }
};