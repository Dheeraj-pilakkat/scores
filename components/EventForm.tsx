'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface EventFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EventForm({ initialData, onSuccess, onCancel }: EventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    event_name: '',
    event_category: 'Sports',
    event_date: new Date().toISOString().split('T')[0],
    status: 'Upcoming',
    first_place: '',
    second_place: '',
    third_place: '',
    points_awarded: { first: 15, second: 10, third: 5 }
  });

  const [groups, setGroups] = useState<{ group_name: string }[]>([]);

  useEffect(() => {
    // Load groups for dropdowns
    fetch('/api/groups').then(res => res.json()).then(data => setGroups(data));
    
    if (initialData) {
      setFormData({
        ...initialData,
        event_date: initialData.event_date.split('T')[0],
        first_place: initialData.first_place || '',
        second_place: initialData.second_place || '',
        third_place: initialData.third_place || '',
        // Ensure points object exists
        points_awarded: initialData.points_awarded || { first: 15, second: 10, third: 5 }
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('points_')) {
      const pointKey = name.replace('points_', '');
      setFormData(prev => ({
        ...prev,
        points_awarded: {
          ...prev.points_awarded,
          [pointKey]: Number(value)
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      // Convert empty strings to null for backend enum validation
      first_place: formData.first_place || null,
      second_place: formData.second_place || null,
      third_place: formData.third_place || null,
    };

    try {
      const url = initialData ? `/api/events/${initialData._id}` : '/api/events';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save event');
      }

      router.refresh();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Error saving event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Event Name</label>
          <input
            type="text"
            name="event_name"
            value={formData.event_name}
            onChange={handleChange}
            required
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
          <select
            name="event_category"
            value={formData.event_category}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Sports">Sports</option>
            <option value="Arts">Arts</option>
            <option value="Games">Games</option>
          </select>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
           <input
            type="date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            required
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {formData.status === 'Completed' && (
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 space-y-4">
          <h4 className="text-lg font-semibold text-gray-200">Results & Points</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* First Place */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-yellow-400">1st Place</label>
              <select
                 name="first_place"
                 value={formData.first_place}
                 onChange={handleChange}
                 className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="">Select Group</option>
                {groups.map(g => <option key={g.group_name} value={g.group_name}>{g.group_name}</option>)}
              </select>
              <input 
                type="number"
                name="points_first"
                value={formData.points_awarded.first}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-xs text-white"
                placeholder="Points"
              />
            </div>

            {/* Second Place */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-400">2nd Place</label>
               <select
                 name="second_place"
                 value={formData.second_place}
                 onChange={handleChange}
                 className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="">Select Group</option>
                {groups.map(g => <option key={g.group_name} value={g.group_name}>{g.group_name}</option>)}
              </select>
               <input 
                type="number"
                name="points_second"
                value={formData.points_awarded.second}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-xs text-white"
                placeholder="Points"
              />
            </div>

            {/* Third Place */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-orange-400">3rd Place</label>
               <select
                 name="third_place"
                 value={formData.third_place}
                 onChange={handleChange}
                 className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="">Select Group</option>
                {groups.map(g => <option key={g.group_name} value={g.group_name}>{g.group_name}</option>)}
              </select>
               <input 
                type="number"
                name="points_third"
                value={formData.points_awarded.third}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-xs text-white"
                placeholder="Points"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
        {onCancel && (
            <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-transparent hover:bg-gray-800 text-gray-300 rounded-lg transition-colors"
                disabled={loading}
            >
                Cancel
            </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : (initialData ? 'Update Event' : 'Create Event')}
        </button>
      </div>
    </form>
  );
}
