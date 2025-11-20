"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { AlertCard } from "./AlertCard";
import { DisasterMap } from "./DisasterMap";
import { ReportIncidentModal } from "./ReportIncidentModal";
import { SafetyTips } from "./SafetyTips";
import { EmergencyContacts } from "./EmergencyContacts";
import { Bell, User, Plus, Radio, Send } from "lucide-react";

// 🔥 Firebase imports
import { db } from "../firebase/config";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

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

const mockAlerts = [
  {
    id: 1,
    type: "Flood",
    severity: "high",
    location: "Downtown Area, Sector 5",
    timestamp: "10 mins ago",
    description:
      "Heavy rainfall causing flooding in low-lying areas. Water level rising rapidly.",
    lat: 40.7128,
    lng: -74.006,
  },
  {
    id: 2,
    type: "Fire",
    severity: "critical",
    location: "Industrial Zone, Block B",
    timestamp: "25 mins ago",
    description:
      "Large fire detected in warehouse district. Evacuate immediately.",
    lat: 40.758,
    lng: -73.9855,
  },
];

export function CitizenDashboard({ onLogout }: CitizenDashboardProps) {
  const [showReportModal, setShowReportModal] = useState(false);
  const [broadcasts, setBroadcasts] = useState<BroadcastData[]>([]);

  // ✅ Firebase stats
  const [activeAlerts, setActiveAlerts] = useState(0);
  const [sheltersCount, setSheltersCount] = useState(0);
  const [safeZonesCount, setSafeZonesCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);

  // 💬 AI Chatbot state
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "👋 Hi there! I'm your AI Disaster Assistant (Powered by Google Gemini). Ask me about safety, shelters, or alerts.",
    },
  ]);

  // 🚀 Send message to Gemini backend
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

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      const botReply =
        data.reply ||
        "⚠️ Sorry, I couldn’t get a response right now. Please try again.";

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Failed to reach the Gemini AI server. Please ensure it’s running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Firebase listeners
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 🔹 Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-slate-900 font-semibold">
            Alert Sphere Citizen
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                {broadcasts.length}
              </span>
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* 🔹 Main Section */}
      <main className="container mx-auto px-4 py-6">
        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Stat title="Active Alerts" count={activeAlerts} color="red" />
          <Stat title="Nearby Shelters" count={sheltersCount} color="blue" />
          <Stat title="Safe Zones" count={safeZonesCount} color="green" />
          <Stat title="Your Reports" count={reportsCount} color="orange" />
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Map */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-slate-900">Live Disaster Map</h2>
                <Button
                  onClick={() => setShowReportModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Report Incident
                </Button>
              </div>
              <DisasterMap markers={mockAlerts} height="500px" />
            </div>

            {/* Broadcast Alerts */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center gap-2">
                <Radio className="w-5 h-5 text-blue-600" />
                <h2 className="text-slate-900 font-semibold">
                  Broadcast Alerts
                </h2>
              </div>
              <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                {broadcasts.length === 0 ? (
                  <p className="text-slate-500 italic">No broadcasts yet.</p>
                ) : (
                  broadcasts.map((b) => (
                    <div
                      key={b.id}
                      className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="font-semibold text-slate-900">
                        {b.title}
                      </div>
                      <div className="text-slate-600 text-sm">{b.message}</div>
                      {b.timestamp && (
                        <div className="text-xs text-slate-400 mt-1">
                          {new Date(
                            b.timestamp.seconds * 1000
                          ).toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="lg:hidden">
              <EmergencyContacts />
              <SafetyTips />
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            {/* 🧠 Gemini AI Chatbot */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-blue-50">
                <h2 className="text-slate-900 font-semibold flex items-center gap-2">
                  🤖 Gemini Disaster Assistant
                  <span className="text-xs text-slate-500 ml-2">
                    (Powered by Google Gemini)
                  </span>
                </h2>
              </div>

              <div className="p-4 h-80 overflow-y-auto bg-slate-50 space-y-2">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-lg max-w-[75%] text-sm ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-slate-200 text-slate-900"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <p className="text-xs text-slate-500 italic">
                    Gemini is thinking...
                  </p>
                )}
              </div>

              <div className="flex items-center p-3 border-t border-slate-200 bg-white">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about safety, shelters, or alerts..."
                  className="flex-1 text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="ml-2 bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Live Alerts */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-slate-900 font-semibold">Live Alert Feed</h2>
              </div>
              <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                {mockAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </div>

            {/* Emergency Contacts */}
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

// 🔸 Helper Component
function Stat({
  title,
  count,
  color,
}: {
  title: string;
  count: number;
  color: string;
}) {
  return (
    <div
      className={`bg-white rounded-xl p-4 shadow-sm border-l-4 border-${color}-500`}
    >
      <div className="text-slate-600 mb-1">{title}</div>
      <div className="text-slate-900 text-xl font-semibold">{count}</div>
    </div>
  );
}
