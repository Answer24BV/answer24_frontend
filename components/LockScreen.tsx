import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LockScreenProps {
  onUnlock: () => void;
  show: boolean;
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock, show }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  if (!show) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const savedKey =
      typeof window !== "undefined" ? localStorage.getItem("lockKey") : null;
    if (input === savedKey) {
      setError("");
      setInput("");
      onUnlock();
    } else {
      setError("Incorrect key. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 bg-opacity-80">
      <form
        className="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center min-w-[300px]"
        onSubmit={handleUnlock}
      >
        <h2 className="text-2xl font-bold mb-4">Locked</h2>
        <p className="mb-4 text-gray-600">
          Enter your 6-digit lock key to continue.
        </p>
        <Input
          type="password"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          minLength={6}
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value.replace(/[^0-9]/g, ""))}
          className="mb-2 text-center text-lg tracking-widest"
        />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <Button type="submit" className="w-full">
          Unlock
        </Button>
      </form>
    </div>
  );
};

export default LockScreen;
