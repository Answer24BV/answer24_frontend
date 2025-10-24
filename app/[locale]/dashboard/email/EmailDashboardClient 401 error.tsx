"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, ArrowLeft, X, Send } from "lucide-react";
import { toast } from "react-toastify";

interface Mail {
  id: number;
  from: string;
  to: string[];
  subject: string;
  body: string;
  date: string;
  unread: boolean;
  category: "inbox" | "sent" | "pending";
  thread?: Mail[];
}

const EMAIL_API_URL =
  process.env.NEXT_PUBLIC_EMAIL_API_URL || "https://api.answer24.nl/api/v1";

export default function EmailDashboardClient() {
  const [emails, setEmails] = useState<Mail[]>([]);
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [reply, setReply] = useState("");
  const [folder, setFolder] = useState<"inbox" | "sent" | "pending">("inbox");
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("auth_token")?.split(",")[1]?.replace("]", "").trim()
      : null;

  const userData =
    typeof window !== "undefined" ? localStorage.getItem("user_data") : null;
  const user = userData ? JSON.parse(userData) : null;
  const userId = user?.id;
  const userEmail = user?.email || `user${userId}@answer24.com`;

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    fetchEmails();
  }, [folder]);

  useEffect(() => {
    // Retry pending emails every 30 seconds
    const interval = setInterval(() => {
      retryPendingEmails();
    }, 30000);

    return () => clearInterval(interval);
  }, [emails]);

  const fetchEmails = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${EMAIL_API_URL}/emails`, {
        headers,
        params: { folder: folder === "pending" ? "Sent" : folder },
      });

      const data = response.data?.data?.data || [];
      const formatted = data.map((email: any) => ({
        id: email.id,
        from: email.messages?.[0]?.from || "Unknown",
        to: email.messages?.[0]?.to || [],
        subject: email.subject || "(No Subject)",
        body: email.messages?.[0]?.body || "",
        date: email.updated_at,
        unread: email.unread_count > 0,
        category: folder === "pending" ? "pending" : folder,
        thread: email.messages || [],
      }));

      setEmails(formatted);
    } catch {
      // suppress errors
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (to: string, subject: string, body: string) => {
    const toArray = to.split(",").map((t) => t.trim()).filter(Boolean);

    // Add to pending list first
    const pendingMail: Mail = {
      id: Date.now(),
      from: userEmail,
      to: toArray,
      subject: subject || "(No Subject)",
      body,
      date: new Date().toISOString(),
      unread: false,
      category: "pending",
    };
    setEmails((prev) => [...prev, pendingMail]);
    toast.info("Mail added to pending...");

    try {
      await axios.post(
        `${EMAIL_API_URL}/emails`,
        { to: toArray, subject, body },
        { headers }
      );

      // Update mail to sent
      setEmails((prev) =>
        prev.map((m) =>
          m.id === pendingMail.id ? { ...m, category: "sent" } : m
        )
      );

      toast.success("Mail sent successfully!");
    } catch {
      // leave it in pending
      toast.success("Mail stored in pending (will retry automatically).");
    } finally {
      setIsComposing(false);
      fetchEmails();
    }
  };

  const retryPendingEmails = async () => {
    const pending = emails.filter((m) => m.category === "pending");

    for (const mail of pending) {
      try {
        await axios.post(
          `${EMAIL_API_URL}/emails`,
          {
            to: mail.to,
            subject: mail.subject,
            body: mail.body,
          },
          { headers }
        );

        // Move to sent
        setEmails((prev) =>
          prev.map((m) =>
            m.id === mail.id ? { ...m, category: "sent" } : m
          )
        );

        toast.success(`Pending email to ${mail.to.join(", ")} sent successfully!`);
      } catch {
        // still pending, no action needed
      }
    }
  };

  const handleReply = async () => {
    if (!selectedMail) return;

    const threadId = selectedMail.id;

    try {
      await axios.post(
        `${EMAIL_API_URL}/emails`,
        {
          thread_id: threadId,
          to: [selectedMail.from],
          body: reply,
        },
        { headers }
      );

      toast.success("Reply sent!");
      setReply("");
      setSelectedMail(null);
      fetchEmails();
    } catch {
      // store reply as pending
      const pendingReply: Mail = {
        id: Date.now(),
        from: userEmail,
        to: [selectedMail.from],
        subject: `Re: ${selectedMail.subject}`,
        body: reply,
        date: new Date().toISOString(),
        unread: false,
        category: "pending",
      };
      setEmails((prev) => [...prev, pendingReply]);
      toast.success("Reply stored in pending (will retry automatically).");
      setReply("");
      setSelectedMail(null);
      fetchEmails();
    }
  };

  const filteredEmails = emails.filter((e) => e.category === folder);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Emails</h1>
        <button
          onClick={() => setIsComposing(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Compose
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        {["inbox", "sent", "pending"].map((type) => (
          <button
            key={type}
            onClick={() => setFolder(type as any)}
            className={`px-4 py-2 rounded-xl ${
              folder === type
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading emails...</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="col-span-1 bg-white rounded-2xl shadow p-4 overflow-y-auto max-h-[70vh]">
            {filteredEmails.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No emails found</p>
            ) : (
              filteredEmails.map((mail) => (
                <div
                  key={mail.id}
                  onClick={() => setSelectedMail(mail)}
                  className={`p-4 rounded-xl mb-2 cursor-pointer hover:bg-blue-50 ${
                    selectedMail?.id === mail.id ? "bg-blue-100" : ""
                  }`}
                >
                  <p className="font-semibold text-gray-900">{mail.subject}</p>
                  <p className="text-sm text-gray-600 truncate">{mail.body}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(mail.date).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="col-span-2 bg-white rounded-2xl shadow p-6">
            {isComposing ? (
              <ComposeEmail
                onSend={handleSendEmail}
                onCancel={() => setIsComposing(false)}
              />
            ) : selectedMail ? (
              <div>
                <button
                  onClick={() => setSelectedMail(null)}
                  className="flex items-center gap-2 text-gray-500 mb-4 hover:text-gray-800"
                >
                  <ArrowLeft size={18} /> Back
                </button>
                <h2 className="text-xl font-bold mb-2">{selectedMail.subject}</h2>
                <p className="text-sm text-gray-500 mb-6">
                  From: {selectedMail.from}
                </p>
                <p className="mb-6 whitespace-pre-line">{selectedMail.body}</p>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full border rounded-xl p-3 mb-3"
                  rows={4}
                />
                <button
                  onClick={handleReply}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
                >
                  <Send size={16} /> Send Reply
                </button>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-10">
                Select an email to view
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ComposeEmail({
  onSend,
  onCancel,
}: {
  onSend: (to: string, subject: string, body: string) => void;
  onCancel: () => void;
}) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = () => {
    if (!to || !body) return toast.error("Recipient and message are required");
    onSend(to, subject, body);
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">New Email</h2>
        <button onClick={onCancel}>
          <X size={20} className="text-gray-500 hover:text-gray-800" />
        </button>
      </div>
      <input
        type="text"
        placeholder="Recipients (comma separated)"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="w-full border rounded-xl p-3 mb-3"
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full border rounded-xl p-3 mb-3"
      />
      <textarea
        placeholder="Message"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full border rounded-xl p-3 mb-3"
        rows={6}
      />
      <button
        onClick={handleSubmit}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
      >
        <Send size={16} /> Send
      </button>
    </div>
  );
}
