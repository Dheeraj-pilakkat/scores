'use client';

import { useEffect, useState } from 'react';
import { Trophy, Calendar, Users } from 'lucide-react';

interface Stats {
  totalEvents: number;
  completedEvents: number;
  leadingGroup: string;
}

interface Group {
  group_name: string;
  total_points: number;
  wins_count: number;
  group_color: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, groupsRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/groups')
        ]);
        
        const events = await eventsRes.json();
        const groupsData = await groupsRes.json();
        
        const completed = events.filter((e: any) => e.status === 'Completed').length;
        const leader = groupsData.length > 0 ? groupsData[0].group_name : 'N/A';
        
        setGroups(groupsData);
        setStats({
          totalEvents: events.length,
          completedEvents: completed,
          leadingGroup: leader
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return <div className="text-white">Loading stats...</div>;

  const handleRecalculate = async () => {
    try {
        const res = await fetch('/api/master/recalculate', { method: 'POST' });
        if (res.ok) {
            window.location.reload(); // Simple reload to refresh data
        } else {
            alert('Failed to recalculate');
        }
    } catch (error) {
        console.error(error);
        alert('Error recalculating');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        <button 
            onClick={handleRecalculate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
            <Trophy className="w-4 h-4" />
            Recalculate Scores
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Events</p>
              <h3 className="text-3xl font-bold text-white mt-2">{stats?.totalEvents}</h3>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            {stats?.completedEvents} completed
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">Leading Group</p>
              <h3 className="text-3xl font-bold text-white mt-2">{stats?.leadingGroup}</h3>
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Groups</p>
              <h3 className="text-3xl font-bold text-white mt-2">{groups.length}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-bold text-white">Current Standings</h3>
        </div>
        <div className="p-6">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-300">
                    <thead className="text-xs uppercase bg-gray-900/50 text-gray-400">
                        <tr>
                            <th className="px-6 py-4 rounded-l-lg">Group</th>
                            <th className="px-6 py-4">Total Points</th>
                            <th className="px-6 py-4 rounded-r-lg">Wins</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.map((group) => (
                            <tr key={group.group_name} className="border-b border-gray-700/50 last:border-0 hover:bg-gray-700/30 transition-colors">
                                <td className="px-6 py-4 font-medium flex items-center space-x-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: group.group_color }}></div>
                                    <span>{group.group_name}</span>
                                </td>
                                <td className="px-6 py-4 text-white font-bold">{group.total_points}</td>
                                <td className="px-6 py-4">{group.wins_count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}
