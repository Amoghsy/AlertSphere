import { Button } from './ui/button';
import { Phone, Flame, Shield, Ambulance } from 'lucide-react';

const emergencyContacts = [
  {
    name: 'Police',
    number: '100',
    icon: Shield,
    color: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    name: 'Fire',
    number: '101',
    icon: Flame,
    color: 'bg-red-600 hover:bg-red-700'
  },
  {
    name: 'Ambulance',
    number: '102',
    icon: Ambulance,
    color: 'bg-green-600 hover:bg-green-700'
  }
];

export function EmergencyContacts() {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-4 border-b border-slate-200 flex items-center gap-2">
        <Phone className="w-5 h-5 text-red-600" />
        <h2 className="text-slate-900">Emergency Contacts</h2>
      </div>
      <div className="p-4 space-y-3">
        {emergencyContacts.map((contact) => {
          const Icon = contact.icon;
          return (
            <Button
              key={contact.name}
              className={`w-full justify-start gap-3 text-white ${contact.color}`}
            >
              <Icon className="w-5 h-5" />
              <div className="flex-1 text-left">
                <div>{contact.name}</div>
                <div className="text-xs opacity-90">Dial {contact.number}</div>
              </div>
              <Phone className="w-4 h-4" />
            </Button>
          );
        })}
        
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="text-slate-600 mb-2">National Disaster  Management Services</div>
          <Button variant="outline" className="w-full gap-2">
            <Phone className="w-4 h-4" />
            1077
          </Button>
        </div>
      </div>
    </div>
  );
}
