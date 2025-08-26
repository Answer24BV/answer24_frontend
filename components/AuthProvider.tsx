"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { tokenUtils } from "@/utils/auth";

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
    throw new Error("useAuth must be used within an AuthProvider");
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
  const publicRoutes = [
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/partner-signup",
    "/",
  ];

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);

      // Detect if running in PWA mode
      const isPWA = window.matchMedia("(display-mode: standalone)").matches;

      try {
        const token = tokenUtils.getToken();
        const userData = tokenUtils.getUser();

        // Check if current route is public (moved inside to have latest pathname)
        const currentIsPublicRoute = publicRoutes.some((route) =>
          pathname.startsWith(route)
        );

        if (token && userData) {
          setIsAuthenticated(true);
          setUser(userData);

          // List of auth routes that should redirect to dashboard when authenticated
          const authRoutes = [
            "/signin",
            "/signup",
            "/forgot-password",
            "/reset-password",
            "/partner-signup",
          ];
          const isAuthRoute = authRoutes.some((route) =>
            pathname.startsWith(route)
          );

          // Redirect only if on auth root
          if (isAuthRoute) {
            const redirectDelay = isPWA ? 2500 : 0;
            setTimeout(() => {
              router.replace("/dashboard");
            }, redirectDelay);
            return;
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);

          // Only redirect to signin if on a protected route while unauthenticated
          if (!currentIsPublicRoute) {
            // For PWA, add delay to let loader finish
            const redirectDelay = isPWA ? 2500 : 0;
            setTimeout(() => {
              router.replace("/signin");
            }, redirectDelay);
            return;
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        setUser(null);

        const currentIsPublicRoute = publicRoutes.some((route) =>
          pathname.startsWith(route)
        );
        if (!currentIsPublicRoute) {
          const redirectDelay = isPWA ? 2500 : 0;
          setTimeout(() => {
            router.replace("/signin");
          }, redirectDelay);
        }
      } finally {
        // For PWA, keep loading state longer to sync with loader animation
        const loadingDelay = isPWA ? 2000 : 0;
        setTimeout(() => {
          setIsLoading(false);
        }, loadingDelay);
      }
    };

    checkAuth();
  }, [pathname, router]);

  const logout = () => {
    tokenUtils.removeToken();
    setIsAuthenticated(false);
    setUser(null);
    router.replace("/signin");
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
