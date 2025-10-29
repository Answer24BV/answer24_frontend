"use client";

import { useState, useEffect } from "react";
import { translationService, TranslationKey } from "@/lib/translationService";
import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "@/components/ui/button";

export default function TranslationManagementPage() {
  const [translationKeys, setTranslationKeys] = useState<TranslationKey[]>([]);
  const [languages, setLanguages] = useState<{ code: string; name: string }[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newLanguageCode, setNewLanguageCode] = useState("");
  const [newLanguageName, setNewLanguageName] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [savingKeys, setSavingKeys] = useState<string[]>([]);

  const { t: dynamicT } = useTranslations();

  useEffect(() => {
    loadLanguagesAndTranslations();
  }, []);

  // Load languages and all translations in one go
  const loadLanguagesAndTranslations = async () => {
    try {
      const langs = await translationService.getLanguages();
      setLanguages(langs);

      const res = await fetch("https://api.answer24.nl/api/v1/translations");
      const allTranslations: TranslationKey[] = await res.json();

      // Ensure each key has all language codes
      const completedTranslations = allTranslations.map((t) => {
        langs.forEach((lang) => {
          if (!(lang.code in t)) t[lang.code] = "";
        });
        return t;
      });

      setTranslationKeys(completedTranslations);
    } catch (error) {
      console.error("Failed to load languages or translations", error);
    }
  };

  // Add new language
  const handleAddLanguage = async () => {
    if (!newLanguageCode || !newLanguageName) return;
    try {
      const success = await translationService.addLanguage(
        newLanguageCode,
        newLanguageName
      );
      if (success) {
        setLanguages((prev) => [
          ...prev,
          { code: newLanguageCode, name: newLanguageName },
        ]);
        setNewLanguageCode("");
        setNewLanguageName("");
        // Add empty translation values for new language
        setTranslationKeys((prev) =>
          prev.map((t) => ({ ...t, [newLanguageCode]: "" }))
        );
      }
    } catch (error) {
      console.error("Error adding language:", error);
    }
  };

  // Save a translation for a key/language
  const handleSaveTranslation = async (
    key: string,
    lang: string,
    text: string
  ) => {
    setSavingKeys((prev) => [...prev, key]);
    setSaveStatus(`Saving ${lang} for ${key}...`);

    try {
      const success = await translationService.updateTranslation(
        key,
        lang,
        text
      );
      if (success) {
        setTranslationKeys((prev) =>
          prev.map((item) =>
            item.key === key ? { ...item, [lang]: text } : item
          )
        );
        setSaveStatus("Saved successfully! 🎉");
      } else {
        setSaveStatus("Failed to save 😢");
      }
    } catch (error) {
      console.error(error);
      setSaveStatus("Error saving 😵‍💫");
    } finally {
      setSavingKeys((prev) => prev.filter((k) => k !== key));
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  // Add new translation key
  const handleAddNewKey = async () => {
    if (!newKey.trim()) return;

    const success = await translationService.addTranslationKey(newKey);
    if (success) {
      const newTranslation: TranslationKey = { key: newKey };
      languages.forEach((lang) => (newTranslation[lang.code] = ""));
      setTranslationKeys((prev) => [...prev, newTranslation]);
      setNewKey("");
    } else {
      console.error("Failed to add new translation key.");
    }
  };

  const filteredKeys = translationKeys.filter((item) =>
    item.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 pt-8">
      <h1 className="text-3xl font-bold mb-6">
        {dynamicT("admin.title", "Translation Management")}
      </h1>

      {saveStatus && (
        <div
          className={`mb-4 p-3 rounded ${
            saveStatus.includes("success")
              ? "bg-green-100 text-green-800"
              : saveStatus.includes("Error") || saveStatus.includes("Failed")
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {saveStatus}
        </div>
      )}

      {/* Add New Language */}
      <div className="mb-6 space-y-2">
        <h2 className="font-semibold text-lg">Add New Language</h2>
        <div className="flex gap-2">
          <input
            placeholder="Language code (e.g., es)"
            value={newLanguageCode}
            onChange={(e) => setNewLanguageCode(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />
          <input
            placeholder="Language name (e.g., Spanish)"
            value={newLanguageName}
            onChange={(e) => setNewLanguageName(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />
          <Button onClick={handleAddLanguage}>Add Language</Button>
        </div>
      </div>

      {/* Add New Key */}
      <div className="mb-6 flex gap-2">
        <input
          placeholder="New translation key (e.g., header.new_text)"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md"
        />
        <Button onClick={handleAddNewKey}>Add Key</Button>
      </div>

      {/* Translation Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left">Key</th>
              {languages.map((lang) => (
                <th key={lang.code} className="px-6 py-3 text-left">
                  {lang.name}
                </th>
              ))}
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredKeys.map((item) => (
              <tr key={item.key} className="border-b">
                <td className="px-6 py-3 font-medium">{item.key}</td>
                {languages.map((lang) => (
                  <td key={lang.code} className="px-6 py-3">
                    <textarea
                      className="w-full border rounded px-2 py-1"
                      rows={2}
                      value={item[lang.code] || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setTranslationKeys((prev) =>
                          prev.map((t) =>
                            t.key === item.key
                              ? { ...t, [lang.code]: value }
                              : t
                          )
                        );
                      }}
                    />
                  </td>
                ))}
                <td className="px-6 py-3">
                  <Button
                    disabled={savingKeys.includes(item.key)}
                    onClick={() =>
                      languages.forEach((lang) =>
                        handleSaveTranslation(
                          item.key,
                          lang.code,
                          item[lang.code] || ""
                        )
                      )
                    }
                  >
                    Save All
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredKeys.length === 0 && (
        <p className="text-gray-500 mt-4">
          No translation keys found. Add a new key above ✨
        </p>
      )}
    </div>
  );
}
