"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

const PWALoader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false); // Initialize to false
  const [isPWA, setIsPWA] = useState(false); // New state to track PWA mode
  const progressCircleRef = useRef<SVGCircleElement | null>(null);
  // const t = useTranslations("PWA_LOADER");

  useEffect(() => {
    // 1. Detect PWA display mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)');

    const checkIfPWA = () => {
      setIsPWA(mediaQuery.matches);
      // If it's a PWA, make the loader visible initially
      if (mediaQuery.matches) {
        setVisible(true);
      } else {
        // If not a PWA, ensure the loader is not visible and stop any ongoing animation
        setVisible(false);
      }
    };

    // Initial check
    checkIfPWA();

    // Listen for changes in display mode (e.g., if user installs the PWA while on the site)
    mediaQuery.addEventListener('change', checkIfPWA);

    // 2. Handle the progress animation and visibility based on PWA mode
    let loadingInterval: NodeJS.Timeout | undefined;

    if (isPWA) { // Only run the loading animation if we are in PWA mode
      const circle = progressCircleRef.current;
      if (!circle) return;

      const radius = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;

      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      circle.style.strokeDashoffset = `${circumference}`;

      const updateProgress = (percent: number) => {
        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDashoffset = `${offset}`;
        setProgress(Math.round(percent));
      };

      let currentProgress = 0;
      const duration = 2000; // Total duration for progress animation
      const interval = 20;    // Update interval

      loadingInterval = setInterval(() => {
        currentProgress += 100 / (duration / interval);
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(loadingInterval);
          setTimeout(() => setVisible(false), 400); // Delay fade-out after 100%
        }
        updateProgress(currentProgress);
      }, interval);
    }

    // Cleanup function
    return () => {
      mediaQuery.removeEventListener('change', checkIfPWA);
      if (loadingInterval) {
        clearInterval(loadingInterval);
      }
    };
  }, [isPWA]); // Re-run effect when isPWA changes

  // Don't render the loader if it's not visible or not in PWA mode
  if (!visible || !isPWA) {
    return null;
  }

  return (
    <div
      id="pwa-loader-container"
      className="flex fixed inset-0 z-[9999] justify-center items-center min-h-screen overflow-hidden"
      style={{
        backgroundColor: `rgba(243,244,246,${1 - progress / 100})`, // bg-gray-100 with animated alpha
        transition: 'background-color 0.3s',
      }}
    >
      <div className="flex relative justify-center items-center w-52 h-52 z-10">
        <svg className="absolute top-0 left-0 w-full h-full -rotate-90">
          <circle className="fill-none stroke-gray-200" strokeWidth={10} cx={104} cy={104} r={90} />
          <circle
            ref={progressCircleRef}
            className="transition-all duration-300 ease-linear fill-none stroke-blue-500 stroke-round"
            strokeWidth={10}
            cx={104}
            cy={104}
            r={90}
          />
        </svg>
        <div className="flex relative z-10 flex-col justify-center items-center text-center text-gray-800">
          <img src="/icon-192.png" alt="Logo" className="mb-4 w-20 h-20" />
          <div className="text-2xl font-semibold text-gray-800">{progress}%</div>
        </div>
      </div>
    </div>
  );
};

export default PWALoader;
