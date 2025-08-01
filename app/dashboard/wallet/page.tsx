"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WalletRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the localized version (assuming 'en' as default)
    router.replace("/en/dashboard/wallet");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Redirecting...</p>
      </div>
    </div>
  );
}