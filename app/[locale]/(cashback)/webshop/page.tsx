"use client";
import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/common/Navbar";
import { Search, Star, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import Footer from "@/components/(webshop)/Footer";

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

const CashbackHomepage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [webshops, setWebshops] = useState<Webshop[]>([]);
  const [categories, setCategories] = useState<Category[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const categoryEndpoint =
    "https://answer24.laravel.cloud/api/v1/daisycon/category";
  const connectEndpoint =
    "https://answer24.laravel.cloud/api/v1/daisycon/connect"; // 👈 adjust if backend named it differently
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  // 👇 Fetch categories and handle Daisycon connection
  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchCategories = async () => {
      try {
        const res = await fetch(categoryEndpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.status === "error") {
          // Not connected yet, get OAuth URL
          const connectRes = await fetch(connectEndpoint, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const connectData = await connectRes.json();

          if (connectData?.data?.authorization_url) {
            alert(
              "You need to connect your Daisycon account. You will be redirected now."
            );
            window.location.href = connectData.data.authorization_url;
          }
        } else if (data?.data) {
          setCategories(["All", ...data.data.map((c: any) => c.name)]);
          // here you could also fetch media (stores) in the same way
        }
      } catch (err) {
        console.error("Category fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token, router]);

  // Mock for now until media endpoint works
  useEffect(() => {
    if (!token) return;
    setWebshops([
      {
        id: 1,
        name: "Samsung",
        logo: "https://avatar.iran.liara.run/public/45",
        cashback: "Up to 8%",
        description: "Latest smartphones, tablets, and electronics",
        category: "Electronics",
        rating: 4.8,
        featured: true,
      },
    ]);
  }, [token]);

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

  return (
    <div className="min-h-screen bg-gray-50 -mt-20">
      <Navbar />

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
          <h2 className="text-3xl font-bold text-gray-900 mb-8">All Stores</h2>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : filteredWebshops.length === 0 ? (
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

      <Footer />
    </div>
  );
};

export default CashbackHomepage;
