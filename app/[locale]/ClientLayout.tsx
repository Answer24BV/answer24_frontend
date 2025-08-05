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

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboardPage = pathname.startsWith("/dashboard");
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
      {isDashboardPage ? null : <Header />}
      <PWALoader />
      <main className={isDashboardPage ? "pt-20" : ""}>{children}</main>
      {!isDashboardChatPage && <ChatWidget />}
      {isDashboardPage ? null : <Footer />}
      <ToastContainer position="top-right" autoClose={5000} />
    </AuthProvider>
  );
}
