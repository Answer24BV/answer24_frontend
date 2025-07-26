"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { MessageCircle, Send, X } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// ...existing code...

// ...existing code...

const welcomeOptions = [
  { label: "What is answer24?", icon: "❓" },
  { label: "Discover answer24 Premium", icon: "💎" },
  { label: "How can I log into my account?", icon: "🔑" },
  // { label: "How can I manage my subscription?", icon: "📝" },
  { label: "Contact support", icon: "💬" },
];

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hi there! I'm answer24, your assistant. How can I help you today?" },
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'chat'>('home');
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [currentLang, setCurrentLang] = useState<string>("en-US"); // en-US or nl-NL
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Text-to-speech for bot replies
  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.sender === 'bot' && lastMsg.text && !isMuted) {
      if ('speechSynthesis' in window) {
        const utter = new window.SpeechSynthesisUtterance(lastMsg.text);
        utter.lang = currentLang === 'nl-NL' ? 'nl-NL' : 'en-US';
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      }
    }
  }, [messages, isMuted, currentLang]);

  // Speech-to-text
  const toggleMic = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    if (!recognitionRef.current || recognitionRef.current.lang !== currentLang) {
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
      };
      recognition.onerror = (event: any) => {
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
    if (!isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    } else {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setCurrentLang((prevLang) => (prevLang === "en-US" ? "nl-NL" : "en-US"));
  }, [currentLang, isListening]);
  const handleSend = useCallback((fromSpeech = false) => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const botReply = "Thank you for your message! Our team will get back to you soon.";
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
      setIsTyping(false);
      // If sent from speech-to-text, read the bot reply immediately
      if (fromSpeech && 'speechSynthesis' in window && !isMuted) {
        const utter = new window.SpeechSynthesisUtterance(botReply);
        utter.lang = currentLang === 'nl-NL' ? 'nl-NL' : 'en-US';
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      }
    }, 1200);
  }, [input, isMuted, currentLang]);

  const handleOptionClick = (option: string) => {
    setActiveTab('chat');
    setMessages((prev) => [...prev, { sender: "user", text: option }]);
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: "Here's more info about: " + option }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      <style>{`
        @keyframes floaty {
          0% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
      `}</style>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-gradient-to-br from-[#1e293b] to-[#2563eb] p-4 text-white shadow-lg transition duration-300 hover:from-[#2563eb] hover:to-[#1e293b] animate-floaty"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        style={{ animation: 'floaty 2.5s ease-in-out infinite' }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-[9999] flex h-[70vh] max-h-[600px] w-[90vw] max-w-[400px] flex-col rounded-3xl border border-gray-200 bg-white font-sans shadow-2xl overflow-hidden">
          <div className="relative bg-gradient-to-br from-[#1e293b] to-[#2563eb] p-5 pb-4 rounded-t-3xl flex flex-col gap-2 sticky top-0 z-10">
            <div className="flex items-center gap-2">
              {activeTab === 'chat' && (
                <button onClick={() => setActiveTab('home')} className="text-white text-2xl mr-2 hover:text-blue-200 transition" title="Back to welcome">←</button>
              )}
              <div className="flex -space-x-2">
                  <img src="/Image-1.png" alt="avatar1" className="w-8 h-8 rounded-full border-2 border-white" />
                  <img src="/Image-2.png" alt="avatar2" className="w-8 h-8 rounded-full border-2 border-white" />
                  <img src="/Image-3.png" alt="avatar3" className="w-8 h-8 rounded-full border-2 border-white" />
                </div>
              <span className="text-white text-xl font-bold ml-2">answer24 Chat</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
              <span className="text-white text-sm">We are online</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col bg-white min-h-0">
            {activeTab === 'home' ? (
              <div className="flex-1 flex flex-col items-center justify-start px-6 py-8 gap-4 overflow-y-auto w-full min-h-0 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}`}</style>
                <div className="text-[#2563eb] font-semibold text-lg mb-1">Welcome to answer24!</div>
                <div className="text-gray-700 text-sm mb-3">Choose a topic to get started:</div>
                <div className="w-full max-w-[95%] flex flex-col gap-2">
                  {welcomeOptions.map((opt) => (
                    <button key={opt.label} className="w-full text-left px-4 py-3 rounded-xl bg-gray-100 hover:bg-[#e0e7ff] border border-gray-200 text-base font-medium transition flex items-center justify-between mb-1" onClick={() => handleOptionClick(opt.label)}>
                      <span>{opt.icon}</span> <span>{opt.label}</span> <span className="text-[#2563eb]">&gt;</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-x-hidden overflow-y-auto space-y-3 bg-white p-4 text-sm w-full min-h-0 scrollbar-hide" style={{ minHeight: 0, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}`}</style>
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${
                        msg.sender === "user"
                          ? "ml-auto self-end bg-[#2563eb] text-white"
                          : "self-start bg-gray-100 border border-[#2563eb] text-gray-800"
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="self-start rounded-2xl bg-white border border-[#2563eb] px-4 py-2 animate-pulse text-gray-500 max-w-[80%] flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-[#2563eb] rounded-full animate-bounce mr-1" style={{ animationDelay: '0s' }}></span>
                      <span className="inline-block w-2 h-2 bg-[#2563eb] rounded-full animate-bounce mr-1" style={{ animationDelay: '0.2s' }}></span>
                      <span className="inline-block w-2 h-2 bg-[#2563eb] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                      <span className="ml-2">answer24 is typing…</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-1 border-t bg-white p-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="min-w-0 flex-1 rounded-full border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      // When mic is toggled and speech is received, send and read response
                      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                      if (!SpeechRecognition) {
                        alert("Speech recognition not supported in this browser.");
                        return;
                      }
                      if (!recognitionRef.current || recognitionRef.current.lang !== currentLang) {
                        if (recognitionRef.current) {
                          recognitionRef.current.stop();
                        }
                        const recognition = new SpeechRecognition();
                        recognition.continuous = false;
                        recognition.lang = currentLang === 'nl-NL' ? 'nl-NL' : 'en-US';
                        recognition.interimResults = false;
                        recognition.onresult = (event: any) => {
                          const transcript = event.results[0][0].transcript;
                          setInput(transcript);
                          setIsListening(false);
                          // Send and read response after speech-to-text
                          setTimeout(() => handleSend(true), 100);
                        };
                        recognition.onerror = (event: any) => {
                          setIsListening(false);
                        };
                        recognition.onend = () => setIsListening(false);
                        recognitionRef.current = recognition;
                      }
                      if (!isListening) {
                        recognitionRef.current.start();
                        setIsListening(true);
                      } else {
                        recognitionRef.current.stop();
                        setIsListening(false);
                      }
                      setCurrentLang((prevLang) => (prevLang === "en-US" ? "nl-NL" : "en-US"));
                    }}
                    className={`rounded-full border p-2 transition-colors duration-200 text-[#2563eb] bg-gray-50 hover:bg-gray-100 ${isListening ? "bg-red-100" : ""}`}
                    title={`Speak in ${currentLang === "en-US" ? "English" : "Dutch"} (Click to switch)`}
                  >
                    <span role="img" aria-label="mic">🎤</span>
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-gradient-to-br from-[#2563eb] to-[#1e293b] p-2 text-white text-base shadow-lg hover:from-[#1e293b] hover:to-[#2563eb] transition flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
          <div className="text-center text-xs text-gray-400 py-2 border-t bg-gray-50">
            <button
              className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-gray-100 hover:bg-[#e0e7ff] border border-gray-200 border border-gray-300 text-base font-semibold text-black transition mb-2"
              onClick={() => setActiveTab('chat')}
            >
              Chat with answer24 <span className="ml-2"><Send className="inline w-5 h-5" /></span>
            </button>
            Powered by <span className="font-semibold text-[#2563eb]">answer24</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;