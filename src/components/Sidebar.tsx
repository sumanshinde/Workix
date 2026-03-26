'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, CreditCard, Sparkles, Bell, Settings,
  LogOut, Wallet, Users, Briefcase, MessageSquare,
  Zap, MapPin, Megaphone, PlusCircle, Rocket,
  FileText, Clock, Building2, ChevronLeft
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { BRANDING } from '@/lib/config';
import { authAPI } from '@/services/api';
import { signOut, useSession } from 'next-auth/react';

// ── Sidebar Item Component ──────────────────────────────────────────
const SidebarItem = ({ icon, label, path, active, collapsed, onClick, badge }: any) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer
      transition-all duration-200 text-left group relative
      ${active
        ? 'bg-blue-50/50 text-blue-600'
        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
      }
    `}
  >
    {active && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-blue-600" />
    )}
    <span className={`shrink-0 ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'} transition-colors`}>
      {icon}
    </span>
    {!collapsed && (
      <div className="flex-1 flex items-center justify-between">
        <span className={`text-[13px] font-semibold tracking-tight ${active ? 'font-bold' : ''}`}>
          {label}
        </span>
        {badge && (
          <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[20px] text-center">
            {badge}
          </span>
        )}
      </div>
    )}
  </button>
);

export default function SaaSSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const [user, setUser] = useState<any>(null);
  React.useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    else if (session?.user) setUser(session.user);
  }, [session]);

  const isActive = (path: string) => pathname === path || (path !== '/dashboard' && pathname.startsWith(path + '/'));

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      await signOut({ redirect: false });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  const sections = [
    {
      title: 'CORE',
      items: [
        { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <MessageSquare size={18} />, label: 'Messages', path: '/dashboard/messages', badge: '2' },
        { icon: <Briefcase size={18} />, label: 'Marketplace', path: '/marketplace' },
      ]
    },
    {
      title: 'MONEY',
      items: [
        { icon: <CreditCard size={18} />, label: 'Receive Payments', path: '/dashboard/payments' },
        { icon: <Wallet size={18} />, label: 'Withdrawals', path: '/dashboard/withdraw' },
        { icon: <Sparkles size={18} />, label: 'Subscriptions', path: '/dashboard/subscriptions' },
      ]
    },
    {
      title: 'MANAGE',
      items: [
        { icon: <FileText size={18} />, label: 'Contracts', path: '/dashboard/contracts' },
        { icon: <Clock size={18} />, label: 'Reminders', path: '/dashboard/reminders' },
        { icon: <Users size={18} />, label: 'Referrals', path: '/dashboard/referrals' },
      ]
    }
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-100 flex flex-col z-[100] transition-all duration-300 ${collapsed ? 'w-20' : 'w-[260px]'}`}
    >
      {/* Branding */}
      <div className={`h-20 flex items-center ${collapsed ? 'justify-center' : 'px-6'} shrink-0 mb-4`}>
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
           <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Zap size={20} className="fill-white" />
           </div>
           {!collapsed && (
              <div>
                <span className="font-bold text-lg tracking-tight text-slate-900 block leading-tight">GigIndia</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">PRO DASHBOARD</span>
              </div>
           )}
        </div>
      </div>

      {/* Menu Sections */}
      <nav className="flex-1 px-4 space-y-6 overflow-y-auto scrollbar-none">
         {sections.map(section => (
            <div key={section.title} className="space-y-1.5">
               {!collapsed && (
                 <p className="px-3 text-[10px] font-bold text-slate-300 uppercase tracking-[0.15em] mb-2">{section.title}</p>
               )}
               {section.items.map(item => (
                  <SidebarItem 
                     key={item.path}
                     {...item}
                     active={isActive(item.path)}
                     collapsed={collapsed}
                     onClick={() => router.push(item.path)}
                  />
               ))}
            </div>
         ))}
         
         <div className="pt-4 space-y-1.5 border-t border-slate-50">
            <SidebarItem 
               icon={<Building2 size={18} />}
               label="Business Settings"
               path="/dashboard/business"
               active={isActive('/dashboard/business')}
               collapsed={collapsed}
               onClick={() => router.push('/dashboard/business')}
            />
            <SidebarItem 
               icon={<Settings size={18} />}
               label="Settings"
               path="/dashboard/settings"
               active={isActive('/dashboard/settings')}
               collapsed={collapsed}
               onClick={() => router.push('/dashboard/settings')}
            />
            <button 
               onClick={handleLogout}
               className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all ${collapsed ? 'justify-center' : ''}`}
            >
               <LogOut size={18} className="rotate-180" />
               {!collapsed && <span className="text-[13px] font-semibold">Logout</span>}
            </button>
         </div>
      </nav>

      {/* User Card */}
      <div className="p-4 px-3 mb-2">
         <div 
            onClick={() => router.push('/profile')}
            className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} p-2.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:border-blue-200 transition-all`}
         >
            <div className="relative w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
               TU
               <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            {!collapsed && (
               <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-slate-900 truncate">Test Setup User</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">FREELANCER</p>
               </div>
            )}
         </div>
      </div>

      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-300 hover:text-blue-600 shadow-sm z-[110] transition-colors"
      >
         <ChevronLeft size={12} className={collapsed ? 'rotate-180' : ''} />
      </button>
    </aside>
  );
}
