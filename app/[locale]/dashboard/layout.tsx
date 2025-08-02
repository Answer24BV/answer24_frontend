"use client";

import { Sidebar } from "@/components/common/Sidebar";
import { AuthGuard } from "@/components/AuthGuard";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-white flex">
        <Sidebar />
        <main className="flex-1 overflow-auto md:ml-64 transition-all duration-300">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
