'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, CreditCard, Bell, Settings,
  LogOut, Users, Briefcase, Zap, ChevronLeft,
  Rocket, Search, Command, MessageSquare, Wallet,
  FileText, Clock, Building, MapPin, Megaphone
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { BRANDING } from '@/lib/config';
import { authAPI } from '@/services/api';
import { signOut, useSession } from 'next-auth/react';

// ── Sidebar Item Component ──────────────────────────────────────────
const SidebarItem = ({ icon, label, active, collapsed, badge, onClick }: any) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer
      transition-all duration-200 text-left group relative
      ${active
        ? 'bg-blue-50 text-[#2563eb] font-semibold'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
      }
    `}
  >
    <div className="flex items-center gap-3 min-w-0">
      {active && (
         <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#2563eb] rounded-r-md" />
      )}
      <span className={`shrink-0 ${active ? 'text-[#2563eb]' : 'text-slate-400 group-hover:text-[#2563eb]'} transition-colors`}>
        {icon}
      </span>
      {!collapsed && (
        <span className="text-[14px] truncate">
          {label}
        </span>
      )}
    </div>
    {!collapsed && badge && (
      <span className="bg-blue-100 text-[#2563eb] py-0.5 px-2 rounded-full text-[10px] font-bold">
        {badge}
      </span>
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

  const isActive = (path: string) => pathname === path || (path !== '/dashboard' && path !== '' && pathname.startsWith(path + '/'));

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

  const menuGroups = [
    {
      title: 'CORE',
      items: [
        { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <MessageSquare size={18} />, label: 'Messages', path: '/dashboard/messages', badge: '2' },
        { icon: <Briefcase size={18} />, label: 'Marketplace', path: '/dashboard/marketplace' },
        { icon: <MapPin size={18} />, label: 'Nearby Radar', path: '/nearby' },
        { icon: <Megaphone size={18} />, label: 'Ad Campaigns', path: '/ads/dashboard' },
      ]
    },
    {
      title: 'MONEY',
      items: [
        { icon: <CreditCard size={18} />, label: 'Receive Payments', path: '/dashboard/payments/receive' },
        { icon: <Wallet size={18} />, label: 'Withdrawals', path: '/dashboard/payments/withdraw' },
        { icon: <Zap size={18} />, label: 'Subscriptions', path: '/dashboard/subscriptions' },
      ]
    },
    {
      title: 'MANAGE',
      items: [
        { icon: <FileText size={18} />, label: 'Contracts', path: '/dashboard/contracts' },
        { icon: <Clock size={18} />, label: 'Reminders', path: '/dashboard/reminders' },
        { icon: <Users size={18} />, label: 'Referrals', path: '/dashboard/referrals' },
        { icon: <Building size={18} />, label: 'Business Settings', path: '/dashboard/business' },
        { icon: <Settings size={18} />, label: 'Settings', path: '/dashboard/settings' },
        { icon: <LogOut size={18} />, label: 'Logout', isAction: true, action: handleLogout }
      ]
    }
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-100 flex flex-col z-[100] transition-all duration-300 ${collapsed ? 'w-20' : 'w-[260px]'} overflow-y-auto overflow-x-hidden`}
    >
      <div className={`h-24 flex items-center ${collapsed ? 'justify-center' : 'px-6'} shrink-0`}>
        <div className="flex items-center gap-3 cursor-pointer group w-full" onClick={() => router.push('/')}>
           <div className="w-10 h-10 bg-[#2563eb] rounded-[10px] flex items-center justify-center text-white shadow-sm shrink-0">
              <Zap size={20} className="fill-white" />
           </div>
           {!collapsed && (
              <div className="flex flex-col">
                 <span className="font-extrabold text-[18px] tracking-tight text-slate-900 leading-tight">GigIndia</span>
                 <span className="text-[10px] font-bold text-slate-400 tracking-[0.1em] mt-0.5">PRO DASHBOARD</span>
              </div>
           )}
        </div>
      </div>

      <nav className="flex-1 py-4 space-y-6">
         {menuGroups.map((group, i) => (
            <div key={i} className="space-y-1 relative">
               {!collapsed && (
                 <h4 className="text-[11px] font-bold text-slate-400 tracking-[0.1em] px-7 mb-2 uppercase">{group.title}</h4>
               )}
               <div className="px-4 space-y-1">
                 {group.items.map((item: any, j) => (
                    <SidebarItem 
                       key={j}
                       icon={item.icon}
                       label={item.label}
                       badge={item.badge}
                       active={!item.isAction && isActive(item.path)}
                       collapsed={collapsed}
                       onClick={() => item.isAction ? item.action() : router.push(item.path)}
                    />
                 ))}
               </div>
            </div>
         ))}
      </nav>

      <div className="p-4 shrink-0 mb-4">
         <div 
            onClick={() => router.push('/profile')}
            className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} bg-slate-50 p-2.5 rounded-2xl cursor-pointer transition-all border border-slate-100 hover:border-slate-200 group`}
         >
            <div className="relative w-10 h-10 rounded-full bg-[#2563eb] text-white flex items-center justify-center overflow-hidden shrink-0 font-bold text-sm shadow-sm">
               {user?.avatar ? (
                 <Image src={user.avatar} alt="Avatar" fill className="object-cover" />
               ) : (
                 "TU"
               )}
            </div>
            {!collapsed && (
               <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-slate-900 truncate group-hover:text-[#2563eb] transition-colors">{user?.name || 'Test Setup User'}</p>
                  <p className="text-[10px] font-bold text-slate-400 tracking-[0.1em] mt-0.5 uppercase">{user?.role || 'FREELANCER'}</p>
               </div>
            )}
         </div>
      </div>

      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="fixed left-[248px] top-12 -translate-y-1/2 w-6 h-6 bg-white border border-slate-200 rounded-full flex flex-col items-center justify-center text-slate-400 hover:text-[#2563eb] shadow-sm z-[110] transition-colors"
        style={{ transform: collapsed ? 'translate(-12px, -50%)' : 'translate(0, -50%)', left: collapsed ? '80px' : '260px', transition: 'left 300ms' }}
      >
         <ChevronLeft size={16} className={collapsed ? 'rotate-180' : ''} />
      </button>
    </aside>
  );
}
