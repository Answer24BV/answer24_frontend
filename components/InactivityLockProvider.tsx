"use client"
import React, { useEffect, useRef, useState } from "react";
import LockScreen from "@/components/LockScreen";

interface InactivityLockProviderProps {
  children: React.ReactNode;
}

const getLockTimeoutMs = () => {
  if (typeof window === "undefined") return 15 * 60 * 1000;
  const stored = localStorage.getItem("lockTimeout");
  return stored ? Number(stored) * 60 * 1000 : 1 * 60 * 1000;
};

const InactivityLockProvider: React.FC<InactivityLockProviderProps> = ({ children }) => {
  const [locked, setLocked] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timer on user activity
  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setLocked(true), getLockTimeoutMs());
    // If locked, don't reset timer
    if (locked) return;
  };

  // Listen to user activity
  useEffect(() => {
    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    const handler = () => resetTimer();
    events.forEach((event) => window.addEventListener(event, handler));
    resetTimer();
    return () => {
      events.forEach((event) => window.removeEventListener(event, handler));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line
  }, [locked]);

  // Unlock callback
  const handleUnlock = () => {
    setLocked(false);
    resetTimer();
  };

  return (
    <>
      <LockScreen show={locked} onUnlock={handleUnlock} />
      {children}
    </>
  );
};

export default InactivityLockProvider;
