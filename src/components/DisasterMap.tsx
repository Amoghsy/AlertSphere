import { MapPin, Navigation } from 'lucide-react';
import { Button } from './ui/button';

// ✅ Updated type to support Firestore string IDs
export interface Marker {
  id: string | number;
  type: string;
  severity: string;
  location: string;
  description?: string;
  lat: number;
  lng: number;
}

interface DisasterMapProps {
  markers: Marker[];
  height?: string;
}

const severityColors: Record<string, string> = {
  critical: '#ef4444', // red
  high: '#f97316', // orange
  moderate: '#eab308', // yellow
  low: '#22c55e', // green
  default: '#6b7280' // gray fallback
};

export function DisasterMap({ markers, height = '400px' }: DisasterMapProps) {
  return (
    <div className="relative bg-slate-100" style={{ height }}>
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-100">
        <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-slate-300"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button size="sm" variant="secondary" className="bg-white shadow-md">
          <Navigation className="w-4 h-4" />
        </Button>
        <div className="bg-white rounded-lg shadow-md p-2 flex flex-col gap-1">
          <Button size="sm" variant="ghost" className="w-8 h-8 p-0">+</Button>
          <div className="border-t border-slate-200"></div>
          <Button size="sm" variant="ghost" className="w-8 h-8 p-0">−</Button>
        </div>
      </div>

      {/* Severity Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 z-10">
        <div className="text-slate-900 mb-2 font-medium">Severity</div>
        <div className="space-y-1 text-sm">
          {[
            { label: 'Critical', color: 'bg-red-500' },
            { label: 'High', color: 'bg-orange-500' },
            { label: 'Moderate', color: 'bg-yellow-500' },
            { label: 'Low', color: 'bg-green-500' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span className="text-slate-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disaster Markers */}
      <div className="absolute inset-0">
        {markers.map((marker, index) => {
          const color =
            severityColors[marker.severity?.toLowerCase()] || severityColors.default;

          // For display positioning only (replace with map coords later)
          const top = 20 + (index * 15) % 60;
          const left = 20 + (index * 20) % 60;

          return (
            <div
              key={marker.id}
              className="absolute group cursor-pointer"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Marker Pin */}
              <div className="relative">
                <MapPin
                  className="w-8 h-8 drop-shadow-lg animate-pulse"
                  style={{ color }}
                  fill={color}
                />

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                  <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                    <div className="font-medium">{marker.type}</div>
                    <div className="text-xs text-slate-300">
                      {marker.location || 'Unknown location'}
                    </div>
                    {marker.description && (
                      <div className="text-xs text-slate-400 mt-1">
                        {marker.description}
                      </div>
                    )}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                  </div>
                </div>
              </div>

              {/* Ping Animation */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full opacity-30 animate-ping"
                style={{ backgroundColor: color }}
              ></div>
            </div>
          );
        })}

        {/* Example Safe Zone Marker */}
        <div
          className="absolute group cursor-pointer"
          style={{ top: '30%', left: '75%', transform: 'translate(-50%, -50%)' }}
        >
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold">S</span>
          </div>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
            <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              <div>Safe Shelter</div>
              <div className="text-xs text-slate-300">Community Center</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
