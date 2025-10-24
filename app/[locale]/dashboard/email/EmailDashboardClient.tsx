"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, ArrowLeft, X, Send } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tokenUtils } from "@/utils/auth";

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

const EMAIL_API_URL = process.env.NEXT_PUBLIC_EMAIL_API_URL || "https://api.answer24.nl/api/v1";

export default function EmailDashboardClient() {
  const [emails, setEmails] = useState<Mail[]>([]);
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [reply, setReply] = useState("");
  const [folder, setFolder] = useState<"inbox" | "sent" | "pending">("inbox");
  const [loading, setLoading] = useState(false);

  const user = tokenUtils.getUser();
  const userId = user?.id ?? null;
  const userEmail = user?.email ?? (userId ? `user${userId}@example.com` : "you@example.com");
  const token = tokenUtils.getToken();

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
  const extraParams = userId ? { user_id: userId } : {};

  // Load emails on folder change
  useEffect(() => { fetchEmails(); }, [folder]);

  // Retry pending emails every 30s
  useEffect(() => {
    const interval = setInterval(retryPendingEmails, 30000);
    return () => clearInterval(interval);
  }, [emails]);

  // --- FETCH EMAILS ---
  const fetchEmails = async () => {
    setLoading(true);
    try {
      if (folder === "pending") {
        const stored = localStorage.getItem("pendingEmails");
        const pending: Mail[] = stored ? JSON.parse(stored) : [];
        setEmails(pending);
      } else {
        const resp = await axios.get(`${EMAIL_API_URL}/emails`, {
          headers: authHeaders,
          params: { folder: folder === "inbox" ? "Inbox" : "Sent", ...extraParams },
        });

        const list = resp.data?.data?.data ?? [];
        const formatted: Mail[] = list.map((e: any) => ({
          id: e.id,
          from: e.messages?.[0]?.from || "Unknown",
          to: e.messages?.[0]?.to || [],
          subject: e.subject || "(No Subject)",
          body: e.messages?.[0]?.body || "",
          date: e.updated_at || new Date().toISOString(),
          unread: (e.unread_count ?? 0) > 0,
          category: folder,
          thread: e.messages || [],
        }));

        setEmails(formatted);
      }
      toast.success("Emails loaded successfully!");
    } catch (err) {
      // toast.warn("Failed to fetch emails. Loading pending...");
      setFolder("pending");
    } finally {
      setLoading(false);
    }
  };

  // --- PENDING EMAIL HANDLING ---
  const addPendingMail = (mail: Mail) => {
    setEmails(prev => [...prev, mail]);
    try {
      const stored = localStorage.getItem("pendingEmails");
      const arr: Mail[] = stored ? JSON.parse(stored) : [];
      if (!arr.find(m => m.id === mail.id)) arr.push(mail);
      localStorage.setItem("pendingEmails", JSON.stringify(arr));
    } catch {}
  };

  const removePendingMail = (id: number) => {
    setEmails(prev => prev.filter(m => m.id !== id));
    try {
      const stored = localStorage.getItem("pendingEmails");
      const arr: Mail[] = stored ? JSON.parse(stored) : [];
      const newArr = arr.filter(m => m.id !== id);
      localStorage.setItem("pendingEmails", JSON.stringify(newArr));
    } catch {}
  };

  // --- SEND EMAIL ---
  const handleSendEmail = async (to: string, subject: string, body: string) => {
    const toArray = to.split(",").map(s => s.trim()).filter(Boolean);
    if (toArray.length === 0) return toast.error("Please add at least one recipient");

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

    addPendingMail(pendingMail);
    toast.info("Mail queued — added to Pending.");

    try {
      await axios.post(`${EMAIL_API_URL}/emails`, { to: toArray, subject, body, ...extraParams }, { headers: authHeaders });
      setEmails(prev => prev.map(m => m.id === pendingMail.id ? { ...m, category: "sent" } : m));
      removePendingMail(pendingMail.id);
      toast.success("Mail sent successfully!");
    } catch {
      toast.warn("Mail stored in Pending. Will retry automatically.");
    } finally {
      setIsComposing(false);
      fetchEmails();
    }
  };

  // --- REPLY ---
  const handleReply = async () => {
    if (!selectedMail) return;
    const payload = { thread_id: selectedMail.id, to: [selectedMail.from], body: reply, ...extraParams };

    try {
      await axios.post(`${EMAIL_API_URL}/emails`, payload, { headers: authHeaders });
      toast.success("Reply sent!");
      setReply("");
      setSelectedMail(null);
      fetchEmails();
    } catch {
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
      addPendingMail(pendingReply);
      toast.info("Reply stored in Pending.");
      setReply("");
      setSelectedMail(null);
      fetchEmails();
    }
  };

  // --- RETRY PENDING ---
  const retryPendingEmails = async () => {
    const pending = emails.filter(e => e.category === "pending");
    for (const mail of pending) {
      try {
        await axios.post(`${EMAIL_API_URL}/emails`, { to: mail.to, subject: mail.subject, body: mail.body, ...extraParams }, { headers: authHeaders });
        setEmails(prev => prev.map(p => p.id === mail.id ? { ...p, category: "sent" } : p));
        removePendingMail(mail.id);
        toast.success(`Pending email to ${mail.to.join(", ")} sent!`);
      } catch {}
    }
  };

  const filtered = emails.filter(m => m.category === folder);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Emails</h1>
        <button onClick={() => setIsComposing(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
          <Plus size={18} /> Compose
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        {["inbox", "sent", "pending"].map(t => (
          <button key={t} onClick={() => setFolder(t as any)} className={`px-4 py-2 rounded-xl ${folder === t ? "bg-blue-600 text-white" : "bg-white text-gray-700 border"}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading emails...</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="col-span-1 bg-white rounded-2xl shadow p-4 overflow-y-auto max-h-[70vh]">
            {filtered.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No emails found</p>
            ) : (
              filtered.map(mail => (
                <div key={mail.id} onClick={() => setSelectedMail(mail)} className={`p-4 rounded-xl mb-2 cursor-pointer hover:bg-blue-50 ${selectedMail?.id === mail.id ? "bg-blue-100" : ""}`}>
                  <p className="font-semibold text-gray-900">{mail.subject}</p>
                  <p className="text-sm text-gray-600 truncate">{mail.body}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(mail.date).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>

          <div className="col-span-2 bg-white rounded-2xl shadow p-6">
            {isComposing ? (
              <ComposeEmail onSend={handleSendEmail} onCancel={() => setIsComposing(false)} />
            ) : selectedMail ? (
              <div>
                <button onClick={() => setSelectedMail(null)} className="flex items-center gap-2 text-gray-500 mb-4 hover:text-gray-800">
                  <ArrowLeft size={18} /> Back
                </button>
                <h2 className="text-xl font-bold mb-2">{selectedMail.subject}</h2>
                <p className="text-sm text-gray-500 mb-6">From: {selectedMail.from}</p>
                <p className="mb-6 whitespace-pre-line">{selectedMail.body}</p>
                <textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply..." className="w-full border rounded-xl p-3 mb-3" rows={4} />
                <button onClick={handleReply} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
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

// --- COMPOSE EMAIL COMPONENT ---
function ComposeEmail({ onSend, onCancel }: { onSend: (to: string, subject: string, body: string) => void; onCancel: () => void; }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = () => {
    onSend(to, subject, body);
    onCancel();
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">New Email</h2>
        <button onClick={onCancel}><X size={20} className="text-gray-500 hover:text-gray-800" /></button>
      </div>
      <input type="text" placeholder="Recipients (comma separated)" value={to} onChange={(e) => setTo(e.target.value)} className="w-full border rounded-xl p-3 mb-3" />
      <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full border rounded-xl p-3 mb-3" />
      <textarea placeholder="Message" value={body} onChange={(e) => setBody(e.target.value)} className="w-full border rounded-xl p-3 mb-3" rows={6} />
      <button onClick={handleSubmit} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
        <Send size={16} /> Send
      </button>
    </div>
  );
}
