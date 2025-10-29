"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Camera,
  User,
  Shield,
  Bell,
  CreditCard,
  ChevronRight,
  Building, // <-- added
} from "lucide-react";
import { Security } from "./Security";
import { Notifications } from "./Notifications";
import { Billing } from "./Billing";
import Details from "./Details"; // <-- added
import { usePathname } from "next/navigation";
import { tokenUtils } from "@/utils/auth";
import { toast } from "react-toastify";

// API call to update user profile
const updateUserProfile = async (data: {
  name?: string;
  profile_picture?: File | null;
  phone?: string;
}) => {
  try {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.profile_picture)
      formData.append("profile_picture", data.profile_picture);
    if (data.phone) formData.append("phone", data.phone); // <-- ADD THIS HERE

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.answer24.nl/api/v1"
      }/profile`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${tokenUtils.getToken()}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update profile");
    }

    const userData = await response.json();
    if (userData.user) {
      tokenUtils.setUser(userData.user);
    }

    return { success: true, message: "Profile updated successfully!" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
};

interface UserData {
  id?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  profile_picture?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface ProfileContentProps {
  user: Partial<UserData>;
  fullName: string;
  email: string;
  phone: string;
  profilePicture: string;
  onProfilePictureChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProfileSubmit: (e: React.FormEvent) => void;
  setFullName: (name: string) => void;
  setPhone: (phone: string) => void;
}

const ProfileContent = ({
  user,
  fullName,
  email,
  profilePicture,
  onProfilePictureChange,
  onProfileSubmit,
  setFullName,
  phone,
  setPhone,
}: ProfileContentProps) => (
  <div className="space-y-4">
    <div>
      <h2 className="text-2xl font-semibold text-gray-900">
        Profile Information
      </h2>
      <p className="text-gray-500 mt-1">
        Update your personal information and photo
      </p>
    </div>
    <div className="border-t border-gray-100 pt-6">
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
              <AvatarImage
                src={profilePicture || "/images/avatar-placeholder.png"}
                alt="Profile picture"
              />
              <AvatarFallback className="text-2xl bg-gray-100">
                {fullName
                  ? fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <label
              htmlFor="profile-picture-upload"
              className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Camera size={18} />
            </label>
            <input
              id="profile-picture-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onProfilePictureChange}
            />
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline">Change Picture</Button>
            <p className="text-xs text-gray-500 mt-2">
              JPG, GIF or PNG. 1MB max.
            </p>
          </div>
        </div>

        <div className="flex-1">
          <form onSubmit={onProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="full-name"
                  className="text-sm font-medium text-gray-700 mb-1.5 block"
                >
                  Full Name
                </Label>
                <Input
                  id="full-name"
                  className="w-full"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 mb-1.5 block"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  className="w-full bg-gray-50"
                  value={email}
                  disabled
                  placeholder={email || "Your email address"}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Contact support to change your email
                </p>
              </div>
              <div>
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700 mb-1.5 block"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  className="w-full bg-gray-50"
                  value={phone}
                  disabled
                  placeholder={phone || "Your phone number"}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Contact support to change your phone number
                </p>
              </div>
            </div>
            <div className="pt-4 flex justify-end border-t border-gray-100">
              <Button type="submit" className="px-6 py-2.5 text-sm font-medium">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);

export function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<Partial<UserData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );
  const [profilePicturePreview, setProfilePicturePreview] =
    useState<string>("");
  const pathname = usePathname();
  const [phone, setPhone] = useState("");

  // Fetch user data on component mount
  useEffect(() => {
    const handleUserDataUpdate = (event: CustomEvent) => {
      const userData = event.detail;
      if (userData && userData.email && userData.email !== "user@example.com") {
        setUser(userData);
        setFullName(userData.name || "");
        setEmail(userData.email || "");
        setPhone(userData.phone || "");
        setProfilePicturePreview(userData.profile_picture || "");
        setIsLoading(false);
      }
    };

    window.addEventListener(
      "userDataUpdated",
      handleUserDataUpdate as EventListener
    );

    const fetchUserData = () => {
      try {
        const userData = tokenUtils.getUser();
        if (
          userData &&
          userData.email &&
          userData.email !== "user@example.com"
        ) {
          setUser(userData);
          setFullName(userData.name || "");
          setEmail(userData.email || "");
          setPhone(userData.phone || ""); // ✅ FIXED
          setProfilePicturePreview(userData.profile_picture || "");
          setIsLoading(false);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error fetching user data:", error);
        return false;
      }
    };

    // Try to load user data immediately
    if (!fetchUserData()) {
      // If no user data found, retry with exponential backoff
      let retryCount = 0;
      const maxRetries = 15;

      const retryInterval = setInterval(() => {
        retryCount++;
        if (fetchUserData() || retryCount >= maxRetries) {
          if (retryCount >= maxRetries) {
            setIsLoading(false);
          }
          clearInterval(retryInterval);
        }
      }, 200 * retryCount); // Exponential backoff

      return () => {
        window.removeEventListener(
          "userDataUpdated",
          handleUserDataUpdate as EventListener
        );
        clearInterval(retryInterval);
      };
    }

    return () => {
      window.removeEventListener(
        "userDataUpdated",
        handleUserDataUpdate as EventListener
      );
    };
  }, []);

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePictureFile(file); // store the File object for upload
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicturePreview(reader.result as string); // for preview only
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() && !profilePictureFile) {
      toast.error("Please enter your full name or select a profile picture");
      return;
    }

    const payload: {
      name?: string;
      profile_picture?: File | null;
      phone?: string;
    } = {};
    if (fullName.trim() && fullName !== user?.name)
      payload.name = fullName.trim();
    if (profilePictureFile) payload.profile_picture = profilePictureFile;
    if (phone.trim() && phone !== user?.phone) payload.phone = phone.trim();

    if (!payload.name && !payload.profile_picture && !payload.phone) {
      toast.info("No changes to update");
      return;
    }

    try {
      const response = await updateUserProfile(payload);
      if (response.success) {
        const updatedUser: UserData = {
          ...user,
          ...(payload.name ? { name: payload.name } : {}),
          ...(payload.profile_picture
            ? { profile_picture: profilePicturePreview }
            : {}),
          ...(payload.phone ? { phone: payload.phone } : {}),
        };
        setUser(updatedUser);
        tokenUtils.setUser(updatedUser);
      }
      toast.success(response.message);
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderContent();
      case "security":
        return <Security />;
      case "notifications":
        return <Notifications />;
      case "billing":
        return <Billing />;
      case "company": // <-- changed from "Company"
        return <Details />; // <-- render new component
      default:
        return renderContent();
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600">
            Failed to load user data. Please try again later.
          </p>
        </div>
      );
    }

    return (
      <ProfileContent
        user={user}
        fullName={fullName}
        email={email}
        phone={phone} // <-- ADD THIS
        profilePicture={profilePicturePreview}
        onProfilePictureChange={handleProfilePictureChange}
        onProfileSubmit={handleProfileSubmit}
        setFullName={setFullName}
        setPhone={setPhone} // <-- ADD THIS
      />
    );
  };

  // Define tabs configuration
  const tabs = [
    { id: "profile", icon: User, label: "Profile" },
    { id: "security", icon: Shield, label: "Security" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "billing", icon: CreditCard, label: "Billing" },
    { id: "company", icon: Building, label: "Company Details" }, // <-- added
  ];

  // Determine active tab based on path
  useEffect(() => {
    if (pathname?.includes("security")) setActiveTab("security");
    else if (pathname?.includes("notifications")) setActiveTab("notifications");
    else if (pathname?.includes("billing")) setActiveTab("billing");
    else if (pathname?.includes("company") || pathname?.includes("details"))
      setActiveTab("company"); // <-- added
    else setActiveTab("profile");
  }, [pathname]);

  return (
    <div className="bg-gra min-h-screen p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-500 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-3" />
                      {tab.label}
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
