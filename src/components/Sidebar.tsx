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
      className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-300 border ${
        active 
          ? 'bg-blue-50/80 text-blue-600 border-blue-100 shadow-sm shadow-blue-500/5' 
          : 'text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-900 shadow-none'
      }`}
    >
      <div className={`flex items-center justify-center transition-colors ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`}>
        {React.cloneElement(icon as React.ReactElement, { size: 20, strokeWidth: active ? 2.5 : 2 })}
      </div>
      
      {!collapsed && (
        <span className={`text-[15px] font-medium whitespace-nowrap transition-all ${active ? 'font-extrabold text-blue-900' : 'group-hover:translate-x-0.5'}`}>
          {label}
        </span>
      )}

      {badge && !collapsed && (
        <span className="ml-auto inline-flex items-center justify-center px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-100 text-blue-700 shadow-sm border border-blue-200">
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
      await authAPI.logout();
      await signOut({ redirect: false });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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
      className={`fixed left-0 top-0 h-screen bg-white/70 backdrop-blur-xl border-r border-slate-200 flex flex-col z-[100] transition-all duration-300 shadow-soft ${collapsed ? 'w-[80px]' : 'w-[260px]'}`}
    >
      {/* BRANDING HEADER */}
      <div className={`h-[88px] flex items-center ${collapsed ? 'justify-center' : 'px-6'} relative border-b border-slate-100`}>
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
          <div className="w-10 h-10-xl bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-[15px] shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
            {BRANDING.shortName}
          </div>
          {!collapsed && (
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">
              {BRANDING.name}
            </span>
          )}
        </div>
        
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all z-50 shadow-sm"
        >
          <div className={`transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`}>
            <ChevronRight size={14} />
          </div>
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 mt-6 space-y-1.5 overflow-y-auto no-scrollbar">
        {!collapsed && (
           <div className="px-3 py-3 mb-1">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Main Menu</span>
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
      <div className="p-4 mt-auto border-t border-slate-100 bg-slate-50/50">
        <div className="space-y-1.5 mb-6">
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
            icon={<LogOut className="text-slate-400 group-hover:text-rose-600" />}
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
          className={`p-3 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center ${collapsed ? 'justify-center p-2' : 'gap-3 mx-1'} group cursor-pointer hover:border-blue-200 hover:shadow-soft transition-all duration-300 relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-slate-100 border-2 border-slate-50 group-hover:border-blue-100 transition-colors z-10">
            <Image 
              src={user?.avatar || user?.image || "https://ui-avatars.com/api/?name=" + (user?.name || "User")} 
              alt="Avatar" 
              fill 
              className="object-cover"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
          </div>
          
          {!collapsed && (
            <div className="flex-1 min-w-0 text-left z-10">
               <p className="text-[13px] font-extrabold text-slate-900 truncate tracking-tight group-hover:text-blue-700 transition-colors">{user?.name || 'Aman Sharma'}</p>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{user?.role || 'User'}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
