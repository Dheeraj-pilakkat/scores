'use client';

import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Trophy, Users, LogOut } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
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
      <div className="min-h-screen bg-gray-950 text-white flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 border-r border-gray-800 flex-shrink-0">
          <div className="p-6 border-b border-gray-800">
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

          <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800">
             <Link href="/api/auth/signout" className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
             </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}
