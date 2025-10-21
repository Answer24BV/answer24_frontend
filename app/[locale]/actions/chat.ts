"use server"

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

    console.log("getChats: Making request to:", getApiUrl("/chats"))
    console.log("getChats: Using token:", token.substring(0, 20) + "...")

    const response = await fetch(getApiUrl("/chats"), {
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

    const response = await fetch(getApiUrl(`/chats/${chatId}/messages`), {
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

    const response = await fetch(getApiUrl(`/chats/${chatId}/messages`), {
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

    const response = await fetch(getApiUrl("/chats"), {
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

export async function createHelpdeskChat(token?: string, userId?: string): Promise<Chat> {
  try {
    console.log("createHelpdeskChat: Starting with token:", token ? token.substring(0, 20) + '...' : 'NOT PROVIDED')
    console.log("createHelpdeskChat: Starting with userId:", userId)
    
    // Get token from parameter or from tokenUtils
    const authToken = token || tokenUtils.getToken()
    if (!authToken) {
      console.error("createHelpdeskChat: No authentication token found")
      throw new Error("No authentication token found")
    }

    // Get user ID from parameter or from tokenUtils
    let userIdValue = userId
    if (!userIdValue) {
      const userData = tokenUtils.getUser()
      console.log("createHelpdeskChat: Retrieved user data:", userData)
      userIdValue = userData?.id
    }
    
    console.log("createHelpdeskChat: Final userId:", userIdValue)
    console.log("createHelpdeskChat: User ID is valid:", !!userIdValue && userIdValue !== 'undefined' && userIdValue !== 'null')
    
    if (!userIdValue || userIdValue === 'undefined' || userIdValue === 'null') {
      console.error("createHelpdeskChat: No user ID found or invalid user ID")
      throw new Error("User ID not found")
    }

    console.log("createHelpdeskChat: Making request to:", getApiUrl("/chats"))
    console.log("createHelpdeskChat: Using token:", authToken.substring(0, 20) + "...")

    const requestBody = {
      participants: [String(userIdValue)], // Ensure user ID is a string
      type: "helpdesk",
      title: "Helpdesk Support"
    }
    console.log("createHelpdeskChat: Request body:", requestBody)
    console.log("createHelpdeskChat: User ID type:", typeof userIdValue)

    // Add timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(getApiUrl("/chats"), {
      method: "POST",
      headers: {
        ...getApiHeaders(authToken),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    console.log("createHelpdeskChat: Response status:", response.status)
    console.log("createHelpdeskChat: Response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("createHelpdeskChat: Error response:", errorText)
      
      // If it's a 500 error, create a fallback chat
      if (response.status === 500) {
        console.log("createHelpdeskChat: Server error, creating fallback chat")
        return {
          id: `fallback-${Date.now()}`,
          participants: [{
            id: userIdValue,
            name: "User",
            avatar: "",
            status: "online" as const
          }],
          type: "helpdesk" as const,
          title: "Helpdesk Support",
          createdAt: new Date(),
          updatedAt: new Date(),
          aiEnabled: true
        }
      }
      
      throw new Error(`Failed to create helpdesk chat: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("createHelpdeskChat: Response data:", data)
    console.log("createHelpdeskChat: Chat ID from response:", data.chat?.id)
    return data.chat
  } catch (error) {
    console.error("Error creating helpdesk chat:", error)
    
    // If it's a network error or timeout, create a fallback chat
    if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('fetch'))) {
      console.log("createHelpdeskChat: Network error, creating fallback chat")
      const userData = tokenUtils.getUser()
      return {
        id: `fallback-${Date.now()}`,
        participants: [{
          id: userData?.id || 'unknown',
          name: userData?.name || "User",
          avatar: userData?.profile_picture || "",
          status: "online" as const
        }],
        type: "helpdesk" as const,
        title: "Helpdesk Support",
        createdAt: new Date(),
        updatedAt: new Date(),
        aiEnabled: true
      }
    }
    
    throw error
  }
}

export async function generateAIResponse(chatId: string, message: string, token?: string): Promise<Message> {
  try {
    // Get token from parameter or from tokenUtils
    const authToken = token || tokenUtils.getToken()
    if (!authToken) {
      console.log("generateAIResponse: No authentication token, providing fallback response")
      return {
        id: `fallback-${Date.now()}`,
        senderId: "ai",
        content: "Hello! I'm Answer24's AI assistant. I'm currently in offline mode, but I can still help you with basic questions. For full AI capabilities, please log in to your account.",
        type: "text" as const,
        timestamp: new Date(),
        isAiGenerated: true
      }
    }

    // Add timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout for AI

    const apiUrl = getApiUrl(`/chats/${chatId}/ai`)
    console.log("generateAIResponse: Making request to:", apiUrl)
    console.log("generateAIResponse: Using token:", authToken.substring(0, 20) + '...')
    console.log("generateAIResponse: Message:", message)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        ...getApiHeaders(authToken),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    console.log("generateAIResponse: Response status:", response.status)
    console.log("generateAIResponse: Response ok:", response.ok)

    if (!response.ok) {
      // If it's a server error, provide a fallback response
      if (response.status >= 500) {
        console.log("generateAIResponse: Server error, providing fallback response")
        return {
          id: `fallback-${Date.now()}`,
          senderId: "ai",
          content: "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again in a moment, or contact support if the issue persists.",
          type: "text" as const,
          timestamp: new Date(),
          isAiGenerated: true
        }
      }
      throw new Error(`Failed to generate AI response: ${response.status}`)
    }

    const data = await response.json()
    return data.message
  } catch (error) {
    console.error("Error generating AI response:", error)
    console.log("Error type:", error instanceof Error ? error.name : typeof error)
    console.log("Error message:", error instanceof Error ? error.message : String(error))
    
    // If it's a network error or timeout, provide a fallback response
    if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('fetch'))) {
      console.log("generateAIResponse: Network error, providing fallback response")
      return {
        id: `fallback-${Date.now()}`,
        senderId: "ai",
        content: "I'm experiencing connectivity issues right now. Please try again in a moment.",
        type: "text" as const,
        timestamp: new Date(),
        isAiGenerated: true
      }
    }
    
    throw error
  }
}

export async function toggleAIForChat(chatId: string, enabled: boolean): Promise<void> {
  try {
    const token = tokenUtils.getToken()
    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(getApiUrl(`/chats/${chatId}`), {
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
