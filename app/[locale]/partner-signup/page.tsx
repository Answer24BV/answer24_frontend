"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useState, FormEvent, useEffect } from "react";
import { useTranslations } from "next-intl";
import { authAPI, tokenUtils } from "@/utils/auth";
import { useRouter } from "@/i18n/navigation";

interface Errors {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeTerms: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  description: string;
  features: string[];
  credits?: number;
  trial_days?: number;
}

export default function PartnerSignUp() {
  const [signUpStep, setSignUpStep] = useState(1);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  const [errors, setErrors] = useState<Errors>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: "",
  });

  const t = useTranslations("SignInPage");
  const router = useRouter();

  // Fetch subscription plans when component mounts or when step 2 is reached
  useEffect(() => {
    if (signUpStep === 2) {
      fetchSubscriptionPlans();
    }
  }, [signUpStep]);

  async function fetchSubscriptionPlans() {
    setLoadingPlans(true);
    try {
      const token = tokenUtils.getToken();

      if (!token) {
        console.error("No token found in localStorage");
        setError("Authentication required. Please try signing up again.");
        setLoadingPlans(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/subscription/details`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Partner subscription details API response:", data);
        setSubscriptionPlans(data.plans || data || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          "Failed to fetch partner subscription plans:",
          response.status,
          errorData
        );
        setError(
          `Failed to load subscription plans (${response.status}). Please try again.`
        );
      }
    } catch (err) {
      console.error("Error fetching partner subscription plans:", err);
      setError("Failed to load subscription plans. Please try again.");
    } finally {
      setLoadingPlans(false);
    }
  }

  function validateAccountDetails(): boolean {
    let valid = true;
    const newErrors: Errors = {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeTerms: "",
    };

    if (!fullName.trim()) {
      newErrors.fullName = t("errors.fullNameRequired");
      valid = false;
    }
    if (!email.trim()) {
      newErrors.email = t("errors.emailRequired");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t("errors.invalidEmail");
      valid = false;
    }
    if (!phone.trim()) {
      newErrors.phone = t("errors.phoneRequired");
      valid = false;
    }
    if (!password) {
      newErrors.password = t("errors.passwordRequired");
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = t("errors.passwordTooShort");
      valid = false;
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = t("errors.confirmPasswordRequired");
      valid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t("errors.passwordsDontMatch");
      valid = false;
    }
    if (!agreeTerms) {
      newErrors.agreeTerms = t("errors.agreeTermsRequired");
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  async function handlePartnerSignUpSubmit(
    e: FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    if (!validateAccountDetails()) return;

    setError("");
    setIsLoading(true);

    try {
      const response = await authAPI.registerPartner({
        name: fullName,
        email,
        phone,
        password,
        password_confirmation: confirmPassword,
      });

      console.log("Partner registration API response:", response);

      // Store token and user data (token is nested in response.data.token)
      if (response.data?.token) {
        console.log("Storing partner token:", response.data.token);
        tokenUtils.setToken(response.data.token);
      } else {
        console.error("No token in partner registration response");
      }
      if (response.data?.user) {
        console.log("Storing partner user data:", response.data.user);
        tokenUtils.setUser(response.data.user);
      }

      // Verify token was stored
      const storedToken = tokenUtils.getToken();
      console.log("Partner token after storage:", storedToken);

      // Go to step 2 (plan selection) after successful signup
      setSignUpStep(2);
    } catch (err: any) {
      setError(err.message || "Partner registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePlanSelection(planId: string): Promise<void> {
    setError("");
    setIsLoading(true);

    try {
      const token = tokenUtils.getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/subscription/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            plan_id: planId,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Partner subscription successful:", data);

        // Redirect to dashboard after successful subscription
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        console.error("Partner subscription failed:", errorData);
        setError(
          errorData.message || "Failed to subscribe to plan. Please try again."
        );
      }
    } catch (err: any) {
      console.error("Error subscribing partner to plan:", err);
      setError(err.message || "Plan selection failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = () => {
    console.log("Partner signing up with Google...");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div
        className={`relative flex flex-col lg:flex-row w-11/12 md:w-3/4 lg:w-4/5 xl:w-2/3 2xl:w-1/2 bg-white rounded-2xl shadow-lg overflow-hidden my-8`}
      >
        {signUpStep === 1 && (
          <div className="relative lg:w-1/2 h-64 lg:h-auto">
            <Image
              src="/image.png"
              alt="Partner signup"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        )}

        <div
          className={`${
            signUpStep === 1 ? "lg:w-1/2" : "w-full"
          } p-8 lg:p-12 flex flex-col justify-center`}
        >
          {signUpStep === 2 ? (
            <>
              <div className="mb-2 text-gray-700 font-medium">
                {t("signUp.selectPlan")}
              </div>
              <h2 className="text-2xl font-bold mb-4">
                Partner {t("signUp.subscriptionPlans")}
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                  {error}
                </div>
              )}

              {loadingPlans ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">
                    Loading partner subscription plans...
                  </span>
                </div>
              ) : subscriptionPlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {subscriptionPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="bg-white rounded-xl shadow p-6 border"
                    >
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-xl font-bold">{plan.name}</span>
                        <span className="text-blue-600 font-bold text-lg">
                          {plan.currency === "USD" ? "$" : "€"}
                          {plan.price}
                          <span className="text-base font-normal">
                            /{plan.interval}
                          </span>
                        </span>
                      </div>
                      {plan.trial_days && (
                        <div className="text-xs text-gray-500 mb-2">
                          {plan.trial_days} day free trial
                        </div>
                      )}
                      <div className="mb-4 text-gray-700 text-sm">
                        {plan.description}
                      </div>
                      {plan.credits && (
                        <div className="mb-4 text-gray-700 text-sm">
                          {plan.credits} credits included{" "}
                          <span className="ml-1 text-gray-400">?</span>
                        </div>
                      )}
                      <Button
                        onClick={() => handlePlanSelection(plan.id)}
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold mb-4 disabled:opacity-50"
                      >
                        {isLoading
                          ? "Processing..."
                          : plan.trial_days
                          ? `Start ${plan.trial_days}-Day Trial`
                          : "Select Plan"}
                      </Button>
                      {plan.features && plan.features.length > 0 && (
                        <div>
                          <div className="font-semibold mb-1">
                            Features included:
                          </div>
                          <ul className="text-xs text-gray-700 list-disc pl-5">
                            {plan.features.map(
                              (feature: string, index: number) => (
                                <li key={index}>{feature}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">
                    No partner subscription plans available at the moment.
                  </p>
                  <Button
                    onClick={fetchSubscriptionPlans}
                    variant="outline"
                    className="mt-4"
                  >
                    Retry Loading Plans
                  </Button>
                </div>
              )}

              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => setSignUpStep(1)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ← Back to Account Details
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {t("signUp.partnerSignUpTitle")}
                </h1>
                <p className="text-blue-600 text-lg">Join as a Partner</p>
              </div>

              <form className="space-y-6" onSubmit={handlePartnerSignUpSubmit}>
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

                <div className="space-y-2">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder={t("signUp.fullName")}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-0 py-3 text-gray-700 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none placeholder-gray-500"
                  />
                  {errors.fullName && (
                    <div className="text-xs text-red-600">
                      {errors.fullName}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder={t("email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-0 py-3 text-gray-700 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none placeholder-gray-500"
                  />
                  {errors.email && (
                    <div className="text-xs text-red-600">{errors.email}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    placeholder="Telefoonnummer"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-0 py-3 text-gray-700 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none placeholder-gray-500"
                  />
                  {errors.phone && (
                    <div className="text-xs text-red-600">{errors.phone}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder={t("password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-0 py-3 text-gray-700 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none placeholder-gray-500"
                  />
                  {errors.password && (
                    <div className="text-xs text-red-600">
                      {errors.password}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder={t("signUp.passwordAgain")}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-0 py-3 text-gray-700 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none placeholder-gray-500"
                  />
                  {errors.confirmPassword && (
                    <div className="text-xs text-red-600">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                <div className="flex items-start space-x-3 mt-6">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="agreeTerms" className="text-sm text-gray-600">
                    {t("termsText")}{" "}
                    <Link href="#" className="text-blue-600 hover:underline">
                      {t("termsOfService")}
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-blue-600 hover:underline">
                      {t("privacyPolicy")}
                    </Link>
                  </label>
                </div>
                {errors.agreeTerms && (
                  <div className="text-xs text-red-600">
                    {errors.agreeTerms}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? "Creating Partner Account..."
                    : "Sign Up as Partner"}
                </Button>

                <div className="text-center text-sm text-gray-600 mt-6">
                  {t("alreadyCustomer")}{" "}
                  <Link
                    href="/signin"
                    className="text-blue-600 hover:underline"
                  >
                    {t("login")}
                  </Link>{" "}
                  or{" "}
                  <Link
                    href="/signup"
                    className="text-blue-600 hover:underline"
                  >
                    Regular Sign Up
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
