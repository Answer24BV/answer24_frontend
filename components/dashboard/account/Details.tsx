"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { tokenUtils } from "@/utils/auth";

interface Address {
  street?: string;
  housenumber?: string;
  zipcode?: string;
  city?: string;
  region?: string;
  country?: string;
}

interface SocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

interface OpeningHour {
  day: string;
  open: string;
  close: string;
}

interface Company {
  id?: string;
  user_id?: string;
  name?: string;
  address?: Address;
  contact?: string;
  website_url?: string;
  social_links?: SocialLinks;
  serpapi_language?: string;
  company_opening_hours?: OpeningHour[];
}

export function Details() {
  const [company, setCompany] = useState<Company | null>(null);
  const [initialCompanyData, setInitialCompanyData] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [housenumber, setHousenumber] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");
  const [contact, setContact] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [serpapiLanguage, setSerpapiLanguage] = useState("");
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([]);

  const API_BASE = "https://answer24.laravel.cloud/api/v1";

  useEffect(() => {
    const fetchOrCreateCompany = async () => {
      setLoading(true);
      try {
        const currentUser = tokenUtils.getUser();
        const token = tokenUtils.getToken();
        if (!currentUser?.id || !token) {
          toast.error("No user or token found.");
          setLoading(false);
          return;
        }

        // Fetch companies for user
        const res = await fetch(`${API_BASE}/user-companies/user/${currentUser.id}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });

        if (!res.ok) throw new Error("Failed to fetch companies");

        const json = await res.json();
        let companyData: Company | null = json.data?.[0] ?? null;

        if (!companyData) {
          // This should rarely happen if backend auto-creates default
          const createRes = await fetch(`${API_BASE}/user-companies`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name: "Default Company", user_id: currentUser.id }),
          });

          if (!createRes.ok) throw new Error("Failed to create default company");

          const createJson = await createRes.json();
          companyData = createJson.data;
        }

        console.log("Fetched company from backend:", companyData);

        setCompany(companyData);
        setInitialCompanyData(companyData);

        // Populate fields
        setName(companyData?.name || "");
        setStreet(companyData?.address?.street || "");
        setHousenumber(companyData?.address?.housenumber || "");
        setZipcode(companyData?.address?.zipcode || "");
        setCity(companyData?.address?.city || "");
        setRegion(companyData?.address?.region || "");
        setCountry(companyData?.address?.country || "");
        setContact(companyData?.contact || "");
        setWebsiteUrl(companyData?.website_url || "");
        setFacebook(companyData?.social_links?.facebook || "");
        setInstagram(companyData?.social_links?.instagram || "");
        setYoutube(companyData?.social_links?.youtube || "");
        setSerpapiLanguage(companyData?.serpapi_language || "");
        setOpeningHours(companyData?.company_opening_hours || []);

      } catch (err) {
        console.error("Error fetching/creating company:", err);
        toast.error("Unable to fetch company data.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateCompany();
  }, []);

  const handleOpeningHourChange = (idx: number, field: "day" | "open" | "close", value: string) => {
    const updated = [...openingHours];
    updated[idx] = { ...updated[idx], [field]: value };
    setOpeningHours(updated);
  };

  const addOpeningHour = () => setOpeningHours([...openingHours, { day: "", open: "", close: "" }]);
  const removeOpeningHour = (idx: number) => setOpeningHours(openingHours.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const currentUser = tokenUtils.getUser();
      const token = tokenUtils.getToken();
      if (!currentUser?.id || !token) {
        toast.error("Cannot save: missing user or token.");
        setSaving(false);
        return;
      }

      const payload: Partial<Company> = {
        name: name || undefined,
        address: { street, housenumber, zipcode, city, region, country },
        contact: contact || undefined,
        website_url: websiteUrl || undefined,
        social_links: { facebook, instagram, youtube },
        serpapi_language: serpapiLanguage || undefined,
        company_opening_hours: openingHours,
      };

      if (!company?.id) {
        toast.error("No company ID found. Cannot update.");
        setSaving(false);
        return;
      }

      const url = `${API_BASE}/user-companies/${company.id}`;

      console.log("Submitting company update with ID:", company.id);

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Save failed:", res.status, text);
        toast.error("Failed to save company details");
        setSaving(false);
        return;
      }

      const json = await res.json();
      const updated = json.data || json;
      setCompany(updated);
      setInitialCompanyData(updated);
      toast.success("Company details saved successfully");

    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save company details");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!initialCompanyData) return;

    setName(initialCompanyData.name || "");
    setStreet(initialCompanyData.address?.street || "");
    setHousenumber(initialCompanyData.address?.housenumber || "");
    setZipcode(initialCompanyData.address?.zipcode || "");
    setCity(initialCompanyData.address?.city || "");
    setRegion(initialCompanyData.address?.region || "");
    setCountry(initialCompanyData.address?.country || "");
    setContact(initialCompanyData.contact || "");
    setWebsiteUrl(initialCompanyData.website_url || "");
    setFacebook(initialCompanyData.social_links?.facebook || "");
    setInstagram(initialCompanyData.social_links?.instagram || "");
    setYoutube(initialCompanyData.social_links?.youtube || "");
    setSerpapiLanguage(initialCompanyData.serpapi_language || "");
    setOpeningHours(initialCompanyData.company_opening_hours || []);
    toast.info("Form reset to last saved values");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Company Details</h2>
      <div className="border-t border-gray-100 pt-6">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><Label htmlFor="company-name">Company Name</Label><Input id="company-name" value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div><Label htmlFor="contact">Contact</Label><Input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} /></div>
              <div><Label htmlFor="street">Street</Label><Input id="street" value={street} onChange={(e) => setStreet(e.target.value)} /></div>
              <div><Label htmlFor="housenumber">House Number</Label><Input id="housenumber" value={housenumber} onChange={(e) => setHousenumber(e.target.value)} /></div>
              <div><Label htmlFor="zipcode">Zipcode</Label><Input id="zipcode" value={zipcode} onChange={(e) => setZipcode(e.target.value)} /></div>
              <div><Label htmlFor="city">City</Label><Input id="city" value={city} onChange={(e) => setCity(e.target.value)} /></div>
              <div><Label htmlFor="region">Region</Label><Input id="region" value={region} onChange={(e) => setRegion(e.target.value)} /></div>
              <div><Label htmlFor="country">Country</Label><Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} /></div>
              <div><Label htmlFor="website">Website URL</Label><Input id="website" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} /></div>
              <div><Label htmlFor="facebook">Facebook</Label><Input id="facebook" value={facebook} onChange={(e) => setFacebook(e.target.value)} /></div>
              <div><Label htmlFor="instagram">Instagram</Label><Input id="instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} /></div>
              <div><Label htmlFor="youtube">YouTube</Label><Input id="youtube" value={youtube} onChange={(e) => setYoutube(e.target.value)} /></div>
              <div><Label htmlFor="serpapi-language">SERPAPI Language</Label><Input id="serpapi-language" value={serpapiLanguage} onChange={(e) => setSerpapiLanguage(e.target.value)} /></div>
            </div>

            {/* Opening Hours */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">Opening Hours</h3>
              {openingHours.map((oh, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-2 items-center">
                  <Input placeholder="Day" value={oh.day} onChange={(e) => handleOpeningHourChange(idx, "day", e.target.value)} />
                  <Input placeholder="Open" value={oh.open} onChange={(e) => handleOpeningHourChange(idx, "open", e.target.value)} />
                  <Input placeholder="Close" value={oh.close} onChange={(e) => handleOpeningHourChange(idx, "close", e.target.value)} />
                  <Button type="button" variant="destructive" onClick={() => removeOpeningHour(idx)}>Remove</Button>
                </div>
              ))}
              <Button type="button" onClick={addOpeningHour}>Add Opening Hour</Button>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
              <Button type="button" variant="outline" onClick={handleReset}>Reset</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
