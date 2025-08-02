'use client';

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useHideSomethingOnRoute } from "@/lib/useHideSomethinOnRoute";
import { usePathname } from "@/i18n/navigation";
import ChatWidget from "@/components/common/ChatWidget";
import PWALoader from "@/components/PWALoader";
import TranslationPreloader from "@/components/TranslationPreloader";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isDashboardPage = pathname.startsWith("/dashboard");

    // hook to hide something on route
    const hiddenNavbar = useHideSomethingOnRoute(["/client/autoservicejanssen"]);

    return (
        <>
            <TranslationPreloader />
            {hiddenNavbar ? null : <Header />}
            <PWALoader />
            {children}
            <ChatWidget />
            {isDashboardPage ? null : <Footer />}
        </>
    );
}
