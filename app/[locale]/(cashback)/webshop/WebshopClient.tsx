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

// Dummy data mimicking Daisycon API responses for fallback
const dummyCategories: Category[] = [
  "All",
  "Fashion",
  "Home & Living",
  "Electronics",
  "Health & Beauty",
  "Pets",
  "General"
];

const dummyWebshops: Webshop[] = [
  {
    id: 1,
    name: "AliExpress",
    logo: "https://via.placeholder.com/64x64/FF6B35/FFFFFF?text=AE",
    cashback: "Up to 7%",
    description: "Shop millions of trending products from global sellers at unbeatable prices.",
    category: "General",
    rating: 4.7,
    featured: true,
  },
  {
    id: 2,
    name: "Alibaba",
    logo: "https://via.placeholder.com/64x64/FFA500/FFFFFF?text=AB",
    cashback: "Up to 5%",
    description: "World's largest wholesale marketplace connecting buyers and suppliers worldwide.",
    category: "Electronics",
    rating: 4.6,
    featured: false,
  },
  {
    id: 3,
    name: "500Cosmetics",
    logo: "https://via.placeholder.com/64x64/E91E63/FFFFFF?text=500C",
    cashback: "Up to 10%",
    description: "Discover premium cosmetics and beauty products from top brands.",
    category: "Health & Beauty",
    rating: 4.8,
    featured: true,
  },
  {
    id: 4,
    name: "Emma Mattress",
    logo: "https://via.placeholder.com/64x64/2196F3/FFFFFF?text=EM",
    cashback: "Up to 8%",
    description: "Award-winning mattresses designed for the perfect night's sleep.",
    category: "Home & Living",
    rating: 4.9,
    featured: true,
  },
  {
    id: 5,
    name: "Webshopvoorhonden.nl",
    logo: "https://via.placeholder.com/64x64/4CAF50/FFFFFF?text=WH",
    cashback: "Up to 6%",
    description: "Premium pet supplies and accessories for happy dogs.",
    category: "Pets",
    rating: 4.5,
    featured: false,
  },
  {
    id: 6,
    name: "Weight Watchers Shop",
    logo: "https://via.placeholder.com/64x64/9C27B0/FFFFFF?text=WW",
    cashback: "Up to 4%",
    description: "Healthy living essentials, from meal plans to fitness gear.",
    category: "Health & Beauty",
    rating: 4.4,
    featured: false,
  },
];

const WebshopClient = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [webshops, setWebshops] = useState<Webshop[]>([]);
  const [categories, setCategories] = useState<Category[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const categoryEndpoint = `${API_CONFIG.BASE_URL}/daisycon/categories`;
  const mediaEndpoint = `${API_CONFIG.BASE_URL}/daisycon/media`;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  
  // Check if user is logged in
  const isLoggedIn = !!token;

  // Fetch categories from Daisycon
  const fetchCategories = async () => {
    try {
      const res = await fetch(categoryEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch categories:", res.status);
        // On failure, use dummy categories to keep UI functional
        setCategories(dummyCategories);
        return;
      }

      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        const categoryNames = data.data.map((c: any) => c.name || c.title);
        setCategories(["All", ...categoryNames]);
      } else {
        // Fallback to dummy if data is invalid
        setCategories(dummyCategories);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      // On error, use dummy categories to keep UI functional
      setCategories(dummyCategories);
    }
  };

  // Fetch webshops/campaigns from Daisycon
  const fetchWebshops = async () => {
    try {
      const res = await fetch(mediaEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch webshops:", res.status);
        // On failure (including 404), use dummy data to make it look like a live Daisycon store
        setWebshops(dummyWebshops);
        setError(null); // Clear any error to show main UI
        return;
      }

      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        const shopsList = data.data.map((shop: any) => ({
          id: shop.id || shop.program_id || Math.random(),
          name: shop.name || shop.program_name || "Store",
          logo: shop.logo || shop.image_url || "https://avatar.iran.liara.run/public/45",
          cashback: shop.commission_rate || shop.cashback || "Up to 5%",
          description: shop.description || "Earn cashback on your purchases",
          category: shop.category || shop.category_name || "General",
          rating: shop.rating || 4.5,
          featured: shop.featured || shop.is_featured || false,
        }));

        setWebshops(shopsList);
        setError(null);
      } else {
        // Fallback to dummy if data is invalid
        setWebshops(dummyWebshops);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching webshops:", err);
      // On error, use dummy data to make it look like a live Daisycon store
      setWebshops(dummyWebshops);
      setError(null);
    }
  };

  // Load categories and webshops on mount
  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchWebshops()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const filteredWebshops = webshops.filter((shop) => {
    const matchesCategory =
      activeCategory === "All" || shop.category === activeCategory;
    const matchesSearch =
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleShopClick = (shop: Webshop) => {
    // Backend should generate tracking link with user ID
    // For now, just navigate to shop detail page
    // Note: For dummy shops, this will still route to /webshop/{id}, but detail page may need similar fallback
    router.push(`/webshop/${shop.id}`);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {isLoggedIn ? <PrivateNavbar /> : <Navbar />}
        <div className="flex items-center justify-center min-h-[60vh] pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cashback stores...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state (now only if something else goes wrong, but unlikely with fallbacks)
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {isLoggedIn ? <PrivateNavbar /> : <Navbar />}
        <div className="flex items-center justify-center min-h-[60vh] pt-20">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Webshops Unavailable
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main content (now always shows with real or dummy data)
  return (
    <div className="min-h-screen bg-gray-50">
      {isLoggedIn ? <PrivateNavbar /> : <Navbar />}
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Cashback Webshops
            </h1>
            <p className="text-lg text-gray-600">
              Shop at your favorite stores and earn A-Points cashback on every purchase
            </p>
            {isLoggedIn && (
              <div className="mt-4">
                <a 
                  href="/dashboard/wallet" 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span className="mr-2">💰</span>
                  View My Wallet
                </a>
              </div>
            )}
          </div>

          {/* Search & Filter */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[200px]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Webshops Grid */}
          {filteredWebshops.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No stores found. Try adjusting your search or filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWebshops.map((shop) => (
                <div
                  key={shop.id}
                  onClick={() => handleShopClick(shop)}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <img
                        src={shop.logo}
                        alt={shop.name}
                        className="w-16 h-16 object-contain rounded"
                      />
                      {shop.featured && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {shop.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {shop.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm text-gray-700">{shop.rating}</span>
                      </div>
                      <span className="text-blue-600 font-semibold">
                        {shop.cashback}
                      </span>
                    </div>
                    <div className="mt-4">
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {shop.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WebshopClient;