import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { MapPin } from "lucide-react";

// 🔥 Firebase imports
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface ReportIncidentModalProps {
  open: boolean;
  onClose: () => void;
}

export function ReportIncidentModal({ open, onClose }: ReportIncidentModalProps) {
  const [incidentType, setIncidentType] = useState("");
  const [severity, setSeverity] = useState("");
  const [location, setLocation] = useState("Fetching location...");
  const [description, setDescription] = useState("");
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 📍 Function to fetch current location (with reverse geocoding)
  const fetchLocation = () => {
    if ("geolocation" in navigator) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          let detectedLocation = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;

          try {
            // 🌍 Optional: Fetch human-readable address using OpenStreetMap
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            if (data.display_name) {
              detectedLocation = data.display_name;
            }
          } catch (error) {
            console.warn("Failed to fetch address, using coordinates only");
          }

          setLocation(detectedLocation);
          setLocating(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocation("Location unavailable (auto-detect failed)");
          setLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocation("Geolocation not supported on this device");
    }
  };

  // 🧭 Automatically fetch location on mount
  useEffect(() => {
    fetchLocation();
  }, []);

  // 🚀 Handle form submission (Firestore only)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!incidentType || !severity || !description) {
      alert("⚠️ Please fill in all required fields before submitting.");
      return;
    }

    try {
      setSubmitting(true);

      // Add new incident to Firestore
      const docRef = await addDoc(collection(db, "incidents"), {
        incidentType,
        severity,
        location,
        description,
        timestamp: serverTimestamp(),
      });

      console.log("✅ Incident submitted! Document ID:", docRef.id);
      alert("✅ Incident reported successfully!");

      // Reset form
      setIncidentType("");
      setSeverity("");
      setDescription("");
      setLocation("Fetching location...");
      fetchLocation(); // Refresh after submission
      onClose();
    } catch (error) {
      console.error("❌ Error reporting incident:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report New Incident</DialogTitle>
          <DialogDescription>
            Help authorities respond quickly by reporting disaster incidents in your area.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Incident Type */}
          <div className="space-y-2">
            <Label htmlFor="incident-type">Incident Type</Label>
            <Select onValueChange={setIncidentType} value={incidentType}>
              <SelectTrigger id="incident-type">
                <SelectValue placeholder="Select incident type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flood">Flood</SelectItem>
                <SelectItem value="fire">Fire</SelectItem>
                <SelectItem value="earthquake">Earthquake</SelectItem>
                <SelectItem value="cyclone">Cyclone</SelectItem>
                <SelectItem value="landslide">Landslide</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <Label htmlFor="severity">Severity Level</Label>
            <Select onValueChange={setSeverity} value={severity}>
              <SelectTrigger id="severity">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical - Immediate danger</SelectItem>
                <SelectItem value="high">High - Serious situation</SelectItem>
                <SelectItem value="moderate">Moderate - Concerning</SelectItem>
                <SelectItem value="low">Low - Minor issue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={fetchLocation}
              disabled={locating}
              className="w-full mt-2"
            >
              {locating ? "Detecting..." : "📍 Get My Current Location"}
            </Button>
            <p className="text-xs text-slate-500 mt-1">
              {location.startsWith("Lat") ? "Coordinates detected automatically." : "Approximate address detected."}
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the situation, number of people affected, etc."
              rows={4}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
