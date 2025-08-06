'use client';
import React, { useState } from 'react';
import { Search, Star, TrendingUp, Gift, Users, Shield, ChevronRight, Filter } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useRouter } from 'next/navigation';

const CashbackHomepage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const categories = [
    'All', 'Electronics', 'Fashion', 'Travel', 'Food & Drinks', 'Home & Garden', 'Sports', 'Beauty'
  ];

  const webshops = [
    {
      id: 1,
      name: 'Samsung',
      logo: 'https://avatar.iran.liara.run/public/45',
      cashback: 'Up to 8%',
      description: 'Latest smartphones, tablets, and electronics',
      category: 'Electronics',
      rating: 4.8,
      featured: true
    },
    {
      id: 2,
      name: 'Nike',
      logo: 'https://avatar.iran.liara.run/public/46',
      cashback: '€12.50',
      description: 'Premium sportswear and athletic gear',
      category: 'Fashion',
      rating: 4.7,
      featured: true
    },
    {
      id: 3,
      name: 'Booking.com',
      logo: 'https://avatar.iran.liara.run/public/47',
      cashback: 'Up to 6%',
      description: 'Hotels, flights, and travel deals worldwide',
      category: 'Travel',
      rating: 4.6,
      featured: false
    },
    {
      id: 4,
      name: 'H&M',
      logo: 'https://avatar.iran.liara.run/public/48',
      cashback: 'Up to 5%',
      description: 'Trendy fashion for men, women & kids',
      category: 'Fashion',
      rating: 4.5,
      featured: false
    },
    {
      id: 5,
      name: 'Apple',
      logo: 'https://avatar.iran.liara.run/public/49',
      cashback: 'Up to 3%',
      description: 'iPhone, iPad, Mac, and accessories',
      category: 'Electronics',
      rating: 4.9,
      featured: true
    },
    {
      id: 6,
      name: 'IKEA',
      logo: 'https://avatar.iran.liara.run/public/50',
      cashback: '€8.00',
      description: 'Furniture and home decoration',
      category: 'Home & Garden',
      rating: 4.4,
      featured: false
    }
  ];

  const filteredWebshops = webshops.filter(shop => {
    const matchesCategory = activeCategory === 'All' || shop.category === activeCategory;
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleShopClick = (shopName: string) => {
    // Navigate to shop detail page
    router.push(`/nl/webshop/${shopName}`);
    console.log(`Navigate to shop ${shopName}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 -mt-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">CashFlow</span>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
                <a href="#all-stores" className="text-gray-700 hover:text-blue-600 font-medium">Webshops</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => router.push('/nl/login')} className="text-gray-700 hover:text-blue-600 font-medium">Login</button>
              <button onClick={() => router.push('/nl/signup')} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Earn Money While You
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600"> Shop</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Get cashback from thousands of your favorite stores. Shop normally, earn automatically.
              It's that simple.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
                Start Earning Now
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Partner Stores</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">€2M+</div>
                <div className="text-gray-600">Cashback Paid</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
                <div className="text-gray-600">Happy Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

            {/* Category Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto">
              <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${activeCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stores */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Cashback Stores
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the best deals and highest cashback rates from top brands
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebshops.filter(shop => shop.featured).map((shop) => (
              <Link key={shop.id} href={`/webshop/${shop.name}`}>
                <div

                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleShopClick(shop.name)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <img
                      src={shop.logo}
                      alt={shop.name}
                      className="w-16 h-8 object-contain"
                    />
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {shop.cashback} Cashback
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{shop.name}</h3>
                  <p className="text-gray-600 mb-4">{shop.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{shop.rating}</span>
                    </div>
                    <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Stores */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">All Stores</h2>

          <div id="all-stores" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    <h3 className="font-semibold text-gray-900">{shop.name}</h3>
                    <div className="text-green-600 font-medium text-sm">{shop.cashback}</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">{shop.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">{shop.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {shop.category}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredWebshops.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No stores found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Earning Cashback?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of smart shoppers who earn money back on every purchase.
            Sign up today and start saving immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all">
              Create Free Account
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                <Gift className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold">CashFlow</span>
            </div>
            <p className="text-sm">&copy; 2025 CashFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CashbackHomepage;