'use client';

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useHideSomethingOnRoute } from "@/lib/useHideSomethinOnRoute";
import { usePathname } from "@/i18n/navigation";
import ChatWidget from "@/components/common/ChatWidget";
import PWALoader from "@/components/PWALoader";
import TranslationPreloader from "@/components/TranslationPreloader";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import { AuthProvider } from "@/components/AuthProvider";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isDashboardPage = pathname.startsWith("/dashboard");
    const isDashboardChatPage = pathname === "/dashboard/chat";

    // hook to hide something on route
    const hiddenNavbar = useHideSomethingOnRoute(["/client/autoservicejanssen"]);

    return (
        <AuthProvider>
            <ServiceWorkerRegistration />
            <TranslationPreloader />
            {hiddenNavbar ? null : <Header />}
            <PWALoader />
            {children}
            {!isDashboardChatPage && <ChatWidget />}
            {isDashboardPage ? null : <Footer />}
        </AuthProvider>
    );
}
