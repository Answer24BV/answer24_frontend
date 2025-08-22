"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { tokenUtils } from "@/utils/auth";

export default function GoogleCallback() {
  const [status, setStatus] = useState("Processing...");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    handleGoogleCallback();
  }, []);

  async function handleGoogleCallback() {
    try {
      // Get the authorization code from URL parameters
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const error = searchParams.get("error");
      const isSignup = searchParams.get("signup") === "true";

      // Handle OAuth errors (user cancelled, etc.)
      if (error) {
        setError(`Google authentication failed: ${error}`);
        setTimeout(() => {
          router.push(isSignup ? "/signup" : "/signin");
        }, 3000);
        return;
      }

      // Check if we have the authorization code
      if (!code) {
        setError("No authorization code received from Google");
        setTimeout(() => {
          router.push(isSignup ? "/signup" : "/signin");
        }, 3000);
        return;
      }

      setStatus("Exchanging authorization code...");

      // Send the authorization code to your backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/sso/google/callback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            code: code,
            state: state,
            signup: isSignup,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log("Google callback response:", result);

      // Store authentication data
      if (result.data?.token) {
        tokenUtils.setToken(result.data.token);
      }
      if (result.data?.user) {
        tokenUtils.setUser(result.data.user);
      }

      setStatus("Authentication successful! Redirecting...");

      // Redirect based on whether it's signup or signin
      if (isSignup) {
        // For signup, go to plan selection (step 2)
        router.push("/signup?step=2");
      } else {
        // For signin, go directly to dashboard
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Google callback error:", err);
      setError(err.message || "Authentication failed");

      // Redirect back to appropriate page after error
      setTimeout(() => {
        const isSignup = searchParams.get("signup") === "true";
        router.push(isSignup ? "/signup" : "/signin");
      }, 3000);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {error ? (
            <>
              <div className="text-red-600 mb-4">
                <svg
                  className="w-12 h-12 mx-auto mb-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Authentication Failed
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <p className="text-sm text-gray-500">Redirecting you back...</p>
            </>
          ) : (
            <>
              <div className="text-blue-600 mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Completing Authentication
              </h2>
              <p className="text-gray-600">{status}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
