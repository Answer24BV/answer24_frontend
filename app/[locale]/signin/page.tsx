"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Eye, EyeOff, Mail, Key, User, Camera, Upload } from "lucide-react";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpStep, setSignUpStep] = useState(0); // 0: email, 1: account details, 2: plan selection
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState({
    fullName: "",
    password: "",
    password2: "",
  });
  const [planBilling, setPlanBilling] = useState("monthly");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );

  const searchParams = useSearchParams();
  const t = useTranslations("SignInPage");
  
  useEffect(() => {
    if (searchParams.get("signup") === "1") {
      setIsSignUp(true);
    }
  }, [searchParams]);
  
  // Get translated password requirements
  const passwordRequirements = t.raw("signUp.passwordRequirements") as string[];

  // Password requirements are now handled by translations

  function validateAccountDetails() {
    let valid = true;
    const newErrors = { fullName: "", password: "", password2: "" };
    if (!fullName) {
      newErrors.fullName = t("errors.fullNameRequired");
      valid = false;
    }
    if (!password) {
      newErrors.password = t("errors.passwordRequired");
      valid = false;
    }
    if (!password2) {
      newErrors.password2 = t("errors.passwordAgainRequired");
      valid = false;
    } else if (password !== password2) {
      newErrors.password2 = t("errors.passwordsDontMatch");
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  }

  function handleSignUpEmailSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (email) {
      setSignUpStep(1);
    }
  }

  function handleAccountDetailsSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (validateAccountDetails()) {
      setSignUpStep(2); // Go to plan selection
    }
  }

  function handleProfilePictureUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert(t("errors.invalidFileType"));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(t("errors.fileTooLarge"));
        return;
      }

      setProfilePictureFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePicture(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function removeProfilePicture() {
    setProfilePicture(null);
    setProfilePictureFile(null);
  }

  return (
    <div className="min-h-screen flex items-stretch bg-gray-50 pt-20">
      {/* Left: Marketing */}
      {!(isSignUp && signUpStep === 2) && (
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-[#0a0a23] p-10 text-white">
          {/* <div className="flex items-center mb-8">
            <Image src="/globe.svg" alt="Logo" width={40} height={40} />
            <span className="ml-3 text-2xl font-bold">adsby</span>
          </div> */}
          <div className="mb-4 text-lg font-medium opacity-80">
            {t("hero.weeklyOptimization")}
          </div>
          <h2 className="text-3xl font-bold mb-2 text-white text-center">
            {t("hero.weeklyOptimization")}
            <br />
           <span className="text-teal-300">{t("hero.withNoHassle")}</span>
          </h2>
          <p className="mb-8 text-base opacity-80 text-center">
            {t("hero.includeSearchTerms")}
            <br />
            {t("hero.withinCampaignScope")}
          </p>
          <Image
            src="/image.png"
            alt="Optimize your campaign"
            width={260}
            height={160}
            className="rounded-xl shadow"
          />
        </div>
      )}
      {/* Right: Auth Form */}
      <div
        className={`flex-1 ${
          isSignUp && signUpStep === 2
            ? "p-0 bg-transparent w-full max-w-5xl mx-auto"
            : "p-8 md:p-12 bg-white"
        } flex flex-col justify-center ${
          isSignUp && signUpStep === 2 ? "" : ""
        }`}
      >
        <div
          className={`${
            isSignUp && signUpStep === 2 ? "py-8" : "w-full max-w-md mx-auto"
          }`}
        >
          {/* Sign Up Multi-Step */}
          {isSignUp && signUpStep === 2 ? (
            <>
              {/* Progress Indicator */}
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-gray-300 mx-1" />
                  <span className="w-3 h-3 rounded-full bg-gray-300 mx-1" />
                  <span className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-blue-600 text-blue-600 font-bold mr-2">
                    3
                  </span>
                  <span className="w-3 h-3 rounded-full bg-gray-300 mx-1" />
                </div>
              </div>
              <div className="mb-2 text-gray-700 font-medium">
                {t("signUp.selectPlan")}
              </div>
              <h2 className="text-2xl font-bold mb-4">{t("signUp.subscriptionPlans")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Launch Plan */}
                <div className="bg-white rounded-xl shadow p-6 border">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xl font-bold">{t("signUp.plans.launch.name")}</span>
                    <span className="text-pink-500 font-bold text-lg">
                      $29 <span className="text-base font-normal">/mo</span>
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {t("signUp.plans.launch.trial")}
                  </div>
                  <div className="mb-4 text-gray-700 text-sm">
                    {t("signUp.plans.launch.description")}
                  </div>
                  <div className="mb-4 text-gray-700 text-sm">
                    {t("signUp.plans.launch.credits")}{" "}
                    <span className="ml-1 text-gray-400">?</span>
                  </div>
                  <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold mb-4">
                    {t("signUp.startTrial")}
                  </Button>
                  <div>
                    <div className="font-semibold mb-1">{t("signUp.plans.launch.featuresLabel")}</div>
                    <ul className="text-xs text-gray-700 list-disc pl-5">
                      {(t.raw("signUp.plans.launch.features") as string[]).map((feature: string, index: number) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Growth Plan */}
                <div className="bg-white rounded-xl shadow p-6 border">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xl font-bold">{t("signUp.plans.growth.name")}</span>
                    <span className="text-pink-500 font-bold text-lg">
                      $49 <span className="text-base font-normal">/mo</span>
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {t("signUp.plans.growth.trial")}
                  </div>
                  <div className="mb-4 text-gray-700 text-sm">
                    {t("signUp.plans.growth.description")}
                  </div>
                  <div className="mb-4 text-gray-700 text-sm">
                    {t("signUp.plans.growth.credits")}{" "}
                    <span className="ml-1 text-gray-400">?</span>
                  </div>
                  <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold mb-4">
                    {t("signUp.startTrial")}
                  </Button>
                  <div>
                    <div className="font-semibold mb-1">{t("signUp.plans.growth.featuresLabel")}</div>
                    <ul className="text-xs text-gray-700 list-disc pl-5">
                      {(t.raw("signUp.plans.growth.features") as string[]).map((feature: string, index: number) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Enterprise Plan */}
                <div className="bg-white rounded-xl shadow p-6 border">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xl font-bold">{t("signUp.plans.enterprise.name")}</span>
                    <span className="text-pink-500 font-bold text-lg">
                      $249 <span className="text-base font-normal">/mo</span>
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {t("signUp.plans.enterprise.trial")}
                  </div>
                  <div className="mb-4 text-gray-700 text-sm">
                    {t("signUp.plans.enterprise.description")}
                  </div>
                  <div className="mb-4 text-gray-700 text-sm">
                    {t("signUp.plans.enterprise.credits")}{" "}
                    <span className="ml-1 text-gray-400">?</span>
                  </div>
                  <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold mb-4">
                    {t("signUp.startTrial")}
                  </Button>
                  <div>
                    <div className="font-semibold mb-1">{t("signUp.plans.enterprise.featuresLabel")}</div>
                    <ul className="text-xs text-gray-700 list-disc pl-5">
                      {(t.raw("signUp.plans.enterprise.features") as string[]).map((feature: string, index: number) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : isSignUp && signUpStep === 1 ? (
            <>
              {/* Progress Indicator */}
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-gray-300 mx-1" />
                  <span className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-blue-600 text-blue-600 font-bold mr-2">
                    2
                  </span>
                  <span className="w-3 h-3 rounded-full bg-gray-300 mx-1" />
                  <span className="w-3 h-3 rounded-full bg-gray-300 mx-1" />
                </div>
              </div>
              <div className="mb-2 text-gray-700 font-medium">
                {t("signUp.welcomeMessage")}
              </div>
              <h2 className="text-2xl font-bold mb-6">{t("signUp.accountDetails")}</h2>
              <form className="space-y-4" onSubmit={handleAccountDetailsSubmit}>
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t("signUp.profilePicture")}
                  </label>
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
                      {profilePicture ? (
                        <Image
                          src={profilePicture}
                          alt="Profile preview"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <User size={32} className="text-gray-400" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                      id="profile-picture-upload"
                    />
                    <label
                      htmlFor="profile-picture-upload"
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
                    >
                      <Camera size={16} className="text-white" />
                    </label>
                  </div>
                  {profilePicture && (
                    <button
                      type="button"
                      onClick={removeProfilePicture}
                      className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                    >
                      {t("signUp.removePicture")}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("signUp.fullName")}
                  </label>
                  <span className="absolute left-3 top-9 text-gray-400">
                    <User size={18} />
                  </span>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder={t("signUp.fullName")}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`pl-10 pr-3 py-2 w-full border ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.fullName && (
                    <div className="text-xs text-red-600 mt-1">
                      {errors.fullName}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("email")}
                  </label>
                  <span className="absolute left-3 top-9 text-gray-400">
                    <Mail size={18} />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    disabled
                    className="pl-10 pr-3 py-2 w-full border border-gray-200 bg-gray-100 rounded-md shadow-sm text-gray-500"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="relative w-1/2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t("password")}
                    </label>
                    <span className="absolute left-3 top-9 text-gray-400">
                      <Key size={18} />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-10 pr-10 py-2 w-full border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-9 text-gray-400 focus:outline-none"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {errors.password && (
                      <div className="text-xs text-red-600 mt-1">
                        {errors.password}
                      </div>
                    )}
                  </div>
                  <div className="relative w-1/2">
                    <label
                      htmlFor="password2"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t("signUp.passwordAgain")}
                    </label>
                    <span className="absolute left-3 top-9 text-gray-400">
                      <Key size={18} />
                    </span>
                    <input
                      id="password2"
                      name="password2"
                      type={showPassword2 ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      placeholder="********"
                      value={password2}
                      onChange={(e) => setPassword2(e.target.value)}
                      className={`pl-10 pr-10 py-2 w-full border ${
                        errors.password2 ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-9 text-gray-400 focus:outline-none"
                      onClick={() => setShowPassword2((v) => !v)}
                      tabIndex={-1}
                    >
                      {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {errors.password2 && (
                      <div className="text-xs text-red-600 mt-1">
                        {errors.password2}
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 mt-2">
                  <div className="font-semibold mb-1">
                    {t("signUp.strongPassword")}
                  </div>
                  <ul className="text-xs text-gray-700 list-disc pl-5">
                    {passwordRequirements.map((req) => (
                      <li key={req}>{req}</li>
                    ))}
                  </ul>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-emerald-400 hover:bg-emerald-500 text-white text-base font-semibold py-2 rounded-md mt-2"
                >
                  {t("signUp.continueButton")}
                </Button>
              </form>
            </>
          ) : isSignUp ? (
            <>
              <h2 className="text-2xl font-bold text-center mb-6">
                {t("signUp.title")}
              </h2>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center mb-6"
              >
                <Image
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                {t("signUp.signInWithGoogle")}
              </Button>
              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="mx-4 text-gray-400 font-medium">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <form className="space-y-4" onSubmit={handleSignUpEmailSubmit}>
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("email")}
                  </label>
                  <span className="absolute left-3 top-9 text-gray-400">
                    <Mail size={18} />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder={t("email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-emerald-400 hover:bg-emerald-500 text-white text-base font-semibold py-2 rounded-md"
                >
                  {t("signUp.signUpWithEmail")}
                </Button>
              </form>
              <div className="text-center text-sm text-gray-600 mt-6">
                {t("alreadyCustomer")}{" "}
                <button
                  type="button"
                  className="text-blue-600 font-semibold underline"
                  onClick={() => setIsSignUp(false)}
                >
                  {t("signIn")}
                </button>
              </div>
              <div className="text-xs text-center text-gray-500 mt-4">
                {t.rich("termsText", {
                  tos: (chunks: React.ReactNode) => (
                    <Link
                      href="/terms"
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {chunks}
                    </Link>
                  ),
                  privacy: (chunks: React.ReactNode) => (
                    <Link
                      href="/privacy"
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center mb-6">
                {t("title")}
              </h2>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center mb-6"
              >
                <Image
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                {t("signInWithGoogle")}
              </Button>
              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="mx-4 text-gray-400 font-medium">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <form className="space-y-4">
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("email")}
                  </label>
                  <span className="absolute left-3 top-9 text-gray-400">
                    <Mail size={18} />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("email")}
                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("password")}
                  </label>
                  <span className="absolute left-3 top-9 text-gray-400">
                    <Key size={18} />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("password")}
                    className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-400 focus:outline-none"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="flex items-center justify-end">
                  <Link
                    href="#"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {t("forgotPassword")}
                  </Link>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-emerald-400 hover:bg-emerald-500 text-white text-base font-semibold py-2 rounded-md"
                >
                  {t("signIn")}
                </Button>
              </form>
              <div className="text-center text-sm text-gray-600 mt-6">
                {t("noAccount")}{" "}
                <button
                  type="button"
                  className="text-yellow-600 font-semibold underline"
                  onClick={() => setIsSignUp(true)}
                >
                  {t("startTrial")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

