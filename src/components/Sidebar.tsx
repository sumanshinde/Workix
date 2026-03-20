'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  Wallet, 
  Settings, 
  ChevronRight, 
  LogOut, 
  ShieldCheck,
  PieChart,
  FileText,
  Users,
  Percent
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { BRANDING } from '@/lib/config';
import { authAPI } from '@/services/api';
import { signOut, useSession } from 'next-auth/react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
  badge?: string;
}

const SidebarItem = ({ icon, label, path, active, collapsed, onClick, badge }: SidebarItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 border ${
        active 
          ? 'bg-blue-50/50 text-blue-600 border-blue-100' 
          : 'text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-900 focus:bg-gray-50 focus:text-gray-900'
      }`}
    >
      <div className={`flex items-center justify-center ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} transition-colors`}>
        {React.cloneElement(icon as React.ReactElement, { size: 18, strokeWidth: active ? 2.5 : 2 })}
      </div>
      
      {!collapsed && (
        <span className={`text-sm font-medium whitespace-nowrap ${active ? 'font-semibold' : ''}`}>
          {label}
        </span>
      )}

      {badge && !collapsed && (
        <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-600">
          {badge}
        </span>
      )}
    </div>
  );
};

export default function SaaSSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      // 1. Clear backend cookie
      await authAPI.logout();
      // 2. Clear next-auth session
      await signOut({ redirect: false });
      // 3. Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // 4. Redirect
      router.push('/login');
    } catch (err) {
      console.error('Logout failed', err);
      router.push('/login');
    }
  };

  const [user, setUser] = useState<any>(null);
  React.useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    else if (session?.user) setUser(session.user);
  }, [session]);

  const menuItems = [
    { icon: <LayoutDashboard />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Briefcase />, label: 'Marketplace', path: '/marketplace' },
    { icon: <FileText />, label: 'Contracts', path: '/dashboard/contracts' },
    { icon: <MessageSquare />, label: 'Messages', path: '/messages', badge: '2' },
    { icon: <Wallet />, label: 'Payments', path: '/dashboard/withdraw' },
    { icon: <PieChart />, label: 'Analytics', path: '/admin/analytics' },
    { icon: <ShieldCheck />, label: 'Compliance', path: '/admin/dashboard' },
    { icon: <Users />, label: 'Referrals', path: '/referrals' },
    { icon: <Percent />, label: 'Commission', path: '/admin/fees' },
  ];

  const bottomItems = [
    { icon: <Settings />, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-100 flex flex-col z-[100] transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[256px]'}`}
    >
      {/* BRANDING HEADER */}
      <div className={`h-16 flex items-center ${collapsed ? 'justify-center' : 'px-6'} relative border-b border-gray-100`}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-10 h-10-lg">
            {BRANDING.shortName}
          </div>
          {!collapsed && (
            <span 
              className="font-semibold text-xl text-gray-900 tracking-tight"
            >
              {BRANDING.name}
            </span>
          )}
        </div>
        
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all z-50 hover:bg-gray-50"
        >
          <div className={`transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`}>
            <ChevronRight size={10} />
          </div>
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-3 mt-6 space-y-1 overflow-y-auto no-scrollbar">
        {!collapsed && (
          <div className="px-3 py-2">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Main Menu</span>
          </div>
        )}
        
        {menuItems.map((item) => (
          <SidebarItem 
            key={item.path}
            {...item}
            active={pathname === item.path}
            collapsed={collapsed}
            onClick={() => router.push(item.path)}
          />
        ))}
      </nav>

      {/* FOOTER & USER */}
      <div className="p-3 mt-auto border-t border-gray-100">
        <div className="space-y-1 mb-4">
          {bottomItems.map((item) => (
            <SidebarItem 
              key={item.path}
              {...item}
              active={pathname === item.path}
              collapsed={collapsed}
              onClick={() => router.push(item.path)}
            />
          ))}
          <SidebarItem 
            icon={<LogOut className="text-gray-400 group-hover:text-red-600" />}
            label="Logout"
            path="/logout"
            active={false}
            collapsed={collapsed}
            onClick={handleLogout}
          />
        </div>

        {/* User Card */}
        <div 
          onClick={() => router.push('/profile')}
          className={`p-2 rounded-lg border border-gray-100 flex items-center ${collapsed ? 'justify-center' : 'gap-3'} group cursor-pointer hover:bg-gray-50 transition-all duration-200`}
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 bg-gray-100">
            <Image 
              src={user?.avatar || user?.image || "https://ui-avatars.com/api/?name=" + (user?.name || "User")} 
              alt="Avatar" 
              fill 
              className="object-cover"
            />
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-white rounded-full" />
          </div>
          
          {!collapsed && (
            <div className="flex-1 min-w-0 text-left">
               <p className="text-[11px] font-bold text-slate-900 truncate tracking-tight">{user?.name || 'Aman Sharma'}</p>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user?.role || 'User'}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
