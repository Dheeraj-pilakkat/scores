'use client';

import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Trophy, Users, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isLoginPage = pathname === '/master/login';

  if (isLoginPage) {
    return <SessionProvider>{children}</SessionProvider>;
  }

  const navItems = [
    { href: '/master', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/master/events', label: 'Events', icon: Trophy },
    { href: '/master/groups', label: 'Groups', icon: Users },
  ];

  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">
        {/* Mobile Header */}
        <div className="md:hidden bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between sticky top-0 z-30">
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Admin Panel
            </h1>
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 text-gray-400 hover:text-white"
            >
                {isSidebarOpen ? <X /> : <Menu />}
            </button>
        </div>

        {/* Sidebar Overlay (Mobile) */}
        {isSidebarOpen && (
            <div 
                className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
                onClick={() => setIsSidebarOpen(false)}
            ></div>
        )}

        {/* Sidebar */}
        <aside className={`
            fixed md:static inset-y-0 left-0 z-30 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out md:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 border-b border-gray-800 hidden md:block">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Scoreboard Admin
            </h1>
          </div>
          
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800 bg-gray-900">
             <Link href="/api/auth/signout" className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
             </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-950 w-full">
          <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}
