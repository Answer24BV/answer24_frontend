'use client';
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  Star, 
  Shield, 
  Clock, 
  TrendingUp, 
  Users, 
  Gift,
  ChevronRight,
  Heart,
  Share2,
  Info
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const WebshopDetailPage = () => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  
  // Mock data - in real app this would come from props or API
  const webshop = {
    id: 1,
    name: 'Samsung',
    logo: 'https://via.placeholder.com/120x60/1f2937/ffffff?text=Samsung',
    cashback: 'Up to 8%',
    cashbackAmount: '€8.00',
    description: 'Samsung is a leading global technology company offering innovative smartphones, tablets, laptops, TVs, home appliances, and more. Shop the latest Galaxy devices, QLED TVs, and smart home solutions with cutting-edge technology.',
    category: 'Electronics',
    rating: 4.8,
    reviewCount: 2847,
    avgProcessingTime: '24-48 hours',
    trustScore: 98,
    founded: '1938',
    website: 'samsung.com',
    popularProducts: ['Galaxy Smartphones', 'QLED TVs', 'Galaxy Tablets', 'Home Appliances'],
    cashbackTerms: 'Cashback applies to all purchases. Special offers and gift cards excluded. Cashback credited within 48 hours.',
    trackingUrl: 'https://example.com/track',
    similarShops: [
      { name: 'Apple', cashback: 'Up to 3%', logo: 'https://via.placeholder.com/60x30/1f2937/ffffff?text=Apple' },
      { name: 'LG', cashback: 'Up to 5%', logo: 'https://via.placeholder.com/60x30/1f2937/ffffff?text=LG' },
      { name: 'Sony', cashback: 'Up to 6%', logo: 'https://via.placeholder.com/60x30/1f2937/ffffff?text=Sony' }
    ]
  };

  const reviews = [
    {
      id: 1,
      user: 'Mike J.',
      rating: 5,
      date: '2 days ago',
      comment: 'Great cashback rate and fast processing. Bought a new Galaxy phone and got my cashback within 24 hours!'
    },
    {
      id: 2,
      user: 'Sarah L.',
      rating: 5,
      date: '1 week ago',
      comment: 'Excellent service. The tracking works perfectly and cashback always arrives on time.'
    },
    {
      id: 3,
      user: 'David R.',
      rating: 4,
      date: '2 weeks ago',
      comment: 'Good cashback rates. Only minor issue was a slight delay in processing but customer service was helpful.'
    }
  ];

  const handleGoToShop = () => {
    // In real app, USER_ID would come from auth context
    const userId = 123; // Mock user ID
    const trackingUrl = `${webshop.trackingUrl}?user_id=${userId}`;
    console.log('Redirecting to:', trackingUrl);
    window.open(trackingUrl, '_blank');
  };

  const handleBack = () => {
    console.log('Navigate back to homepage');
    router.back();
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
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-blue-600 font-medium">Login</button>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2 text-sm">
            <button 
              onClick={handleBack}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Stores</span>
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{webshop.category}</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{webshop.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Store Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex items-start space-x-6">
                  <img 
                    src={webshop.logo} 
                    alt={webshop.name}
                    className="w-24 h-12 object-contain bg-gray-50 rounded-lg p-2"
                  />
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">{webshop.name}</h1>
                      <div className="flex items-center space-x-1">
                        <Shield className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-green-600">Verified</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="font-semibold text-gray-900">{webshop.rating}</span>
                        <span className="text-gray-600">({webshop.reviewCount.toLocaleString()} reviews)</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">{webshop.category}</span>
                    </div>
                    <p className="text-gray-600 max-w-xl leading-relaxed">{webshop.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-3 rounded-full transition-all ${
                      isLiked 
                        ? 'bg-red-50 text-red-500' 
                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Cashback Info */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center md:text-left">
                  <div className="text-4xl font-bold text-green-600 mb-2">{webshop.cashback}</div>
                  <div className="text-green-700 font-medium">Cashback Rate</div>
                  <div className="text-sm text-green-600 mt-1">Up to {webshop.cashbackAmount} per purchase</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-gray-900 font-semibold">{webshop.avgProcessingTime}</div>
                  <div className="text-gray-600 text-sm">Average Processing</div>
                </div>
                <div className="text-center md:text-right">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{webshop.trustScore}%</div>
                  <div className="text-purple-700 font-medium">Trust Score</div>
                  <div className="text-sm text-purple-600 mt-1">Based on user reviews</div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-green-200">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-700">{webshop.cashbackTerms}</p>
                </div>
              </div>
            </div>

            {/* Popular Products */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Products</h2>
              <div className="grid grid-cols-2 gap-4">
                {webshop.popularProducts.map((product, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-gray-900">{product}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900">{webshop.rating}</span>
                  <span className="text-gray-600">({webshop.reviewCount.toLocaleString()})</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-gray-900">{review.user}</span>
                          <div className="flex items-center">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                  View All Reviews
                </button>
              </div>
            </div>

            {/* Similar Shops */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Stores</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {webshop.similarShops.map((shop, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-center space-x-3 mb-3">
                      <img src={shop.logo} alt={shop.name} className="w-12 h-6 object-contain" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{shop.name}</h3>
                        <div className="text-sm text-green-600 font-medium">{shop.cashback}</div>
                      </div>
                    </div>
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                      View Store →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Start Earning Cashback</h3>
                <p className="text-gray-600 text-sm">Click the button below to visit {webshop.name} and earn {webshop.cashback} cashback on your purchase.</p>
              </div>
              
              <button 
                onClick={handleGoToShop}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Go to {webshop.name}</span>
                <ExternalLink className="w-5 h-5" />
              </button>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-yellow-700">
                    <strong>Important:</strong> Make sure to complete your purchase in the same browser session to ensure cashback tracking.
                  </p>
                </div>
              </div>
            </div>

            {/* Store Stats */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Store Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Founded</span>
                  <span className="font-semibold text-gray-900">{webshop.founded}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Website</span>
                  <span className="font-semibold text-blue-600">{webshop.website}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold text-gray-900">{webshop.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Reviews</span>
                  <span className="font-semibold text-gray-900">{webshop.reviewCount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Why Choose Us?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Secure Tracking</div>
                    <div className="text-sm text-gray-600">Your purchases are securely tracked</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Fast Processing</div>
                    <div className="text-sm text-gray-600">Cashback credited within 48 hours</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Trusted by Thousands</div>
                    <div className="text-sm text-gray-600">Join 50K+ happy customers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
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

export default WebshopDetailPage;