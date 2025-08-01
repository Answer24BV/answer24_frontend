"use client"

import { useState } from "react"
import type { Chat } from "@/types/chat"
import { ChatListSidebar } from "./ChatListSidebar"
import { ChatDetailView } from "./ChatDetailsView"
import { EmptyChatState } from "./EmptyChatState"

export function SimpleChatContainer() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)

  // This would come from your auth system
  const currentUserId = "2" // Mock current user ID

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat)
  }

  return (
    <div className="h-screen flex pt-20 px-2">
      <ChatListSidebar
        onChatSelect={handleChatSelect}
        selectedChatId={selectedChat?.id}
        currentUserId={currentUserId}
      />

      {selectedChat ? <ChatDetailView chat={selectedChat} currentUserId={currentUserId} /> : <EmptyChatState />}
    </div>
  )
}
