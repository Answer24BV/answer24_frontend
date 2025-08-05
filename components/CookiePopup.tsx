"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function CookiePopup() {
  const t = useTranslations("COOKIES");
  const [show, setShow] = useState(false);
  const [settings, setSettings] = useState({
    functional: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem("cookie-consent");
    if (!stored) setShow(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  const savePreferences = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(settings));
    setShow(false);
  };

  const acceptAll = () => {
    const all = { functional: true, analytics: true, marketing: true };
    localStorage.setItem("cookie-consent", JSON.stringify(all));
    setShow(false);
  };

  const toggle = (key: keyof typeof settings) =>
    setSettings({ ...settings, [key]: !settings[key] });

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 bg-opacity-60 backdrop-blur-sm"></div>

      {/* Modal */}
      <div className="relative z-10 bg-white w-full max-w-md mx-4 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold mb-2">{t("title")}</h2>
        <p className="text-sm text-gray-700 mb-4">{t("description")}</p>

        <h3 className="font-bold mb-3">{t("manageSettings")}</h3>

        <div className="space-y-4">
          {[
            {
              key: "functional",
              label: t("types.functional.title"),
              desc: t("types.functional.description"),
            },
            {
              key: "analytics",
              label: t("types.analytics.title"),
              desc: t("types.analytics.description"),
            },
            {
              key: "marketing",
              label: t("types.marketing.title"),
              desc: t("types.marketing.description"),
            },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex justify-between items-start gap-4">
              <div>
                <p className="font-semibold">{label}</p>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>

              {/* Rounded toggle switch */}
              <div className="relative mt-2">
                <input
                  type="checkbox"
                  id={`toggle-${key}`}
                  checked={settings[key as keyof typeof settings]}
                  onChange={() => toggle(key as keyof typeof settings)}
                  className="sr-only"
                />
                <div
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                    settings[key as keyof typeof settings]
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }`}
                  onClick={() => toggle(key as keyof typeof settings)}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      settings[key as keyof typeof settings]
                        ? "translate-x-5"
                        : ""
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
          <button
            onClick={savePreferences}
            className="bg-gray-200 cursor-pointer hover:bg-gray-300 px-2 md:px-4 py-2 rounded font-semibold text-sm"
          >
            {t("savePreferences")}
          </button>
          <button
            onClick={acceptAll}
            className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-2 md:px-4 py-2 rounded font-semibold text-sm"
          >
            {t("acceptAll")}
          </button>
        </div>
      </div>
    </div>
  );
}
