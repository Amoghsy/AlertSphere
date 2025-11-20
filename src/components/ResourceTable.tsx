import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Users } from 'lucide-react';

const mockTeams = [
  {
    id: 1,
    name: 'Rescue Team Alpha',
    type: 'Fire & Rescue',
    location: 'Station 1, Downtown',
    status: 'Available',
    members: 12
  },
  {
    id: 2,
    name: 'Medical Unit 5',
    type: 'Medical',
    location: 'City Hospital',
    status: 'Busy',
    members: 8
  },
  {
    id: 3,
    name: 'Flood Response Beta',
    type: 'Water Rescue',
    location: 'Harbor Zone',
    status: 'Available',
    members: 15
  },
  {
    id: 4,
    name: 'K9 Search Unit',
    type: 'Search & Rescue',
    location: 'North Station',
    status: 'Deployed',
    members: 6
  },
  {
    id: 5,
    name: 'Emergency Support 3',
    type: 'Logistics',
    location: 'Supply Center',
    status: 'Available',
    members: 10
  }
];

interface ResourceTableProps {
  expanded?: boolean;
}

export function ResourceTable({ expanded = false }: ResourceTableProps) {
  const displayTeams = expanded ? mockTeams : mockTeams.slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h2 className="text-slate-900">Rescue Teams</h2>
        </div>
        {!expanded && (
          <Button variant="ghost" size="sm" className="text-blue-600">
            View All
          </Button>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayTeams.map((team) => (
              <TableRow key={team.id}>
                <TableCell>
                  <div className="text-slate-900">{team.name}</div>
                </TableCell>
                <TableCell>
                  <div className="text-slate-600">{team.type}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-slate-600">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-[150px]">{team.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-slate-600">{team.members}</div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      team.status === 'Available'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : team.status === 'Busy'
                        ? 'bg-orange-50 text-orange-700 border-orange-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }
                  >
                    {team.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    {team.status === 'Available' ? 'Deploy' : 'View'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
