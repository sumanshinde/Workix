'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Search, Bell } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { BRANDING } from '@/lib/config';
import { Button } from '@/components/ui';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, status } = useSession();

  useEffect(() => {
    // 1. Skip if still loading session
    if (status === 'loading') return;

    // 2. Identify current user and token
    const token = localStorage.getItem('token') || (session as any)?.backendToken;
    const rawUser = localStorage.getItem('user');
    let localUserDetails = null;
    if (rawUser) {
      try { localUserDetails = JSON.parse(rawUser); } catch (e) { localStorage.removeItem('user'); }
    }
    const currentUser = session?.user || localUserDetails;

    // 3. Conditional state sync and redirection
    if (currentUser && token) {
      if (!user) {
        setUser(currentUser);
        // Ensure local storage is in sync
        if (!rawUser) localStorage.setItem('user', JSON.stringify(currentUser));
        if (!localStorage.getItem('token') && (session as any)?.backendToken) {
          localStorage.setItem('token', (session as any).backendToken);
        }
      }
    } else {
      // Unauthenticated or missing critical metadata
      const isDashboardRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/client');
      if (isDashboardRoute) {
        // Prevent recursive redirection by checking if we are already transitioning
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
  }, [status, session, pathname, user]);
  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 ml-[72px] lg:ml-[256px] transition-all duration-300 flex flex-col min-h-screen">
        <header className="h-16 px-6 bg-white/90 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between sticky top-0 z-40">
          <div className="relative group w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search jobs, projects..." 
              className="w-full bg-gray-50 border border-gray-100 rounded-lg pl-10 pr-4 py-2 text-sm focus:bg-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10-lg-600 transition-all bg-gray-50 hover:bg-white border border-gray-100 rounded-lg">
               <Bell size={18} />
            </button>
            <Button
              size="sm"
              onClick={() => router.push(user.role === 'freelancer' ? '/marketplace' : '/post-job')}
            >
              {user.role === 'freelancer' ? 'Find Work' : 'Post a Job'}
            </Button>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}


