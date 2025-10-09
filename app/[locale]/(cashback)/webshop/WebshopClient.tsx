"use client";
import React, { useEffect, useState } from "react";
import { PrivateNavbar } from "@/components/common/PrivateNavbar";
import { Navbar } from "@/components/common/Navbar";
import { Search, Star, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import Footer from "@/components/(webshop)/Footer";
import { API_CONFIG } from "@/lib/api-config";

type Webshop = {
  id: number;
  name: string;
  logo: string;
  cashback: string;
  description: string;
  category: string;
  rating: number;
  featured: boolean;
};

type Category = "All" | string;

const WebshopClient = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [webshops, setWebshops] = useState<Webshop[]>([]);
  const [categories, setCategories] = useState<Category[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionChecked, setConnectionChecked] = useState(false);
  const router = useRouter();

  const categoryEndpoint = `${API_CONFIG.BASE_URL}/daisycon/category`;
  const connectEndpoint = `${API_CONFIG.BASE_URL}/daisycon/connect`;
  const mediaEndpoint = `${API_CONFIG.BASE_URL}/daisycon/media`;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  // Fetch media/webshops
  const fetchMedia = async () => {
    try {
      const res = await fetch(mediaEndpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success === true && data.data) {
        const mediaList = data.data.map((media: any) => ({
          id: media.id || Math.random(),
          name: media.name || "Unknown Store",
          logo: media.logo || "https://avatar.iran.liara.run/public/45",
          cashback: media.cashback || "Up to 5%",
          description: media.description || "Earn cashback on purchases",
          category: media.category || "General",
          rating: media.rating || 4.5,
          featured: media.featured || false,
        }));

        setWebshops(mediaList);
      } else {
        console.error("Failed to fetch media:", data);
        setWebshops([]);
      }
    } catch (err) {
      console.error("Media fetch error:", err);
      setWebshops([]);
    }
  };

  // Check Daisycon connection status (NO auto-redirect)
  const checkDaisyconConnection = async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setLoading(true);

      // Try to fetch categories to check if connected
      const res = await fetch(categoryEndpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success === true && data.data) {
        // User is connected, load categories and media
        setIsConnected(true);
        setCategories(["All", ...data.data.map((c: any) => c.name)]);
        await fetchMedia();
      } else {
        // User is not connected, just show the prompt - NO auto-redirect
        setIsConnected(false);
      }
    } catch (err) {
      console.error("Connection check error:", err);
      // If category fetch fails, assume not connected - NO auto-redirect
      setIsConnected(false);
    } finally {
      setConnectionChecked(true);
      setLoading(false);
    }
  };

  // Initiate OAuth connection (only called when user clicks button)
  const initiateOAuthConnection = async () => {
    try {
      const connectRes = await fetch(connectEndpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const connectData = await connectRes.json();

      if (connectData?.success && connectData?.data?.url) {
        // Store current page in localStorage so we can return here after OAuth
        localStorage.setItem("daisycon_return_url", window.location.pathname);

        // Redirect to Daisycon OAuth
        window.location.href = connectData.data.url;
      } else {
        console.error("Failed to get OAuth URL:", connectData);
        alert("Failed to initiate Daisycon connection. Please try again.");
      }
    } catch (err) {
      console.error("OAuth initiation error:", err);
      alert("Failed to connect to Daisycon. Please try again.");
    }
  };

  // Check for OAuth return (when user comes back from Daisycon)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (code && state) {
      // User returned from OAuth, clean URL and recheck connection
      window.history.replaceState({}, document.title, window.location.pathname);

      // Give backend time to process the callback, then recheck
      setTimeout(() => {
        checkDaisyconConnection();
      }, 2000);
    } else {
      // Normal page load, check connection
      checkDaisyconConnection();
    }
  }, [token, router]);

  const filteredWebshops = webshops.filter((shop) => {
    const matchesCategory =
      activeCategory === "All" || shop.category === activeCategory;
    const matchesSearch =
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleShopClick = (shopName: string) => {
    router.push(`/nl/webshop/${shopName}`);
  };

  // Show loading while checking connection
  if (!connectionChecked || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PrivateNavbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {!connectionChecked
                ? "Checking Daisycon connection..."
                : "Loading stores..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show connection prompt if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PrivateNavbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-20">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              You are not connected to Daisycon
            </h2>
            <p className="text-gray-600 mb-6">
              Connect your Daisycon account to access cashback stores and start
              earning rewards.
            </p>
            <button
              onClick={initiateOAuthConnection}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Connect Daisycon Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main content (when connected)
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section with padding to account for fixed navbar */}
      <div className="pt-20">
        {/* Search and Filters */}
        <section className="bg-white py-8 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search stores..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Categories */}
              <div className="flex items-center space-x-2 overflow-x-auto">
                <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* All Stores */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              All Stores
            </h2>

            {filteredWebshops.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No stores found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredWebshops.map((shop) => (
                  <div
                    key={shop.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleShopClick(shop.name)}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={shop.logo}
                        alt={shop.name}
                        className="w-12 h-6 object-contain"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {shop.name}
                        </h3>
                        <div className="text-green-600 font-medium text-sm">
                          {shop.cashback}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {shop.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">
                          {shop.rating}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {shop.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default WebshopClient;
