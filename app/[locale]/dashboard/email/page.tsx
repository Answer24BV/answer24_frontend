"use client"

import { useState } from "react"
import type { mailData } from "@/lib/data"
import { Sidebar } from "@/components/dashboard/email/Sidebar"
import { MailList } from "@/components/dashboard/email/EmailList"
import { MailDetail } from "@/components/dashboard/email/EmailDetails"
import { BottomTabs } from "@/components/dashboard/email/BottomTabs"

export default function EmailDashboard() {
  const [selectedMail, setSelectedMail] = useState<(typeof mailData)[0] | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>("unassigned") // Default to 'Unassigned'

  const handleSelectMail = (mail: (typeof mailData)[0]) => {
    setSelectedMail(mail)
  }

  const handleBackToList = () => {
    setSelectedMail(null)
  }

  const handleSelectCategory = (category: string | null) => {
    setSelectedCategory(category)
    setSelectedMail(null) // Reset selected mail when category changes
  }

  return (
    <div className="flex h-screen w-full flex-col bg-page-background">
      <main className="flex flex-1 overflow-hidden pb-16 md:pb-0">
        {/* Desktop Sidebar */}
        <Sidebar selectedCategory={selectedCategory} onSelectCategory={handleSelectCategory} />

        {/* Main Content Area */}
        {selectedMail ? (
          <MailDetail mail={selectedMail} onBack={handleBackToList} />
        ) : (
          <MailList onSelectMail={handleSelectMail} filterCategory={selectedCategory} />
        )}
      </main>

      {/* Mobile Bottom Tabs */}
      <BottomTabs selectedCategory={selectedCategory} onSelectCategory={handleSelectCategory} />
    </div>
  )
}
