"use server"

import { User, Chat, Message } from "@/types/chat"
const mockUsers: User[] = [
  {
    id: "1",
    name: "George Paul",
    avatar: "https://avatar.iran.liara.run/public/40",
    role: "Development Manager",
    company: "Talentswide",
    status: "online",
    joinDate: "6 JAN 2021",
  },
  {
    id: "2",
    name: "Zaire Siphron",
    avatar: "https://avatar.iran.liara.run/public/43",
    status: "offline",
  },
  {
    id: "3",
    name: "Giana Press",
    avatar: "https://avatar.iran.liara.run/public/42",
    status: "away",
  },
  {
    id: "4",
    name: "Zain Bator",
    avatar: "https://avatar.iran.liara.run/public/41",
    status: "offline",
  },
  {
    id: "5",
    name: "Ann Herwitz",
    avatar: "https://avatar.iran.liara.run/public/44",
    status: "online",
  },
  {
    id: "6",
    name: "Wilson Carder",
    avatar: "https://avatar.iran.liara.run/public/45",
    status: "offline",
  },
  {
    id: "7",
    name: "Paityn Lipshutz",
    avatar: "https://avatar.iran.liara.run/public/46",
    status: "online",
  },
]

const mockChats: Chat[] = [
  {
    id: "1",
    participants: [mockUsers[0], mockUsers[1]],
    lastMessage: {
      id: "1",
      content: "Hey Erşad! 👋 How is...",
      senderId: "1",
      timestamp: new Date("2024-01-06"),
      type: "text",
    },
    unreadCount: 1,
    updatedAt: new Date("2024-01-06"),
  },
  {
    id: "2",
    participants: [mockUsers[1], mockUsers[2]],
    lastMessage: {
      id: "2",
      content: "I can help 👍",
      senderId: "2",
      timestamp: new Date("2024-01-06"),
      type: "text",
    },
    updatedAt: new Date("2024-01-06"),
  },
  {
    id: "3",
    participants: [mockUsers[2], mockUsers[3]],
    lastMessage: {
      id: "3",
      content: "I have a new project! ✨",
      senderId: "3",
      timestamp: new Date("2024-01-06"),
      type: "text",
    },
    updatedAt: new Date("2024-01-06"),
  },
  {
    id: "4",
    participants: [mockUsers[3], mockUsers[4]],
    lastMessage: {
      id: "4",
      content: "Need to fix this place..",
      senderId: "4",
      timestamp: new Date("2024-01-06"),
      type: "text",
    },
    updatedAt: new Date("2024-01-06"),
  },
  {
    id: "5",
    participants: [mockUsers[4], mockUsers[5]],
    lastMessage: {
      id: "5",
      content: "I understood, okay 👋",
      senderId: "5",
      timestamp: new Date("2024-01-06"),
      type: "text",
    },
    updatedAt: new Date("2024-01-06"),
  },
  {
    id: "6",
    participants: [mockUsers[5], mockUsers[6]],
    lastMessage: {
      id: "6",
      content: "As you wish 🎯",
      senderId: "6",
      timestamp: new Date("2024-01-06"),
      type: "text",
    },
    updatedAt: new Date("2024-01-06"),
  },
  {
    id: "7",
    participants: [mockUsers[6], mockUsers[0]],
    lastMessage: {
      id: "7",
      content: "Thank you! 👍",
      senderId: "7",
      timestamp: new Date("2024-01-06"),
      type: "text",
    },
    updatedAt: new Date("2024-01-06"),
  },
]

export async function getChats(): Promise<Chat[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockChats
}

export async function getChatMessages(chatId: string): Promise<Message[]> {
  const messages: Message[] = [
    {
      id: "1",
      content: "Hey Erşad! 👋 How is going?",
      senderId: "1",
      timestamp: new Date("2024-01-06T10:30:00"),
      type: "text",
    },
  ]

  await new Promise((resolve) => setTimeout(resolve, 200))
  return messages
}

export async function sendMessage(chatId: string, content: string, senderId: string): Promise<Message> {
  const newMessage: Message = {
    id: Date.now().toString(),
    content,
    senderId,
    timestamp: new Date(),
    type: "text",
  }

  await new Promise((resolve) => setTimeout(resolve, 200))
  return newMessage
}
