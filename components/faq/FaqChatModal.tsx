"use client"

import { useState, useEffect } from "react"
import { X, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type FeedbackType = 'helpful' | 'not-helpful' | null

interface FaqChatModalProps {
  isOpen: boolean
  onClose: () => void
  question: string
  answer: string
  isLoading: boolean
  onFeedback: (isHelpful: boolean) => void
}

export function FaqChatModal({
  isOpen,
  onClose,
  question,
  answer,
  isLoading,
  onFeedback,
}: FaqChatModalProps) {
  const [feedback, setFeedback] = useState<FeedbackType>(null)
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)

  useEffect(() => {
    // Handle escape key press
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleFeedback = async (isHelpful: boolean) => {
    if (isSubmittingFeedback) return
    
    setIsSubmittingFeedback(true)
    try {
      await onFeedback(isHelpful)
      setFeedback(isHelpful ? 'helpful' : 'not-helpful')
    } finally {
      setIsSubmittingFeedback(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-background rounded-lg shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{question}</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Generating answer...</span>
            </div>
          ) : (
            <div className="prose max-w-none">
              <p>{answer}</p>
            </div>
          )}
        </div>
        
        {/* Footer with feedback */}
        <div className="border-t p-4 bg-muted/20">
          {!isLoading && !feedback ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Was this helpful?</span>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback(true)}
                  disabled={isSubmittingFeedback}
                  className="flex items-center gap-1"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>Yes</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback(false)}
                  disabled={isSubmittingFeedback}
                  className="flex items-center gap-1"
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span>No</span>
                </Button>
              </div>
            </div>
          ) : feedback === 'helpful' ? (
            <div className="text-sm text-green-600 flex items-center">
              <ThumbsUp className="h-4 w-4 mr-1" />
              Thank you for your feedback!
            </div>
          ) : feedback === 'not-helpful' ? (
            <div className="text-sm text-amber-600 flex items-center">
              <ThumbsDown className="h-4 w-4 mr-1" />
              We're sorry to hear that. We'll use your feedback to improve.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
