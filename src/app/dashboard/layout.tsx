'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Search, Bell, Command } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    const token = localStorage.getItem('token') || (session as any)?.backendToken;
    const rawUser = localStorage.getItem('user');
    let localUserDetails = null;
    if (rawUser) {
      try { localUserDetails = JSON.parse(rawUser); } catch { localStorage.removeItem('user'); }
    }
    const currentUser = session?.user || localUserDetails;
    if (currentUser && token) {
      if (!user) {
        setUser(currentUser);
        if (!rawUser) localStorage.setItem('user', JSON.stringify(currentUser));
        if (!localStorage.getItem('token') && (session as any)?.backendToken) {
          localStorage.setItem('token', (session as any).backendToken);
        }
      }
    } else {
      const isDashboardRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/client');
      if (isDashboardRoute && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
  }, [status, session, pathname, user]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-[72px] lg:ml-[260px] transition-all duration-300 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 px-4 md:px-6 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between sticky top-0 z-40">
          <div className={`
            hidden md:flex items-center gap-2.5 rounded-xl px-3.5 py-2 w-[300px]
            transition-all duration-200 border
            ${searchFocused
              ? 'bg-white border-blue-400 ring-4 ring-blue-500/10'
              : 'bg-slate-100/70 border-transparent'
            }
          `}>
            <Search size={15} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs, projects..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="bg-transparent border-none outline-none text-sm w-full font-medium text-slate-900 placeholder:text-slate-400"
            />
            <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200 text-slate-400">
              <Command size={9} /> K
            </kbd>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>
            <Button
              size="sm"
              onClick={() => router.push(user.role === 'freelancer' ? '/marketplace' : '/post-job')}
            >
              {user.role === 'freelancer' ? 'Find Work' : 'Post a Job'}
            </Button>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
