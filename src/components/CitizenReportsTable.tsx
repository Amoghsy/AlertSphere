import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { FileText, Clock, MapPin } from "lucide-react";

// 🔥 Firebase imports
import { db } from "../firebase/config";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";

interface ReportData {
  id: string;
  incidentType: string;
  severity: string;
  location: string;
  description: string;
  timestamp?: Timestamp;
  status?: string;
}

interface CitizenReportsTableProps {
  expanded?: boolean;
}

export function CitizenReportsTable({ expanded = false }: CitizenReportsTableProps) {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);

  // 📡 Real-time listener for incidents collection
  useEffect(() => {
    const q = query(collection(db, "incidents"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: ReportData[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ReportData[];

      setReports(data);
      setLoading(false);
      console.log("📡 Live data from Firestore:", data);
    });

    return () => unsubscribe();
  }, []);

  // 🟢 Update report status in Firestore
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const ref = doc(db, "incidents", id);
      await updateDoc(ref, { status: newStatus });
      console.log(`✅ Updated ${id} to status: ${newStatus}`);
    } catch (error) {
      console.error("❌ Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  // Show only top 3 if not expanded
  const displayReports = expanded ? reports : reports.slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-orange-600" />
          <h2 className="text-slate-900">Citizen Reports</h2>
        </div>
        {!expanded && (
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600"
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-slate-500">
                  Loading reports...
                </TableCell>
              </TableRow>
            ) : displayReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-slate-500">
                  No reports yet.
                </TableCell>
              </TableRow>
            ) : (
              displayReports.map((report) => (
                <TableRow key={report.id}>
                  {/* Type */}
                  <TableCell>
                    <div className="text-slate-900">{report.incidentType}</div>
                  </TableCell>

                  {/* Location */}
                  <TableCell>
                    <div className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-[150px]">
                        {report.location}
                      </span>
                    </div>
                  </TableCell>

                  {/* Description */}
                  <TableCell>
                    <div className="text-slate-600 truncate max-w-[200px]">
                      {report.description}
                    </div>
                  </TableCell>

                  {/* Time */}
                  <TableCell>
                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>
                        {report.timestamp
                          ? new Date(report.timestamp.toDate()).toLocaleString()
                          : "N/A"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Severity */}
                  <TableCell>
                    <Badge
                      className={
                        report.severity === "Critical"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : report.severity === "High"
                          ? "bg-orange-50 text-orange-700 border-orange-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }
                    >
                      {report.severity}
                    </Badge>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge
                      className={
                        report.status === "Verified"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : report.status === "Assigned"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : report.status === "Resolved"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }
                    >
                      {report.status || "Pending"}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex gap-1">
                      {(!report.status || report.status === "Pending") && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-300"
                          onClick={() => updateStatus(report.id, "Verified")}
                        >
                          Verify
                        </Button>
                      )}
                      {report.status === "Verified" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-300"
                          onClick={() => updateStatus(report.id, "Assigned")}
                        >
                          Assign
                        </Button>
                      )}
                      {report.status === "Assigned" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-300"
                          onClick={() => updateStatus(report.id, "Resolved")}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
