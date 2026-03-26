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
      // Removed redirection to /client/dashboard so normal dashboard can be viewed
    } else {
      const isDashboardRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/client');
      if (isDashboardRoute && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
  }, [status, session, pathname, user, router]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <main className="flex-1 ml-20 lg:ml-[260px] transition-all duration-300 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 px-4 md:px-8 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
          
          {/* Search */}
          <div className="flex-1 flex items-center">
            <div className={`
              hidden md:flex items-center gap-3 rounded-xl px-4 py-2 w-[320px] lg:w-[480px]
              transition-all duration-200
              ${searchFocused ? 'bg-white border-blue-200 ring-4 ring-blue-50 shadow-sm' : 'bg-slate-50 border-transparent hover:bg-slate-100'}
              border
            `}>
              <Search size={16} className={searchFocused ? 'text-[#2563eb]' : 'text-slate-400'} />
              <input
                type="text"
                placeholder="Search jobs, projects..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="bg-transparent border-none outline-none text-[13px] w-full font-medium text-slate-900 placeholder:text-slate-400"
              />
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white shadow-sm border border-slate-200 text-slate-400 shrink-0">
                 <Command size={10} />
                 <span className="text-[9px] font-bold">K</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button className="relative p-2 rounded-full hover:bg-slate-50 hover:text-rose-500 text-rose-500 transition-all bg-rose-50 border border-transparent">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>
            <Button onClick={() => router.push('/jobs')} className="hidden sm:flex bg-[#3b82f6] hover:bg-blue-600 shadow-md shadow-blue-500/20 text-white rounded-[12px] h-10 px-6 text-sm font-bold tracking-wide">
               Find Work
            </Button>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
