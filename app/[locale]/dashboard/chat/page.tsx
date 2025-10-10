import { SimpleChatContainer } from "@/components/dashboard/chat/SimpleChatContainer";

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'nl' },
  ];
}

export default function MessagesPage() {
  return <SimpleChatContainer />;
}
