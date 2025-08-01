"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const SectionDownloadApp = () => {
  const [showModal, setShowModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true ||
      document.referrer.includes("android-app://");

    setIsInstalled(standalone);

    const isLocalhostCheck =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "[::1]";
    setIsLocalhost(isLocalhostCheck);

    setShouldRender(!standalone /*&& !isLocalhostCheck*/);

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("[PWA] beforeinstallprompt fired for component");
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (isInstalled) {
      alert("App is already installed.");
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log("User choice:", outcome);
      setDeferredPrompt(null);
      setShowModal(false);
    } else {
      if (isLocalhost) {
        alert(
          "Install prompt not available on localhost. Please test on a real device or deploy the app."
        );
      } else {
        alert(
         
            " prompt not available. Try refreshing or use your browser's Add to Home Screen option. (DEBUG: deferredPrompt was null)"
        );
      }
    }
  };

  if (!shouldRender) return null;

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full text-center space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold text-neutral-800">
            Install This App
            </h2>
            <p className="text-neutral-600 text-sm">For faster access, install this app on your device.</p>

            {isInstalled && (
              <p className="text-sm text-green-600 font-medium">
               App is already installed.
                <br />
                To install again, please uninstall the app first.
              </p>
            )}

            {!deferredPrompt && !isInstalled && (
              <p className="text-xs text-gray-400">
                
                  "You can also add this app to your home screen manually from your browser menu.
              </p>
            )}

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleInstallClick}
                // Enable only if deferredPrompt is available and not installed
                disabled={isInstalled || !deferredPrompt}
                className={`px-4 py-2 rounded-xl cursor-pointer  transition ${
                  isInstalled || !deferredPrompt
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                install
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200  cursor-pointer text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition"
              >
               later
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="relative mt-20 py-20 lg:py-28 xl:py-36 2xl:py-44">
        <div className="absolute inset-0 w-full h-full bg-neutral-100/90 -z-10 rounded-b-[40px] overflow-hidden">
          <Image
            src="/dowloadAppBG.png"
            alt="Download Background"
            layout="fill"
            objectFit="cover"
            className="object-right rtl:object-left"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-800">
             Answer24 Mobile Apps
            </h2>
            <p className="mt-6 text-lg sm:text-xl text-neutral-600">
            Download our mobile apps to stay connected with your favorite services.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6">
              <button
                onClick={() => setShowModal(true)}
                className="group w-44 transition-transform duration-200 hover:scale-105 cursor-pointer"
              >
                <Image
                  src="/appstore.png"
                  alt="Download on App Store"
                  width={176}
                  height={52}
                />
              </button>
              <button
               onClick={() => setShowModal(true)}
                className="group w-44 transition-transform duration-200 hover:scale-105 cursor-pointer"
              >
                <Image
                  src="/googleplay.png"
                  alt="Get it on Google Play"
                  
                  width={176}
                  height={52}
                />
              </button>

             
            </div>     
          </div>

          {/* <div className="mt-12 lg:mt-0 lg:absolute lg:bottom-0 lg:end-0 lg:max-w-lg hidden lg:block">
            <Image
              src="/newBg1.png"
              alt="Mobile preview"
              width={400}
              height={800}
              className="rounded-3xl"
            />
          </div> */}
        </div>
      </section>
    </>
  );
};

export default SectionDownloadApp;
