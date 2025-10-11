import { SimpleChatContainer } from "@/components/dashboard/chat/SimpleChatContainer";
import { ChatIntegrationTest } from "@/components/dashboard/chat/ChatIntegrationTest";

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'nl' },
  ];
}

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      {/* <ChatIntegrationTest /> */}
      <SimpleChatContainer />
    </div>
  );
}
