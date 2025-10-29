"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  local_map?: string;
  serpapi_language?: string;
}

export default function Details() {
  const [company, setCompany] = useState<Company | null>(null);
  const [form, setForm] = useState<Company>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://api.answer24.nl/api/v1";

  // ✅ Ensure axios uses JSON
  useEffect(() => {
    axios.defaults.headers.common["Accept"] = "application/json";
    axios.defaults.headers.common["Content-Type"] = "application/json";
  }, []);

  // 🔹 Step 1: Extract email from localStorage user_data
  useEffect(() => {
    try {
      const storedUserData = localStorage.getItem("user_data");
      if (storedUserData) {
        const parsed = JSON.parse(storedUserData);
        if (parsed.email) {
          setUserEmail(parsed.email);
        } else {
          toast.error("❌ No email found in user data. Please log in again.");
        }
      } else {
        toast.error("❌ No user data found. Please log in again.");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      toast.error("❌ Failed to parse user data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Step 2: Fetch company using email
  useEffect(() => {
    if (!userEmail) return;

    const fetchCompany = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${API_BASE_URL}/user-company/email/${encodeURIComponent(userEmail)}`
        );

        if (data.success && data.data.length > 0) {
          setCompany(data.data[0]);
          setForm(data.data[0]);
          setCreating(false);
        } else {
          setCompany(null);
          setCreating(true);
        }
      } catch (err) {
        console.error("❌ Error fetching company:", err);
        setCreating(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [userEmail]);

  // 🔹 Step 3: Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Step 4: Save company (create or replace)
  const handleSave = async () => {
    if (!userEmail) {
      toast.error("User email missing. Please log in or register.");
      return;
    }

    setSaving(true);

    try {
      // Delete existing company if exists
      if (company?.id) {
        await axios.delete(`${API_BASE_URL}/user-companies/${company.id}`);
        toast.info("🗑️ Old company deleted.");
      }

      const { data } = await axios.post(`${API_BASE_URL}/user-companies`, {
        ...form,
        email: userEmail,
      });

      setCompany(data.data);
      setCreating(false);
      toast.success("✅ Company saved successfully!");
    } catch (err: any) {
      console.error("❌ Save failed:", err);
      toast.error(err.response?.data?.message || "Failed to save company.");
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------- UI ----------------------------
  if (loading)
    return <div className="p-6 text-gray-500">Loading company details...</div>;

  if (!company && !creating)
    return (
      <div className="p-6">
        <ToastContainer position="top-right" autoClose={3000} />
        <h2 className="text-lg font-semibold mb-2">No company found</h2>
        <p className="text-gray-500 mb-4">
          You don’t have a company added yet.
        </p>
        <Button onClick={() => setCreating(true)}>Create Company</Button>
      </div>
    );

  return (
    <div className="p-6 space-y-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-xl font-semibold">
        {creating ? "Create Company" : "Manage Company"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          "local_map",
          "serpapi_language",
        ].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium mb-1 capitalize">
              {field.replace("_", " ")}
            </label>
            <Input
              name={field}
              value={form[field as keyof Company] || ""}
              onChange={handleChange}
              placeholder={`Enter ${field.replace("_", " ")}`}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Company"}
        </Button>

        {!creating && (
          <Button variant="outline" onClick={() => setCreating(true)}>
            Create New
          </Button>
        )}
      </div>
    </div>
  );
}
