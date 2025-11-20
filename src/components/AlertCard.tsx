import { Badge } from './ui/badge';
import { Flame, Droplets, Home, Wind, MapPin, Clock } from 'lucide-react';

interface Alert {
  id: number;
  type: string;
  severity: string;
  location: string;
  timestamp: string;
  description: string;
}

interface AlertCardProps {
  alert: Alert;
}

const disasterIcons = {
  'Flood': Droplets,
  'Fire': Flame,
  'Earthquake': Home,
  'Cyclone': Wind
};

const severityColors = {
  'critical': 'bg-red-500',
  'high': 'bg-orange-500',
  'moderate': 'bg-yellow-500',
  'low': 'bg-green-500'
};

const severityTextColors = {
  'critical': 'text-red-600 bg-red-50 border-red-200',
  'high': 'text-orange-600 bg-orange-50 border-orange-200',
  'moderate': 'text-yellow-700 bg-yellow-50 border-yellow-200',
  'low': 'text-green-600 bg-green-50 border-green-200'
};

export function AlertCard({ alert }: AlertCardProps) {
  const Icon = disasterIcons[alert.type as keyof typeof disasterIcons] || Home;
  const severityColor = severityColors[alert.severity as keyof typeof severityColors] || 'bg-gray-500';
  const severityTextColor = severityTextColors[alert.severity as keyof typeof severityTextColors] || 'text-gray-600 bg-gray-50 border-gray-200';

  return (
    <div className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${severityColor}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-slate-900">{alert.type}</h3>
            <Badge className={`${severityTextColor} border capitalize`}>
              {alert.severity}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1 text-slate-600 mb-2">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{alert.location}</span>
          </div>
          
          <p className="text-slate-600 line-clamp-2 mb-2">
            {alert.description}
          </p>
          
          <div className="flex items-center gap-1 text-slate-500">
            <Clock className="w-3 h-3" />
            <span>{alert.timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
