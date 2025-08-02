"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { authAPI, tokenUtils } from "@/utils/auth";
import { useRouter } from "@/i18n/navigation";
import { AuthGuard } from "@/components/AuthGuard";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const t = useTranslations("SignInPage");
  const router = useRouter();

  async function handleSignInSubmit(
    e: FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await authAPI.login(email, password, rememberMe);

      // Store token and user data
      if (response.data.token) {
        console.log("Storing token:", response.data.token);
        tokenUtils.setToken(response.data.token);
      }
      if (response.data.user) {
        console.log("Storing user data:", response.data.user);
        tokenUtils.setUser(response.data.user);
      }

      // Show success message
      setSuccess("Login successful! Redirecting to dashboard...");

      // Redirect to dashboard immediately for PWA, with delay for web
      const isPWA = window.matchMedia('(display-mode: standalone)').matches;
      const redirectDelay = isPWA ? 200 : 800;
      
      setTimeout(() => {
        router.push("/dashboard");
      }, redirectDelay);
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = () => {
    console.log("Signing in with Google...");
    // Implement Google OAuth logic here
  };

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="relative flex flex-col lg:flex-row w-11/12 md:w-3/4 lg:w-4/5 xl:w-2/3 2xl:w-1/2 bg-white rounded-2xl shadow-lg overflow-hidden my-8">
        <div className="relative lg:w-1/2 h-64 lg:h-auto">
          <Image
            src="/image.png"
            alt="People with house"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {t("welcomeBack")}
            </h1>
            {/* <p className="text-blue-600 text-lg">{t("title")}</p> */}
          </div>

          <form className="space-y-6" onSubmit={handleSignInSubmit}>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center space-x-2 border border-gray-300 rounded-lg py-3 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              <Image
                src="/google-icon.svg"
                alt="Google"
                width={20}
                height={20}
              />
              <span>{t("signInWithGoogle")}</span>
            </button>

            <div className="relative flex items-center justify-center my-6">
              <span className="absolute bg-white px-2 text-sm text-gray-500">
                {t("or")}
              </span>
              <div className="w-full border-t border-gray-300"></div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            <div className="space-y-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={t("enterEmail")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-0 py-3 text-gray-700 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none placeholder-gray-500"
              />
            </div>

            <div className="space-y-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder={t("password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-0 py-3 text-gray-700 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none placeholder-gray-500"
              />
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center space-x-2">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                {t("forgotPassword")}
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : t("signIn")}
            </Button>

            <div className="text-center text-sm text-gray-600 mt-6">
              {t("noAccount")}{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                {t("signUpWithEmailFreeTrial")}
              </Link>
              <br />
              <span className="text-gray-500">or</span>{" "}
              <Link
                href="/partner-signup"
                className="text-blue-600 hover:underline"
              >
                {t("signupPartner")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}
