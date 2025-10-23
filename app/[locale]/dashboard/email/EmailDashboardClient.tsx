"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, ArrowLeft, X, Send } from "lucide-react";

interface Mail {
  id: number;
  from: string;
  to: string[];
  subject: string;
  body: string;
  date: string;
  unread: boolean;
  category: "inbox" | "sent";
  thread?: Mail[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function EmailDashboard() {
  const [emails, setEmails] = useState<Mail[]>([]);
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"inbox" | "sent">("inbox");
  const [showNewMail, setShowNewMail] = useState(false);
  const [newMail, setNewMail] = useState({ to: "", subject: "", body: "" });
  const [replyText, setReplyText] = useState("");

  const tabs = [
    { key: "inbox", label: "Inbox" },
    { key: "sent", label: "Sent" },
  ];

  // Fetch emails for selected category
  const fetchEmails = async () => {
    try {
      const folder = selectedCategory === "inbox" ? "Inbox" : "Sent";
      const res = await axios.get(`${API_URL}/emails?folder=${folder}`);
      // Map backend structure to frontend Mail interface
      const mappedEmails: Mail[] = res.data.data.data.map((e: any) => ({
        id: e.id,
        from: e.messages[0]?.from || "",
        to: e.messages[0]?.to || [],
        subject: e.subject,
        body: e.messages[0]?.body || "",
        date: e.updated_at,
        unread: e.unread_count > 0,
        category: folder.toLowerCase() as "inbox" | "sent",
        thread: e.messages.map((m: any) => ({
          id: m.id,
          from: m.from,
          to: m.to,
          subject: e.subject,
          body: m.body,
          date: m.updated_at,
          unread: false,
          category: folder.toLowerCase() as "inbox" | "sent",
        })),
      }));
      setEmails(mappedEmails);
    } catch (err) {
      console.error("Failed to fetch emails", err);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [selectedCategory]);

  // Send new email
  const handleSendMail = async () => {
    if (!newMail.to || !newMail.subject || !newMail.body) return;
    try {
      await axios.post(`${API_URL}/emails`, {
        to: newMail.to.split(","), // comma-separated
        subject: newMail.subject,
        body: newMail.body,
      });
      setNewMail({ to: "", subject: "", body: "" });
      setShowNewMail(false);
      setSelectedCategory("sent");
      fetchEmails();
    } catch (err) {
      console.error("Failed to send email", err);
    }
  };

  // Reply to a thread
  const handleReply = async () => {
    if (!replyText || !selectedMail) return;
    try {
      await axios.post(`${API_URL}/emails`, {
        thread_id: selectedMail.id,
        to: selectedMail.from,
        body: replyText,
      });
      setReplyText("");
      fetchEmails();
    } catch (err) {
      console.error("Failed to send reply", err);
    }
  };

  // Recursive thread rendering
  const renderThread = (mail: Mail, level = 0) => (
    <div
      key={mail.id}
      className={`border rounded-lg p-4 bg-white dark:bg-neutral-900 shadow-sm ml-${level * 4} my-2`}
    >
      <p className="text-sm text-neutral-500">
        <span className="font-semibold">From:</span> {mail.from}
      </p>
      <p className="text-sm text-neutral-500">
        <span className="font-semibold">To:</span> {mail.to.join(", ")}
      </p>
      <p className="text-xs text-neutral-400">{mail.date}</p>
      <p className="mt-2 text-neutral-800 dark:text-neutral-200">{mail.body}</p>
      {mail.thread &&
        mail.thread.map((reply) => renderThread(reply, level + 1))}
    </div>
  );

  // Count unread emails per category
  const countUnread = (category: "inbox" | "sent") =>
    emails.filter((m) => m.category === category && m.unread).length;

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950/50">
      {/* Sidebar */}
      <aside className="w-56 border-r border-slate-200/60 bg-white/80 dark:border-slate-800/60 dark:bg-slate-950/80 flex flex-col">
        <div className="p-4">
          <button
            onClick={() => setShowNewMail(true)}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="h-4 w-4" /> New Mail
          </button>
        </div>

        <nav className="flex flex-col gap-2 px-2 mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setSelectedCategory(tab.key as "inbox" | "sent");
                setSelectedMail(null);
              }}
              className={`flex justify-between items-center px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${
                  selectedCategory === tab.key
                    ? "bg-blue-600 text-white shadow-md hover:shadow-lg"
                    : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                }`}
            >
              <span>{tab.label}</span>
              {countUnread(tab.key as "inbox" | "sent") > 0 && (
                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                  {countUnread(tab.key as "inbox" | "sent")}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Email List / Thread */}
      <div className="flex-1 overflow-hidden border-r border-slate-200/60 dark:border-slate-800/60">
        {selectedMail ? (
          <div className="h-full flex flex-col p-6 animate-in slide-in-from-right-1 duration-200 overflow-auto">
            <div className="flex items-center mb-4">
              <button
                onClick={() => setSelectedMail(null)}
                className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <ArrowLeft className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
              </button>
              <h2 className="text-xl font-semibold ml-3 text-neutral-900 dark:text-neutral-100">
                {selectedMail.subject}
              </h2>
            </div>

            {/* Thread view */}
            <div className="flex flex-col gap-2">
              {renderThread(selectedMail)}
            </div>

            {/* Reply Box */}
            <div className="mt-4 flex flex-col gap-2">
              <textarea
                placeholder="Write a reply..."
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 h-24"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button
                onClick={handleReply}
                className="self-end flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Send className="h-4 w-4" /> Reply
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto h-full">
            {emails.map((mail) => (
              <div
                key={mail.id}
                onClick={() => setSelectedMail(mail)}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer border-b border-slate-200/60 dark:border-slate-800/60 transition-all duration-200
                  hover:bg-blue-50 dark:hover:bg-neutral-800 ${
                    mail.unread
                      ? "bg-blue-50 dark:bg-neutral-800 font-semibold"
                      : ""
                  }`}
              >
                <div className="flex flex-col flex-1 min-w-0">
                  <p className="truncate">{mail.from}</p>
                  <p className="truncate text-neutral-600 dark:text-neutral-400">
                    {mail.subject} - {mail.body.substring(0, 60)}...
                  </p>
                </div>
                <div className="flex flex-col items-end ml-4 text-xs text-neutral-500 dark:text-neutral-400">
                  {mail.unread && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full mb-1"></span>
                  )}
                  <span>{new Date(mail.date).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Mail Modal */}
      {showNewMail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => setShowNewMail(false)}
              className="absolute top-3 right-3 p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
              New Mail
            </h2>
            <input
              type="text"
              placeholder="To (comma-separated emails)"
              className="w-full mb-3 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={newMail.to}
              onChange={(e) => setNewMail({ ...newMail, to: e.target.value })}
            />
            <input
              type="text"
              placeholder="Subject"
              className="w-full mb-3 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={newMail.subject}
              onChange={(e) =>
                setNewMail({ ...newMail, subject: e.target.value })
              }
            />
            <textarea
              placeholder="Message..."
              className="w-full mb-3 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 h-32"
              value={newMail.body}
              onChange={(e) => setNewMail({ ...newMail, body: e.target.value })}
            />
            <div className="flex justify-end">
              <button
                onClick={handleSendMail}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
