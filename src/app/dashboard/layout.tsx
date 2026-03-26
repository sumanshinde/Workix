'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Search, Bell, Command, ChevronDown } from 'lucide-react';
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
  }, [status, session, pathname, user, router]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar />
      <main className="flex-1 ml-20 lg:ml-[260px] transition-all duration-300 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 px-4 md:px-8 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
          
          {/* Search */}
          <div className={`
            hidden md:flex items-center gap-3 rounded-xl px-4 py-1.5 w-[320px] lg:w-[480px]
            transition-all duration-200
            ${searchFocused ? 'bg-white border-blue-200 ring-4 ring-blue-50' : 'bg-slate-50 border-transparent'}
            border
          `}>
            <Search size={16} className={searchFocused ? 'text-blue-600' : 'text-slate-400'} />
            <input
              type="text"
              placeholder="Search jobs, projects..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="bg-transparent border-none outline-none text-sm w-full font-medium text-slate-700 placeholder:text-slate-400"
            />
            <div className="flex items-center gap-1 border border-slate-100 bg-white px-2 py-0.5 rounded-lg shadow-sm">
               <Command size={10} className="text-slate-300" />
               <span className="text-[10px] font-black text-slate-300">K</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>
            
            <Button 
               onClick={() => router.push('/marketplace')}
               className="bg-[#2563eb] hover:bg-blue-700 text-white rounded-xl px-6 h-10 text-sm font-bold shadow-lg shadow-blue-500/20"
            >
               Find Work
            </Button>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
