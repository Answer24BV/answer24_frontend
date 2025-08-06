'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React, { useState } from "react";
import { toast } from "react-toastify";

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

  // Lock screen state
  const [lockKey, setLockKey] = useState('');
  const [lockTimeout, setLockTimeout] = useState(1);

  // Sync with localStorage on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setLockKey(localStorage.getItem('lockKey') || '');
      const storedTimeout = localStorage.getItem('lockTimeout');
      setLockTimeout(storedTimeout ? Number(storedTimeout) : 1);
    }
  }, []);

  const [lockSettingsMsg, setLockSettingsMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleLockSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLockSettingsMsg(null);
    if (!/^\d{6}$/.test(lockKey)) {
      setLockSettingsMsg({ type: 'error', text: 'Lock key must be exactly 6 digits.' });
      return;
    }
    if (lockTimeout < 1 || lockTimeout > 120) {
      setLockSettingsMsg({ type: 'error', text: 'Timeout must be between 1 and 120 minutes.' });
      return;
    }
    localStorage.setItem('lockKey', lockKey);
    localStorage.setItem('lockTimeout', String(lockTimeout));
    toast.success('Lock settings saved!');
    setLockSettingsMsg({ type: 'success', text: 'Lock settings saved!' });
  };

  const [passwordMsg, setPasswordMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    const response = await updateUserPassword({ currentPassword, newPassword });
    if (response.success) {
      setPasswordMsg({ type: 'success', text: response.message });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="p-2">
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
            {passwordMsg && (
              <div className={`mt-2 text-sm ${passwordMsg.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                {passwordMsg.text}
              </div>
            )}
          </form>
        </div>

        {/* Lock Screen Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Lock Screen</h3>
          <p className="mt-1 text-sm text-gray-500">Set a 6-digit lock key and inactivity timeout. When inactive, your dashboard will be locked.</p>
          <form className="mt-4 space-y-4" onSubmit={handleLockSettingsSubmit}>
            <div>
              <Label htmlFor="lock-key">6-Digit Lock Key</Label>
              <Input
                id="lock-key"
                type="password"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                minLength={6}
                placeholder="Enter 6-digit key"
                value={lockKey}
                onChange={e => setLockKey(e.target.value.replace(/[^0-9]/g, ''))}
                autoComplete="off"
              />
            </div>
            <div>
              <Label htmlFor="lock-timeout">Lock Timeout (minutes)</Label>
              <Input
                id="lock-timeout"
                type="number"
                min={1}
                max={120}
                value={lockTimeout}
                onChange={e => setLockTimeout(Number(e.target.value))}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save Lock Settings</Button>
            </div>
            {lockSettingsMsg && (
              <div className={`mt-2 text-sm ${lockSettingsMsg.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                {lockSettingsMsg.text}
              </div>
            )}
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