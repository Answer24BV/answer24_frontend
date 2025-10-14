"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2, Plus, Menu, X, Trash2, MessageSquare, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { createHelpdeskChat, generateAIResponse } from "@/app/[locale]/actions/chat"
import { tokenUtils } from "@/utils/auth"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export function ChatGPTLikeChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [chatId, setChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [initError, setInitError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize with a default session and create helpdesk chat
  useEffect(() => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setSessions([newSession])
    setCurrentSessionId(newSession.id)
    setMessages([])

    // Create helpdesk chat for backend
    const initializeChat = async () => {
      try {
        setIsInitializing(true)
        setInitError(null)
        
        // Check if user is authenticated
        const token = tokenUtils.getToken()
        const userData = tokenUtils.getUser()
        
        if (!token) {
          throw new Error("Please log in to use the chat feature")
        }
        
        if (!userData || !userData.id) {
          throw new Error("User data not found. Please log in again.")
        }
        
        // Pass token and user ID to server action
        const chat = await createHelpdeskChat(token, userData.id)
        setChatId(chat.id)
        setIsInitializing(false)
      } catch (error) {
        console.error("Failed to create helpdesk chat:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to initialize chat"
        setInitError(errorMessage)
        setIsInitializing(false)
      }
    }
    initializeChat()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setSessions(prev => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
    setMessages([])
  }

  const selectSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId)
    if (session) {
      setCurrentSessionId(sessionId)
      setMessages(session.messages)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }
  }

  const deleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newSessions = sessions.filter(s => s.id !== sessionId)
    setSessions(newSessions)
    
    if (currentSessionId === sessionId) {
      if (newSessions.length > 0) {
        selectSession(newSessions[0].id)
      } else {
        createNewChat()
      }
    }
  }

  const updateSessionTitle = (sessionId: string, title: string) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, title } : s
    ))
  }

  const getSessionTitle = (session: ChatSession): string => {
    // If there are messages, use the first user message as title
    const firstUserMessage = session.messages.find(m => m.role === 'user')
    if (firstUserMessage) {
      // Truncate to 50 characters
      return firstUserMessage.content.length > 50 
        ? firstUserMessage.content.substring(0, 50) + '...'
        : firstUserMessage.content
    }
    return session.title
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || isInitializing) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    // Update session title if it's the first user message
    if (currentSessionId && messages.length === 1) {
      const title = input.trim().slice(0, 50)
      updateSessionTitle(currentSessionId, title)
    }

    try {
      // Check if we have a chat ID
      if (!chatId) {
        throw new Error("Chat is still initializing. Please wait a moment and try again.")
      }

      // Get token for server action
      const token = tokenUtils.getToken()
      if (!token) {
        throw new Error("Authentication required")
      }

      // Call Laravel backend AI service
      const aiMessage = await generateAIResponse(chatId, userMessage.content, token)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiMessage.content || "I'm sorry, I couldn't process that request.",
        timestamp: new Date()
      }

      const finalMessages = [...newMessages, assistantMessage]
      setMessages(finalMessages)

      // Update session in sessions array
      if (currentSessionId) {
        setSessions(prev => prev.map(s => 
          s.id === currentSessionId 
            ? { ...s, messages: finalMessages, updatedAt: new Date() }
            : s
        ))
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I'm having trouble right now. Please try again in a moment.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const currentSession = sessions.find(s => s.id === currentSessionId)

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className={cn(
        "bg-white border-r border-gray-200 text-gray-900 transition-all duration-300 ease-in-out overflow-hidden",
        sidebarOpen ? "w-64 md:w-80" : "w-0"
      )}>
        <div className="flex flex-col h-full">
          {/* New Chat Button */}
          <div className="p-3 border-b border-gray-200">
            <Button
              onClick={createNewChat}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => selectSession(session.id)}
                className={cn(
                  "group flex items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors",
                  currentSessionId === session.id && "bg-blue-50 border border-blue-200"
                )}
              >
                <MessageSquare className="w-4 h-4 flex-shrink-0 text-gray-600" />
                <span className="flex-1 truncate text-sm text-gray-900">{getSessionTitle(session)}</span>
                <button
                  onClick={(e) => deleteSession(session.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity text-gray-600"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Bot className="w-4 h-4" />
              <span>GPT-4o-mini</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">
              {currentSession ? getSessionTitle(currentSession) : "New Chat"}
            </h1>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center px-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-6">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-3">
                How can I help you today?
              </h2>
              <p className="text-gray-600 mb-8">
                Start a conversation by typing a message below
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                <button
                  onClick={() => setInput("What is answer24?")}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
                >
                  <p className="font-medium text-gray-900">What is answer24?</p>
                  <p className="text-sm text-gray-600 mt-1">Learn about our platform</p>
                </button>
                <button
                  onClick={() => setInput("How do I get started?")}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
                >
                  <p className="font-medium text-gray-900">How do I get started?</p>
                  <p className="text-sm text-gray-600 mt-1">Get help with getting started</p>
                </button>
                <button
                  onClick={() => setInput("What features are available?")}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
                >
                  <p className="font-medium text-gray-900">What features are available?</p>
                  <p className="text-sm text-gray-600 mt-1">Explore our features</p>
                </button>
                <button
                  onClick={() => setInput("How can I contact support?")}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
                >
                  <p className="font-medium text-gray-900">How can I contact support?</p>
                  <p className="text-sm text-gray-600 mt-1">Get help from our team</p>
                </button>
              </div>
            </div>
          )}
          
          {isInitializing && (
            <div className="flex gap-4 w-full justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  <span className="text-sm text-gray-500">Initializing chat...</span>
                </div>
              </div>
            </div>
          )}
          
          {initError && !isInitializing && (
            <div className="flex gap-4 w-full justify-start">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="bg-red-50 rounded-2xl px-4 py-3 shadow-sm border border-red-200">
                <p className="text-sm text-red-800 font-medium mb-1">Unable to initialize chat</p>
                <p className="text-sm text-red-600">{initError}</p>
                {initError.includes("log in") && (
                  <Button
                    onClick={() => window.location.href = '/nl/signin'}
                    className="mt-2 h-8 text-xs"
                    size="sm"
                  >
                    Go to Login
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-4 w-full",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div className={cn(
                "rounded-2xl px-4 py-3",
                message.role === "user"
                  ? "bg-blue-600 text-white max-w-[70%]"
                  : "bg-white text-gray-900 shadow-sm border border-gray-200 max-w-[70%]"
              )}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-4 w-full justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 px-4 py-4">
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
            <div className="relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isInitializing ? "Initializing chat..." : 
                  initError ? "Chat unavailable" : 
                  "Message answer24..."
                }
                className="pr-12 py-6 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-2xl"
                disabled={isLoading || isInitializing || !!initError}
              />
              <Button 
                type="submit" 
                disabled={!input.trim() || isLoading || isInitializing || !!initError}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl"
                size="sm"
              >
                {isLoading || isInitializing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-center text-gray-500 mt-2">
              {isInitializing ? "Setting up your chat..." : 
               initError ? "Please resolve the issue above to continue" :
               "answer24 can make mistakes. Consider checking important information."}
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
