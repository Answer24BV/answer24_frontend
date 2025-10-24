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

const EMAIL_API_BASE_URL =
  process.env.NEXT_PUBLIC_EMAIL_API_BASE_URL || "https://answer24.nl/api/v1";

export default function EmailDashboardClient() {
  const [mails, setMails] = useState<Mail[]>([]);
  const [activeTab, setActiveTab] = useState<"inbox" | "sent" | "pending">("inbox");
  const [loading, setLoading] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [newMail, setNewMail] = useState({
    to: [] as string[],
    subject: "",
    body: "",
  });

  // Fetch emails based on the active tab
  const fetchEmails = async () => {
    try {
      setLoading(true);
      if (activeTab === "pending") {
        setLoading(false);
        return; // Pending mails are only local
      }

      const res = await axios.get(`${EMAIL_API_BASE_URL}/emails`, {
        params: { folder: activeTab === "inbox" ? "Inbox" : "Sent" },
      });

      if (res.data.success) {
        const fetchedEmails: Mail[] = res.data.data.data.map((email: any) => ({
          id: email.id,
          from: email.messages?.[0]?.from || "Unknown",
          to: email.messages?.[0]?.to || [],
          subject: email.subject,
          body: email.messages?.[0]?.body || "",
          date: email.updated_at,
          unread: email.unread_count > 0,
          category: activeTab,
          thread: email.messages || [],
        }));
        setMails(fetchedEmails);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load emails");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [activeTab]);

  // Handle send mail
  const handleSendMail = async () => {
    if (!newMail.to.length || !newMail.body.trim()) {
      toast.error("Recipient and message body are required");
      return;
    }

    const pendingMail: Mail = {
      id: Date.now(),
      from: "You",
      to: newMail.to,
      subject: newMail.subject || "(No Subject)",
      body: newMail.body,
      date: new Date().toISOString(),
      unread: false,
      category: "pending",
      thread: [],
    };

    setMails((prev) => [...prev, pendingMail]);
    toast.info("Mail added to Pending...");

    try {
      const response = await axios.post(`${EMAIL_API_BASE_URL}/emails`, {
        to: newMail.to,
        subject: newMail.subject,
        body: newMail.body,
      });

      if (response.data.success) {
        toast.success("Mail sent successfully!");
        setMails((prev) =>
          prev.map((mail) =>
            mail.id === pendingMail.id ? { ...mail, category: "sent" } : mail
          )
        );
      } else {
        toast.error("Failed to send mail");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error sending mail");
    } finally {
      setShowComposer(false);
      setNewMail({ to: [], subject: "", body: "" });
    }
  };

  const filteredMails = mails.filter((m) => m.category === activeTab);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "inbox" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("inbox")}
          >
            Inbox
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "sent" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("sent")}
          >
            Sent
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "pending" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </button>
        </div>

        <button
          onClick={() => setShowComposer(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md"
        >
          <Plus size={18} /> New Mail
        </button>
      </div>

      {loading ? (
        <p>Loading emails...</p>
      ) : filteredMails.length === 0 ? (
        <p>No {activeTab} mails found.</p>
      ) : (
        <div className="space-y-3">
          {filteredMails.map((mail) => (
            <div
              key={mail.id}
              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">{mail.subject}</h4>
                <span className="text-sm text-gray-500">
                  {new Date(mail.date).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700 text-sm mt-2 line-clamp-2">
                {mail.body}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                From: {mail.from} → {mail.to.join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setShowComposer(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Compose Mail</h2>

            <input
              type="text"
              placeholder="Recipient emails (comma separated)"
              className="w-full border rounded-md px-3 py-2 mb-3"
              onChange={(e) =>
                setNewMail((prev) => ({
                  ...prev,
                  to: e.target.value.split(",").map((t) => t.trim()),
                }))
              }
            />

            <input
              type="text"
              placeholder="Subject"
              className="w-full border rounded-md px-3 py-2 mb-3"
              value={newMail.subject}
              onChange={(e) =>
                setNewMail((prev) => ({ ...prev, subject: e.target.value }))
              }
            />

            <textarea
              placeholder="Message body"
              className="w-full border rounded-md px-3 py-2 h-32 mb-4"
              value={newMail.body}
              onChange={(e) =>
                setNewMail((prev) => ({ ...prev, body: e.target.value }))
              }
            />

            <button
              onClick={handleSendMail}
              className="bg-blue-600 text-white w-full flex justify-center items-center gap-2 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <Send size={18} /> Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
