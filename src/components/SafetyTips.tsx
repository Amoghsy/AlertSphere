import { Info, Droplets, Flame, Home, Wind } from 'lucide-react';

const safetyTips = [
  {
    type: 'Flood',
    icon: Droplets,
    color: 'text-blue-600 bg-blue-100',
    tips: [
      'Move to higher ground immediately',
      'Avoid walking or driving through flood waters',
      'Turn off utilities if instructed to do so'
    ]
  },
  {
    type: 'Fire',
    icon: Flame,
    color: 'text-red-600 bg-red-100',
    tips: [
      'Evacuate immediately if threatened',
      'Stay low to avoid smoke inhalation',
      'Call emergency services from a safe location'
    ]
  },
  {
    type: 'Earthquake',
    icon: Home,
    color: 'text-orange-600 bg-orange-100',
    tips: [
      'Drop, Cover, and Hold On',
      'Stay away from windows and heavy objects',
      'Exit building after shaking stops if safe'
    ]
  },
  {
    type: 'Cyclone',
    icon: Wind,
    color: 'text-purple-600 bg-purple-100',
    tips: [
      'Secure outdoor items and close shutters',
      'Stay indoors away from windows',
      'Have emergency supplies ready'
    ]
  }
];

export function SafetyTips() {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-4 border-b border-slate-200 flex items-center gap-2">
        <Info className="w-5 h-5 text-blue-600" />
        <h2 className="text-slate-900">Safety Tips</h2>
      </div>
      <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
        {safetyTips.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.type} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-slate-900">{item.type}</h3>
              </div>
              <ul className="space-y-2">
                {item.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-slate-600">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
