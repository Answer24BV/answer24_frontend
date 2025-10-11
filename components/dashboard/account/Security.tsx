"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { tokenUtils } from "@/utils/auth";
import { getApiUrl, getApiHeaders } from "@/lib/api-config";

// API call to update lock settings
const updateLockSettings = async (data: {
  lock_key?: string;
  lock_timeout?: number;
}) => {
  try {
    const response = await fetch(
      getApiUrl("/profile"),
      {
        method: "PUT",
        headers: getApiHeaders(tokenUtils.getToken() || undefined),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update lock settings");
    }

    const responseData = await response.json();

    // Update local user data with new lock settings
    const currentUser = tokenUtils.getUser();
    const updatedUser = {
      ...currentUser,
      lock_key: data.lock_key,
      lock_timeout: data.lock_timeout,
    };
    tokenUtils.setUser(updatedUser);

    console.log("Updated user data:", updatedUser);

    return { success: true, message: "Lock settings updated successfully!" };
  } catch (error) {
    console.error("Error updating lock settings:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update lock settings",
    };
  }
};

// API call to change password
const updateUserPassword = async (data: {
  current_password: string;
  new_password: string;
  confirm_password: string;
}) => {
  try {
    const response = await fetch(
      getApiUrl("/change-password"),
      {
        method: "POST",
        headers: getApiHeaders(tokenUtils.getToken() || undefined),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to change password");
    }

    const responseData = await response.json();
    return { success: true, message: "Password updated successfully!" };
  } catch (error) {
    console.error("Error changing password:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to change password. Please try again.",
    };
  }
};

// API call to create PIN
const createPin = async (data: {
  pin: string;
  confirm_pin: string;
}) => {
  try {
    const token = tokenUtils.getToken();
    console.log("=== CREATE PIN DEBUG ===");
    console.log("Creating PIN with data:", data);
    console.log("API URL:", getApiUrl("/create-pin"));
    console.log("Auth token:", token);
    console.log("Token type:", typeof token);
    console.log("Token length:", token?.length);
    console.log("LocalStorage auth_token:", localStorage.getItem("auth_token"));
    console.log("All localStorage keys:", Object.keys(localStorage));
    console.log("========================");
    
    // Check if token exists
    if (!token) {
      console.error("Token is null or undefined!");
      
      // Try to get token directly from localStorage as fallback
      const directToken = localStorage.getItem("auth_token");
      console.log("Direct localStorage token:", directToken);
      
      if (!directToken) {
        throw new Error("No authentication token found. Please log in again.");
      }
      
      // Use the direct token if available
      const finalToken = directToken;
      console.log("Using fallback token:", finalToken);
      
      const response = await fetch(
        getApiUrl("/create-pin"),
        {
          method: "POST",
          headers: getApiHeaders(finalToken),
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();
      console.log("Create PIN response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create PIN");
      }
      
      // Update user data with new PIN
      if (responseData.data && responseData.data.pin) {
        const currentUser = tokenUtils.getUser();
        const updatedUser = {
          ...currentUser,
          pin: responseData.data.pin,
        };
        tokenUtils.setUser(updatedUser);
      }
      
      return { success: true, message: "PIN created successfully!" };
    }
    
    const response = await fetch(
      getApiUrl("/create-pin"),
      {
        method: "POST",
        headers: getApiHeaders(token),
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();
    console.log("Create PIN response:", responseData);

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to create PIN");
    }
    
    // Update user data with new PIN
    if (responseData.data && responseData.data.pin) {
      const currentUser = tokenUtils.getUser();
      const updatedUser = {
        ...currentUser,
        pin: responseData.data.pin,
      };
      tokenUtils.setUser(updatedUser);
    }
    
    return { success: true, message: "PIN created successfully!" };
  } catch (error) {
    console.error("Error creating PIN:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create PIN. Please try again.",
    };
  }
};

// API call to change PIN
const changePin = async (data: {
  current_pin: string;
  new_pin: string;
  confirm_pin: string;
}) => {
  try {
    const token = tokenUtils.getToken();
    console.log("=== CHANGE PIN DEBUG ===");
    console.log("Changing PIN with data:", data);
    console.log("API URL:", getApiUrl("/change-pin"));
    console.log("Auth token:", token);
    console.log("Token type:", typeof token);
    console.log("Token length:", token?.length);
    console.log("LocalStorage auth_token:", localStorage.getItem("auth_token"));
    console.log("All localStorage keys:", Object.keys(localStorage));
    console.log("========================");
    
    // Check if token exists
    if (!token) {
      console.error("Token is null or undefined!");
      
      // Try to get token directly from localStorage as fallback
      const directToken = localStorage.getItem("auth_token");
      console.log("Direct localStorage token:", directToken);
      
      if (!directToken) {
        throw new Error("No authentication token found. Please log in again.");
      }
      
      // Use the direct token if available
      const finalToken = directToken;
      console.log("Using fallback token:", finalToken);
      
      const response = await fetch(
        getApiUrl("/change-pin"),
        {
          method: "POST",
          headers: getApiHeaders(finalToken),
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();
      console.log("Change PIN response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to change PIN");
      }
      
      // Update user data with new PIN
      if (responseData.data && responseData.data.pin) {
        const currentUser = tokenUtils.getUser();
        const updatedUser = {
          ...currentUser,
          pin: responseData.data.pin,
        };
        tokenUtils.setUser(updatedUser);
      }
      
      return { success: true, message: "PIN changed successfully!" };
    }
    
    const response = await fetch(
      getApiUrl("/change-pin"),
      {
        method: "POST",
        headers: getApiHeaders(token),
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();
    console.log("Change PIN response:", responseData);

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to change PIN");
    }
    
    // Update user data with new PIN
    if (responseData.data && responseData.data.pin) {
      const currentUser = tokenUtils.getUser();
      const updatedUser = {
        ...currentUser,
        pin: responseData.data.pin,
      };
      tokenUtils.setUser(updatedUser);
    }
    
    return { success: true, message: "PIN changed successfully!" };
  } catch (error) {
    console.error("Error changing PIN:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to change PIN. Please try again.",
    };
  }
};

export function Security() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Lock screen state
  const [lockKey, setLockKey] = useState("");
  const [confirmLockKey, setConfirmLockKey] = useState("");
  const [currentPin, setCurrentPin] = useState("");
  const [lockTimeout, setLockTimeout] = useState(1);
  const [isUpdatingLock, setIsUpdatingLock] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hasPin, setHasPin] = useState(false);

  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false);


  // Ensure client-side rendering
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Load current user data on mount
  React.useEffect(() => {
    if (!isClient) return;
    
    const userData = tokenUtils.getUser();
    const token = tokenUtils.getToken();
    
    console.log("=== SECURITY COMPONENT DEBUG ===");
    console.log("Security component - User data:", userData);
    console.log("Security component - Auth token:", token);
    console.log("Security component - Token exists:", !!token);
    console.log("LocalStorage auth_token:", localStorage.getItem("auth_token"));
    console.log("LocalStorage user_data:", localStorage.getItem("user_data"));
    console.log("All localStorage keys:", Object.keys(localStorage));
    console.log("=================================");
    
    if (userData) {
      // Get lock settings from user data if available
      setLockTimeout(userData.lock_timeout || 1);
      // Check if user has a PIN
      setHasPin(!!userData.pin);
      console.log("User has PIN:", !!userData.pin);
    }
  }, [isClient]);

  const [lockSettingsMsg, setLockSettingsMsg] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const handleLockSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLockSettingsMsg(null);

    // Validation for PIN
    if (!/^\d{6}$/.test(lockKey)) {
      setLockSettingsMsg({
        type: "error",
        text: "PIN must be exactly 6 digits.",
      });
      return;
    }

    if (lockKey !== confirmLockKey) {
      setLockSettingsMsg({
        type: "error",
        text: "PINs do not match.",
      });
      return;
    }

    if (lockTimeout < 1 || lockTimeout > 120) {
      setLockSettingsMsg({
        type: "error",
        text: "Timeout must be between 1 and 120 minutes.",
      });
      return;
    }

    setIsUpdatingLock(true);

    try {
      let pinResponse;
      
      if (hasPin) {
        // User already has a PIN, use change-pin API
        if (!/^\d{6}$/.test(currentPin)) {
          setLockSettingsMsg({
            type: "error",
            text: "Current PIN must be exactly 6 digits.",
          });
          setIsUpdatingLock(false);
          return;
        }
        
        pinResponse = await changePin({
          current_pin: currentPin,
          new_pin: lockKey,
          confirm_pin: confirmLockKey,
        });
      } else {
        // User doesn't have a PIN, use create-pin API
        pinResponse = await createPin({
          pin: lockKey,
          confirm_pin: confirmLockKey,
        });
      }

      if (!pinResponse.success) {
        setLockSettingsMsg({ type: "error", text: pinResponse.message });
        toast.error(pinResponse.message);
        return;
      }

      // Then update the lock timeout settings
      const lockResponse = await updateLockSettings({
        lock_timeout: lockTimeout,
      });

      if (lockResponse.success) {
        toast.success("Lock screen settings saved successfully!");
        setLockSettingsMsg({ type: "success", text: "Lock screen settings saved successfully!" });
        // Clear the form after successful submission
        setLockKey("");
        setConfirmLockKey("");
        setCurrentPin("");
        // Update hasPin state if this was PIN creation
        if (!hasPin) {
          setHasPin(true);
        }
      } else {
        setLockSettingsMsg({ type: "error", text: lockResponse.message });
        toast.error(lockResponse.message);
      }
    } catch (error) {
      const errorMsg = "Failed to save lock settings. Please try again.";
      setLockSettingsMsg({ type: "error", text: errorMsg });
      toast.error(errorMsg);
    } finally {
      setIsUpdatingLock(false);
    }
  };

  const [passwordMsg, setPasswordMsg] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);


  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    // Validation
    if (!currentPassword.trim()) {
      setPasswordMsg({ type: "error", text: "Current password is required." });
      return;
    }

    if (!newPassword.trim()) {
      setPasswordMsg({ type: "error", text: "New password is required." });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "New password must be at least 8 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordMsg({ type: "error", text: "New password must be different from current password." });
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await updateUserPassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      if (response.success) {
        setPasswordMsg({ type: "success", text: response.message });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success(response.message);
      } else {
        setPasswordMsg({ type: "error", text: response.message });
        toast.error(response.message);
      }
    } catch (error) {
      const errorMsg = "Failed to change password. Please try again.";
      setPasswordMsg({ type: "error", text: errorMsg });
      toast.error(errorMsg);
    } finally {
      setIsChangingPassword(false);
    }
  };


  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="p-2">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Security Settings
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading security settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Security Settings
      </h2>
      <div className="space-y-8">
        {/* 2FA */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Two-Factor Authentication
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add an extra layer of security to your account.
          </p>
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
              <Input
                id="current-password"
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isChangingPassword}
              />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isChangingPassword}
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isChangingPassword}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? "Updating..." : "Update Password"}
              </Button>
            </div>
            {passwordMsg && (
              <div
                className={`mt-2 text-sm ${
                  passwordMsg.type === "error"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {passwordMsg.text}
              </div>
            )}
          </form>
        </div>

        {/* Lock Screen Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Lock Screen</h3>
          <p className="mt-1 text-sm text-gray-500">
            {hasPin 
              ? "Update your 6-digit PIN and inactivity timeout. When inactive, your dashboard will be locked."
              : "Set a 6-digit PIN and inactivity timeout. When inactive, your dashboard will be locked."
            }
          </p>
          <form className="mt-4 space-y-4" onSubmit={handleLockSettingsSubmit}>
            {hasPin && (
              <div>
                <Label htmlFor="current-pin">Current PIN</Label>
                <Input
                  id="current-pin"
                  type="password"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  minLength={6}
                  placeholder="Enter current PIN"
                  value={currentPin}
                  onChange={(e) =>
                    setCurrentPin(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  autoComplete="off"
                  disabled={isUpdatingLock}
                />
              </div>
            )}
            <div>
              <Label htmlFor="lock-key">{hasPin ? "New 6-Digit PIN" : "6-Digit PIN"}</Label>
              <Input
                id="lock-key"
                type="password"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                minLength={6}
                placeholder="Enter 6-digit key"
                value={lockKey}
                onChange={(e) =>
                  setLockKey(e.target.value.replace(/[^0-9]/g, ""))
                }
                autoComplete="off"
                disabled={isUpdatingLock}
              />
            </div>
            <div>
              <Label htmlFor="confirm-lock-key">{hasPin ? "Confirm New 6-Digit PIN" : "Confirm 6-Digit PIN"}</Label>
              <Input
                id="confirm-lock-key"
                type="password"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                minLength={6}
                placeholder="Confirm 6-digit key"
                value={confirmLockKey}
                onChange={(e) =>
                  setConfirmLockKey(e.target.value.replace(/[^0-9]/g, ""))
                }
                autoComplete="off"
                disabled={isUpdatingLock}
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
                onChange={(e) => setLockTimeout(Number(e.target.value))}
                disabled={isUpdatingLock}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isUpdatingLock}>
                {isUpdatingLock ? "Saving..." : "Save Lock Settings"}
              </Button>
            </div>
            {lockSettingsMsg && (
              <div
                className={`mt-2 text-sm ${
                  lockSettingsMsg.type === "error"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {lockSettingsMsg.text}
              </div>
            )}
          </form>
        </div>

        {/* Active Sessions */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Active Sessions</h3>
          <p className="mt-1 text-sm text-gray-500">
            This is a list of devices that have logged into your account. Revoke
            any sessions that you do not recognize.
          </p>
          <ul className="mt-4 space-y-4">
            <li className="flex items-center justify-between">
              <div>
                <p className="font-medium">Chrome on macOS</p>
                <p className="text-sm text-gray-500">
                  New York, USA - Current session
                </p>
              </div>
              <Button variant="outline">Revoke</Button>
            </li>
            <li className="flex items-center justify-between">
              <div>
                <p className="font-medium">Safari on iPhone</p>
                <p className="text-sm text-gray-500">
                  New York, USA - 2 hours ago
                </p>
              </div>
              <Button variant="outline">Revoke</Button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
