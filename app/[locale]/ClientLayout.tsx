'use client';

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useHideSomethingOnRoute } from "@/lib/useHideSomethinOnRoute";
import ChatWidget from "@/components/common/ChatWidget";
import PWALoader from "@/components/PWALoader";
import TranslationPreloader from "@/components/TranslationPreloader";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // hook to hide something on route
    const hidden = useHideSomethingOnRoute(["/dashboard/chat", "/dashboard/account", "/dashboard/account/wallet", "/dashboard", "/dashboard/wallet", "/client/avatar", "/admin/client-domain-management", "/client/autoservicejanssen", '/dashboard/admin', '/dashboard/admin/blog', '/dashboard/admin/client-domain-management']);
    const hiddenNavbar = useHideSomethingOnRoute(["/client/autoservicejanssen"]);

    return (
        <>
            <TranslationPreloader />
            {hiddenNavbar ? null : <Header />}
            <PWALoader />
            {children}
            <ChatWidget />
            {hidden ? null : <Footer />}
        </>
    );
}
