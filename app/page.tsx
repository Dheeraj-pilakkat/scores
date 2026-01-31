'use client';

import { useState, useEffect } from 'react';
import { Orbitron } from 'next/font/google';
import GroupStandings from '@/components/GroupStandings';
import { Search, Filter, Calendar, Trophy } from 'lucide-react';
import Link from 'next/link';

const orbitron = Orbitron({ subsets: ['latin'], weight: '700' });

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: 'All', status: 'All', search: '' });

  useEffect(() => {
    const fetchData = async (isBackground = false) => {
      try {
        if (!isBackground) setLoading(true);
        
        const fetchPromise = Promise.all([
          fetch('/api/events'),
          fetch('/api/groups')
        ]);
        
        // Minimum 10s delay for initial load
        const delayPromise = !isBackground 
            ? new Promise(resolve => setTimeout(resolve, 10000)) 
            : Promise.resolve();

        const [[eventsRes, groupsRes]] = await Promise.all([
            fetchPromise,
            delayPromise
        ]);

        const eventsData = await eventsRes.json();
        const groupsData = await groupsRes.json();
        setEvents(eventsData);
        setGroups(groupsData);
      } catch (error) {
        console.error(error);
      } finally {
        if (!isBackground) setLoading(false);
      }
    };

    fetchData(); // Initial load

    
        fetchData(true);
  
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesCategory = filter.category === 'All' || event.event_category === filter.category;
    const matchesStatus = filter.status === 'All' || event.status === filter.status;
    const matchesSearch = event.event_name.toLowerCase().includes(filter.search.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <>
      {/* Loading Screen Overlay */}
      <div className={`fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 ease-in-out ${
          loading ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}>
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 opacity-20" 
             style={{ 
                 backgroundImage: 'radial-gradient(circle at 50% 50%, #1f2937 1px, transparent 1px)', 
                 backgroundSize: '40px 40px' 
             }}>
        </div>

        <div className="relative z-10 text-center space-y-8">
            <div className="relative">
                {/* Outlined Text (Empty) */}
                <h1 className={`text-3xl md:text-6xl font-black text-transparent stroke-white stroke-2 uppercase tracking-tighter ${orbitron.className}`}
                    style={{ WebkitTextStroke: '1px #333' }}>
                    UNION OF <br/> MALABAR CET <br/> 2K25-26
                </h1>
                
                {/* Filled Text (Animating) */}
                <h1 className={`absolute inset-0 text-3xl md:text-6xl font-black text-white top-0 left-0 uppercase tracking-tighter overflow-hidden ${orbitron.className}`}
                    style={{ 
                        clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)',
                        animation: 'fillUp 8s cubic-bezier(0.19, 1, 0.22, 1) forwards'
                     }}>
                    UNION OF <br/> MALABAR CET <br/> 2K25-26
                </h1>
            </div>

            {/* Loading Bar */}
            <div className="w-48 h-1 bg-gray-800 rounded-full mx-auto overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 animate-[loadingBar_2s_ease-in-out_infinite]"></div>
            </div>
            
             <p className="text-gray-500 text-xs font-bold tracking-[0.3em] uppercase animate-pulse">
                Initializing System...
            </p>
        </div>

        <style jsx>{`
            @keyframes fillUp {
                0% { clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0% 100%); }
                100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%); }
            }
            @keyframes loadingBar {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
        `}</style>
      </div>

    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-500/30 overflow-x-hidden">
        {/* Background Grid */}
        <div className="fixed inset-0 z-0 opacity-100 pointer-events-none" 
             style={{ 
                 backgroundImage: 'radial-gradient(circle at 50% 50%, #1f2937 1px, transparent 1px)', 
                 backgroundSize: '40px 40px' 
             }}>
        </div>
        
        {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                 <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-50"></div>
                    <div className="relative p-2.5 bg-gray-900 rounded-lg border border-gray-800">
                        <Trophy className="w-6 h-6 text-white" />
                    </div>
                </div>
                <div>
                     <div className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase mb-0.5 hidden md:block">Official Scoreboard</div>
                     <h1 className={`text-xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 uppercase tracking-tight ${orbitron.className}`}>
                        UNION of <span className="text-white">Malabarcet</span> 2k25-26
                    </h1>
                </div>
            </div>
        </div>
      </div>

      <main className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto space-y-20">
            
            {/* Hero Section */}
            <section className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold uppercase tracking-widest mb-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                        </span>
                        Live Standings
                    </div>
                    <h2 className={`text-4xl md:text-7xl font-black tracking-tighter text-white drop-shadow-2xl ${orbitron.className}`}>
                        LEADERBOARD
                    </h2>
                </div>
                <GroupStandings groups={groups} />
            </section>

            {/* Event List Redesign */}
            <section className="space-y-8">
                 <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-800 pb-6">
                    <div>
                        <h2 className={`text-3xl md:text-4xl font-bold flex items-center gap-3 text-white ${orbitron.className}`}>
                            <Calendar className="w-8 h-8 text-blue-500" />
                            MATCH CENTER
                        </h2>
                        <p className="text-gray-400 mt-2 font-medium">Tracking all competitive events</p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-3">
                         <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
                            <input 
                                type="text"
                                placeholder="Search..."
                                value={filter.search}
                                onChange={(e) => setFilter(prev => ({...prev, search: e.target.value}))}
                                className="w-48 bg-gray-900/50 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-600 text-white"
                            />
                        </div>
                        <select 
                            value={filter.category}
                            onChange={(e) => setFilter(prev => ({...prev, category: e.target.value}))}
                            className="bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer hover:bg-gray-800 transition-colors text-gray-300"
                        >
                            <option value="All">All Categories</option>
                            <option value="Sports">Sports</option>
                            <option value="Arts">Arts</option>
                            <option value="Games">Games</option>
                        </select>
                         <select 
                            value={filter.status}
                            onChange={(e) => setFilter(prev => ({...prev, status: e.target.value}))}
                            className="bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer hover:bg-gray-800 transition-colors text-gray-300"
                        >
                            <option value="All">All Status</option>
                            <option value="Upcoming">Upcoming</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    {filteredEvents.map((event) => (
                        <div key={event._id} className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:-translate-y-0.5">
                             {/* Category Glow (faint background) */}
                            <div className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${
                                event.event_category === 'Sports' ? 'from-green-500 to-transparent' : 
                                event.event_category === 'Arts' ? 'from-purple-500 to-transparent' : 'from-orange-500 to-transparent' 
                            }`}></div>

                            <div className="relative p-5 md:p-6 flex flex-col md:flex-row lg:flex-col gap-6 md:items-center lg:items-stretch">
                                {/* Date & Status Group */}
                                <div className="flex items-center justify-between md:flex-col lg:flex-row md:items-start lg:items-center lg:justify-between md:w-24 lg:w-full md:flex-shrink-0 gap-4">
                                     <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{new Date(event.event_date).toLocaleString('default', { month: 'short' })}</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className={`text-3xl font-black text-white ${orbitron.className}`}>
                                                {new Date(event.event_date).getDate()}
                                            </span>
                                            <span className="text-gray-600 text-xs font-bold uppercase">{new Date(event.event_date).toLocaleString('default', { weekday: 'short' })}</span>
                                        </div>
                                    </div>
                                    
                                     {/* Mobile/LG Status Badge */}
                                    <div className="md:hidden lg:block">
                                         {event.status === 'Ongoing' ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                                <span className="w-1.5 h-1.5 rounded-full bg-current"></span> Live
                                            </span>
                                        ) : (
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                                event.status === 'Completed' ? 'bg-gray-800/50 border-gray-700 text-gray-400' :
                                                'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                            }`}>
                                                {event.status}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Divider (Tablet only) */}
                                <div className="hidden md:block lg:hidden w-px h-16 bg-white/5"></div>

                                {/* Main Info */}
                                <div className="flex-grow space-y-3 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                            event.event_category === 'Sports' ? 'border-green-500/20 text-green-400 bg-green-500/5' : 
                                            event.event_category === 'Arts' ? 'border-purple-500/20 text-purple-400 bg-purple-500/5' : 
                                            'border-orange-500/20 text-orange-400 bg-orange-500/5'
                                        }`}>
                                            {event.event_category}
                                        </span>
                                         {/* Tablet Status Badge */}
                                        <div className="hidden md:block lg:hidden">
                                             {event.status === 'Ongoing' && (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-red-500 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span> Live
                                                </span>
                                            )}
                                            {event.status !== 'Ongoing' && (
                                                 <span className={`text-[10px] font-bold uppercase tracking-wider text-gray-500`}>
                                                    • {event.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-100 group-hover:text-white transition-colors leading-tight">
                                        {event.event_name}
                                    </h3>
                                </div>

                                {/* Results or Placeholder */}
                                <div className="w-full md:w-auto md:min-w-[300px] lg:w-full lg:min-w-0">
                                    {event.status === 'Completed' ? (
                                        <div className="grid grid-cols-3 gap-2 bg-black/20 rounded-xl p-3 border border-white/5">
                                            {/* 1st Place */}
                                            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/10">
                                                <div className="text-[10px] text-yellow-500/70 font-bold uppercase tracking-wider mb-1">Winner</div>
                                                <div className={`text-sm md:text-base font-bold text-yellow-400 text-center leading-tight ${orbitron.className}`}>
                                                    {event.first_place || '-'}
                                                </div>
                                                <div className='text-sm font-bold text-yellow-400 text-center leading-tight'>{event.points_awarded.first}</div>
                                            </div>
                                            
                                            {/* 2nd Place */}
                                            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 border border-white/5">
                                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">2nd</div>
                                                <div className="text-sm font-medium text-gray-300 text-center leading-tight">
                                                    {event.second_place || '-'}
                                                </div>
                                                <div className='text-sm font-bold text-gray-400 text-center leading-tight'>{event.points_awarded.second}</div>
                                            </div>

                                            {/* 3rd Place */}
                                            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 border border-white/5">
                                                <div className="text-[10px] text-orange-700/70 font-bold uppercase tracking-wider mb-1">3rd</div>
                                                <div className="text-sm font-medium text-gray-400 text-center leading-tight">
                                                    {event.third_place || '-'}
                                                </div>
                                                <div className='text-sm font-bold text-gray-400 text-center leading-tight'>{event.points_awarded.third}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-full min-h-[80px] rounded-xl bg-white/5 border border-white/5 border-dashed">
                                            <span className="text-gray-600 font-medium text-sm">
                                                {event.status === 'Upcoming' ? 'Starts soon' : 'In Progress'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredEvents.length === 0 && (
                        <div className="col-span-full py-16 text-center text-gray-500 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 border-dashed">
                            No events found.
                        </div>
                    )}
                </div>
            </section>
        </div>
        <footer className="mt-24 py-8 text-center">
            <p className={`text-sm text-gray-500 font-medium tracking-wide ${orbitron.className}`}>
                Build with ❤️ for Union of Malabar CET 2K25-26 by <span className="text-blue-400"> <Link href="https://github.com/Dheeraj-pilakkat">Dheeraj</Link></span>
            </p>
        </footer>
      </main>
    </div>
    </>
  );
}
