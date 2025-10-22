"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";

interface Company {
  id?: string;
  email?: string;
  name?: string;
  street?: string;
  housenumber?: string;
  zipcode?: string;
  city?: string;
  region?: string;
  country?: string;
  contact?: string;
  website_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
}

export default function Details() {
  const [company, setCompany] = useState<Company | null>(null);
  const [form, setForm] = useState<Company>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://answer24_backend.test/api/v1";

  useEffect(() => {
    axios.defaults.headers.common["Accept"] = "application/json";
    axios.defaults.headers.common["Content-Type"] = "application/json";
  }, []);

  useEffect(() => {
    try {
      const storedUserData = localStorage.getItem("user_data");
      if (storedUserData) {
        const parsed = JSON.parse(storedUserData);
        if (parsed.email) setUserEmail(parsed.email);
      }
    } catch (error) {
      console.error("Error reading user data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userEmail) return;

    const fetchCompany = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${API_BASE_URL}/user-company/email/${encodeURIComponent(userEmail)}`
        );

        if (data.success && data.data.length > 0) {
          const fetched = data.data[0];
          setCompany(fetched);
          setForm(fetched);
          localStorage.setItem("company_data", JSON.stringify(fetched));
        } else {
          setCompany(null);
        }
      } catch {
        const localData = localStorage.getItem("company_data");
        if (localData) {
          const parsed = JSON.parse(localData);
          setCompany(parsed);
          setForm(parsed);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [userEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    localStorage.setItem("company_data", JSON.stringify(updated));
  };

  const handleSave = async () => {
    if (!userEmail) return;
    setSaving(true);

    try {
      const { data } = await axios.post(`${API_BASE_URL}/user-companies`, {
        ...form,
        email: userEmail,
      });

      setCompany(data.data);
      localStorage.setItem("company_data", JSON.stringify(data.data));
      setEditing(false);
    } catch {
      localStorage.setItem("company_data", JSON.stringify(form));
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading)
    return (
      <div className="p-6 text-gray-500 text-center animate-pulse">
        Loading company details...
      </div>
    );

  // FORM MODE
  if (!company || editing)
    return (
      <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-md border border-neutral-200 dark:border-neutral-700">
        <h2 className="text-2xl font-semibold mb-6 text-neutral-900 dark:text-neutral-100">
          {company ? "Edit Company" : "Create Company"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            "name",
            "street",
            "housenumber",
            "zipcode",
            "city",
            "region",
            "country",
            "contact",
            "website_url",
            "facebook_url",
            "instagram_url",
            "youtube_url",
          ].map((field) => (
            <div key={field} className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 capitalize">
                {field.replace("_", " ")}
              </label>
              <Input
                name={field}
                value={form[field as keyof Company] || ""}
                onChange={handleChange}
                placeholder={`Enter ${field.replace("_", " ")}`}
                className="border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {saving ? "Saving..." : "Save"}
          </Button>
          {company && (
            <Button
              variant="outline"
              onClick={() => setEditing(false)}
              className="px-6"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    );

  // CARD MODE
  return (

      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-md hover:shadow-lg transition-all duration-300">
         <h2 className="text-2xl font-semibold mb-6 text-neutral-900 dark:text-neutral-100 text-center sm:text-left">
        Company Details: 
      </h2>
        
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100">
            {company.name || "Untitled Company"}
          </h3>
          <p className="text-neutral-500 mt-1 text-sm sm:text-base">
            {company.city && company.country
              ? `${company.city}, ${company.country}`
              : company.city || company.country || ""}
          </p>
        </div>

        <div className="space-y-5">
          {company.contact && (
            <div>
              <p className="text-xs uppercase text-neutral-500 tracking-wider">
                Company Contact
              </p>
              <p className="text-base font-medium">{company.contact}</p>
            </div>
          )}

          {/* Link Fields with Copy Buttons */}
          {[
            { label: "Website", value: company.website_url },
            { label: "Facebook", value: company.facebook_url },
            { label: "Instagram", value: company.instagram_url },
            { label: "YouTube", value: company.youtube_url },
          ]
            .filter((link) => link.value)
            .map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div className="w-full">
                  <p className="text-xs uppercase text-neutral-500 tracking-wider">
                    {label}
                  </p>
                  <a
                    href={value!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {value}
                  </a>
                </div>
                <button
                  onClick={() => handleCopy(value!)}
                  className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition self-start sm:self-center"
                  title="Copy to clipboard"
                >
                  <Copy
                    className={`h-4 w-4 ${
                      copied === value ? "text-green-500" : "text-neutral-500"
                    }`}
                  />
                </button>
              </div>
            ))}

          {company.street && (
            <div>
              <p className="text-xs uppercase text-neutral-500 tracking-wider">
                Address
              </p>
              <p className="text-base font-medium text-neutral-800 dark:text-neutral-200">
                {[company.street, company.housenumber, company.zipcode]
                  .filter(Boolean)
                  .join(" ")}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center sm:justify-end">
          <Button
            onClick={() => setEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
          >
            Edit Company
          </Button>
        </div>
      </div>
  );
}
