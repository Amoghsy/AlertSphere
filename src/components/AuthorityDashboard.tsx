"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DisasterMap } from "./DisasterMap";
import { ResourceTable } from "./ResourceTable";
import { CitizenReportsTable } from "./CitizenReportsTable";
import { AnalyticsChart } from "./AnalyticsChart";
import {
  LayoutDashboard,
  AlertTriangle,
  FileText,
  Users,
  Package,
  Radio,
  BarChart3,
  User,
  Menu,
  ChevronLeft,
  Send,
} from "lucide-react";

// 🔥 Firebase imports
import { db } from "../firebase/config";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

interface AuthorityDashboardProps {
  onLogout: () => void;
}

type MenuSection =
  | "dashboard"
  | "alerts"
  | "reports"
  | "teams"
  | "resources"
  | "broadcast";

interface IncidentData {
  id: string;
  incidentType: string;
  severity: string;
  location: string;
  description: string;
  timestamp?: Timestamp;
}

interface TeamData {
  id: string;
  teamName: string;
  teamLead: string;
  contact: string;
  status: string;
  timestamp?: Timestamp;
}

interface ResourceData {
  id: string;
  resourceName: string;
  quantity: string;
  location: string;
  status: string;
  timestamp?: Timestamp;
}

interface BroadcastData {
  id: string;
  title: string;
  message: string;
  timestamp?: Timestamp;
}

export function AuthorityDashboard({ onLogout }: AuthorityDashboardProps) {
  const [activeSection, setActiveSection] = useState<MenuSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [incidents, setIncidents] = useState<IncidentData[]>([]);
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [resources, setResources] = useState<ResourceData[]>([]);
  const [broadcasts, setBroadcasts] = useState<BroadcastData[]>([]);

  const [, setLoading] = useState(true);

  // 🔹 Form States
  const [teamName, setTeamName] = useState("");
  const [teamLead, setTeamLead] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState("Available");

  const [resourceName, setResourceName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [resourceLocation, setResourceLocation] = useState("");
  const [resourceStatus, setResourceStatus] = useState("Available");

  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");

  // 🧭 Fetch Incidents
  useEffect(() => {
    const q = query(collection(db, "incidents"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as IncidentData[];
      setIncidents(fetched);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 🧭 Fetch Teams
  useEffect(() => {
    const q = query(collection(db, "rescueTeams"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TeamData[];
      setTeams(data);
    });
    return () => unsubscribe();
  }, []);

  // 🧭 Fetch Resources
  useEffect(() => {
    const q = query(collection(db, "resources"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ResourceData[];
      setResources(data);
    });
    return () => unsubscribe();
  }, []);

  // 🧭 Fetch Broadcasts
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

  // ➕ Add Team
  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !teamLead || !contact) return alert("⚠️ Fill all fields!");
    await addDoc(collection(db, "rescueTeams"), {
      teamName,
      teamLead,
      contact,
      status,
      timestamp: serverTimestamp(),
    });
    setTeamName("");
    setTeamLead("");
    setContact("");
    setStatus("Available");
  };

  // ➕ Add Resource
  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceName || !quantity || !resourceLocation)
      return alert("⚠️ Fill all fields!");
    await addDoc(collection(db, "resources"), {
      resourceName,
      quantity,
      location: resourceLocation,
      status: resourceStatus,
      timestamp: serverTimestamp(),
    });
    setResourceName("");
    setQuantity("");
    setResourceLocation("");
    setResourceStatus("Available");
  };

  // ➕ Send Broadcast
  // ➕ Send Broadcast (FCM + Firestore)
const handleSendBroadcast = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!broadcastTitle || !broadcastMessage) {
    alert("⚠️ Please enter both title and message!");
    return;
  }

  try {
    // 1️⃣ Send push notification via Node.js server
    const response = await fetch("https://alertspherenotifyserver.onrender.com/send-broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: broadcastTitle,
        message: broadcastMessage,
      }),
    });

    const resData = await response.json();
    console.log("Broadcast Push Result:", resData);

    if (!response.ok) {
      alert("❌ Failed to send push notification to citizens.");
    } else {
      alert("✅ Push Notification Sent to Citizens!");
    }

    // 2️⃣ Save broadcast to Firestore history
    await addDoc(collection(db, "broadcasts"), {
      title: broadcastTitle,
      message: broadcastMessage,
      timestamp: serverTimestamp(),
    });

    // Reset fields
    setBroadcastTitle("");
    setBroadcastMessage("");
  } catch (error) {
    console.error("❌ Broadcast error:", error);
    alert("❌ Error sending broadcast!");
  }
};


  // 📊 Dashboard Stats
  const activeAlerts = incidents.filter((i) => i.severity === "critical").length;
  const totalReports = incidents.length;
