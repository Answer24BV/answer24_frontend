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
  category: "inbox" | "sent";
  thread?: Mail[];
}

const EMAIL_API_URL = process.env.NEXT_PUBLIC_EMAIL_API_URL || "https://api.answer24.nl/api/v1";

export default function EmailDashboardClient() {
  const [emails, setEmails] = useState<Mail[]>([]);
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [reply, setReply] = useState("");
  const [folder, setFolder] = useState<"inbox" | "sent">("inbox");
  const [loading, setLoading] = useState(false);

  // Get token or fallback to user_data.id
  const token = localStorage.getItem("auth_token");
  const userData = localStorage.getItem("user_data");
  const user = userData ? JSON.parse(userData) : null;
  const userId = user?.id;

  useEffect(() => {
    fetchEmails();
  }, [folder]);

  const fetchEmails = async () => {
    try {
      setLoading(true);

      const headers: any = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await axios.get(`${EMAIL_API_URL}/emails`, {
        headers,
        params: { folder },
      });

      setEmails(response.data.data || []);
    } catch (error: any) {
      console.error("Error fetching emails:", error);
      toast.error("Failed to load emails");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (to: string, subject: string, body: string) => {
    try {
      const headers: any = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const payload = {
        from_id: userId,
        to,
        subject,
        body,
      };

      await axios.post(`${EMAIL_API_URL}/emails`, payload, { headers });
      toast.success("Email sent successfully!");
      setIsComposing(false);
      fetchEmails();
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email");
    }
  };

  const handleReply = async () => {
    if (!selectedMail) return;

    try {
      const headers: any = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const payload = {
        from_id: userId,
        to: selectedMail.from,
        subject: `Re: ${selectedMail.subject}`,
        body: reply,
      };

      await axios.post(`${EMAIL_API_URL}/emails`, payload, { headers });
      toast.success("Reply sent!");
      setReply("");
      setSelectedMail(null);
      fetchEmails();
    } catch (error: any) {
      console.error("Error replying:", error);
      toast.error("Failed to send reply");
    }
  };

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

      {/* Folder Toggle */}
      <div className="flex gap-4 mb-4">
        {["inbox", "sent"].map((type) => (
          <button
            key={type}
            onClick={() => setFolder(type as "inbox" | "sent")}
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

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading emails...</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Email List */}
          <div className="col-span-1 bg-white rounded-2xl shadow p-4 overflow-y-auto max-h-[70vh]">
            {emails.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No emails found</p>
            ) : (
              emails.map((mail) => (
                <div
                  key={mail.id}
                  onClick={() => setSelectedMail(mail)}
                  className={`p-4 rounded-xl mb-2 cursor-pointer hover:bg-blue-50 ${
                    selectedMail?.id === mail.id ? "bg-blue-100" : ""
                  }`}
                >
                  <p className="font-semibold text-gray-900">{mail.subject}</p>
                  <p className="text-sm text-gray-600 truncate">{mail.body}</p>
                  <p className="text-xs text-gray-400 mt-1">{mail.date}</p>
                </div>
              ))
            )}
          </div>

          {/* Email View / Compose */}
          <div className="col-span-2 bg-white rounded-2xl shadow p-6">
            {isComposing ? (
              <ComposeEmail onSend={handleSendEmail} onCancel={() => setIsComposing(false)} />
            ) : selectedMail ? (
              <div>
                <button
                  onClick={() => setSelectedMail(null)}
                  className="flex items-center gap-2 text-gray-500 mb-4 hover:text-gray-800"
                >
                  <ArrowLeft size={18} /> Back
                </button>
                <h2 className="text-xl font-bold mb-2">{selectedMail.subject}</h2>
                <p className="text-sm text-gray-500 mb-6">{selectedMail.from}</p>
                <p className="mb-6">{selectedMail.body}</p>
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
              <p className="text-gray-500 text-center py-10">Select an email to view</p>
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
    if (!to || !subject || !body) return toast.error("All fields are required");
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
        type="email"
        placeholder="To"
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
