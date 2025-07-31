"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useState, ChangeEvent, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Camera, User } from "lucide-react";

interface Errors {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeTerms: string;
  profilePicture: string;
}

export default function SignUp() {
  const [signUpStep, setSignUpStep] = useState(1);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | ArrayBuffer | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<Errors>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: "",
    profilePicture: "",
  });

  const t = useTranslations("SignInPage");  
function validateAccountDetails(): boolean {
    let valid = true;
    const newErrors: Errors = {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeTerms: "",
      profilePicture: "",
    };

    if (!profilePictureFile) {
      newErrors.profilePicture = t("errors.profilePictureRequired");
      valid = false;
    }

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

  function handleAccountDetailsSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (validateAccountDetails()) {
      setSignUpStep(2);
    }
  }

  function handleProfilePictureUpload(e: ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prevErrors) => ({ ...prevErrors, profilePicture: t("errors.invalidFileType") }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prevErrors) => ({ ...prevErrors, profilePicture: t("errors.fileTooLarge") }));
        return;
      }

      setProfilePictureFile(file);
      setErrors((prevErrors) => ({ ...prevErrors, profilePicture: "" }));

      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePicture(event.target?.result || null);
      };
      reader.readAsDataURL(file);
    }
  }

  function removeProfilePicture(): void {
    setProfilePicture(null);
    setProfilePictureFile(null);
    setErrors((prevErrors) => ({ ...prevErrors, profilePicture: t("errors.profilePictureRequired") }));
    const fileInput = document.getElementById("profile-picture-upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  const handleGoogleSignIn = () => {
    console.log("Signing up with Google...");
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
              alt="House with magnifying glass"
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
                {t("signUp.subscriptionPlans")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow p-6 border">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xl font-bold">
                      {t("signUp.plans.launch.name")}
                    </span>
                    <span className="text-blue-600 font-bold text-lg">
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
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold mb-4">
                    {t("signUp.plans.launch.startTrial")}
                  </Button>
                  <div>
                    <div className="font-semibold mb-1">
                      {t("signUp.plans.launch.featuresLabel")}
                    </div>
                    <ul className="text-xs text-gray-700 list-disc pl-5">
                      {t("signUp.plans.launch.features").split(',').map((feature, index) => (
                        <li key={index}>{feature.trim()}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 border">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xl font-bold">
                      {t("signUp.plans.growth.name")}
                    </span>
                    <span className="text-blue-600 font-bold text-lg">
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
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold mb-4">
                    {t("signUp.plans.growth.startTrial")}
                  </Button>
                  <div>
                    <div className="font-semibold mb-1">
                      {t("signUp.plans.growth.featuresLabel")}
                    </div>
                    <ul className="text-xs text-gray-700 list-disc pl-5">
                      {t("signUp.plans.growth.features").split(',').map((feature, index) => (
                        <li key={index}>{feature.trim()}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 border">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xl font-bold">
                      {t("signUp.plans.enterprise.name")}
                    </span>
                    <span className="text-blue-600 font-bold text-lg">
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
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold mb-4">
                    {t("signUp.plans.enterprise.startTrial")}
                  </Button>
                  <div>
                    <div className="font-semibold mb-1">
                      {t("signUp.plans.enterprise.featuresLabel")}
                    </div>
                    <ul className="text-xs text-gray-700 list-disc pl-5">
                      {t("signUp.plans.enterprise.features").split(',').map((feature, index) => (
                        <li key={index}>{feature.trim()}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {t("signUp.welcomeMessage")}
                </h1>
                <p className="text-blue-600 text-lg">
                  {t("signUp.signUpWithEmail")}
                </p>
              </div> */}

              <form className="space-y-6" onSubmit={handleAccountDetailsSubmit}>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center space-x-2 border border-gray-300 rounded-lg py-3 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
                  <span>{t("signUpWithGoogle")}</span>
                </button>

                <div className="relative flex items-center justify-center my-6">
                  <span className="absolute bg-white px-2 text-sm text-gray-500">
                    {t("or")}
                  </span>
                  <div className="w-full border-t border-gray-300"></div>
                </div>

                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
                      {profilePicture ? (
                        <Image
                          src={profilePicture as string}
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
                      title={t("signUp.profilePicture")}
                    >
                      <Camera size={16} className="text-white" />
                    </label>
                    {profilePicture && (
                      <button
                        type="button"
                        onClick={removeProfilePicture}
                        className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors text-white text-xs"
                        title={t("signUp.removePicture")}
                      >
                        X
                      </button>
                    )}
                  </div>
                  {errors.profilePicture && (
                    <div className="text-xs text-red-600 mt-2">{errors.profilePicture}</div>
                  )}
                </div>    
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
                    <div className="text-xs text-red-600">{errors.fullName}</div>
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
                    <div className="text-xs text-red-600">{errors.password}</div>
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
                  <div className="text-xs text-red-600">{errors.agreeTerms}</div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mt-8"
                >
                  {t("signUp.continueButton")}
                </Button>

                <div className="text-center text-sm text-gray-600 mt-6">
                  {t("alreadyCustomer")}{" "}
                  <Link
                    href="/signin"
                    className="text-blue-600 hover:underline"
                  >
                    {t("login")}
                  </Link>
                  {" "}or{" "}
                  <Link
                    href="/partner-signup"
                    className="text-blue-600 hover:underline"
                  >
                    {t("signupPartner")}
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
     