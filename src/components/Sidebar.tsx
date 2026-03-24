'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, CreditCard, Sparkles, Bell, Settings,
  ChevronRight, LogOut, Wallet, Users, Briefcase,
  MessageSquare, PieChart, Zap, MapPin, Megaphone,
  PlusCircle, Rocket, FileText, ChevronLeft, Building2,
  Clock, QrCode, Receipt,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { BRANDING } from '@/lib/config';
import { authAPI } from '@/services/api';
import { signOut, useSession } from 'next-auth/react';

// ── Menu Structure ───────────────────────────────────────────────────
interface MenuItem { icon: React.ReactNode; label: string; path: string; badge?: string }
interface MenuSection { title: string; items: MenuItem[] }

const MENU_SECTIONS: MenuSection[] = [
  {
    title: 'Core',
    items: [
      { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/dashboard' },
      { icon: <MessageSquare size={18} />, label: 'Messages', path: '/messages', badge: '2' },
      { icon: <Briefcase size={18} />, label: 'Marketplace', path: '/marketplace' },
    ],
  },
  {
    title: 'Money',
    items: [
      { icon: <CreditCard size={18} />, label: 'Receive Payments', path: '/dashboard/payments' },
      { icon: <Wallet size={18} />, label: 'Withdrawals', path: '/dashboard/withdraw' },
      { icon: <Sparkles size={18} />, label: 'Subscriptions', path: '/dashboard/subscriptions' },
    ],
  },
  {
    title: 'Manage',
    items: [
      { icon: <FileText size={18} />, label: 'Contracts', path: '/dashboard/contracts' },
      { icon: <Clock size={18} />, label: 'Reminders', path: '/dashboard/reminders' },
      { icon: <Users size={18} />, label: 'Referrals', path: '/dashboard/referrals' },
    ],
  },
  {
    title: 'Grow',
    items: [
      { icon: <PlusCircle size={18} />, label: 'Post Requirement', path: '/post-requirement' },
      { icon: <Megaphone size={18} />, label: 'Ads Dashboard', path: '/ads/dashboard' },
      { icon: <MapPin size={18} />, label: 'Nearby', path: '/nearby' },
    ],
  },
];

// ── Sidebar Item ─────────────────────────────────────────────────────
const SidebarItem = ({ icon, label, path, active, collapsed, onClick, badge }: MenuItem & { active: boolean; collapsed: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer
      transition-all duration-200 text-left group relative
      ${active
        ? 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-500/5'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }
    `}
  >
    {active && (
      <motion.div
        layoutId="sidebarActive"
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-blue-600"
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      />
    )}
    <span className={`shrink-0 ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'} transition-colors`}>
      {icon}
    </span>
    {!collapsed && (
      <>
        <span className={`text-[13px] font-semibold tracking-tight flex-1 truncate ${active ? 'font-bold text-blue-900' : ''}`}>
          {label}
        </span>
        {badge && (
          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
            {badge}
          </span>
        )}
      </>
    )}
  </button>
);

// ═══════════════════════════════════════════════════════════════════════
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
    } catch {
      router.push('/login');
    }
  };

  const [user, setUser] = useState<any>(null);
  React.useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    else if (session?.user) setUser(session.user);
  }, [session]);

  const isActive = (path: string) => pathname === path || (path !== '/dashboard' && pathname.startsWith(path + '/'));

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-200/60 flex flex-col z-[100] transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[260px]'}`}
    >
      {/* Logo */}
      <div className={`h-16 flex items-center ${collapsed ? 'justify-center' : 'px-5'} border-b border-slate-100 shrink-0`}>
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Zap size={16} className="text-white fill-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900">{BRANDING.name}</span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Pro Dashboard</span>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto scrollbar-thin">
        {MENU_SECTIONS.map(section => (
          <div key={section.title}>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-300">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
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
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-100 space-y-1 shrink-0">
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
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all text-left group"
        >
          <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
          {!collapsed && <span className="text-[13px] font-semibold">Logout</span>}
        </button>
      </div>

      {/* User Card */}
      <div className="px-3 pb-3">
        <div
          onClick={() => router.push('/profile')}
          className={`p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center ${collapsed ? 'justify-center' : 'gap-3'} cursor-pointer hover:border-blue-200 hover:bg-white transition-all group`}
        >
          <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 bg-slate-200">
            <Image
              src={user?.avatar || user?.image || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=3B82F6&color=fff`}
              alt="Avatar"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{user?.role || 'Member'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-all z-50 shadow-md"
      >
        <ChevronLeft size={12} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
      </button>
    </aside>
  );
}
