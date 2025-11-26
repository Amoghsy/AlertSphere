"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DisasterMap } from "./DisasterMap";
import { ReportIncidentModal } from "./ReportIncidentModal";
import { SafetyTips } from "./SafetyTips";
import { EmergencyContacts } from "./EmergencyContacts";
import {Plus, Radio, Send, LogOut } from "lucide-react";


// 🔥 Firebase imports
import { db, auth, requestNotificationPermission, listenForForegroundNotifications } from "../firebase/config";
import { collection, onSnapshot, orderBy, query, doc, setDoc } from "firebase/firestore";

interface CitizenDashboardProps {
  onLogout: () => void;
}

interface BroadcastData {
  id: string;
  title: string;
  message: string;
  timestamp?: any;
}

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

export function CitizenDashboard({ onLogout }: CitizenDashboardProps) {
  const [showReportModal, setShowReportModal] = useState(false);
  const [broadcasts, setBroadcasts] = useState<BroadcastData[]>([]);

  // Firebase stats
  const [activeAlerts, setActiveAlerts] = useState(0);
  const [sheltersCount, setSheltersCount] = useState(0);
  const [safeZonesCount, setSafeZonesCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);

  // Chatbot
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "👋 Hi! I'm your AI Disaster Assistant. Ask me about alerts, safety tips, or shelters.",
    },
  ]);

  /* -------------------------------------------------------
      🔥 PUSH NOTIFICATIONS SETUP FOR CITIZEN (IMPORTANT)
  --------------------------------------------------------*/

useEffect(() => {
  async function setupNotifications() {
    const token = await requestNotificationPermission();
    if (!token) return;
    
    // Store token locally in Firestore (optional)
    if (auth.currentUser) {
      await setDoc(doc(db, "citizenTokens", auth.currentUser.uid), { token }, { merge: true });
    }

    // Send token to Node.js server so push can work
    await fetch("http://localhost:5000/register-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    console.log("🔹 Token registered with server:", token);
  }

  listenForForegroundNotifications(); // real-time notifications
  setupNotifications();
}, []);


  /* -------------------------------------------------------
      🔹 FETCH FIRESTORE COLLECTIONS
  --------------------------------------------------------*/

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "incidents"), (snap) =>
      setActiveAlerts(snap.size)
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "shelters"), (snap) =>
      setSheltersCount(snap.size)
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "safeZones"), (snap) =>
      setSafeZonesCount(snap.size)
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "citizenReports"), (snap) =>
      setReportsCount(snap.size)
    );
    return () => unsub();
  }, []);

  // Fetch new broadcasts (Auto-update UI)
  useEffect(() => {
    const q = query(collection(db, "broadcasts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BroadcastData[];
      setBroadcasts(fetched);
    });
    return () => unsubscribe();
  }, []);

  /* -------------------------------------------------------
      🧠 CHATBOT
  --------------------------------------------------------*/

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://ideaforgeserver.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botReply = data.reply || "⚠️ Unable to get a response right now.";

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error reaching server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------
      UI RENDER BELOW
  --------------------------------------------------------*/

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-slate-900 font-semibold">Alert Sphere Citizen</h1>

          <div className="flex items-center gap-2">
            

            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="container mx-auto px-4 py-6">
        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Stat title="Active Alerts" count={activeAlerts} color="red" />
          <Stat title="Nearby Shelters" count={sheltersCount} color="blue" />
          <Stat title="Safe Zones" count={safeZonesCount} color="green" />
          <Stat title="Citizen Reports" count={reportsCount} color="orange" />
        </div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Disaster Map */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b flex justify-between">
                <h2 className="text-slate-900">Live Disaster Map</h2>
                <Button
                  onClick={() => setShowReportModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 gap-2"
                >
                  <Plus className="w-4 h-4" /> Report Incident
                </Button>
              </div>
              <DisasterMap markers={[]} height="500px" />
            </div>

            {/* Broadcast Alerts */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b flex items-center gap-2">
                <Radio className="w-5 h-5 text-blue-600" />
                <h2 className="text-slate-900 font-semibold">Broadcast Alerts</h2>
              </div>

              <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                {broadcasts.length === 0 ? (
                  <p className="text-slate-500 italic">No broadcasts yet.</p>
                ) : (
                  broadcasts.map((b) => (
                    <div
                      key={b.id}
                      className="border rounded-lg p-3 hover:bg-slate-50 transition"
                    >
                      <div className="font-semibold">{b.title}</div>
                      <div className="text-slate-600 text-sm">{b.message}</div>
                      {b.timestamp && (
                        <div className="text-xs text-slate-400 mt-1">
                          {new Date(b.timestamp.seconds * 1000).toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            {/* Chatbot */}
            <ChatbotSection
              input={input}
              loading={loading}
              messages={messages}
              setInput={setInput}
              handleSendMessage={handleSendMessage}
            />

            <div className="hidden lg:block">
              <EmergencyContacts />
              <SafetyTips />
            </div>
          </div>
        </div>
      </main>

      {/* Incident Report Modal */}
      <ReportIncidentModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </div>
  );
}

/* -----------------------------------------  
    Helper Components
------------------------------------------*/

function Stat({ title, count, color }: any) {
  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border-l-4 border-${color}-500`}>
      <div className="text-slate-600 mb-1">{title}</div>
      <div className="text-xl font-semibold text-slate-900">{count}</div>
    </div>
  );
}

function ChatbotSection({ input, loading, messages, setInput, handleSendMessage }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-blue-50">
        <h2 className="text-slate-900 font-semibold flex items-center gap-2">
          🤖 Gemini Disaster Assistant
        </h2>
      </div>

      <div className="p-4 h-80 overflow-y-auto space-y-2 bg-slate-50">
        {messages.map((msg: any, i: number) => (
          <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`px-3 py-2 rounded-lg max-w-[75%] text-sm ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <p className="text-xs text-slate-500">Gemini is thinking...</p>}
      </div>

      <div className="p-3 border-t flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about safety or alerts..."
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button
          onClick={handleSendMessage}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={loading}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
