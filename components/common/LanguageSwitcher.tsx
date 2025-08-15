"use client";

import { useState } from "react";

export default function LanguageSwitcher() {
  const [lang, setLang] = useState("en");

  const toggleLanguage = () => {
    setLang(lang === "en" ? "nl" : "en");
  };

  return (
    <button onClick={toggleLanguage}>
      {lang === "en" ? "English" : "Dutch"}
    </button>
  );
}
