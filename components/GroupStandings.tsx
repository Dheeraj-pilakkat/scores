import { Trophy, Medal, Star } from 'lucide-react';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700', '900'] });

interface Group {
  group_name: string;
  total_points: number;
  group_color: string;
  wins_count: number;
}

export default function GroupStandings({ groups }: { groups: Group[] }) {
  // Sort by points descending
  const sortedGroups = [...groups].sort((a, b) => b.total_points - a.total_points);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 items-end justify-items-center max-w-6xl mx-auto py-12 px-4">
      {/* Second Place */}
      {sortedGroups[1] && (
        <div className="order-2 md:order-1 flex flex-col items-center w-full">
            <div className="relative w-full max-w-[280px] group aspect-[4/5] perspective">
                <div 
                    className="relative h-full rounded-3xl bg-gray-900/80 backdrop-blur-sm border border-gray-800 shadow-[0_0_30px_rgba(255,255,255,0.05)] flex flex-col items-center justify-between p-6 transform transition-transform hover:-translate-y-2 duration-300"
                >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900 rounded-full flex items-center justify-center font-black text-2xl ring-8 ring-gray-950 shadow-2xl z-20">
                        2
                    </div>
                    
                    <div className="mt-12 text-center w-full">
                        <h3 className={`text-2xl font-bold text-gray-300 tracking-wider uppercase mb-1 ${orbitron.className}`}>
                            {sortedGroups[1].group_name}
                        </h3>
                        <div className="h-1 w-16 mx-auto rounded-full mb-6" style={{ backgroundColor: sortedGroups[1].group_color }}></div>
                        
                        <div className={`text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] ${orbitron.className}`}>
                            {sortedGroups[1].total_points}
                        </div>
                        <div className="text-gray-500 text-sm font-medium tracking-widest uppercase mt-1">Points</div>
                    </div>

                    <div className="w-full bg-gray-800/50 rounded-xl p-3 flex items-center justify-center gap-2 mt-4 border border-gray-700/50">
                        <Star className="w-4 h-4 text-gray-400 fill-gray-400" />
                        <span className={`text-lg font-bold text-gray-300 ${orbitron.className}`}>{sortedGroups[1].wins_count}</span>
                        <span className="text-xs text-gray-500 font-bold uppercase">Wins</span>
                    </div>
                    
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-50"></div>
                </div>
            </div>
        </div>
      )}

      {/* First Place */}
      {sortedGroups[0] && (
        <div className="order-1 md:order-2 flex flex-col items-center w-full z-10 md:-mt-12">
             <div className="relative w-full max-w-[340px] aspect-[4/5] md:aspect-[3.8/5]">
                <div className="absolute -inset-1 bg-gradient-to-b from-yellow-500 to-orange-600 rounded-3xl blur opacity-30 animate-pulse"></div>
                <div 
                    className="relative h-full rounded-3xl bg-gray-900 border border-yellow-500/30 shadow-[0_0_60px_rgba(234,179,8,0.2)] flex flex-col items-center justify-between p-8 transform transition-transform hover:-translate-y-2 duration-300 overflow-visible"
                >
                    {/* Background sheen */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent opacity-50 rounded-3xl"></div>

                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 text-yellow-950 rounded-full flex items-center justify-center font-bold text-4xl ring-8 ring-gray-950 shadow-[0_0_50px_rgba(234,179,8,0.4)] z-20">
                        <Trophy className="w-12 h-12 fill-yellow-900/20" />
                    </div>

                    <div className="mt-16 text-center w-full relative z-10">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-bold uppercase tracking-widest mb-4">
                            <Star className="w-3 h-3 fill-yellow-400" /> Leader <Star className="w-3 h-3 fill-yellow-400" />
                        </div>
                        
                        <h3 className={`text-3xl font-black text-white tracking-wider uppercase mb-2 ${orbitron.className}`}>
                            {sortedGroups[0].group_name}
                        </h3>
                         <div className="h-1.5 w-24 mx-auto rounded-full mb-8 shadow-[0_0_15px_currentColor]" style={{ backgroundColor: sortedGroups[0].group_color, color: sortedGroups[0].group_color }}></div>
                        
                        <div className={`text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-100 to-yellow-500 drop-shadow-2xl ${orbitron.className}`}>
                            {sortedGroups[0].total_points}
                        </div>
                         <div className="text-yellow-500/80 text-sm font-bold tracking-[0.3em] uppercase mt-2">Total Score</div>
                    </div>

                    <div className="w-full bg-gradient-to-r from-yellow-950/30 to-yellow-900/10 rounded-xl p-4 flex items-center justify-center gap-3 mt-6 border border-yellow-500/20 relative z-10">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className={`text-2xl font-black text-yellow-100 ${orbitron.className}`}>{sortedGroups[0].wins_count}</span>
                        <span className="text-xs text-yellow-500 font-bold uppercase">Victories</span>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Third Place */}
      {sortedGroups[2] && (
        <div className="order-3 md:order-3 flex flex-col items-center w-full">
            <div className="relative w-full max-w-[280px] aspect-[4/5]">
                <div 
                    className="relative h-full rounded-3xl bg-gray-900/80 backdrop-blur-sm border border-gray-800 shadow-[0_0_30px_rgba(255,255,255,0.05)] flex flex-col items-center justify-between p-6 transform transition-transform hover:-translate-y-2 duration-300"
                >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-700 text-orange-50 rounded-full flex items-center justify-center font-black text-2xl ring-8 ring-gray-950 shadow-2xl z-20">
                        3
                    </div>
                    
                    <div className="mt-12 text-center w-full">
                        <h3 className={`text-2xl font-bold text-gray-300 tracking-wider uppercase mb-1 ${orbitron.className}`}>
                            {sortedGroups[2].group_name}
                        </h3>
                        <div className="h-1 w-16 mx-auto rounded-full mb-6" style={{ backgroundColor: sortedGroups[2].group_color }}></div>
                        
                        <div className={`text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] ${orbitron.className}`}>
                            {sortedGroups[2].total_points}
                        </div>
                        <div className="text-gray-500 text-sm font-medium tracking-widest uppercase mt-1">Points</div>
                    </div>

                    <div className="w-full bg-gray-800/50 rounded-xl p-3 flex items-center justify-center gap-2 mt-4 border border-gray-700/50">
                        <Star className="w-4 h-4 text-orange-600/70 fill-orange-600/70" />
                        <span className={`text-lg font-bold text-gray-300 ${orbitron.className}`}>{sortedGroups[2].wins_count}</span>
                        <span className="text-xs text-gray-500 font-bold uppercase">Wins</span>
                    </div>
                    
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-orange-700 to-transparent opacity-50"></div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
