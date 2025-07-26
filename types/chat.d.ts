export interface User {
    id: string
    name: string
    avatar: string
    role?: string
    company?: string
    status: "online" | "offline" | "away"
    joinDate?: string
    lastSeen?: Date
  }
  
  export interface Message {
    id: string
    content: string
    senderId: string
    timestamp: Date
    type: "text"
    isRead?: boolean
    isLoading?: boolean
    role?: string
    receiverId?: string
  }
  
  export interface Chat {
    id: string
    participants: User[]
    lastMessage?: Message
    unreadCount?: number
    updatedAt: Date
    createdAt?: Date
  }
  