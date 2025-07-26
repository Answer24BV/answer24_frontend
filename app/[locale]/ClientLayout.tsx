'use client';

import { Navbar } from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { useHideSomethingOnRoute } from "@/lib/useHideSomethinOnRoute";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // hook to hide something on route
    const hidden = useHideSomethingOnRoute("/chat");

    return (
        <>
            <Navbar />
            {children}
            {hidden ? null : <Footer />}
        </>
    );
}
