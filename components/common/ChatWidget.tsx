"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { MessageCircle, Send, X, Paperclip } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  text: string;
  file?: {
    name: string;
    type: string;
    url?: string; // For image/PDF previews
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

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hi there! I'm answer24, your assistant. How can I help you today?",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "chat">("home");
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [currentLang, setCurrentLang] = useState<string>("en-US"); // en-US or nl-NL
  const [isMuted, setIsMuted] = useState(false);

  // New state for file uploads
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null); // For image previews
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for inactivity and exit intent with cooldown
  const activityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [hasPromptedInactivity, setHasPromptedInactivity] = useState(false);
  const [hasPromptedExit, setHasPromptedExit] = useState(false);
  const [lastExitPromptTime, setLastExitPromptTime] = useState<number>(0);
  const exitCooldownRef = useRef<number>(2 * 60 * 1000); // 2 minutes in milliseconds

  // Function to reset inactivity timer
  const resetActivityTimer = useCallback(() => {
    if (activityTimerRef.current) {
      clearTimeout(activityTimerRef.current);
    }
    // Only set a new timer if the chat is not open and we haven't prompted yet
    if (!isOpen && !hasPromptedInactivity) {
      activityTimerRef.current = setTimeout(() => {
        setIsOpen(true); // Open the chat
        setActiveTab("chat"); // Switch to chat view
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Can I assist you with anything?" },
        ]);
        setHasPromptedInactivity(true); // Mark that we've prompted
      }, 30000); // 30 seconds
    }
  }, [isOpen, hasPromptedInactivity]);

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
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      }
    }
  }, [messages, isMuted, currentLang]);

  // --- Inactivity and Exit Intent Logic ---
  useEffect(() => {
    // Start the timer on component mount
    resetActivityTimer();

    // Event listener for mouse movement to reset timer
    const handleMouseMove = () => {
      resetActivityTimer();
    };

    // Event listener for exit intent with cooldown logic
    const handleMouseLeave = (event: MouseEvent) => {
      const currentTime = Date.now();
      const timeSinceLastPrompt = currentTime - lastExitPromptTime;

      // Check if mouse is moving to the top of the viewport, chat is not open,
      // we haven't prompted yet in this session, and enough time has passed since last prompt
      if (
        event.clientY < 50 &&
        !isOpen &&
        !hasPromptedExit &&
        timeSinceLastPrompt >= exitCooldownRef.current
      ) {
        setIsOpen(true); // Open the chat
        setActiveTab("chat"); // Switch to chat view
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Leaving so soon?" },
        ]);
        setHasPromptedExit(true); // Mark that we've prompted for this session
        setLastExitPromptTime(currentTime); // Record the time of this prompt
        if (activityTimerRef.current) {
          clearTimeout(activityTimerRef.current); // Clear inactivity timer if exit intent is triggered
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Clean up event listeners and timer on component unmount
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

  // Speech-to-text
  const toggleMic = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    if (
      !recognitionRef.current ||
      recognitionRef.current.lang !== currentLang
    ) {
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Generate preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (file.type === "application/pdf") {
        setFilePreview("/pdf-icon.png"); // Use a generic PDF icon, or embed the PDF viewer
      } else if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword"
      ) {
        setFilePreview("/doc-icon.png"); // Use a generic Word icon
      } else if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      ) {
        setFilePreview("/excel-icon.png"); // Use a generic Excel icon
      } else {
        setFilePreview(null); // No specific preview for other file types
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
  };

  const handleSend = useCallback(
    (fromSpeech = false) => {
      if (!input.trim() && !selectedFile) return;

      const userMessage: Message = { sender: "user", text: input };

      if (selectedFile) {
        userMessage.file = {
          name: selectedFile.name,
          type: selectedFile.type,
          url: filePreview || undefined, // Include URL for image/PDF previews
        };
      }

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setSelectedFile(null); // Clear selected file after sending
      setFilePreview(null); // Clear preview after sending
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input
      }

      setIsTyping(true);
      setTimeout(() => {
        let botReply = "Thank you for your message!";
        if (selectedFile) {
          botReply += ` I've received your file: ${selectedFile.name}.`;
        }
        botReply += " Our team will get back to you soon.";
        setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
        setIsTyping(false);

        if (fromSpeech && "speechSynthesis" in window && !isMuted) {
          const utter = new window.SpeechSynthesisUtterance(botReply);
          utter.lang = currentLang === "nl-NL" ? "nl-NL" : "en-US";
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utter);
        }
      }, 1200);

      // Reset inactivity prompt after user sends a message, but keep exit prompt state
      setHasPromptedInactivity(false);
      resetActivityTimer();
    },
    [input, selectedFile, filePreview, isMuted, currentLang, resetActivityTimer]
  );

  const handleOptionClick = (option: string) => {
    setActiveTab("chat");
    setMessages((prev) => [...prev, { sender: "user", text: option }]);
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Here's more info about: " + option },
      ]);
      setIsTyping(false);
    }, 1200);
    // Reset inactivity prompt after user interacts, but keep exit prompt state
    setHasPromptedInactivity(false);
    resetActivityTimer();
  };

  // When the chat widget is explicitly opened or closed, reset only inactivity prompts
  useEffect(() => {
    if (isOpen) {
      setHasPromptedInactivity(false);
      if (activityTimerRef.current) {
        clearTimeout(activityTimerRef.current); // Clear timer when chat is open
      }
    } else {
      // When chat is closed, reset and restart inactivity timer
      setHasPromptedInactivity(false);
      resetActivityTimer();
    }
  }, [isOpen, resetActivityTimer]);

  // Reset exit prompt state only when user navigates to a new page or after cooldown
  useEffect(() => {
    const handlePageVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Reset exit prompt when user comes back to the page
        setHasPromptedExit(false);
      }
    };

    document.addEventListener("visibilitychange", handlePageVisibilityChange);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handlePageVisibilityChange
      );
    };
  }, []);

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
        style={{ animation: "floaty 2.5s ease-in-out infinite" }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-[9999] flex h-[70vh] max-h-[600px] w-[90vw] max-w-[400px] flex-col rounded-3xl border border-gray-200 bg-white font-sans shadow-2xl overflow-hidden">
          <div className="relative bg-gradient-to-br from-[#1e293b] to-[#2563eb] p-5 pb-4 rounded-t-3xl flex flex-col gap-2 sticky top-0 z-10">
            <div className="flex items-center gap-2">
              {activeTab === "chat" && (
                <button
                  onClick={() => setActiveTab("home")}
                  className="text-white text-2xl mr-2 hover:text-blue-200 transition"
                  title="Back to welcome"
                >
                  ←
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
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
              <span className="text-white text-sm">We are online</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col bg-white min-h-0">
            {activeTab === "home" ? (
              <div
                className="flex-1 flex flex-col items-center justify-start px-6 py-8 gap-4 overflow-y-auto w-full min-h-0 scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}`}</style>
                <div className="text-[#2563eb] font-semibold text-lg mb-1">
                  Welcome to answer24!
                </div>
                <div className="text-gray-700 text-sm mb-3">
                  Choose a topic to get started:
                </div>
                <div className="w-full max-w-[95%] flex flex-col gap-2">
                  {welcomeOptions.map((opt) => (
                    <button
                      key={opt.label}
                      className="w-full text-left px-4 py-3 rounded-xl bg-gray-100 hover:bg-[#e0e7ff] border border-gray-200 text-base font-medium transition flex items-center justify-between mb-1"
                      onClick={() => handleOptionClick(opt.label)}
                    >
                      <span>{opt.icon}</span> <span>{opt.label}</span>{" "}
                      <span className="text-[#2563eb]">&gt;</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div
                  className="flex-1 overflow-x-hidden overflow-y-auto space-y-3 bg-white p-4 text-sm w-full min-h-0 scrollbar-hide"
                  style={{
                    minHeight: 0,
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
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
                      {msg.file && (
                        <div className="mt-2 p-2 border rounded-lg bg-gray-50 flex items-center gap-2">
                          {msg.file.type.startsWith("image/") &&
                          msg.file.url ? (
                            <img
                              src={msg.file.url}
                              alt="File preview"
                              className="max-w-[100px] max-h-[100px] rounded object-contain"
                            />
                          ) : msg.file.type === "application/pdf" &&
                            msg.file.url ? (
                            <img
                              src={msg.file.url} // This would be your PDF icon
                              alt="PDF icon"
                              className="w-8 h-8"
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
                    <div className="self-start rounded-2xl bg-white border border-[#2563eb] px-4 py-2 animate-pulse text-gray-500 max-w-[80%] flex items-center gap-2">
                      <span
                        className="inline-block w-2 h-2 bg-[#2563eb] rounded-full animate-bounce mr-1"
                        style={{ animationDelay: "0s" }}
                      ></span>
                      <span
                        className="inline-block w-2 h-2 bg-[#2563eb] rounded-full animate-bounce mr-1"
                        style={{ animationDelay: "0.2s" }}
                      ></span>
                      <span
                        className="inline-block w-2 h-2 bg-[#2563eb] rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></span>
                      <span className="ml-2">answer24 is typing…</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="flex flex-col border-t bg-white p-2">
                  {selectedFile && (
                    <div className="flex items-center justify-between p-2 bg-gray-100 rounded-lg mb-2">
                      <div className="flex items-center gap-2">
                        {filePreview &&
                        selectedFile.type.startsWith("image/") ? (
                          <img
                            src={filePreview}
                            alt="Preview"
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <Paperclip className="w-5 h-5 text-gray-500" />
                        )}
                        <span className="text-sm text-gray-700 truncate max-w-[calc(100%-80px)]">
                          {selectedFile.name}
                        </span>
                      </div>
                      <button
                        onClick={handleRemoveFile}
                        className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-gray-200 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="flex items-center gap-1"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // Allowed file types
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full border p-2 transition-colors duration-200 text-[#2563eb] bg-gray-50 hover:bg-gray-100"
                      title="Attach file"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
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
                        const SpeechRecognition =
                          window.SpeechRecognition ||
                          window.webkitSpeechRecognition;
                        if (!SpeechRecognition) {
                          alert(
                            "Speech recognition not supported in this browser."
                          );
                          return;
                        }
                        if (
                          !recognitionRef.current ||
                          recognitionRef.current.lang !== currentLang
                        ) {
                          if (recognitionRef.current) {
                            recognitionRef.current.stop();
                          }
                          const recognition = new SpeechRecognition();
                          recognition.continuous = false;
                          recognition.lang =
                            currentLang === "nl-NL" ? "nl-NL" : "en-US";
                          recognition.interimResults = false;
                          recognition.onresult = (event: any) => {
                            const transcript = event.results[0][0].transcript;
                            setInput(transcript);
                            setIsListening(false);
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
                        setCurrentLang((prevLang) =>
                          prevLang === "en-US" ? "nl-NL" : "en-US"
                        );
                      }}
                      className={`rounded-full border p-2 transition-colors duration-200 text-[#2563eb] bg-gray-50 hover:bg-gray-100 ${
                        isListening ? "bg-red-100" : ""
                      }`}
                      title={`Speak in ${
                        currentLang === "en-US" ? "English" : "Dutch"
                      } (Click to switch)`}
                    >
                      <span role="img" aria-label="mic">
                        🎤
                      </span>
                    </button>
                    <button
                      type="submit"
                      className="rounded-full bg-gradient-to-br from-[#2563eb] to-[#1e293b] p-2 text-white text-base shadow-lg hover:from-[#1e293b] hover:to-[#2563eb] transition flex items-center justify-center"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
          <div className="text-center text-xs text-gray-400 py-2 border-t bg-gray-50">
            <button
              className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-gray-100 hover:bg-[#e0e7ff] border border-gray-200 border border-gray-300 text-base font-semibold text-black transition mb-2"
              onClick={() => setActiveTab("chat")}
            >
              Chat with answer24{" "}
              <span className="ml-2">
                <Send className="inline w-5 h-5" />
              </span>
            </button>
            Powered by{" "}
            <span className="font-semibold text-[#2563eb]">answer24</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
