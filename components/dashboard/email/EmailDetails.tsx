"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { mailData } from "@/lib/data"

interface MailDetailProps {
  mail: (typeof mailData)[0]
  onBack: () => void
}

export function MailDetail({ mail, onBack }: MailDetailProps) {
  return (
    <div className="flex flex-1 flex-col  bg-background rounded-lg shadow-custom-medium p-6">
      <div className="flex items-center gap-4 border-b border-gray-200 pb-4 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-gray-600 hover:bg-gray-100 hover:text-calmBlue-700"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back to list</span>
        </Button>
        <h2 className="text-xl font-semibold text-foreground flex-1 truncate">{mail.subject}</h2>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <div className="mb-4 text-sm text-gray-700">
          <span className="font-medium">From:</span> {mail.customer}
        </div>
        <div
          className="prose max-w-none text-foreground leading-relaxed text-base"
          dangerouslySetInnerHTML={{ __html: mail.content }}
        />
      </div>
    </div>
  )
}
