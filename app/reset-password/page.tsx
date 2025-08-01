"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Get the current URL search params
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    
    // Redirect to the localized version (assuming 'en' as default)
    const redirectUrl = `/en/reset-password?token=${token}&email=${email}`;
    router.replace(redirectUrl);
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