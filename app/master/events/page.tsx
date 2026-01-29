'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import EventForm from '@/components/EventForm';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);

  const fetchEvents = async () => {
    const res = await fetch('/api/events');
    const data = await res.json();
    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event? This will revert any points awarded.')) return;
    
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    fetchEvents();
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    fetchEvents();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Events Management</h2>
        <button
          onClick={() => {
            setEditingEvent(null);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Event</span>
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Event Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Winner</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {events.map((event) => (
                <tr key={event._id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{event.event_name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs border ${
                      event.event_category === 'Sports' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                      event.event_category === 'Arts' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                      'bg-orange-500/10 border-orange-500/20 text-orange-400'
                    }`}>
                      {event.event_category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{new Date(event.event_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded text-xs ${
                      event.status === 'Completed' ? 'bg-gray-700 text-gray-300' :
                      event.status === 'Ongoing' ? 'bg-red-500/10 text-red-400 animate-pulse' :
                      'bg-blue-500/10 text-blue-400'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-yellow-400">
                    {event.first_place || '-'}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                        onClick={() => handleEdit(event)}
                        className="p-2 hover:bg-gray-700 rounded-lg text-blue-400 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => handleDelete(event._id)}
                        className="p-2 hover:bg-gray-700 rounded-lg text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No events found. Create one to get started.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700">
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white">
                        {editingEvent ? 'Edit Event' : 'New Event'}
                    </h3>
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6">
                    <EventForm 
                        initialData={editingEvent} 
                        onSuccess={handleSuccess} 
                        onCancel={() => setIsModalOpen(false)}
                    />
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
