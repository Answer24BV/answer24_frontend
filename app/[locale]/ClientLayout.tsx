'use client';

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useHideSomethingOnRoute } from "@/lib/useHideSomethinOnRoute";
import ChatWidget from "@/components/common/ChatWidget";
import PWALoader from "@/components/PWALoader";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // hook to hide something on route
    const hidden = useHideSomethingOnRoute(["/dashboard/chat", "/dashboard/account", "/dashboard/account/wallet", "/dashboard", "/dashboard/wallet",]);

    return (
        <>
            <Header />
            <PWALoader />
            {children}
            <ChatWidget />
            {hidden ? null : <Footer />}
        </>
    );
}
