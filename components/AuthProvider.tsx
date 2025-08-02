"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { tokenUtils } from '@/utils/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  // Public routes that don't require authentication
  const publicRoutes = ['/signin', '/signup', '/forgot-password', '/reset-password', '/partner-signup', '/'];
  
  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => pathname.includes(route));

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      try {
        const token = tokenUtils.getToken();
        const userData = tokenUtils.getUser();
        
        if (token && userData) {
          setIsAuthenticated(true);
          setUser(userData);
          
          // If user is authenticated and on a public route, redirect to dashboard
          if (isPublicRoute && pathname !== '/') {
            router.replace('/dashboard');
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
          
          // If user is not authenticated and on a protected route, redirect to signin
          if (!isPublicRoute) {
            router.replace('/signin');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setUser(null);
        
        if (!isPublicRoute) {
          router.replace('/signin');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router, isPublicRoute]);

  const logout = () => {
    tokenUtils.removeToken();
    setIsAuthenticated(false);
    setUser(null);
    router.replace('/signin');
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};