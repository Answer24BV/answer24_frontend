"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import FAQIMAGE from "@/public/image.png"
import Image from "next/image"

interface FAQItem {
    question: string
    answer: string
}

interface FAQCategory {
    id: string
    name: string
    items: FAQItem[]
}

const Faq = () => {
    const [categories] = useState<FAQCategory[]>(() => [
        {
            id: "general",
            name: "General",
            items: [
                {
                    question: "About our profile?",
                    answer: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod",
                },
                {
                    question: "News and topics?",
                    answer: "We regularly update our news section with the latest industry trends and company announcements.",
                },
                {
                    question: "How to use?",
                    answer: "Our platform is designed to be intuitive. Navigate through the dashboard to access all features.",
                },
                {
                    question: "How do I update my account information?",
                    answer: 'You can update your account information in the "My Account" section.',
                },
                {
                    question: "How to use?",
                    answer: "Our platform is designed to be intuitive. Navigate through the dashboard to access all features.",
                },
                {
                    question: "How do I update my account information?",
                    answer: 'You can update your account information in the "My Account" section.',
                },
                
            ],
        },
        {
            id: "account",
            name: "Account",
            items: [
                {
                    question: "How to use?",
                    answer: "Our platform is designed to be intuitive. Navigate through the dashboard to access all features.",
                },
                {
                    question: "How do I update my account information?",
                    answer: 'You can update your account information in the "My Account" section.',
                },
            ],
        },
        {
            id: "payment",
            name: "Payment",
            items: [
                {
                    question: "How to use?",
                    answer: "Our platform is designed to be intuitive. Navigate through the dashboard to access all features.",
                },
                {
                    question: "How do I update my account information?",
                    answer: 'You can update your account information in the "My Account" section.',
                },

            ],
        },
        {
            id: "shipping",
            name: "Shipping",
            items: [
                {
                    question: "What are your shipping options?",
                    answer: "Standard (3-5 business days) and express (1-2 business days) shipping.",
                },
                {
                    question: "Do you ship internationally?",
                    answer: "Yes, we ship worldwide. Shipping costs and times vary by location.",
                },
            ],
        },
    ])

    const [activeCategory, setActiveCategory] = useState<string | null>(categories[0]?.id || null)
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
    const [searchQuery, setSearchQuery] = useState("")
    const [filteredItems, setFilteredItems] = useState<Array<{ category: FAQCategory; itemIndex: number }>>([])

    const toggleItem = (itemId: string) => {
        setOpenItems((prev) => ({
            ...prev,
            [itemId]: !prev[itemId],
        }))
    }

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredItems([])
            return
        }

        const query = searchQuery.toLowerCase()
        const results: Array<{ category: FAQCategory; itemIndex: number }> = []

        categories.forEach((category) => {
            category.items.forEach((item, index) => {
                if (item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query)) {
                    results.push({ category, itemIndex: index })
                }
            })
        })

        setFilteredItems(results)
    }, [searchQuery, categories])

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <h2 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>

                    <div className="relative mt-6 mb-8">
                        <div className="relative rounded-full overflow-hidden bg-muted/30 flex items-center">
                            <Input
                                type="text"
                                placeholder="Search question here"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-4 pr-10 py-3 w-full border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                            />
                            <Search className="absolute right-4 h-5 w-5 text-muted-foreground" />
                        </div>
                    </div>

                    <div>
                        {!searchQuery.trim() && (
                            <div className="flex flex-wrap gap-2 mt-8">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setActiveCategory(category.id)}
                                        className={cn(
                                            "px-4 py-2 text-sm font-medium transition-colors",
                                            activeCategory === category.id
                                                ? "text-primary underline underline-offset-4"
                                                : "text-muted-foreground hover:text-foreground",
                                        )}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="space-y-4">
                        {searchQuery.trim() ? (
                            filteredItems.length > 0 ? (
                                filteredItems.map(({ category, itemIndex }, resultIndex) => {
                                    const item = category.items[itemIndex]
                                    const itemId = `search-${resultIndex}`
                                    const isOpen = openItems[itemId]

                                    return (
                                        <div key={itemId} className="border-b border-muted last:border-b-0">
                                            <button
                                                onClick={() => toggleItem(itemId)}
                                                className="cursor-pointer w-full flex items-center justify-between py-4 text-left"
                                            >
                                                <h3 className="font-medium text-foreground">{item.question}</h3>
                                                {isOpen ? (
                                                    <Minus className="h-5 w-5 text-muted-foreground" />
                                                ) : (
                                                    <Plus className="h-5 w-5 text-muted-foreground" />
                                                )}
                                            </button>
                                            <div
                                                className={cn(
                                                    "overflow-hidden transition-all duration-300",
                                                    isOpen ? "pb-4 max-h-96" : "max-h-0",
                                                )}
                                            >
                                                <p className="text-muted-foreground">{item.answer}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                            )
                        ) : (
                            categories.map((category) => (
                                <div key={category.id} className={activeCategory !== category.id ? "hidden" : ""}>
                                    {category.items.map((item, index) => {
                                        const itemId = `${category.id}-${index}`
                                        const isOpen = openItems[itemId]

                                        return (
                                            <div key={itemId} className="border-b border-muted last:border-b-0">
                                                <button
                                                    onClick={() => toggleItem(itemId)}
                                                    className="w-full flex items-center justify-between py-4 text-left"
                                                >
                                                    <h3 className="font-medium text-foreground">{item.question}</h3>
                                                    {isOpen ? (
                                                        <Minus className="h-5 w-5 text-muted-foreground" />
                                                    ) : (
                                                        <Plus className="h-5 w-5 text-muted-foreground" />
                                                    )}
                                                </button>
                                                <div
                                                    className={cn(
                                                        "overflow-hidden transition-all duration-300",
                                                        isOpen ? "pb-4 max-h-96" : "max-h-0",
                                                    )}
                                                >
                                                    <p className="text-muted-foreground">{item.answer}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="hidden md:flex justify-center">
                    <Image src={FAQIMAGE} alt="FAQ illustration" width={400} height={400} className="max-w-full h-auto" />
                </div>
            </div>
        </div>
    )
}

export default Faq
