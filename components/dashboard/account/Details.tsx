"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface Company {
  id?: number;
  user_id?: string;
  name?: string;
  street?: string;
  housenumber?: string;
  zipcode?: string;
  city?: string;
  region?: string;
  country?: string;
  contact?: string;
  website_url?: string;
  place_id?: string;
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
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const { toast } = useToast();

  const API_BASE_URL = "https://answer24.laravel.cloud/api/v1";

  useEffect(() => {
    const storedId =
      localStorage.getItem("userId") ||
      "0198ff2c-5918-71a0-a451-0ac7b13e45d6"; // fallback for testing
    setUserId(storedId);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchCompany = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await axios.get(
          `${API_BASE_URL}/user-companies/user/${userId}`
        );

        if (data.success && data.data.length > 0) {
          const companyData = data.data[0];
          setCompany(companyData);
          setForm(companyData);
        } else {
          setCompany(null);
        }
      } catch (err: any) {
        console.error("❌ Error fetching company:", err);
        setCompany(null);
        setError("Failed to load company details");
        toast({
          title: "Error",
          description: "Could not load company details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!userId) {
      toast({
        title: "User ID missing",
        description: "Please log in again to continue.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (company?.id) {
        const { data } = await axios.put(
          `${API_BASE_URL}/user-companies/${company.id}`,
          form
        );

        setCompany(data.data);
        toast({
          title: "✅ Success",
          description: "Company updated successfully!",
        });
      } else {
        const { data } = await axios.post(`${API_BASE_URL}/user-companies`, {
          ...form,
          user_id: userId,
        });

        setCompany(data.data);
        setCreating(false);
        toast({
          title: "✅ Company Created",
          description: "Your company has been created successfully!",
        });
      }
    } catch (err: any) {
      console.error("❌ Save failed:", err);
      setError("Failed to save company details");
      toast({
        title: "Error",
        description: "Failed to save company details.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="p-6 text-gray-500">Loading company details...</div>;

  if (!company && !creating)
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-2">No company found</h2>
        <p className="text-gray-500 mb-4">
          You don’t have a company added yet.
        </p>
        <Button onClick={() => setCreating(true)}>Create Company</Button>
      </div>
    );

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">
        {creating ? "Create Company" : "Edit Company"}
      </h2>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 p-2 rounded">
          ⚠️ {error}
        </p>
      )}

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
          {saving
            ? creating
              ? "Creating..."
              : "Saving..."
            : creating
            ? "Create"
            : "Save Changes"}
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
