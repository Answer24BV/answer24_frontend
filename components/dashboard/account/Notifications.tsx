'use client';

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

// Mock API call
const updateNotificationSettings = async (data: any) => {
  console.log("Updating notification settings with:", data);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // In a real app, you would make a request to your backend here
  return { success: true, message: "Notification settings updated successfully!" };
};

export function Notifications() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [newFeatures, setNewFeatures] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [specialOffers, setSpecialOffers] = useState(false);

  const handleNotificationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await updateNotificationSettings({
      emailNotifications,
      pushNotifications,
      newFeatures,
      weeklyReports,
      specialOffers,
    });
    if (response.success) {
      alert(response.message);
    }
  };

  return (
    <form onSubmit={handleNotificationsSubmit}>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Notification Settings</h2>
        <div className="space-y-8">
          {/* Email Notifications */}
          <div>
            <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
            <p className="mt-1 text-sm text-gray-500">Receive updates and news directly in your inbox.</p>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">Enable Email Notifications</p>
              <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>
          </div>

          {/* Push Notifications */}
          <div>
            <h3 className="text-lg font-medium text-gray-900">Push Notifications</h3>
            <p className="mt-1 text-sm text-gray-500">Get real-time alerts on your devices.</p>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">Enable Push Notifications</p>
              <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
            </div>
          </div>

          {/* Notification Preferences */}
          <div>
            <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
            <p className="mt-1 text-sm text-gray-500">Choose which notifications you want to receive.</p>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">New features and updates</p>
                <Switch checked={newFeatures} onCheckedChange={setNewFeatures} />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Weekly reports</p>
                <Switch checked={weeklyReports} onCheckedChange={setWeeklyReports} />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Special offers</p>
                <Switch checked={specialOffers} onCheckedChange={setSpecialOffers} />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </div>
      </div>
    </form>
  );
}