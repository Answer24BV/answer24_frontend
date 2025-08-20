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
  const [userLockKey, setUserLockKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch user profile from API
  const fetchUserProfile = async () => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "https://answer24.laravel.cloud/api/v1"
        }/profile`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenUtils.getToken()}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();

      if (data?.data?.lock_key) {
        setUserLockKey(data.data.lock_key);
      } else {
        setError(
          "No lock key configured. Please set one in Security settings."
        );
      }
    } catch (err) {
      setError("Could not load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      setInput("");
      setError("");
      setUserLockKey(null);
      setLoading(true);
      fetchUserProfile();

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [show]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userLockKey) {
      setError("No lock key configured. Please set one in Security settings.");
      return;
    }

    if (input === userLockKey) {
      setError("");
      setInput("");
      onUnlock();
    } else {
      setError("Incorrect key. Please try again.");
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
              Enter your 6-digit lock key to unlock the application.
            </p>

            {loading ? (
              <p className="text-sm text-gray-500 mb-4">Loading...</p>
            ) : (
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
                aria-label="6-digit lock key"
                disabled={!userLockKey}
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
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 rounded-lg transition-colors duration-200"
              disabled={loading || input.length !== 6 || !userLockKey}
            >
              {!userLockKey ? "No Lock Key Set" : "Unlock"}
            </Button>

            {!userLockKey && !loading && (
              <p className="text-xs text-gray-500 mt-4 text-center">
                Please configure your lock key in Security settings first.
              </p>
            )}
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LockScreen;
