import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  MessageCircle,
  Send,
  X,
  Paperclip,
  ChevronDown,
  Volume2,
  VolumeX,
  ArrowLeft,
} from "lucide-react";
import { createHelpdeskChat, generateAIResponse } from "@/app/[locale]/actions/chat";
import type { WidgetSettings } from "@/hooks/useWidgetSettings";

interface Message {
  sender: "user" | "bot";
  text: string;
  file?: {
    name: string;
    type: string;
    url?: string;
  };
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const welcomeOptions = [
  { label: "What is answer24?", icon: "❓" },
  { label: "Discover answer24 Premium", icon: "💎" },
  { label: "How can I log into my account?", icon: "🔑" },
  { label: "Contact support", icon: "💬" },
];

interface ChatWidgetProps {
  settings?: WidgetSettings;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ settings }) => {
  // Use settings or defaults - memoize to avoid recalculating on every render
  const theme = React.useMemo(() => settings?.theme || {
    primary: '#2563eb',
    foreground: '#ffffff',
    background: '#ffffff',
    radius: 18,
    fontFamily: 'Inter, ui-sans-serif',
    logoUrl: '/Answer24Logo.png'
  }, [settings?.theme]);
  
  const behavior = React.useMemo(() => settings?.behavior || {
    position: 'right',
    openOnLoad: false,
    openOnExitIntent: true,
    openOnInactivityMs: 60000,
    zIndex: 9999
  }, [settings?.behavior]);
  
  const i18nStrings = React.useMemo(() => settings?.i18n?.strings || {
    'chat.welcome': "Hi there! I'm answer24, your assistant. How can I help you today?",
    'chat.placeholder': 'Type your message...',
    'chat.send': 'Send'
  }, [settings?.i18n?.strings]);
  
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Update welcome message when i18n strings change
  useEffect(() => {
    setMessages([{
      sender: "bot",
      text: i18nStrings['chat.welcome'] || process.env.NEXT_PUBLIC_CHATBOT_WELCOME_MESSAGE || "Hi there! I'm answer24, your assistant. How can I help you today?",
    }]);
  }, [i18nStrings]);

  // Handle openOnLoad behavior
  useEffect(() => {
    if (behavior.openOnLoad) {
      setIsOpen(true);
    }
  }, [behavior.openOnLoad]);

  // Create helpdesk chat when widget opens
  useEffect(() => {
    const initializeChat = async () => {
      if (isOpen && !chatId) {
        try {
          // Get token and user data from localStorage
          const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
          const userDataStr = typeof window !== 'undefined' ? localStorage.getItem('user_data') : null;
          
          if (!token) {
            console.error("No authentication token found");
            return;
          }
          
          if (!userDataStr) {
            console.error("No user data found");
            return;
          }
          
          const userData = JSON.parse(userDataStr);
          if (!userData.id) {
            console.error("User ID not found in user data");
            return;
          }
          
          const chat = await createHelpdeskChat(token, userData.id);
          setChatId(chat.id);
        } catch (error) {
          console.error("Failed to create helpdesk chat:", error);
        }
      }
    };
    initializeChat();
  }, [isOpen, chatId]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "chat">("home");
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [currentLang, setCurrentLang] = useState<string>("en-US");
  const [isMuted, setIsMuted] = useState(true);

  // File upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Welcome modal content scrolling
  const welcomeContentRef = useRef<HTMLDivElement>(null);

  // Inactivity and exit intent states
  const activityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [hasPromptedInactivity, setHasPromptedInactivity] = useState(false);
  const [hasPromptedExit, setHasPromptedExit] = useState(false);
  const [lastExitPromptTime, setLastExitPromptTime] = useState<number>(0);
  const exitCooldownRef = useRef<number>(2 * 60 * 1000); // 2 minutes cooldown

  // Reset inactivity timer
  const resetActivityTimer = useCallback(() => {
    if (activityTimerRef.current) {
      clearTimeout(activityTimerRef.current);
    }
    if (!isOpen && !hasPromptedInactivity && behavior.openOnInactivityMs > 0) {
      activityTimerRef.current = setTimeout(() => {
        setIsOpen(true);
        setActiveTab("chat");
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Can I assist you with anything?" },
        ]);
        setHasPromptedInactivity(true);
      }, behavior.openOnInactivityMs);
    }
  }, [isOpen, hasPromptedInactivity, behavior.openOnInactivityMs]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Text-to-speech for bot replies
  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.sender === "bot" && lastMsg.text && !isMuted) {
      if ("speechSynthesis" in window) {
        const utter = new window.SpeechSynthesisUtterance(lastMsg.text);
        utter.lang = currentLang === "nl-NL" ? "nl-NL" : "en-US";
        utter.rate = 0.9;
        utter.pitch = 1;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      }
    }
  }, [messages, isMuted, currentLang]);

  // Inactivity and exit intent logic
  useEffect(() => {
    resetActivityTimer();

    const handleMouseMove = () => {
      resetActivityTimer();
    };

    const handleMouseLeave = (event: MouseEvent) => {
      if (!behavior.openOnExitIntent) return;
      
      const currentTime = Date.now();
      const timeSinceLastPrompt = currentTime - lastExitPromptTime;

      if (
        event.clientY < 50 &&
        !isOpen &&
        !hasPromptedExit &&
        timeSinceLastPrompt >= exitCooldownRef.current
      ) {
        setIsOpen(true);
        setActiveTab("chat");
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Leaving so soon? Is there anything I can help you with before you go?",
          },
        ]);
        setHasPromptedExit(true);
        setLastExitPromptTime(currentTime);
        if (activityTimerRef.current) {
          clearTimeout(activityTimerRef.current);
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    if (behavior.openOnExitIntent) {
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (activityTimerRef.current) {
        clearTimeout(activityTimerRef.current);
      }
    };
  }, [
    isOpen,
    hasPromptedInactivity,
    hasPromptedExit,
    lastExitPromptTime,
    resetActivityTimer,
  ]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startSpeechRecognition = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = currentLang;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      // Auto-send after speech recognition
      setTimeout(() => handleSend(true), 100);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [currentLang]);

  const handleSend = useCallback(
    async (fromSpeech = false) => {
      if (!input.trim() && !selectedFile) return;

      const userMessage: Message = { sender: "user", text: input };

      if (selectedFile) {
        userMessage.file = {
          name: selectedFile.name,
          type: selectedFile.type,
          url: filePreview || undefined,
        };
      }

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setSelectedFile(null);
      setFilePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setIsTyping(true);

      try {
        // Check if we have a chat ID
        if (!chatId) {
          throw new Error("Chat not initialized");
        }

        // Get token from localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (!token) {
          throw new Error("Authentication required");
        }

        // Call Laravel backend AI service
        const aiMessage = await generateAIResponse(chatId, input, token);
        setMessages((prev) => [...prev, { sender: "bot", text: aiMessage.content }]);
      } catch (error) {
        console.error("Chat error:", error);
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Sorry, something went wrong. Please try again.",
          },
        ]);
      } finally {
        setIsTyping(false);
      }

      setHasPromptedInactivity(false);
      resetActivityTimer();
    },
    [input, selectedFile, filePreview, resetActivityTimer, chatId]
  );

  const handleScrollDown = () => {
    if (welcomeContentRef.current) {
      welcomeContentRef.current.scrollBy({
        top: 200,
        behavior: "smooth",
      });
    }
  };

  const handleOptionClick = (option: string) => {
    setActiveTab("chat");
    setMessages((prev) => [...prev, { sender: "user", text: option }]);
    setIsTyping(true);

    setTimeout(() => {
      const responses: { [key: string]: string } = {
        "What is answer24?":
          "answer24 is your intelligent assistant platform designed to provide instant support and answers to your questions 24/7. We combine AI technology with human expertise to deliver accurate, helpful responses.",
        "Discover answer24 Premium":
          "answer24 Premium offers advanced features including priority support, extended conversation history, file analysis capabilities, and access to specialized knowledge domains. Would you like to learn more about upgrading?",
        "How can I log into my account?":
          "To log into your answer24 account, visit our website and click 'Sign In' in the top right corner. You can use your email and password, or sign in with Google or Microsoft. Need help resetting your password?",
        "Contact support":
          "I'm here to help! You can chat with me directly, or if you need human support, you can email us at support@answer24.nl or call our helpline. What specific issue can I assist you with?",
      };

      const response =
        responses[option] || "Here's more information about: " + option;
      setMessages((prev) => [...prev, { sender: "bot", text: response }]);
      setIsTyping(false);
    }, 1200);

    setHasPromptedInactivity(false);
    resetActivityTimer();
  };

  // Chat open/close effects
  useEffect(() => {
    if (isOpen) {
      setHasPromptedInactivity(false);
      if (activityTimerRef.current) {
        clearTimeout(activityTimerRef.current);
      }
    } else {
      setHasPromptedInactivity(false);
      resetActivityTimer();
    }
  }, [isOpen, resetActivityTimer]);

  // Page visibility change handler
  useEffect(() => {
    const handlePageVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setHasPromptedExit(false);
      }
    };

    document.addEventListener("visibilitychange", handlePageVisibilityChange);
    return () =>
      document.removeEventListener(
        "visibilitychange",
        handlePageVisibilityChange
      );
  }, []);

  return (
    <>
      <style>{`
        @keyframes floaty {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-8px) scale(1.05); }
          100% { transform: translateY(0px) scale(1); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .chat-button {
          animation: floaty 3s ease-in-out infinite;
        }
        .chat-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #1e293b);
          animation: pulse-ring 2s ease-out infinite;
          z-index: -1;
        }
        .scrollbar-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 cursor-pointer ${behavior.position === 'right' ? 'right-6' : 'left-6'} rounded-full p-4 shadow-lg transition duration-300 animate-floaty`}
        style={{
          zIndex: behavior.zIndex,
          background: `linear-gradient(135deg, ${theme.primary}, #1e293b)`,
          color: theme.foreground
        }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div 
          className={`fixed bottom-20 ${behavior.position === 'right' ? 'right-4' : 'left-4'} flex h-[70vh] max-h-[600px] w-[90vw] max-w-[400px] flex-col border border-gray-200 font-sans shadow-2xl overflow-hidden`}
          style={{
            zIndex: behavior.zIndex,
            backgroundColor: theme.background,
            borderRadius: `${theme.radius}px`,
            fontFamily: theme.fontFamily
          }}
        >
          <div 
            className="relative p-5 pb-4 flex flex-col gap-2 sticky top-0 z-10"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, #1e293b)`,
              borderTopLeftRadius: `${theme.radius}px`,
              borderTopRightRadius: `${theme.radius}px`
            }}
          >
            <div className="flex items-center gap-2">
              {activeTab === "chat" && (
                <button
                  onClick={() => setActiveTab("home")}
                  className="text-white  cursor-pointer text-2xl mr-2 hover:text-blue-200 transition-colors duration-200"
                  title="Back to welcome"
                >
                  <ArrowLeft size={24} />
                </button>
              )}
              <div className="flex -space-x-2">
                <img
                  src="/Image-1.png"
                  alt="avatar1"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                  src="/Image-2.png"
                  alt="avatar2"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                  src="/Image-3.png"
                  alt="avatar3"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              </div>
              <span className="text-white text-xl font-bold ml-2">
                answer24 Chat
              </span>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:text-blue-200 transition-colors p-1 rounded"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-400 rounded-full inline-block animate-pulse"></span>
              <span className="text-white text-sm">We are online</span>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col bg-white min-h-0">
            {activeTab === "home" ? (
              <div
                ref={welcomeContentRef}
                className="flex-1 flex flex-col items-center justify-start px-6 py-8 gap-4 overflow-y-auto w-full min-h-0 scrollbar-hide"
              >
                <div className="text-[#2563eb] font-semibold text-lg mb-1">
                  Welcome to answer24!
                </div>
                <div className="text-gray-700 text-sm mb-3 text-center">
                  Choose a topic to get started, or chat directly with our AI
                  assistant:
                </div>

                <div className="w-full max-w-[95%] flex flex-col gap-2">
                  {welcomeOptions.map((opt) => (
                    <button
                      key={opt.label}
                      className="w-full text-left px-4 py-3 rounded-xl bg-gray-100 hover:bg-[#e0e7ff] border border-gray-200 text-base font-medium transition-all duration-200 flex items-center justify-between mb-1 hover:shadow-md hover:scale-[1.02]"
                      onClick={() => handleOptionClick(opt.label)}
                    >
                      <span className="text-lg">{opt.icon}</span>
                      <span className="flex-1 text-center">{opt.label}</span>
                      <span className="text-[#2563eb] font-bold">&gt;</span>
                    </button>
                  ))}
                </div>

                <div className="mt-4 text-xs text-gray-500 text-center">
                  Or scroll down for more options
                </div>
              </div>
            ) : (
              <>
                {/* Messages Area */}
                <div className="flex-1 overflow-x-hidden overflow-y-auto space-y-3 bg-gray-50 p-4 text-sm w-full min-h-0 scrollbar-hide">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 ${
                        msg.sender === "user"
                          ? "ml-auto self-end bg-gradient-to-br from-[#2563eb] to-[#1e40af] text-white"
                          : "self-start bg-white border border-gray-200 text-gray-800 hover:shadow-md"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                      {msg.file && (
                        <div className="mt-2 p-2 border rounded-lg bg-gray-50 flex items-center gap-2">
                          {msg.file.type.startsWith("image/") &&
                          msg.file.url ? (
                            <img
                              src={msg.file.url}
                              alt="File preview"
                              className="max-w-[100px] max-h-[100px] rounded object-contain"
                            />
                          ) : (
                            <Paperclip className="w-5 h-5 text-gray-500" />
                          )}
                          <span className="text-xs text-gray-700 break-all">
                            {msg.file.name}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="self-start rounded-2xl bg-white border border-gray-200 px-4 py-3 shadow-sm max-w-[85%] flex items-center gap-2">
                      <div className="flex gap-1">
                        <span
                          className="inline-block w-2 h-2 bg-[#2563eb] rounded-full animate-bounce"
                          style={{ animationDelay: "0s" }}
                        ></span>
                        <span
                          className="inline-block w-2 h-2 bg-[#2563eb] rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></span>
                        <span
                          className="inline-block w-2 h-2 bg-[#2563eb] rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></span>
                      </div>
                      <span className="ml-2 text-gray-600">
                        answer24 is typing…
                      </span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="flex flex-col border-t bg-white p-3">
                  {selectedFile && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2 border border-gray-200">
                      <div className="flex items-center gap-2">
                        {filePreview &&
                        selectedFile.type.startsWith("image/") ? (
                          <img
                            src={filePreview}
                            alt="Preview"
                            className="w-10 h-10 object-cover rounded border"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-blue-100 rounded border flex items-center justify-center">
                            <Paperclip className="w-5 h-5 text-blue-600" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-700 truncate max-w-[200px] font-medium">
                            {selectedFile.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveFile}
                        className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                        title="Remove file"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full border border-gray-300 p-2 transition-all duration-200 text-[#2563eb] bg-gray-50 hover:bg-blue-50 hover:border-blue-300 hover:scale-105"
                      title="Attach file (max 10MB)"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>

                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={i18nStrings['chat.placeholder'] || 'Type your message...'}
                      className="min-w-0 flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent bg-gray-50 transition-all duration-200"
                    />

                    <button
                      type="button"
                      onClick={startSpeechRecognition}
                      className={`rounded-full border border-gray-300 p-2 transition-all duration-200 ${
                        isListening
                          ? "bg-red-100 border-red-300 text-red-600 animate-pulse"
                          : "text-[#2563eb] bg-gray-50 hover:bg-blue-50 hover:border-blue-300"
                      }`}
                      title={`Voice input (${
                        currentLang === "en-US" ? "English" : "Dutch"
                      })`}
                    >
                      🎤
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSend()}
                      disabled={!input.trim() && !selectedFile}
                      className="rounded-full bg-gradient-to-br from-[#2563eb] to-[#1e293b] p-2 text-white shadow-lg hover:from-[#1e293b] hover:to-[#2563eb] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                      title="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="relative text-center text-xs text-gray-400 py-3 border-t bg-gray-50">
            {activeTab === "home" && (
              <>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <button
                    onClick={handleScrollDown}
                    className="p-2 cursor-pointer rounded-full bg-gradient-to-br from-[#2563eb] to-[#1e293b] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                    title="Scroll down for more options"
                  >
                    <ChevronDown className="w-5 h-5 group-hover:animate-bounce" />
                  </button>
                </div>
                <button
                  className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 text-base font-semibold text-[#2563eb] transition-all duration-200 mb-3 hover:shadow-md hover:scale-[1.02]"
                  onClick={() => setActiveTab("chat")}
                >
                  Chat with answer24
                  <Send className="inline w-5 h-5 ml-2" />
                </button>
              </>
            )}

            <div className="flex items-center justify-center gap-1">
              <span>Powered by</span>
              <span className="font-semibold text-[#2563eb]">answer24</span>
              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse ml-2"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
