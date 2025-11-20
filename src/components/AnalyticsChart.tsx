import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

const incidentData = [
  { name: 'Mon', Flood: 12, Fire: 5, Earthquake: 2 },
  { name: 'Tue', Flood: 15, Fire: 8, Earthquake: 1 },
  { name: 'Wed', Flood: 8, Fire: 6, Earthquake: 3 },
  { name: 'Thu', Flood: 18, Fire: 10, Earthquake: 2 },
  { name: 'Fri', Flood: 14, Fire: 7, Earthquake: 4 },
  { name: 'Sat', Flood: 10, Fire: 4, Earthquake: 1 },
  { name: 'Sun', Flood: 9, Fire: 6, Earthquake: 2 }
];

const typeDistribution = [
  { name: 'Flood', value: 45, color: '#3b82f6' },
  { name: 'Fire', value: 28, color: '#ef4444' },
  { name: 'Earthquake', value: 15, color: '#f97316' },
  { name: 'Cyclone', value: 12, color: '#8b5cf6' }
];

export function AnalyticsChart() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Incidents by Day */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h2 className="text-slate-900">Incidents This Week</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={incidentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#64748b', fontSize: 12 }}
              stroke="#cbd5e1"
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 12 }}
              stroke="#cbd5e1"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Bar dataKey="Flood" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Fire" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Earthquake" fill="#f97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Incidents by Type */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h2 className="text-slate-900">Incidents by Type</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={typeDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {typeDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {typeDistribution.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-600">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
