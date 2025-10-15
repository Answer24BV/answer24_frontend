"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { tokenUtils } from "@/utils/auth";
import { toast } from "react-toastify";

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

interface Company {
  id?: string;
  user_id?: string;
  name?: string;
  address?: Address;
  contact?: string;
  website_url?: string;
  social_links?: SocialLinks;
  serpapi_language?: string;
  created_at?: string;
  updated_at?: string;
  last_updated?: string;
  company_opening_hours?: any[];
  company_reviews?: any[];
}

export function Details() {
  const [company, setCompany] = useState<Company>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Local editable copies
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

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://answer24.laravel.cloud/api/v1";

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const token = tokenUtils.getToken();
        if (!token) {
          toast.error("Not authenticated.");
          setLoading(false);
          return;
        }

        // get current user id from /profile
        let fetchedUserId: string | null = null;
        try {
          const profileRes = await fetch(`${API_BASE}/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });
          if (profileRes.ok) {
            const profileJson = await profileRes.json().catch(() => null);
            fetchedUserId = profileJson?.user?.id || profileJson?.id || null;
            setUserId(fetchedUserId);
          } else {
            console.debug("[Details] /profile returned", profileRes.status);
          }
        } catch (err) {
          console.debug("[Details] profile lookup error", err);
        }

        if (!fetchedUserId) {
          toast.error(
            "Could not determine current user. Company show endpoint requires an identifier."
          );
          setLoading(false);
          return;
        }

        // Use only show endpoint: GET /user-company/{company}
        const showRes = await fetch(
          `${API_BASE}/user-company/${fetchedUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!showRes.ok) {
          if (showRes.status === 404) {
            // No company found for this user (expected for new users)
            setCompany({});
            setLoading(false);
            return;
          }
          const text = await showRes.text().catch(() => "");
          console.error("[Details] show fetch failed:", showRes.status, text);
          toast.error(
            `Failed to load company: ${showRes.status} ${showRes.statusText}`
          );
          setCompany({});
          setLoading(false);
          return;
        }

        const json = await showRes.json().catch(() => ({}));
        const data = json?.data || json || {};
        setCompany(data);
        // populate local fields
        setName(data.name || "");
        setStreet(data.address?.street || "");
        setHousenumber(data.address?.housenumber || "");
        setZipcode(data.address?.zipcode || "");
        setCity(data.address?.city || "");
        setRegion(data.address?.region || "");
        setCountry(data.address?.country || "");
        setContact(data.contact || "");
        setWebsiteUrl(data.website_url || "");
        setFacebook(data.social_links?.facebook || "");
        setInstagram(data.social_links?.instagram || "");
        setYoutube(data.social_links?.youtube || "");
        setSerpapiLanguage(data.serpapi_language || "");
      } catch (err) {
        console.error("[Details] fetchCompany error:", err);
        toast.error("Unable to reach API. Check API_BASE, network and CORS.");
        setCompany({});
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error(
        "Cannot save: missing user identifier for company show endpoint."
      );
      return;
    }

    const payload: Partial<Company> = {
      name: name || undefined,
      address: {
        street: street || undefined,
        housenumber: housenumber || undefined,
        zipcode: zipcode || undefined,
        city: city || undefined,
        region: region || undefined,
        country: country || undefined,
      },
      contact: contact || undefined,
      website_url: websiteUrl || undefined,
      social_links: {
        facebook: facebook || undefined,
        instagram: instagram || undefined,
        youtube: youtube || undefined,
      },
      serpapi_language: serpapiLanguage || undefined,
    };

    setSaving(true);
    try {
      const token = tokenUtils.getToken();
      const url = `${API_BASE}/user-company/${userId}`;
      const res = await fetch(url, {
        method: "PUT", // use show endpoint for update
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text().catch(() => "");
      let parsed: any = null;
      try {
        parsed = text ? JSON.parse(text) : null;
      } catch {}

      if (!res.ok) {
        if (res.status === 404) {
          toast.error(
            "Company not found for this user. This app uses the show endpoint for update. Contact support to create a company."
          );
          throw new Error(
            "Company not found (404) - update via show endpoint not possible."
          );
        }

        if (parsed?.errors) {
          const firstKey = Object.keys(parsed.errors)[0];
          const firstMsg =
            Array.isArray(parsed.errors[firstKey]) &&
            parsed.errors[firstKey].length
              ? parsed.errors[firstKey][0]
              : JSON.stringify(parsed.errors[firstKey]);
          toast.error(firstMsg);
          throw new Error(firstMsg);
        }

        const msg =
          parsed?.message || text || `${res.status} ${res.statusText}`;
        toast.error(msg);
        throw new Error(msg);
      }

      const json = parsed || {};
      const updated = json?.data || json;
      setCompany(updated);
      setName(updated.name || "");
      setStreet(updated.address?.street || "");
      setHousenumber(updated.address?.housenumber || "");
      setZipcode(updated.address?.zipcode || "");
      setCity(updated.address?.city || "");
      setRegion(updated.address?.region || "");
      setCountry(updated.address?.country || "");
      setContact(updated.contact || "");
      setWebsiteUrl(updated.website_url || "");
      setFacebook(updated.social_links?.facebook || "");
      setInstagram(updated.social_links?.instagram || "");
      setYoutube(updated.social_links?.youtube || "");
      setSerpapiLanguage(updated.serpapi_language || "");

      toast.success("Company details updated");
    } catch (error) {
      console.error("Save company error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save company details"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Company Details
        </h2>
        <p className="text-gray-500 mt-1">
          Edit company information. 
        </p>
      </div>

      <div className="border-t border-gray-100 pt-6">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="company-name"
                  className="text-sm font-medium text-gray-700 mb-1.5 block"
                >
                  Company Name
                </Label>
                <Input
                  id="company-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Acme Ltd."
                />
              </div>

              <div>
                <Label
                  htmlFor="contact-person"
                  className="text-sm font-medium text-gray-700 mb-1.5 block"
                >
                  Contact Person / Phone / Email
                </Label>
                <Input
                  id="contact-person"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Jane Doe, +1 555 555"
                />
              </div>

              <div>
                <Label
                  htmlFor="company-street"
                  className="text-sm font-medium text-gray-700 mb-1.5 block"
                >
                  Street
                </Label>
                <Input
                  id="company-street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="123 Main St"
                />
              </div>

              <div>
                <Label
                  htmlFor="company-housenumber"
                  className="text-sm font-medium text-gray-700 mb-1.5 block"
                >
                  House number
                </Label>
                <Input
                  id="company-housenumber"
                  value={housenumber}
                  onChange={(e) => setHousenumber(e.target.value)}
                  placeholder="1A"
                />
              </div>

              <div>
                <Label
                  htmlFor="company-zipcode"
                  className="text-sm font-medium text-gray-700 mb-1.5 block"
                >
                  Zipcode
                </Label>
                <Input
                  id="company-zipcode"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                  placeholder="10001"
                />
              </div>

              <div>
                <Label
                  htmlFor="company-city"
                  className="text-sm font-medium text-gray-700 mb-1.5 block"
                >
                  City
                </Label>
                <Input
                  id="company-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="New York"
                />
              </div>

              <div>
                <Label
                  htmlFor="company-region"
                  className="text-sm font-medium text-gray-700 mb-1.5 block"
                >
                  Region / State
                </Label>
                <Input
                  id="company-region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="NY"
                />
              </div>

              <div>
                <Label
                  htmlFor="company-country"
                  className="text-sm font-medium text-gray-700 mb-1.5 block"
                >
                  Country
                </Label>
                <Input
                  id="company-country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="USA"
                />
              </div>

              <div>
                <Label
                  htmlFor="website-url"
                  className="text-sm font-medium text-gray-700 mb-1.5 block"
                >
                  Website URL
                </Label>
                <Input
                  id="website-url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <Label
                  htmlFor="serpapi-language"
                  className="text-sm font-medium text-gray-700 mb-1.5 block"
                >
                  SERP API Language
                </Label>
                <Input
                  id="serpapi-language"
                  value={serpapiLanguage}
                  onChange={(e) => setSerpapiLanguage(e.target.value)}
                  placeholder="en"
                />
              </div>

              <div>
                <Label
                  htmlFor="facebook"
                  className="text-sm font-medium text-gray-700 mb-1.5 block"
                >
                  Facebook
                </Label>
                <Input
                  id="facebook"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              <div>
                <Label
                  htmlFor="instagram"
                  className="text-sm font-medium text-gray-700 mb-1.5 block"
                >
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/yourpage"
                />
              </div>

              <div>
                <Label
                  htmlFor="youtube"
                  className="text-sm font-medium text-gray-700 mb-1.5 block"
                >
                  YouTube
                </Label>
                <Input
                  id="youtube"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="https://youtube.com/channel/..."
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between border-t border-gray-100">
              <div className="text-sm text-gray-500">
                {company?.company_opening_hours?.length ? (
                  <div>
                    <div>
                      Opening hours configured:{" "}
                      {company.company_opening_hours.length}
                    </div>
                    <div className="text-xs mt-1">
                      Last updated:{" "}
                      {company.last_updated || company.updated_at || "—"}
                    </div>
                  </div>
                ) : (
                  <div>No opening hours configured</div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // reset to current saved values
                    setName(company.name || "");
                    setStreet(company.address?.street || "");
                    setHousenumber(company.address?.housenumber || "");
                    setZipcode(company.address?.zipcode || "");
                    setCity(company.address?.city || "");
                    setRegion(company.address?.region || "");
                    setCountry(company.address?.country || "");
                    setContact(company.contact || "");
                    setWebsiteUrl(company.website_url || "");
                    setFacebook(company.social_links?.facebook || "");
                    setInstagram(company.social_links?.instagram || "");
                    setYoutube(company.social_links?.youtube || "");
                    setSerpapiLanguage(company.serpapi_language || "");
                    toast.info("Form reset to saved values");
                  }}
                >
                  Reset
                </Button>

                <Button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-medium"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Company Details"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
