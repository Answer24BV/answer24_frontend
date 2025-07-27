"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, User, Shield, Bell, CreditCard, ChevronRight } from "lucide-react";
import { Security } from "./Security";
import { Notifications } from "./Notifications";
import { Billing } from "./Billing";
import { usePathname } from "next/navigation";

// Mock API call
const updateUserProfile = async (data: { fullName: string; profilePicture: string }) => {
  console.log("Updating profile with:", data);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // In a real app, you would make a request to your backend here
  return { success: true, message: "Profile updated successfully!" };
};

export function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [fullName, setFullName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [profilePicture, setProfilePicture] = useState(
    "https://github.com/shadcn.png"
  );

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await updateUserProfile({ fullName, profilePicture });
    if (response.success) {
      alert(response.message);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileContent />;
      case "security":
        return <Security />;
      case "notifications":
        return <Notifications />;
      case "billing":
        return <Billing />;
      default:
        return <ProfileContent />;
    }
  };

  const ProfileContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Profile Information</h2>
        <p className="text-gray-500 mt-1">Update your personal information and photo</p>
      </div>
      <div className="border-t border-gray-100 pt-6">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src={profilePicture} alt="Profile picture" />
                <AvatarFallback className="text-2xl">
                  {fullName.split(' ').map(n => n[0]).join('')}
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
                onChange={handleProfilePictureChange}
              />
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline">Change Picture</Button>
              <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="full-name" className="text-sm font-medium text-gray-700 mb-1.5 block">
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
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1.5 block">
                Email
              </Label>
              <Input 
                id="email" 
                className="w-full bg-gray-50" 
                value={email} 
                disabled 
                placeholder="Your email address"
              />
              <p className="mt-1 text-xs text-gray-500">Contact support to change your email</p>
            </div>
          </div>
          <div className="pt-4 flex justify-end border-t border-gray-100">
            <Button 
              type="submit"
              className="px-6 py-2.5 text-sm font-medium"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  // Get current path to highlight active tab
  const pathname = usePathname();
  
  // Define tabs configuration
  const tabs = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'billing', icon: CreditCard, label: 'Billing' },
  ];

  // Determine active tab based on path
  useEffect(() => {
    if (pathname?.includes('security')) setActiveTab('security');
    else if (pathname?.includes('notifications')) setActiveTab('notifications');
    else if (pathname?.includes('billing')) setActiveTab('billing');
    else setActiveTab('profile');
  }, [pathname]);

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-500 mt-2">Manage your account settings and preferences</p>
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
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
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
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}