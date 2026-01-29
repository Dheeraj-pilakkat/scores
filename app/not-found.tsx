'use client';

import Link from 'next/link';
import { Orbitron } from 'next/font/google';
import { Home, Play, RotateCcw, Trophy } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700', '900'] });

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAME_OVER'>('IDLE');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const runGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let frameCount = 0;
    let gameSpeed = 5;
    let scoreCount = 0;
    
    // Player
    const player = {
      x: 50,
      y: 0, // calculated relative to ground
      width: 30,
      height: 30,
      dy: 0,
      jumpForce: 12,
      grounded: true, 
      color: '#ef4444' // red-500
    };

    // Obstacles
    let obstacles: { x: number; width: number; height: number; type: 'cactus' | 'block' }[] = [];
    
    // Constants
    const gravity = 0.6;
    const groundHeight = 40;

    const spawnObstacle = () => {
        const height = Math.random() > 0.5 ? 40 : 25;
        obstacles.push({
            x: canvas.width,
            width: 20 + Math.random() * 20,
            height: height,
            type: Math.random() > 0.8 ? 'block' : 'cactus'
        });
    };

    const reset = () => {
        player.y = canvas.height - groundHeight - player.height;
        player.dy = 0;
        obstacles = [];
        scoreCount = 0;
        setScore(0);
        frameCount = 0;
        gameSpeed = 5;
    };

    // Input handling inside loop to capture latest state if needed, 
    // but React event listener is better for 'jump trigger'.
    // We will just expose a jump function.

    const render = () => {
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);

        // Update Physics
        if (gameState === 'PLAYING') { // This variable is captured from closure, typical issue. 
           // ACTUALLY, relying on the outer 'gameState' inside requestAnimationFrame is tricky if it changes.
           // Since we start this loop ON 'PLAYING', we generally stop it manually.
           // Let's rely on an internal broken flag or check the ref if possible? 
           // Better: "runGame" is called when state BECOMES playing.
        }

        // Draw Ground Line
        ctx.beginPath();
        ctx.moveTo(0, height - groundHeight);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.lineTo(width, height - groundHeight);
        ctx.stroke();

        // Player Logic
        if (!player.grounded) {
            player.dy += gravity;
            player.y += player.dy;
        }

        // Ground Collision
        if (player.y + player.height > height - groundHeight) {
            player.y = height - groundHeight - player.height;
            player.dy = 0;
            player.grounded = true;
        }

        // Draw Player (Neon Cube)
        ctx.shadowBlur = 15;
        ctx.shadowColor = player.color;
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.shadowBlur = 0;

        // Obstacles Logic
        if (frameCount % Math.floor(1000 / (gameSpeed * 10)) === 0 && Math.random() < 0.3) {
             // Basic random spawn dampening
             if (obstacles.length === 0 || width - obstacles[obstacles.length - 1].x > 200) {
                 spawnObstacle();
             }
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
            let obs = obstacles[i];
            obs.x -= gameSpeed;

            // Draw Obstacle
            ctx.fillStyle = '#3b82f6'; // blue-500
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#3b82f6';
            ctx.fillRect(obs.x, height - groundHeight - obs.height, obs.width, obs.height);
            ctx.shadowBlur = 0;

            // Collision Detection
            if (
                player.x < obs.x + obs.width &&
                player.x + player.width > obs.x &&
                player.y < height - groundHeight && // Player height check
                player.y + player.height > height - groundHeight - obs.height
            ) {
                // Game Over
                setGameState('GAME_OVER');
                setHighScore(prev => Math.max(prev, scoreCount));
                cancelAnimationFrame(animationFrameId);
                return;
            }

            // Remove off-screen
            if (obs.x + obs.width < 0) {
                obstacles.splice(i, 1);
                scoreCount++;
                setScore(scoreCount);
                if (scoreCount % 10 === 0) gameSpeed += 0.5; // Scale difficulty
            }
        }

        frameCount++;
        animationFrameId = requestAnimationFrame(render);
    };

    reset();
    render();

    // Attach Jump Listener specific to this game instance
    const handleJump = (e: KeyboardEvent | TouchEvent) => {
        if ((e instanceof KeyboardEvent && e.code === 'Space') || e instanceof TouchEvent) {
             e.preventDefault();
             if (player.grounded) {
                 player.dy = -player.jumpForce;
                 player.grounded = false;
             }
        }
    };

    window.addEventListener('keydown', handleJump);
    window.addEventListener('touchstart', handleJump);

    return () => {
        window.removeEventListener('keydown', handleJump);
        window.removeEventListener('touchstart', handleJump);
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Effect to trigger game start
  useEffect(() => {
    if (gameState === 'PLAYING') {
      const cleanup = runGame();
      return cleanup;
    }
  }, [gameState, runGame]);

  // Handle Resize
  useEffect(() => {
      const resize = () => {
          if (canvasRef.current) {
              const parent = canvasRef.current.parentElement;
              if(parent) {
                  canvasRef.current.width = parent.clientWidth;
                  canvasRef.current.height = 300;
              }
          }
      };
      window.addEventListener('resize', resize);
      resize();
      return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden text-white selection:bg-red-500/30">
        
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 opacity-20" 
             style={{ 
                 backgroundImage: 'radial-gradient(circle at 50% 50%, #1f2937 1px, transparent 1px)', 
                 backgroundSize: '40px 40px' 
             }}>
        </div>

        {/* Game Container */}
        <div className="relative z-10 w-full max-w-2xl px-4 flex flex-col items-center">
            
            {/* Header / Scoreboard */}
            <div className="w-full flex items-center justify-between mb-2 px-2">
                 <div className="text-gray-500 text-xs font-mono uppercase tracking-widest">
                    Err: 404_PAGE_NOT_FOUND
                 </div>
                 <div className={`flex gap-6 text-xl font-black ${orbitron.className}`}>
                     <span className="text-gray-500">HI {Math.floor(highScore).toString().padStart(5, '0')}</span>
                     <span className="text-white">{Math.floor(score).toString().padStart(5, '0')}</span>
                 </div>
            </div>

            {/* Canvas Area */}
            <div className="relative w-full h-[300px] bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden shadow-2xl backdrop-blur-sm">
                <canvas 
                    ref={canvasRef} 
                    className="w-full h-full block"
                />

                {/* Overlays */}
                {gameState === 'IDLE' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                         <h1 className={`text-6xl font-black text-white mb-2 tracking-tighter ${orbitron.className}`}>404</h1>
                         <p className="text-gray-300 font-bold tracking-widest uppercase mb-8">Page Not Found</p>
                         <button 
                            onClick={() => setGameState('PLAYING')}
                            className="group flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold uppercase tracking-wider transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                         >
                            <Play className="w-5 h-5 fill-current" /> Initialize Runner
                         </button>
                         <p className="mt-4 text-xs text-gray-500 font-mono">PRESS SPACE OR TAP TO JUMP</p>
                    </div>
                )}

                {gameState === 'GAME_OVER' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                         <h2 className={`text-4xl font-black text-red-500 mb-2 tracking-tighter animate-pulse ${orbitron.className}`}>GAME OVER</h2>
                         <div className="flex items-center gap-2 text-xl font-bold text-white mb-8">
                            <Trophy className="w-6 h-6 text-yellow-500" />
                            Score: {score}
                         </div>
                         <div className="flex gap-4">
                            <button 
                                onClick={() => setGameState('PLAYING')}
                                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-200 text-black rounded-lg font-bold uppercase tracking-wider transition-all"
                            >
                                <RotateCcw className="w-4 h-4" /> Retry
                            </button>
                            <Link 
                                href="/"
                                className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold uppercase tracking-wider transition-all border border-gray-700"
                            >
                                <Home className="w-4 h-4" /> Exit
                            </Link>
                         </div>
                    </div>
                )}
            </div>

            {/* Footer Branding */}
             <div className="mt-8 text-center space-y-2">
                <h3 className={`text-lg md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 uppercase tracking-tighter opacity-80 ${orbitron.className}`}>
                    UNION OF MALABAR CET 2K25-26
                </h3>
            </div>
        </div>
    </div>
  );
}
