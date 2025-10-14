import { ChatGPTLikeChat } from "@/components/dashboard/chat/ChatGPTLikeChat";

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'nl' },
  ];
}

export default function MessagesPage() {
  return <ChatGPTLikeChat />;
}
