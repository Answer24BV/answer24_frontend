'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

// Mock API call
const updateUserPassword = async (data: any) => {
  console.log("Updating password with:", data);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // In a real app, you would make a request to your backend here
  return { success: true, message: "Password updated successfully!" };
};

export function Security() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    const response = await updateUserPassword({ currentPassword, newPassword });
    if (response.success) {
      alert(response.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Security Settings</h2>
      <div className="space-y-8">
        {/* 2FA */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
          <p className="mt-1 text-sm text-gray-500">Add an extra layer of security to your account.</p>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">Enable 2FA</p>
            <Switch />
          </div>
        </div>

        {/* Password Change */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
          <form className="mt-4 space-y-4" onSubmit={handlePasswordSubmit}>
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" placeholder="Enter current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Update Password</Button>
            </div>
          </form>
        </div>

        {/* Active Sessions */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Active Sessions</h3>
          <p className="mt-1 text-sm text-gray-500">This is a list of devices that have logged into your account. Revoke any sessions that you do not recognize.</p>
          <ul className="mt-4 space-y-4">
            <li className="flex items-center justify-between">
              <div>
                <p className="font-medium">Chrome on macOS</p>
                <p className="text-sm text-gray-500">New York, USA - Current session</p>
              </div>
              <Button variant="outline">Revoke</Button>
            </li>
            <li className="flex items-center justify-between">
              <div>
                <p className="font-medium">Safari on iPhone</p>
                <p className="text-sm text-gray-500">New York, USA - 2 hours ago</p>
              </div>
              <Button variant="outline">Revoke</Button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}