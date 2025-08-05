'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, X, ChevronDown, ChevronUp, GripVertical, HelpCircle, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
// Slide-in panel components
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog'

// Types
type FAQItem = {
  id: string
  question: string
  answer: string
  category: string
  subcategory: string
  tags?: string[]
  viewCount?: number
  createdAt?: string
  updatedAt?: string
}

type FAQFormData = {
  question: string
  answer: string
  category: string
  subcategory: string
  tags: string[]
  [key: string]: string | string[] // Index signature for type safety
}

// Mock data fetcher (replace with actual API calls)
const fetchFAQs = async (): Promise<FAQItem[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  return [
    {
      id: '1',
      question: 'How do I reset my password?',
      answer: 'You can reset your password by clicking on "Forgot Password" on the login page.',
      category: 'Account',
      subcategory: 'Security',
      tags: ['password', 'login', 'account'],
      viewCount: 42,
      createdAt: '2023-01-15T10:30:00Z',
      updatedAt: '2023-01-15T10:30:00Z'
    },
    // Add more mock data as needed
  ]
}

export function FaqAdmin() {
  const [searchTerm, setSearchTerm] = useState('')
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [formData, setFormData] = useState<FAQFormData>({
    question: '',
    answer: '',
    category: '',
    subcategory: '',
    tags: []
  })

  // Get unique categories for tabs
  const categories = ['all', ...new Set(faqs.map(faq => faq.category).filter(Boolean))]

  // Fetch FAQs
  useEffect(() => {
    const loadFAQs = async () => {
      try {
        setIsLoading(true)
        const data = await fetchFAQs()
        console.log(data)
        setFaqs(data)
      } catch (error) {
        console.error('Failed to load FAQs:', error)
        toast.error('Failed to load FAQs')
      } finally {
        setIsLoading(false)
      }
    }

    loadFAQs()
  }, [])

  // Filter FAQs based on search and active tab
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTab = activeTab === 'all' || faq.category === activeTab;
    
    return matchesSearch && matchesTab;
  })

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle tag removal
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  // Handle tag input
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault()
      const newTag = e.currentTarget.value.trim()
      if (!formData.tags?.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...(prev.tags || []), newTag]
        }))
      }
      e.currentTarget.value = ''
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (editingFaq) {
        // Update existing FAQ
        setFaqs(faqs.map(f => 
          f.id === editingFaq.id 
            ? { 
                ...f, 
                ...formData, 
                updatedAt: new Date().toISOString(),
                // Ensure we don't override these fields
                id: f.id,
                viewCount: f.viewCount,
                createdAt: f.createdAt
              } 
            : f
        ))
        toast.success('FAQ updated successfully')
      } else {
        // Add new FAQ
        const newFaq: FAQItem = {
          id: Math.random().toString(36).substring(2, 9),
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          viewCount: 0
        }
        setFaqs([newFaq, ...faqs])
        toast.success('FAQ created successfully')
      }
      
      setIsPanelOpen(false)
    } catch (error) {
      console.error('Error saving FAQ:', error)
      toast.error('Failed to save FAQ. Please try again.')
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!editingFaq) return
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setFaqs(faqs.filter(faq => faq.id !== editingFaq.id))
      setIsDeleteDialogOpen(false)
      setIsPanelOpen(false)
      toast.success('FAQ deleted successfully')
    } catch (error) {
      console.error('Error deleting FAQ:', error)
      toast.error('Failed to delete FAQ. Please try again.')
    }
  }

  // Open edit dialog
  const openEditPanel = (faq: FAQItem) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      subcategory: faq.subcategory || '',
      tags: faq.tags || []
    })
    setEditingFaq(faq)
    setIsPanelOpen(true)
  }

  // Open create dialog
  const openCreatePanel = () => {
    setFormData({
      question: '',
      answer: '',
      category: '',
      subcategory: '',
      tags: []
    })
    setEditingFaq(null)
    setIsPanelOpen(true)
  }

  // Close dialog
  const closeDialog = () => {
    setIsPanelOpen(false)
    setEditingFaq(null)
  }

  return (
    <div className="space-y-6">
      {/* Header with search and create button */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 p-8 shadow-sm">
        <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-indigo-100/50"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">FAQ Management</h1>
              <p className="mt-3 text-lg text-gray-600">Easily manage and organize your frequently asked questions</p>
            </div>
            <div className="flex-shrink-0">
              <Button 
                onClick={openCreatePanel} 
                className="group relative inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-blue-500 transition-all duration-200 hover:shadow-md"
              >
                <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                Create New FAQ
              </Button>
            </div>
          </div>
          
          <div className="mt-8 max-w-2xl">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                className="block w-full rounded-xl border-0 bg-white/80 py-3 pl-12 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 backdrop-blur-sm"
                placeholder="Search questions, answers, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 -mx-2 px-2">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={cn(
                'relative px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap',
                activeTab === category
                  ? 'text-indigo-700 bg-white shadow-sm ring-1 ring-gray-200/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              )}
            >
              {activeTab === category && (
                <span className="absolute inset-x-1 -bottom-px h-0.5 bg-indigo-600 rounded-full"></span>
              )}
              {category.charAt(0).toUpperCase() + category.slice(1)}
              {category !== 'all' && (
                <span className="ml-1.5 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                  {faqs.filter(f => f.category === category).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="space-y-3">
                  <div className="h-5 bg-gray-100 rounded-lg w-3/4 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-3.5 bg-gray-100 rounded w-full animate-pulse"></div>
                    <div className="h-3.5 bg-gray-100 rounded w-5/6 animate-pulse"></div>
                    <div className="h-3.5 bg-gray-100 rounded w-2/3 animate-pulse"></div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <div className="h-5 w-16 bg-gray-100 rounded-full animate-pulse"></div>
                    <div className="h-5 w-20 bg-gray-100 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
              <HelpCircle className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {searchTerm ? 'No FAQs found' : 'No FAQs yet'}
            </h3>
            <p className="mt-2 text-gray-500">
              {searchTerm 
                ? 'We couldn\'t find any FAQs matching your search. Try different keywords.'
                : 'Get started by creating your first FAQ.'}
            </p>
            <div className="mt-6">
              <Button 
                onClick={searchTerm ? () => setSearchTerm('') : openCreatePanel}
                className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                {searchTerm ? 'Clear search' : 'New FAQ'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFaqs.map((faq) => (
              <div 
                key={faq.id} 
                className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {faq.answer}
                    </p>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                        {faq.category || 'General'}
                      </span>
                      {faq.subcategory && (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                          {faq.subcategory}
                        </span>
                      )}
                      {faq.tags?.slice(0, 2).map((tag) => (
                        <span 
                          key={tag}
                          className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                      {faq.tags && faq.tags.length > 2 && (
                        <span className="inline-flex h-5 w-16 bg-gray-50 rounded-full px-2 text-xs font-medium text-gray-500">
                          +{faq.tags.length - 2}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                        <span>Updated {new Date(faq.updatedAt || faq.createdAt || '').toLocaleDateString()}</span>
                        {faq.viewCount !== undefined && faq.viewCount > 0 && (
                          <span className="flex items-center">
                            <span className="mx-1.5">•</span>
                            <Eye className="h-3.5 w-3.5 mr-0.5 text-gray-400" />
                            <span>{faq.viewCount}</span>
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditPanel(faq);
                          }}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span className="sr-only">Edit</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingFaq(faq);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="sr-only">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Slide-in Edit Panel */}
      {/* Slide-in Panel */}
      <div className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ease-in-out ${isPanelOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
        {/* Overlay - Removed blur effect */}
        <div 
          className={`absolute inset-0 bg-gray-900/20 transition-opacity ${isPanelOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsPanelOpen(false)}
        />
        
        {/* Panel with enhanced styling */}
        <div className={`fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16 transform transition-all duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="w-screen max-w-md">
            <div className="flex h-full flex-col bg-white shadow-2xl border-l border-gray-100">
              {/* Header with gradient background */}
              <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {editingFaq ? 'Edit FAQ' : 'Create New FAQ'}
                  </h2>
                  <button
                    type="button"
                    className="rounded-full p-1.5 hover:bg-white/10 transition-colors duration-200"
                    onClick={() => setIsPanelOpen(false)}
                  >
                    <span className="sr-only">Close panel</span>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Form with better spacing */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                <div className="space-y-6 p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="question" className="block text-sm font-medium text-gray-700">
                        Question
                      </label>
                      <Input
                        id="question"
                        name="question"
                        value={formData.question}
                        onChange={handleInputChange}
                        placeholder="Enter the question"
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
                        Answer
                      </label>
                      <Textarea
                        id="answer"
                        name="answer"
                        value={formData.answer}
                        onChange={handleInputChange}
                        placeholder="Enter the answer"
                        rows={6}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                          Category
                        </label>
                        <div className="relative mt-1 rounded-md shadow-sm">
                          <Input
                            id="category"
                            name="category"
                            placeholder="e.g. Billing"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                          Subcategory (optional)
                        </label>
                        <Input
                          id="subcategory"
                          name="subcategory"
                          placeholder="e.g. Invoices"
                          value={formData.subcategory}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Tags
                      </label>
                      <div className="mt-1 flex flex-wrap gap-2 rounded-lg border border-gray-300 px-3 py-2 min-h-[42px]">
                        {formData.tags?.map((tag, index) => (
                          <div key={index} className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-sm font-medium text-indigo-800">
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newTags = [...(formData.tags || [])]
                                newTags.splice(index, 1)
                                setFormData({ ...formData, tags: newTags })
                              }}
                              className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-indigo-500 hover:bg-indigo-200 hover:text-indigo-600"
                            >
                              <span className="sr-only">Remove tag</span>
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        <input
                          type="text"
                          placeholder={formData.tags?.length ? 'Add another tag...' : 'Type and press Enter to add tags...'}
                          className="flex-1 border-0 p-0 text-sm text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                              e.preventDefault()
                              const newTag = e.currentTarget.value.trim()
                              if (!formData.tags?.includes(newTag)) {
                                setFormData({
                                  ...formData,
                                  tags: [...(formData.tags || []), newTag]
                                })
                              }
                              e.currentTarget.value = ''
                            }
                          }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {formData.tags?.length ? `${formData.tags.length} tag${formData.tags.length !== 1 ? 's' : ''} added` : 'Press Enter to add a tag'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sticky Footer */}
                <div className="sticky bottom-0 border-t border-gray-200 bg-white/95 backdrop-blur-sm p-4">
                  <div className="flex justify-end space-x-3">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setIsPanelOpen(false)}
                      className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 border-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
                    >
                      {editingFaq ? 'Save Changes' : 'Create FAQ'}
                      <span className="ml-2">
                        {editingFaq ? '✓' : '+'}
                      </span>
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-xl">
          <div className="flex flex-col items-center text-center p-4">
            <div className="p-3 rounded-full bg-destructive/10 mb-4">
              <Trash2 className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">Delete FAQ?</AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                Are you sure you want to delete "{editingFaq?.question}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter className="sm:justify-center gap-3 sm:gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete FAQ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
