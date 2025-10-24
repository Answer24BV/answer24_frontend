"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, ArrowLeft, X, Send } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const userDataRaw = typeof window !== "undefined" ? localStorage.getItem("user_data") : null;
  const parsedUser = userDataRaw ? JSON.parse(userDataRaw) : null;
  const userId = parsedUser?.id ?? null;
  const userEmail = parsedUser?.email ?? (userId ? `user${userId}@example.com` : "you@example.com");

  const extraParams = userId ? { user_id: userId } : {};

  useEffect(() => {
  fetchEmails();
}, [folder]);


  useEffect(() => {
    const interval = setInterval(retryPendingEmails, 30000);
    return () => clearInterval(interval);
  }, [emails]);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      if (folder === "pending") {
        // Load pending from localStorage
        const stored = localStorage.getItem("pendingEmails");
        const pending: Mail[] = stored ? JSON.parse(stored) : [];
        setEmails(pending);
      } else {
        const resp = await axios.get(`${EMAIL_API_URL}/emails`, {
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
    } catch {
      toast.success("Loaded cached/pending emails (if any).");
    } finally {
      setLoading(false);
    }
  };

  const addPendingMailLocally = (mail: Mail) => {
    setEmails(prev => [...prev, mail]);
    try {
      const stored = localStorage.getItem("pendingEmails");
      const arr = stored ? JSON.parse(stored) : [];
      arr.push(mail);
      localStorage.setItem("pendingEmails", JSON.stringify(arr));
    } catch {}
  };

  const removePendingMailFromLocalStorage = (id: number) => {
    try {
      const stored = localStorage.getItem("pendingEmails");
      const arr = stored ? JSON.parse(stored) : [];
      const newArr = arr.filter((m: any) => m.id !== id);
      localStorage.setItem("pendingEmails", JSON.stringify(newArr));
    } catch {}
  };

  const handleSendEmail = async (to: string, subject: string, body: string) => {
    const toArray = to.split(",").map(s => s.trim()).filter(Boolean);
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

    addPendingMailLocally(pendingMail);
    toast.success("Mail queued — added to Pending.");

    try {
      await axios.post(`${EMAIL_API_URL}/emails`, { to: toArray, subject, body, ...extraParams });
      setEmails(prev => prev.map(m => m.id === pendingMail.id ? { ...m, category: "sent" } : m));
      removePendingMailFromLocalStorage(pendingMail.id);
      toast.success("Mail sent successfully!");
    } catch {
      toast.success("Mail stored in Pending (will retry automatically).");
    } finally {
      setIsComposing(false);
      fetchEmails();
    }
  };

  const handleReply = async () => {
    if (!selectedMail) return;
    const threadId = selectedMail.id;
    const payload = { thread_id: threadId, to: [selectedMail.from], body: reply, ...extraParams };

    try {
      await axios.post(`${EMAIL_API_URL}/emails`, payload);
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
      addPendingMailLocally(pendingReply);
      toast.success("Reply stored in Pending (will retry automatically).");
      setReply("");
      setSelectedMail(null);
      fetchEmails();
    }
  };

  const retryPendingEmails = async () => {
    const pendingFromState = emails.filter(e => e.category === "pending");
    let pendingFromStorage: any[] = [];
    try { pendingFromStorage = JSON.parse(localStorage.getItem("pendingEmails") || "[]"); } catch {}
    
    const byId = new Map<number, Mail>();
    pendingFromStorage.forEach(m => byId.set(m.id, m));
    pendingFromState.forEach(m => byId.set(m.id, m));
    const pendingUnified = Array.from(byId.values());

    for (const mail of pendingUnified) {
      try {
        await axios.post(`${EMAIL_API_URL}/emails`, { to: mail.to, subject: mail.subject, body: mail.body, ...extraParams });
        setEmails(prev => prev.map(p => p.id === mail.id ? { ...p, category: "sent" } : p));
        removePendingMailFromLocalStorage(mail.id);
        toast.success(`Pending message to ${mail.to.join(", ")} sent!`);
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
