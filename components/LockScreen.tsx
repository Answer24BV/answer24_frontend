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
              Enter your 6-digit PIN to unlock the application.
            </p>
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
              disabled={!userPin}
            />
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
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 rounded-lg transition-colors duration-200"
              disabled={input.length !== 6 || !userPin}
            >
              {!userPin ? "No PIN Set" : "Unlock"}
            </Button>

            {!userPin && (
              <p className="text-xs text-gray-500 mt-4 text-center">
                Please configure your PIN in Security settings first.
              </p>
            )}
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LockScreen;
