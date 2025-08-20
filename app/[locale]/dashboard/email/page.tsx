"use client";

import { useState } from "react";
import type { mailData } from "@/lib/data";
import { Sidebar } from "@/components/dashboard/email/Sidebar";
import { MailList } from "@/components/dashboard/email/EmailList";
import { MailDetail } from "@/components/dashboard/email/EmailDetails";
import { BottomTabs } from "@/components/dashboard/email/BottomTabs";

export default function EmailDashboard() {
  const [selectedMail, setSelectedMail] = useState<(typeof mailData)[0] | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "unassigned"
  );

  const handleSelectMail = (mail: (typeof mailData)[0]) => {
    setSelectedMail(mail);
  };

  const handleBackToList = () => {
    setSelectedMail(null);
  };

  const handleSelectCategory = (category: string | null) => {
    setSelectedCategory(category);
    setSelectedMail(null);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950/50">
      {/* Header Bar */}
      <div className="flex h-14 items-center justify-between border-b border-slate-200/60 bg-white/80 px-6 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Email
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <main className="flex flex-1 overflow-hidden">
        {/* Enhanced Desktop Sidebar */}
        <div className="hidden w-64 border-r border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-950/60 md:flex">
          <Sidebar
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />
        </div>

        {/* Main Content Area with Enhanced Styling */}
        <div className="flex-1 overflow-hidden">
          {selectedMail ? (
            <div className="h-full animate-in slide-in-from-right-1 duration-200">
              <MailDetail mail={selectedMail} onBack={handleBackToList} />
            </div>
          ) : (
            <div className="h-full animate-in slide-in-from-left-1 duration-200">
              <MailList
                onSelectMail={handleSelectMail}
                filterCategory={selectedCategory}
              />
            </div>
          )}
        </div>
      </main>

      {/* Enhanced Mobile Bottom Tabs */}
      <div className="border-t border-slate-200/60 bg-white/90 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-950/90 md:hidden">
        <BottomTabs
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
      </div>
    </div>
  );
}