// 🗺️ Convert incidents into map markers
const mapMarkers = incidents.map((incident) => {
  const latMatch = /Lat:\s*([-+]?\d*\.\d+)/.exec(incident.location);
  const lngMatch = /Lng:\s*([-+]?\d*\.\d+)/.exec(incident.location);
  const lat = latMatch ? parseFloat(latMatch[1]) : 12.9716;
  const lng = lngMatch ? parseFloat(lngMatch[1]) : 77.5946;

  return {
    id: incident.id,
    type: incident.incidentType,
    severity: incident.severity,
    location: incident.location,
    description: incident.description,
    lat,
    lng,
  };
});

  const menuItems = [
    { id: "dashboard" as MenuSection, label: "Dashboard", icon: LayoutDashboard },
    { id: "alerts" as MenuSection, label: "Active Alerts", icon: AlertTriangle },
    { id: "reports" as MenuSection, label: "Citizen Reports", icon: FileText },
    { id: "teams" as MenuSection, label: "Rescue Teams", icon: Users },
    { id: "resources" as MenuSection, label: "Resources", icon: Package },
    { id: "broadcast" as MenuSection, label: "Broadcast & Analytics", icon: Radio },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0 lg:w-20"
        } transition-all duration-300 bg-slate-900 text-white flex flex-col fixed lg:static h-screen z-50 overflow-hidden`}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span>Alert Sphere Admin</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-slate-800"
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Nav Menu */}
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                  activeSection === item.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <User className="w-5 h-5" /> {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 p-4 flex justify-between">
          <h1 className="text-slate-900 font-medium">
            {menuItems.find((i) => i.id === activeSection)?.label}
          </h1>
          
        </header>

        {/* Main Sections */}
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          {/* Dashboard */}
          {activeSection === "dashboard" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Active Alerts" value={activeAlerts} color="red" />
                <StatCard title="Teams" value={teams.length} color="blue" />
                <StatCard title="Resources" value={resources.length} color="purple" />
                <StatCard title="Total Reports" value={totalReports} color="orange" />
              </div>

              <DisasterMap markers={mapMarkers} height="450px" />

              <div className="grid lg:grid-cols-2 gap-6">
                <ResourceTable />
                <CitizenReportsTable />
              </div>
              <AnalyticsChart />
            </>
          )}

          {/* Alerts */}
          {activeSection === "alerts" && (
            <section className="bg-white p-6 rounded-xl shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Active Alerts</h2>
              <DisasterMap markers={mapMarkers} height="500px" />
            </section>
          )}

          {/* Reports */}
          {activeSection === "reports" && (
            <section className="bg-white p-6 rounded-xl shadow-sm">
              <CitizenReportsTable expanded />
            </section>
          )}

          {/* Teams */}
          {activeSection === "teams" && (
            <ManageSection
              title="Rescue Teams"
              onSubmit={handleAddTeam}
              inputs={[
                { label: "Team Name", value: teamName, setValue: setTeamName },
                { label: "Team Lead", value: teamLead, setValue: setTeamLead },
                { label: "Contact", value: contact, setValue: setContact },
              ]}
              select={{
                label: "Status",
                value: status,
                setValue: setStatus,
                options: ["Available", "Deployed", "On Standby"],
              }}
              data={teams}
              columns={["teamName", "teamLead", "contact", "status"]}
            />
          )}

          {/* Resources */}
          {activeSection === "resources" && (
            <ManageSection
              title="Resource Management"
              onSubmit={handleAddResource}
              inputs={[
                { label: "Resource Name", value: resourceName, setValue: setResourceName },
                { label: "Quantity", value: quantity, setValue: setQuantity },
                { label: "Location", value: resourceLocation, setValue: setResourceLocation },
              ]}
              select={{
                label: "Status",
                value: resourceStatus,
                setValue: setResourceStatus,
                options: ["Available", "In Use", "Depleted"],
              }}
              data={resources}
              columns={["resourceName", "quantity", "location", "status"]}
            />
          )}

          {/* Broadcast */}
          {activeSection === "broadcast" && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Broadcast */}
              <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Radio className="w-5 h-5 text-blue-600" /> Broadcast Alerts
                </h2>
                <form onSubmit={handleSendBroadcast} className="space-y-3">
                  <Input
                    placeholder="Alert Title"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                  />
                  <textarea
                    className="border border-slate-300 rounded-lg p-2 w-full"
                    rows={3}
                    placeholder="Broadcast Message"
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                  />
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                    <Send className="w-4 h-4" /> Send Broadcast
                  </Button>
                </form>

                <div>
                  <h4 className="text-slate-900 mb-2 font-medium">Recent Broadcasts</h4>
                  {broadcasts.length === 0 ? (
                    <p className="text-slate-500 italic">No broadcasts yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {broadcasts.map((b) => (
                        <li key={b.id} className="border border-slate-200 rounded-lg p-3">
                          <h4 className="font-semibold text-slate-800">{b.title}</h4>
                          <p className="text-slate-600 text-sm">{b.message}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Analytics */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" /> Analytics Overview
                </h2>
                <AnalyticsChart />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* 🔹 Helper Components */

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 border-${color}-500`}>
      <div className="text-slate-600 mb-1">{title}</div>
      <div className="text-xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function ManageSection({
  title,
  onSubmit,
  inputs,
  select,
  data,
  columns,
}: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {inputs.map((input: any, i: number) => (
          <Input
            key={i}
            value={input.value}
            onChange={(e) => input.setValue(e.target.value)}
            placeholder={input.label}
            required
          />
        ))}
        <select
          value={select.value}
          onChange={(e) => select.setValue(e.target.value)}
          className="border border-slate-300 rounded-lg p-2"
        >
          {select.options.map((o: string) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Add
        </Button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-slate-200 rounded-lg">
          <thead className="bg-slate-100">
            <tr>
              {columns.map((col: string) => (
                <th key={col} className="px-4 py-2 border-b capitalize">
                  {col.replace(/([A-Z])/g, " $1")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-slate-500 italic">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  {columns.map((col: string) => (
                    <td key={col} className="px-4 py-2 border-b">
                      {item[col]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
