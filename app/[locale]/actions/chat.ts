"use client"

import { User, Chat, Message } from "@/types/chat"
import { tokenUtils } from "@/utils/auth"
import { getApiUrl, getApiHeaders } from "@/lib/api-config"

// Real API integration with Laravel backend
export async function getChats(): Promise<Chat[]> {
  try {
    const token = tokenUtils.getToken()
    if (!token) {
      console.error("getChats: No authentication token found")
      throw new Error("No authentication token found")
    }

    console.log("getChats: Making request to:", getApiUrl("/api/v1/chats"))
    console.log("getChats: Using token:", token.substring(0, 20) + "...")

    const response = await fetch(getApiUrl("/api/v1/chats"), {
      method: "GET",
      headers: getApiHeaders(token),
    })

    console.log("getChats: Response status:", response.status)
    console.log("getChats: Response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("getChats: Error response:", errorText)
      throw new Error(`Failed to fetch chats: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("getChats: Response data:", data)
    return data.chats || []
  } catch (error) {
    console.error("Error fetching chats:", error)
    // Fallback to empty array on error
    return []
  }
}

export async function getChatMessages(chatId: string): Promise<Message[]> {
  try {
    const token = tokenUtils.getToken()
    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(getApiUrl(`/api/v1/chats/${chatId}/messages`), {
      method: "GET",
      headers: getApiHeaders(token),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.status}`)
    }

    const data = await response.json()
    return data.messages || []
  } catch (error) {
    console.error("Error fetching messages:", error)
    return []
  }
}

export async function sendMessage(
  chatId: string, 
  content: string, 
  senderId: string,
  type: "text" | "image" | "file" = "text",
  attachments?: File[]
): Promise<Message> {
  try {
    const token = tokenUtils.getToken()
    if (!token) {
      throw new Error("No authentication token found")
    }

    const formData = new FormData()
    formData.append("content", content)
    formData.append("type", type)
    
    // Add file attachments if any
    if (attachments && attachments.length > 0) {
      attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file)
      })
    }

    const response = await fetch(getApiUrl(`/api/v1/chats/${chatId}/messages`), {
      method: "POST",
      headers: {
        ...getApiHeaders(token),
        // Don't set Content-Type for FormData, let browser set it
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.status}`)
    }

    const data = await response.json()
    return data.message
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}

export async function createChat(participantIds: string[], title?: string): Promise<Chat> {
  try {
    const token = tokenUtils.getToken()
    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(getApiUrl("/api/v1/chats"), {
      method: "POST",
      headers: {
        ...getApiHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        participants: participantIds,
        title,
        type: "user_to_user"
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create chat: ${response.status}`)
    }

    const data = await response.json()
    return data.chat
  } catch (error) {
    console.error("Error creating chat:", error)
    throw error
  }
}

export async function createHelpdeskChat(): Promise<Chat> {
  try {
    const token = tokenUtils.getToken()
    if (!token) {
      console.error("createHelpdeskChat: No authentication token found")
      throw new Error("No authentication token found")
    }

    console.log("createHelpdeskChat: Making request to:", getApiUrl("/api/v1/chats"))
    console.log("createHelpdeskChat: Using token:", token.substring(0, 20) + "...")

    const requestBody = {
      type: "helpdesk",
      title: "Helpdesk Support"
    }
    console.log("createHelpdeskChat: Request body:", requestBody)

    const response = await fetch(getApiUrl("/api/v1/chats"), {
      method: "POST",
      headers: {
        ...getApiHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    console.log("createHelpdeskChat: Response status:", response.status)
    console.log("createHelpdeskChat: Response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("createHelpdeskChat: Error response:", errorText)
      throw new Error(`Failed to create helpdesk chat: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("createHelpdeskChat: Response data:", data)
    return data.chat
  } catch (error) {
    console.error("Error creating helpdesk chat:", error)
    throw error
  }
}

export async function generateAIResponse(chatId: string, message: string): Promise<Message> {
  try {
    const token = tokenUtils.getToken()
    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(getApiUrl(`/api/v1/chats/${chatId}/ai`), {
      method: "POST",
      headers: {
        ...getApiHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to generate AI response: ${response.status}`)
    }

    const data = await response.json()
    return data.message
  } catch (error) {
    console.error("Error generating AI response:", error)
    throw error
  }
}

export async function toggleAIForChat(chatId: string, enabled: boolean): Promise<void> {
  try {
    const token = tokenUtils.getToken()
    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(getApiUrl(`/api/v1/chats/${chatId}`), {
      method: "PUT",
      headers: {
        ...getApiHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ai_enabled: enabled
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to toggle AI: ${response.status}`)
    }
  } catch (error) {
    console.error("Error toggling AI:", error)
    throw error
  }
}

export async function markMessageAsRead(messageId: string): Promise<void> {
  try {
    const token = tokenUtils.getToken()
    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(getApiUrl(`/api/v1/messages/${messageId}/read`), {
      method: "POST",
      headers: getApiHeaders(token),
    })

    if (!response.ok) {
      throw new Error(`Failed to mark message as read: ${response.status}`)
    }
  } catch (error) {
    console.error("Error marking message as read:", error)
    throw error
  }
}
