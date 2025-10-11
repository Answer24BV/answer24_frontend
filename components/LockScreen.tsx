import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { LockIcon } from "lucide-react";
import { tokenUtils } from "@/utils/auth";

interface LockScreenProps {
  onUnlock: () => void;
  show: boolean;
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock, show }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [userPin, setUserPin] = useState<string | null>(null);
  const [isSettingUpPin, setIsSettingUpPin] = useState(false);
  const [pinSetup, setPinSetup] = useState({
    pin: "",
    confirmPin: "",
  });
  const [pinSetupError, setPinSetupError] = useState("");
  const [isCreatingPin, setIsCreatingPin] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();

      // Get user's PIN from stored user data
      const userData = tokenUtils.getUser();
      console.log("=== LOCKSCREEN PIN DEBUG ===");
      console.log("LockScreen - User data:", userData);
      console.log("LockScreen - User PIN:", userData?.pin);
      console.log("LockScreen - User PIN type:", typeof userData?.pin);
      console.log("LockScreen - User PIN length:", userData?.pin?.length);
      console.log("LockScreen - Full localStorage user_data:", localStorage.getItem("user_data"));
      
      // Try to parse localStorage directly
      try {
        const rawUserData = localStorage.getItem("user_data");
        if (rawUserData) {
          const parsedUserData = JSON.parse(rawUserData);
          console.log("LockScreen - Parsed localStorage user data:", parsedUserData);
          console.log("LockScreen - Parsed PIN:", parsedUserData?.pin);
        }
      } catch (e) {
        console.error("LockScreen - Error parsing localStorage user_data:", e);
      }
      
      console.log("LockScreen - All localStorage keys:", Object.keys(localStorage));
      console.log("==================================");
      
      if (userData && userData.pin) {
        setUserPin(userData.pin);
        setError(""); // Clear any previous error
      } else {
        // If no PIN is set, show error
        setError(
          "No PIN configured. Please set one in Security settings."
        );
      }
    }
  }, [show]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user has a PIN configured
    if (!userPin) {
      setError("No PIN configured. Please set one in Security settings.");
      return;
    }

    console.log("Attempting unlock with PIN:", input);
    console.log("Expected PIN:", userPin);

    if (input === userPin) {
      setError("");
      setInput("");
      onUnlock();
    } else {
      setError("Incorrect PIN. Please try again.");
      setInput("");
      inputRef.current?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    setInput(value);
    if (error && value.length === 6) {
      setError("");
    }
  };

  const handleSetupPin = () => {
    setIsSettingUpPin(true);
    setPinSetupError("");
  };

  const handlePinSetupChange = (field: "pin" | "confirmPin", value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "").slice(0, 6);
    setPinSetup(prev => ({ ...prev, [field]: numericValue }));
    if (pinSetupError) setPinSetupError("");
  };

  const createPin = async (data: { pin: string; confirm_pin: string }) => {
    try {
      const token = tokenUtils.getToken();
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1"}/create-pin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create PIN");
      }

      // Update user data with new PIN
      const currentUser = tokenUtils.getUser();
      const updatedUser = {
        ...currentUser,
        pin: data.pin, // Use the PIN from request since API might not return it
      };
      tokenUtils.setUser(updatedUser);

      return { success: true, message: "PIN created successfully!" };
    } catch (error) {
      console.error("Error creating PIN:", error);
      throw error;
    }
  };

  const handleCreatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pinSetup.pin.length !== 6) {
      setPinSetupError("PIN must be 6 digits");
      return;
    }
    
    if (pinSetup.confirmPin.length !== 6) {
      setPinSetupError("Please confirm your PIN");
      return;
    }
    
    if (pinSetup.pin !== pinSetup.confirmPin) {
      setPinSetupError("PINs do not match");
      return;
    }

    setIsCreatingPin(true);
    setPinSetupError("");

    try {
      await createPin({
        pin: pinSetup.pin,
        confirm_pin: pinSetup.confirmPin,
      });

      // Success - update local state and unlock
      setUserPin(pinSetup.pin);
      setIsSettingUpPin(false);
      setPinSetup({ pin: "", confirmPin: "" });
      
      // Automatically unlock after PIN creation
      onUnlock();
    } catch (err: any) {
      setPinSetupError(err.message || "Failed to create PIN. Please try again.");
    } finally {
      setIsCreatingPin(false);
    }
  };

  const handleBackToUnlock = () => {
    setIsSettingUpPin(false);
    setPinSetup({ pin: "", confirmPin: "" });
    setPinSetupError("");
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm"
        >
          {isSettingUpPin ? (
            // PIN Setup Form
            <motion.form
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleCreatePin}
              className="bg-white rounded-xl p-8 shadow-2xl flex flex-col items-center w-full max-w-sm mx-4"
            >
              <LockIcon className="w-12 h-12 text-blue-900 mb-4" />

              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Set Up PIN
              </h2>
              <p className="mb-6 text-gray-500 text-sm text-center">
                Create a 6-digit PIN to secure your application.
              </p>

              <div className="space-y-4 w-full">
                <div>
                  <Input
                    type="password"
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    value={pinSetup.pin}
                    onChange={(e) => handlePinSetupChange("pin", e.target.value)}
                    className="w-full text-center text-lg tracking-wider border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                    placeholder="Enter 6-digit PIN"
                    aria-label="6-digit PIN"
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Choose a secure 6-digit PIN
                  </p>
                </div>

                <div>
                  <Input
                    type="password"
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    value={pinSetup.confirmPin}
                    onChange={(e) => handlePinSetupChange("confirmPin", e.target.value)}
                    className="w-full text-center text-lg tracking-wider border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                    placeholder="Confirm 6-digit PIN"
                    aria-label="Confirm 6-digit PIN"
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Re-enter your PIN to confirm
                  </p>
                </div>
              </div>

              {pinSetupError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm mb-4 text-center mt-4"
                >
                  {pinSetupError}
                </motion.div>
              )}

              <div className="flex space-x-3 mt-6 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToUnlock}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled={isCreatingPin}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 rounded-lg transition-colors duration-200"
                  disabled={pinSetup.pin.length !== 6 || pinSetup.confirmPin.length !== 6 || isCreatingPin}
                >
                  {isCreatingPin ? "Creating PIN..." : "Create PIN"}
                </Button>
              </div>
            </motion.form>
          ) : (
            // Unlock Form
            <motion.form
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleUnlock}
              className="bg-white rounded-xl p-8 shadow-2xl flex flex-col items-center w-full max-w-sm mx-4"
            >
              <LockIcon className="w-12 h-12 text-blue-900 mb-4" />

              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Secure Access
              </h2>
              <p className="mb-6 text-gray-500 text-sm text-center">
                {userPin ? "Enter your 6-digit PIN to unlock the application." : "Set up a PIN to secure your application."}
              </p>
              
              {userPin && (
                <Input
                  ref={inputRef}
                  type="password"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  minLength={6}
                  value={input}
                  onChange={handleInputChange}
                  className="mb-4 text-center text-lg tracking-wider border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                  placeholder="••••••"
                  aria-label="6-digit PIN"
                />
              )}
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm mb-4 text-center"
                >
                  {error}
                </motion.div>
              )}
              
              <Button
                type={userPin ? "submit" : "button"}
                onClick={!userPin ? handleSetupPin : undefined}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 rounded-lg transition-colors duration-200"
                disabled={userPin ? (input.length !== 6) : false}
              >
                {!userPin ? "Set Up PIN" : "Unlock"}
              </Button>

              {!userPin && (
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Click "Set Up PIN" to create a secure PIN for your application.
                </p>
              )}
            </motion.form>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LockScreen;
