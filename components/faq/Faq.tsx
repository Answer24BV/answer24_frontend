"use client"

import { useState, useEffect } from "react"
import { Search, ChevronDown, ChevronUp, MessageCircle, HelpCircle, Settings, User, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { getFAQs, FAQCategory as APIFAQCategory } from "@/app/[locale]/actions/faq";

// Types
type FAQItem = {
  id: string
  question: string
  answer: string
  viewCount: number
  tags?: string[]
}

type FAQSubcategory = {
  id: string
  name: string
  items: FAQItem[]
}

type FAQCategory = {
  id: string
  name: string
  icon: React.ElementType
  color: string
  bgColor: string
  subcategories: FAQSubcategory[]
}

export default function Faq() {
  // State
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [filteredCategories, setFilteredCategories] = useState<FAQCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const data = await getFAQs();
        console.log("FAQ data received:", data);
        
        if (!data || !Array.isArray(data)) {
          throw new Error("Invalid FAQ data received from server");
        }
        
        const transformedData: FAQCategory[] = data.map(category => ({
          ...category,
          icon: HelpCircle, // You can map icons based on category name or add it to the API
          color: "text-blue-600",
          bgColor: "bg-blue-50 hover:bg-blue-100",
        }));
        setCategories(transformedData);
        setFilteredCategories(transformedData);
      } catch (err) {
        console.error("FAQ fetch error:", err);
        
        // Fallback to mock data when API fails
        console.log("Using fallback FAQ data due to API error");
        const mockData: FAQCategory[] = [
          {
            id: "general",
            name: "General Questions",
            icon: HelpCircle,
            color: "text-blue-600",
            bgColor: "bg-blue-50 hover:bg-blue-100",
            subcategories: [
              {
                id: "getting-started",
                name: "Getting Started",
                items: [
                  {
                    id: "what-is-answer24",
                    question: "What is Answer24?",
                    answer: "Answer24 is an AI-powered platform that helps businesses optimize their Google Ads campaigns and improve their online presence through advanced analytics and automation.",
                    viewCount: 1250,
                    tags: ["platform", "overview", "introduction"]
                  },
                  {
                    id: "how-to-signup",
                    question: "How do I sign up for Answer24?",
                    answer: "You can sign up by clicking the 'Sign Up' button on our homepage, filling out the registration form, and verifying your email address. The process takes just a few minutes.",
                    viewCount: 890,
                    tags: ["registration", "signup", "getting-started"]
                  }
                ]
              }
            ]
          },
          {
            id: "technical",
            name: "Technical Support",
            icon: Settings,
            color: "text-green-600",
            bgColor: "bg-green-50 hover:bg-green-100",
            subcategories: [
              {
                id: "api-integration",
                name: "API & Integration",
                items: [
                  {
                    id: "api-documentation",
                    question: "Where can I find API documentation?",
                    answer: "Our complete API documentation is available at api.answer24.nl/docs. It includes endpoints, authentication methods, and code examples in multiple programming languages.",
                    viewCount: 567,
                    tags: ["api", "documentation", "integration"]
                  }
                ]
              }
            ]
          }
        ];
        
        setCategories(mockData);
        setFilteredCategories(mockData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  // Filter FAQs based on search query and selected category
  useEffect(() => {
    let filtered = [...categories]

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(cat => cat.id === selectedCategory)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered
        .map(category => {
          const subcategories = category.subcategories
            .map(subcategory => {
              const items = subcategory.items.filter(item => 
                item.question.toLowerCase().includes(query) ||
                item.answer?.toLowerCase().includes(query) ||
                item.tags?.some(tag => tag.toLowerCase().includes(query))
              )
              return items.length > 0 ? { ...subcategory, items } : null
            })
            .filter(Boolean) as FAQSubcategory[]
          
          return subcategories.length > 0 ? { ...category, subcategories } : null
        })
        .filter(Boolean) as FAQCategory[]
    }

    // Expand all categories that have results
    const newExpandedCategories = { ...expandedCategories }
    filtered.forEach(cat => {
      if (!newExpandedCategories[cat.id]) {
        newExpandedCategories[cat.id] = true
      }
    })
    setExpandedCategories(newExpandedCategories)

    setFilteredCategories(filtered)
  }, [searchQuery, categories, selectedCategory])

  // Initialize filtered categories and expand all by default
  useEffect(() => {
    const initialExpanded = categories.reduce((acc, cat) => {
      acc[cat.id] = true
      return acc
    }, {} as Record<string, boolean>)
    setExpandedCategories(initialExpanded)
    setFilteredCategories(categories)
  }, [categories])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-red-700 mb-2">Error</h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-600">Find answers to common questions about our platform</p>
      </div>
      
      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${!selectedCategory 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All Categories
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2
              ${selectedCategory === category.id 
                ? `${category.color.replace('text-', 'bg-')} text-white` 
                : `${category.bgColor} ${category.color}`}`}
          >
            <category.icon className="w-4 h-4" />
            {category.name}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 max-w-2xl mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search questions, answers, or keywords..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* FAQ Categories */}
      <div className="space-y-6">
        {filteredCategories.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No results found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className={`w-full flex items-center justify-between p-4 text-left ${category.bgColor} transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <category.icon className={`w-5 h-5 ${category.color}`} />
                  <h2 className={`text-lg font-semibold ${category.color}`}>{category.name}</h2>
                  <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-80 text-gray-700">
                    {category.subcategories.reduce((count, sub) => count + sub.items.length, 0)} questions
                  </span>
                </div>
                {expandedCategories[category.id] ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {expandedCategories[category.id] && (
                <div className="divide-y">
                  {category.subcategories.map((subcategory) => (
                    <div key={subcategory.id} className="p-4">
                      <h3 className="font-medium text-gray-700 mb-3 text-sm uppercase tracking-wider">
                        {subcategory.name}
                      </h3>
                      
                      <div className="space-y-3">
                        {subcategory.items.map((item) => (
                          <div 
                            key={item.id} 
                            className="rounded-lg overflow-hidden transition-shadow hover:shadow-md"
                          >
                            <button
                              className="w-full flex justify-between items-start p-4 text-left hover:bg-gray-50 transition-colors"
                              onClick={() => toggleItem(item.id)}
                            >
                              <span className="font-medium text-gray-900 text-left">{item.question}</span>
                              {expandedItems[item.id] ? (
                                <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0 ml-2" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0 ml-2" />
                              )}
                            </button>
                            
                            {expandedItems[item.id] && (
                              <div className="p-4 pt-0">
                                <div className="text-gray-600 mb-4 prose max-w-none">
                                  {item.answer || "No answer available."}
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                                  <div className="flex flex-wrap gap-2">
                                    {item.tags?.map(tag => (
                                      <span 
                                        key={tag} 
                                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}