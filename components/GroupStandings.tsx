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
  const maxPoints = sortedGroups.length > 0 ? sortedGroups[0].total_points : 0;

  // Create Pyramid Order: [...4, 2, 1, 3, 5...]
  const leftSide: Group[] = [];
  const rightSide: Group[] = [];
  
  sortedGroups.forEach((group, index) => {
      if (index === 0) return; // Leader handled separately
      if (index % 2 === 1) { // 1, 3, 5 (2nd, 4th, 6th place) -> Left
        leftSide.unshift(group); 
      } else { // 2, 4, 6 (3rd, 5th, 7th place) -> Right
        rightSide.push(group);
      }
  });

  const pyramidGroups = [...leftSide, sortedGroups[0], ...rightSide].filter(Boolean);

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4">
       {/* Horizontal Scroll Container */}
       <div className="w-full pb-8">
          <div className="flex flex-row items-end justify-center gap-0 h-[500px] px-4 pt-12">
            
            {pyramidGroups.map((group) => {
              // Recalculate rank for display based on original sorted array
              const rank = sortedGroups.findIndex(g => g.group_name === group.group_name) + 1;
              const isLeader = rank === 1;
              const heightPercentage = group.total_points / 2;
              
              return (
                <div 
                  key={group.group_name}
                  className="flex flex-col items-center justify-end h-full w-24 md:w-48 group"
                >
                  {/* Points floating above */}
                  <div className={`mb-3 text-center transition-all duration-300 transform group-hover:-translate-y-1`}>
                     <div className={`text-lg md:text-xl font-black ${
                       isLeader ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,1.5)]' : 'text-white'
                     } ${orbitron.className}`}>
                        {group.total_points}
                     </div>
                     <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">PTS</div>
                  </div>

                  {/* The Vertical Bar */}
                  <div 
                    className={`relative w-18 md:w-32 rounded-t-lg transition-all duration-1000 ease-in-out border-x border-t flex flex-col justify-end items-center ${
                      isLeader 
                        ? 'bg-yellow-950/40 border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,1.2)]' 
                        : 'bg-gray-900/40 border-gray-700/50 hover:bg-gray-800/60 shadow-[0_0_10px_rgba(0,0,0,1.5)]'
                    }`}
                    style={{ 
                      height: `${Math.max(heightPercentage, 2)}%`, // Minimum 2% height to show the bar base
                    }}
                  >
                     {/* Fill Gradient */}
                     <div 
                        className="absolute inset-0 rounded-t-lg opacity-70"
                        style={{
                           background: `linear-gradient(to top, ${group.group_color}22, ${group.group_color}bb)`
                        }}
                     ></div>
                     
                     {/* Top highlight line */}
                     <div className="absolute top-0 inset-x-0 h-1 bg-white/50 rounded-t-lg shadow-[0_0_10px_white]"></div>

                     {/* Wins Badge inside bar if tall enough, otherwise above? Let's put it at the bottom of the bar */}
                     <div className="mb-4 z-10 flex flex-col items-center gap-1 opacity-80">
                        <Star className={`w-3 h-3 ${isLeader ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-400 text-gray-400'}`} />
                        <span className="text-xs font-bold text-white shadow-black drop-shadow-md">{group.wins_count}</span>
                     </div>
                  </div>

                  {/* Rank & Name below */}
                  <div className="mt-4 flex flex-col items-center text-center">
                     <div className={`text-xs font-bold px-2 py-0.5 rounded-full mb-2 ${
                        isLeader ? 'bg-yellow-500 text-yellow-950' : 'bg-gray-800 text-gray-400'
                     }`}>
                        #{rank}
                     </div>
                     <h3 className={`text-sm md:text-base font-bold uppercase tracking-wider ${
                        isLeader ? 'text-yellow-500' : 'text-gray-300'
                     } ${orbitron.className} max-w-[120px] truncate`}>
                        {group.group_name}
                     </h3>
                  </div>
                </div>
              );
            })}

          </div>
       </div>

    </div>
  );
}