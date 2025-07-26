"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
  useEffect(() => {
    if (searchParams.get("signup") === "1") {
      setIsSignUp(true);
    }
  }, [searchParams]);

  // Password requirements
  const passwordRequirements = [
    "At least 1 uppercase letter",
    "At least 1 lowercase letter",
    "At least 1 number",
    "At least 6 characters",
  ];

  function validateAccountDetails() {
    let valid = true;
    const newErrors = { fullName: "", password: "", password2: "" };
    if (!fullName) {
      newErrors.fullName = "Please type your full name.";
      valid = false;
    }
    if (!password) {
      newErrors.password = "Please type your password.";
      valid = false;
    }
    if (!password2) {
      newErrors.password2 = "Please type your password again.";
      valid = false;
    } else if (password !== password2) {
      newErrors.password2 = "Passwords do not match.";
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
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
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
            Weekly Optimization
          </div>
          <h2 className="text-3xl font-bold mb-2 text-white text-center">
            Weekly Optimization
            <br />
            with <span className="text-teal-300">No Hassle!</span>
          </h2>
          <p className="mb-8 text-base opacity-80 text-center">
            Include the Search Terms recommended by AI
            <br /> within the scope of your campaign.
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
                Select the plan that suits your needs. Answer24 supports fair
                pricing, providing affordable options based on your country.
                Your final price is available on the checkout page.
              </div>
              <h2 className="text-2xl font-bold mb-4">Subscription Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Launch Plan */}
                <div className="bg-white rounded-xl shadow p-6 border">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xl font-bold">Launch</span>
                    <span className="text-pink-500 font-bold text-lg">
                      $29 <span className="text-base font-normal">/mo</span>
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    7-Days Free Trial
                  </div>
                  <div className="mb-4 text-gray-700 text-sm">
                    Initiate and optimize your Google Ads campaigns with
                    AI-powered assistance.
                  </div>
                  <div className="mb-4 text-gray-700 text-sm">
                    50 AI credits/month{" "}
                    <span className="ml-1 text-gray-400">?</span>
                  </div>
                  <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold mb-4">
                    Start 7-Day Free Trial
                  </Button>
                  <div>
                    <div className="font-semibold mb-1">Features</div>
                    <ul className="text-xs text-gray-700 list-disc pl-5">
                      <li>1 Ad Account</li>
                      <li>1 Team Member</li>
                      <li>Weekly Optimizations</li>
                      <li>Ad Tracking (1 Competitor)</li>
                    </ul>
                  </div>
                </div>
                {/* Growth Plan */}
                <div className="bg-white rounded-xl shadow p-6 border">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xl font-bold">Growth</span>
                    <span className="text-pink-500 font-bold text-lg">
                      $49 <span className="text-base font-normal">/mo</span>
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    7-Days Free Trial
                  </div>
                  <div className="mb-4 text-gray-700 text-sm">
                    Perfect for handling multiple ad accounts, providing the
                    tools you need to save time & effort.
                  </div>
                  <div className="mb-4 text-gray-700 text-sm">
                    100 AI credits/month{" "}
                    <span className="ml-1 text-gray-400">?</span>
                  </div>
                  <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold mb-4">
                    Start 7-Day Free Trial
                  </Button>
                  <div>
                    <div className="font-semibold mb-1">Features</div>
                    <ul className="text-xs text-gray-700 list-disc pl-5">
                      <li>Includes everything in Launch</li>
                      <li>5 Ad Accounts</li>
                      <li>5 Team Members</li>
                      <li>Daily Optimizations</li>
                    </ul>
                  </div>
                </div>
                {/* Enterprise Plan */}
                <div className="bg-white rounded-xl shadow p-6 border">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xl font-bold">Enterprise</span>
                    <span className="text-pink-500 font-bold text-lg">
                      $249 <span className="text-base font-normal">/mo</span>
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    7-Days Free Trial
                  </div>
                  <div className="mb-4 text-gray-700 text-sm">
                    Designed for businesses that need personalized support and
                    advanced strategy.
                  </div>
                  <div className="mb-4 text-gray-700 text-sm">
                    200 AI credits/month{" "}
                    <span className="ml-1 text-gray-400">?</span>
                  </div>
                  <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold mb-4">
                    Start 7-Day Free Trial
                  </Button>
                  <div>
                    <div className="font-semibold mb-1">Features</div>
                    <ul className="text-xs text-gray-700 list-disc pl-5">
                      <li>Includes everything in Growth</li>
                      <li>20 Ad Accounts</li>
                      <li>20 Team Members</li>
                      <li>Daily Optimizations</li>
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
                Welcome, first things first...
              </div>
              <h2 className="text-2xl font-bold mb-6">Account Details</h2>
              <form className="space-y-4" onSubmit={handleAccountDetailsSubmit}>
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Profile Picture
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
                      Remove picture
                    </button>
                  )}
                </div>
                <div className="relative">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
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
                    placeholder="John Doe"
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
                    E-mail
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
                      Password
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
                      Password (again)
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
                    For a strong password:
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
                  Continue
                </Button>
              </form>
            </>
          ) : isSignUp ? (
            <>
              <h2 className="text-2xl font-bold text-center mb-6">
                Start your 7-day free trial now
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
                Sign in with Google
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
                    Email
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
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-emerald-400 hover:bg-emerald-500 text-white text-base font-semibold py-2 rounded-md"
                >
                  Sign up with email
                </Button>
              </form>
              <div className="text-center text-sm text-gray-600 mt-6">
                Already a customer?{" "}
                <button
                  type="button"
                  className="text-blue-600 font-semibold underline"
                  onClick={() => setIsSignUp(false)}
                >
                  Sign in
                </button>
              </div>
              <div className="text-center text-xs text-gray-500 mt-8">
                By continuing you agree to Answer24's{" "}
                <Link href="#" className="underline">
                  Terms Of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="underline font-semibold">
                  Privacy Policy
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center mb-6">
                Sign in to your account
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
                Sign in with Google
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
                    Email
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
                    placeholder="Enter your email"
                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
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
                    placeholder="********"
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
                    Forgot Password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-emerald-400 hover:bg-emerald-500 text-white text-base font-semibold py-2 rounded-md"
                >
                  Sign In
                </Button>
              </form>
              <div className="text-center text-sm text-gray-600 mt-6">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="text-yellow-600 font-semibold underline"
                  onClick={() => setIsSignUp(true)}
                >
                  Start Your 7-day Free Trial
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

