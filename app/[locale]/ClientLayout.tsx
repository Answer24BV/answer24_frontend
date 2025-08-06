"use client";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useHideSomethingOnRoute } from "@/lib/useHideSomethinOnRoute";
import { usePathname } from "@/i18n/navigation";
import ChatWidget from "@/components/common/ChatWidget";
import PWALoader from "@/components/PWALoader";
import TranslationPreloader from "@/components/TranslationPreloader";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import { AuthProvider } from "@/components/AuthProvider";
import { ToastContainer } from "react-toastify";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { tokenUtils } from "@/utils/auth";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { NotificationBanner } from "@/components/common/NotificationBanner";
import CookiePopup from "@/components/CookiePopup";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isUserTypePage = pathname.startsWith("/admin") || (pathname.startsWith("/partner") && !pathname.startsWith("/partner-signup")) || pathname.startsWith("/client");
  const isDashboardChatPage = pathname === "/dashboard/chat";
  const [user, setUser] = useState<User | null>(null);

  // Initialize user and push notifications
  useEffect(() => {
    const userData = tokenUtils.getUser();
    setUser(userData);
  }, []);

  // Initialize push notifications globally with user ID
  usePushNotifications(user?.id?.toString());

  // hook to hide something on route
  const hiddenNavbar = useHideSomethingOnRoute(["/client/autoservicejanssen"]);

  return (
    <AuthProvider>
      <ServiceWorkerRegistration />
      <TranslationPreloader />
      <NotificationBanner />
      {isDashboardPage || isUserTypePage ? null : <Header />}
      <PWALoader />
      <main className={isDashboardPage || isUserTypePage ? "pt-20" : ""}>{children}</main>
      {!isDashboardChatPage && <ChatWidget />}
      {isDashboardPage || isUserTypePage ? null : <Footer />}
      <CookiePopup />
      <ToastContainer position="top-right" autoClose={5000} />
    </AuthProvider>
  );
}
