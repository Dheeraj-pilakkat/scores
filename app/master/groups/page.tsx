'use client';

import { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';

interface Group {
  _id: string;
  group_id: string;
  group_name: string;
  group_color: string;
  total_points: number;
  wins_count: number;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const fetchGroups = async () => {
    const res = await fetch('/api/groups');
    const data = await res.json();
    setGroups(data);
    setHasChanges(false);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleChange = (id: string, field: string, value: string) => {
    setGroups(prev => prev.map(g => g._id === id ? { ...g, [field]: value } : g));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch('/api/groups', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groups)
      });
      setHasChanges(false);
      alert('Groups updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update groups');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Group Management</h2>
        <div className="flex space-x-3">
            <button
                onClick={fetchGroups}
                className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                title="Reset Changes"
            >
                <RefreshCw className="w-5 h-5" />
            </button>
            <button
                onClick={handleSave}
                disabled={!hasChanges || loading}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {groups.map((group) => (
            <div key={group._id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-lg">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-inner" style={{ backgroundColor: group.group_color }}>
                        {group.group_id}
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-white mb-1">{group.total_points}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">Total Points</div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Group Name</label>
                        <input 
                            type="text" 
                            value={group.group_name}
                            onChange={(e) => handleChange(group._id, 'group_name', e.target.value)}
                            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Color Code</label>
                        <div className="flex space-x-2">
                            <input 
                                type="color" 
                                value={group.group_color}
                                onChange={(e) => handleChange(group._id, 'group_color', e.target.value)}
                                className="h-10 w-12 bg-transparent border-0 rounded cursor-pointer"
                            />
                            <input 
                                type="text" 
                                value={group.group_color}
                                onChange={(e) => handleChange(group._id, 'group_color', e.target.value)}
                                className="flex-1 bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-700/50 flex justify-between items-center text-sm">
                    <span className="text-gray-400">Wins</span>
                    <span className="text-white font-medium bg-gray-700 px-2 py-1 rounded">{group.wins_count}</span>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
