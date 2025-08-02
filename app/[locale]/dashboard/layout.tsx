"use client";

import { Sidebar } from "@/components/common/Sidebar";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSidebarCollapse = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        collapsed={sidebarCollapsed}
        onCollapse={handleSidebarCollapse}
      />
      <main 
        className={`
          flex-1 overflow-auto transition-all duration-300 ease-in-out
          ${sidebarCollapsed 
            ? 'md:ml-16' // Collapsed sidebar width (4rem = 64px)
            : 'md:ml-64' // Expanded sidebar width (16rem = 256px)
          }
        `}
      >
        <div className="mt-7">
          {children}
        </div>
      </main>
    </div>
  );
}