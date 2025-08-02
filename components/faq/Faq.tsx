"use client"

import { useState, useEffect } from "react"
import { Search, ChevronDown, ChevronUp, MessageCircle, HelpCircle, Settings, User, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { FaqChatModal } from "./FaqChatModal"

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

// Mock data
const mockCategories: FAQCategory[] = [
  {
    id: "general",
    name: "General",
    icon: HelpCircle,
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100",
    subcategories: [
      {
        id: "getting-started",
        name: "Getting Started",
        items: [
          {
            id: "about-profile",
            question: "About our profile?",
            answer: "You can view and edit your profile information in the 'My Account' section.",
            viewCount: 0,
            tags: ["profile", "account"]
          },
          {
            id: "how-to-use",
            question: "How to use the platform?",
            answer: "Our platform is designed to be intuitive. Navigate through the dashboard to access all features.",
            viewCount: 0,
            tags: ["getting started", "tutorial"]
          }
        ]
      },
      {
        id: "troubleshooting",
        name: "Troubleshooting",
        items: [
          {
            id: "forgot-password",
            question: "I forgot my password",
            answer: "Click on 'Forgot Password' on the login page to reset your password.",
            viewCount: 0,
            tags: ["login", "password", "security"]
          }
        ]
      }
    ]
  },
  {
    id: "account",
    name: "Account",
    icon: User,
    color: "text-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-100",
    subcategories: [
      {
        id: "settings",
        name: "Account Settings",
        items: [
          {
            id: "update-email",
            question: "How to update my email?",
            answer: "Go to Account Settings > Email to update your email address.",
            viewCount: 0,
            tags: ["email", "settings"]
          },
          {
            id: "delete-account",
            question: "How to delete my account?",
            answer: "You can delete your account by going to Account Settings > Delete Account. Please note this action is irreversible.",
            viewCount: 0,
            tags: ["account", "deletion"]
          }
        ]
      }
    ]
  },
  {
    id: "security",
    name: "Security",
    icon: Lock,
    color: "text-green-600",
    bgColor: "bg-green-50 hover:bg-green-100",
    subcategories: [
      {
        id: "privacy",
        name: "Privacy",
        items: [
          {
            id: "data-protection",
            question: "How is my data protected?",
            answer: "We use industry-standard encryption and security measures to protect your data. All data is encrypted both in transit and at rest.",
            viewCount: 0,
            tags: ["security", "privacy", "data"]
          },
          {
            id: "two-factor",
            question: "How to enable two-factor authentication?",
            answer: "You can enable two-factor authentication in your Security Settings. We recommend using an authenticator app for better security.",
            viewCount: 0,
            tags: ["2fa", "security", "authentication"]
          }
        ]
      }
    ]
  },
  {
    id: "billing",
    name: "Billing",
    icon: MessageCircle,
    color: "text-amber-600",
    bgColor: "bg-amber-50 hover:bg-amber-100",
    subcategories: [
      {
        id: "payments",
        name: "Payments",
        items: [
          {
            id: "payment-methods",
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards, PayPal, and bank transfers.",
            viewCount: 0,
            tags: ["payments", "billing", "credit cards"]
          },
          {
            id: "refund-policy",
            question: "What is your refund policy?",
            answer: "We offer a 30-day money-back guarantee on all our plans. Contact our support team to request a refund.",
            viewCount: 0,
            tags: ["refunds", "billing", "policy"]
          }
        ]
      }
    ]
  }
]

export default function Faq() {
  // State
  const [categories, setCategories] = useState<FAQCategory[]>(mockCategories)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [filteredCategories, setFilteredCategories] = useState<FAQCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  
  // Chat modal state
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false)
  const [currentFaqId, setCurrentFaqId] = useState('')

  // Handle FAQ item click
  const handleFaqClick = (item: FAQItem) => {
    // Increment view count
    const updatedCategories = categories.map(category => ({
      ...category,
      subcategories: category.subcategories.map(subcategory => ({
        ...subcategory,
        items: subcategory.items.map(i => 
          i.id === item.id ? { ...i, viewCount: (i.viewCount || 0) + 1 } : i
        )
      }))
    }))
    
    setCategories(updatedCategories)
    setCurrentQuestion(item.question)
    setCurrentAnswer(item.answer || '')
    setCurrentFaqId(item.id)
    
    // If no answer, fetch from AI
    if (!item.answer) {
      setIsLoadingAnswer(true)
      fetch('/api/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: item.question, faqId: item.id })
      })
      .then(res => res.json())
      .then(data => {
        setCurrentAnswer(data.answer)
        // Update local state with the AI answer
        const updatedWithAnswer = categories.map(category => ({
          ...category,
          subcategories: category.subcategories.map(subcategory => ({
            ...subcategory,
            items: subcategory.items.map(i => 
              i.id === item.id ? { ...i, answer: data.answer } : i
            )
          }))
        }))
        setCategories(updatedWithAnswer)
      })
      .catch(console.error)
      .finally(() => setIsLoadingAnswer(false))
    }
    
    setIsChatModalOpen(true)
  }

  // Handle new question submission to AI
  const handleNewQuestion = async (question: string) => {
    setIsLoadingAnswer(true)
    try {
      const response = await fetch('/api/faq/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })
      
      if (!response.ok) throw new Error('Failed to get answer')
      
      const data = await response.json()
      setCurrentAnswer(data.answer)
      setCurrentQuestion(question)
      setCurrentFaqId(`temp-${Date.now()}`)
      
      // Add to recent questions if needed
      return data.answer
    } catch (error) {
      console.error('Error asking question:', error)
      setCurrentAnswer('Sorry, I encountered an error while processing your question. Please try again.')
      throw error
    } finally {
      setIsLoadingAnswer(false)
    }
  }

  // Handle feedback submission
  const handleFeedback = (isHelpful: boolean) => {
    fetch('/api/faq', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        faqId: currentFaqId,
        question: currentQuestion,
        answer: currentAnswer,
        isHelpful
      })
    }).catch(console.error)
  }

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
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No results found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
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
                    <div key={subcategory.id} className="p-4 border-t">
                      <h3 className="font-medium text-gray-700 mb-3 text-sm uppercase tracking-wider">
                        {subcategory.name}
                      </h3>
                      
                      <div className="space-y-3">
                        {subcategory.items.map((item) => (
                          <div 
                            key={item.id} 
                            className="border rounded-lg overflow-hidden transition-shadow hover:shadow-md"
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
                              <div className="p-4 pt-0 border-t">
                                <div className="text-gray-600 mb-4 prose max-w-none">
                                  {item.answer || "No answer available. Click 'Ask AI' to generate one."}
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
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleFaqClick(item)
                                    }}
                                    className={`text-sm font-medium ${category.color} hover:underline flex items-center gap-1`}
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                    {item.answer ? 'Ask AI for more details' : 'Ask AI'}
                                  </button>
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

      {/* Chat Modal */}
      <FaqChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        question={currentQuestion}
        answer={currentAnswer}
        isLoading={isLoadingAnswer}
        onFeedback={handleFeedback}
        onNewQuestion={handleNewQuestion}
      />
    </div>
  )
}
