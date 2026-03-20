'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Briefcase, CreditCard, 
  BarChart3, Bell, Settings, LogOut, Search,
  Menu, X, ChevronRight, ShieldCheck, Zap,
  Activity, Globe, Terminal, Shield, Sparkles, MessageSquare
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BRANDING } from '@/lib/config';

interface AdminSidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active: boolean;
  collapsed: boolean;
}

const AdminSidebarItem = ({ icon, label, path, active, collapsed }: AdminSidebarItemProps) => {
  const router = useRouter();
  const t = BRANDING.theme;
  
  return (
    <div 
      onClick={() => router.push(path)}
      style={{ 
        backgroundColor: active ? t.primary : 'transparent',
        color: active ? '#FFFFFF' : t.textSecondary
      }}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300
        ${active ? 'shadow-lg shadow-blue-500/10 text-white' : 'hover:bg-slate-100 hover:text-blue-600'}
      `}
    >
      <div className={`shrink-0 ${active ? 'text-white' : 'text-slate-400 opacity-60'}`}>{React.cloneElement(icon as React.ReactElement, { size: 18 })}</div>
      {!collapsed && (
        <span className="font-bold text-[10px] uppercase tracking-widest whitespace-nowrap">{label}</span>
      )}
      {active && !collapsed && (
        <div className="ml-auto w-1 h-1 rounded-full bg-white opacity-60 animate-pulse" />
      )}
    </div>
  );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const t = BRANDING.theme;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { icon: <LayoutDashboard />, label: 'Overview', path: '/admin/dashboard' },
    { icon: <Activity />, label: 'Activity', path: '/admin/activity' },
    { icon: <MessageSquare />, label: 'Messages', path: '/admin/messages' },
    { icon: <Users />, label: 'Directory', path: '/admin/users' },
    { icon: <Briefcase />, label: 'Services', path: '/admin/jobs' },
    { icon: <CreditCard />, label: 'Finances', path: '/admin/payouts' },
    { icon: <BarChart3 />, label: 'Analytics', path: '/admin/analytics' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-white text-slate-600 selection:bg-blue-100 selection:text-blue-600">
      {/* 1. SIDEBAR - DESKTOP CLUSTER */}
      <aside 
        style={{ backgroundColor: '#F8FAFC' }}
        className={`
          hidden lg:flex flex-col border-r border-slate-50 transition-all duration-300
          sticky top-0 h-screen
          ${collapsed ? 'w-20' : 'w-60'}
        `}
      >
        <div 
          onClick={() => router.push('/')}
          className="flex items-center h-16 px-6 border-b border-slate-50 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div 
              style={{ backgroundColor: t.primary }}
              className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm shadow-blue-500/10 group-hover:rotate-6 transition-transform"
            >
              <Zap size={18} className="text-white fill-white" />
            </div>
            {!collapsed && (
              <span className="font-semibold text-xl tracking-tight text-gray-900">{BRANDING.name}</span>
            )}
          </div>
        </div>

        <div className="flex-1 py-8 px-4 space-y-1 overflow-y-auto no-scrollbar">
          {!collapsed && (
            <div className="px-3 mb-3">
               <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">Infrastructure</span>
            </div>
          )}
          {menuItems.map((item) => (
            <AdminSidebarItem 
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={pathname === item.path}
              collapsed={collapsed}
            />
          ))}
        </div>

        <div className="p-4 border-t border-slate-50 space-y-1">
           <AdminSidebarItem 
              icon={<Settings />} 
              label="Config" 
              path="/admin/settings" 
              active={pathname === '/admin/settings'} 
              collapsed={collapsed}
           />
           <div 
             onClick={handleLogout}
             className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all group"
           >
             <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
             {!collapsed && <span className="font-bold text-[10px] uppercase tracking-widest">Terminate</span>}
           </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT HUB */}
      <div className="flex-1 flex flex-col min-w-0 bg-white ml-0 lg:ml-0 overflow-hidden">
        <header className="h-16 px-6 border-b border-gray-100 bg-white/90 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between shadow-sm">
           <div className="flex items-center gap-4">
             <button 
               onClick={() => setCollapsed(!collapsed)}
               className="hidden lg:flex p-2 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-lg text-slate-300 transition-all"
             >
               <Menu size={18} />
             </button>
             <div className="lg:hidden p-2 hover:bg-slate-50 rounded-lg text-slate-300" onClick={() => setShowMobileMenu(true)}>
               <Menu size={22} />
             </div>
             
             {/* Admin OmniSearch */}
             <div className="hidden md:flex items-center gap-3 bg-slate-50/50 border border-slate-50 rounded-xl px-4 py-1.5 w-[360px] focus-within:bg-white focus-within:border-blue-500/20 transition-all">
               <Search size={14} className="text-slate-300" />
               <input 
                 type="text" 
                 placeholder="Search Users..." 
                 className="bg-transparent border-none shadow-none ring-0 outline-none text-[11px] w-full font-bold text-slate-900 placeholder:text-slate-200"
               />
               <div className="hidden lg:block px-1.5 py-0.5 bg-white border border-slate-100 rounded text-[8px] font-bold text-slate-200">⌘K</div>
             </div>
           </div>

           <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 border border-emerald-50 bg-emerald-50/50 rounded-lg">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                 <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-[0.2em]">SYNC ACTIVE</span>
              </div>
              <div 
                style={{ backgroundColor: t.primary }}
                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-[10px] shadow-sm shadow-blue-500/10 border border-white cursor-pointer hover:scale-105 transition-transform"
              >
                 AD
              </div>
           </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto no-scrollbar">
          {children}
        </main>
      </div>

      {/* 3. MOBILE INTERFACE OVERLAY */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className="fixed inset-0 bg-slate-900/40 z-[100] lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 w-64 bg-white z-[101] p-8 lg:hidden shadow-sm"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div style={{ backgroundColor: t.primary }} className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm shadow-blue-500/10">
                    <Zap size={18} className="text-white fill-white" />
                  </div>
                  <span className="font-bold text-sm tracking-tight text-slate-900 uppercase">Admin</span>
                </div>
                <button onClick={() => setShowMobileMenu(false)} className="text-slate-300 p-2"><X size={24} /></button>
              </div>

              <div className="space-y-2">
                {menuItems.map((item) => (
                  <div 
                    key={item.path}
                    onClick={() => { router.push(item.path); setShowMobileMenu(false); }}
                    className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                      pathname === item.path 
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/10' 
                        : 'text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {item.icon}
                    <span className="font-bold uppercase tracking-widest text-[11px]">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
