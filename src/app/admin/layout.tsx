'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  LayoutDashboard, Users, Briefcase, CreditCard,
  BarChart3, Bell, Settings, LogOut, Search,
  Menu, X, ChevronDown, ShieldCheck, Zap,
  Activity, Globe, Shield, Sparkles, MessageSquare,
  Megaphone, Receipt, Scale, Gift, Moon, Sun,
  ChevronLeft, Command, UserCheck, Building2,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRANDING } from '@/lib/config';

// ── Theme Context ────────────────────────────────────────────────────────────
interface ThemeCtx { dark: boolean; toggle: () => void }
const ThemeContext = createContext<ThemeCtx>({ dark: false, toggle: () => {} });
export const useAdminTheme = () => useContext(ThemeContext);

// ── Menu structure ───────────────────────────────────────────────────────────
interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: string;
  badgeColor?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const MENU_SECTIONS: MenuSection[] = [
  {
    title: 'Overview',
    items: [
      { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/admin/dashboard' },
      { icon: <Activity size={18} />, label: 'Activity', path: '/admin/activity' },
      { icon: <MessageSquare size={18} />, label: 'Messages', path: '/admin/messages' },
    ],
  },
  {
    title: 'People',
    items: [
      { icon: <Users size={18} />, label: 'All Users', path: '/admin/users' },
      { icon: <UserCheck size={18} />, label: 'Freelancers', path: '/admin/users/manage', badge: '', badgeColor: '' },
      { icon: <Building2 size={18} />, label: 'Clients', path: '/admin/leads' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { icon: <Briefcase size={18} />, label: 'Jobs / Requirements', path: '/admin/jobs' },
      { icon: <Receipt size={18} />, label: 'Orders & Transactions', path: '/admin/orders' },
      { icon: <CreditCard size={18} />, label: 'Payments & Payouts', path: '/admin/payouts' },
      { icon: <Scale size={18} />, label: 'Disputes', path: '/admin/disputes', badge: '!', badgeColor: 'bg-rose-500' },
    ],
  },
  {
    title: 'Growth',
    items: [
      { icon: <Gift size={18} />, label: 'Referrals', path: '/admin/referrals' },
      { icon: <Megaphone size={18} />, label: 'Ads Management', path: '/admin/ads' },
      { icon: <Sparkles size={18} />, label: 'Subscriptions', path: '/admin/subscriptions' },
      { icon: <BarChart3 size={18} />, label: 'Analytics', path: '/admin/analytics' },
    ],
  },
];

// ── Sidebar Item ─────────────────────────────────────────────────────────────
const SidebarItem = ({
  icon, label, path, active, collapsed, badge, badgeColor, dark, onClick,
}: MenuItem & { active: boolean; collapsed: boolean; dark: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer
      transition-all duration-200 text-left group relative
      ${active
        ? dark
          ? 'bg-blue-600/20 text-blue-400'
          : 'bg-blue-50 text-blue-700'
        : dark
          ? 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }
    `}
  >
    {active && (
      <motion.div
        layoutId="activeIndicator"
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full ${dark ? 'bg-blue-400' : 'bg-blue-600'}`}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      />
    )}
    <span className={`shrink-0 transition-colors ${active ? (dark ? 'text-blue-400' : 'text-blue-600') : ''}`}>
      {icon}
    </span>
    {!collapsed && (
      <>
        <span className="font-semibold text-[13px] tracking-tight flex-1 truncate">{label}</span>
        {badge && (
          <span className={`w-5 h-5 rounded-full ${badgeColor || 'bg-blue-500'} text-white text-[9px] font-bold flex items-center justify-center`}>
            {badge}
          </span>
        )}
      </>
    )}
  </button>
);

// ═════════════════════════════════════════════════════════════════════════════
//  MAIN LAYOUT
// ═════════════════════════════════════════════════════════════════════════════
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [dark, setDark] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?error=AccessDenied');
    } else if (status === 'authenticated' && (session?.user as any)?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Persist dark mode
  useEffect(() => {
    const saved = localStorage.getItem('admin-dark');
    if (saved === 'true') setDark(true);
  }, []);

  const toggleDark = () => {
    setDark(d => {
      localStorage.setItem('admin-dark', String(!d));
      return !d;
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const navigate = (path: string) => {
    router.push(path);
    if (isMobile) setShowMobileMenu(false);
  };

  if (status === 'loading') {
    return (
       <div className="h-screen w-screen bg-white flex flex-col items-center justify-center gap-6">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Verifying Administrative Authority...</p>
       </div>
    );
  }

  if (status === 'authenticated' && (session?.user as any)?.role !== 'admin') {
    return (
      <div className="h-screen w-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-6">
          <Shield size={40} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Access Resticted</h1>
        <p className="text-slate-500 font-medium max-w-sm mb-8">
          You are currently logged in with a standard account. Administrative privileges are required to access this console.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => router.push('/')}
            className="px-8 py-3 bg-white border border-slate-200 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Back to Home
          </button>
          <button 
            onClick={() => {
              localStorage.clear();
              router.push('/login');
            }}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
          >
            Switch Account
          </button>
        </div>
      </div>
    );
  }

  // ── Sidebar Content (shared desktop/mobile) ────────────────────────────────
  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => {
    const isCollapsed = mobile ? false : collapsed;

    return (
      <div className={`flex flex-col h-full ${dark ? 'bg-slate-900' : 'bg-white'}`}>
        {/* Logo */}
        <div
          onClick={() => router.push('/')}
          className={`flex items-center h-16 px-5 border-b cursor-pointer group shrink-0 ${dark ? 'border-slate-800' : 'border-slate-100'}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Zap size={16} className="text-white fill-white" />
            </div>
            {!isCollapsed && (
              <div>
                <span className={`font-bold text-base tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
                  {BRANDING.name}
                </span>
                <span className={`block text-[9px] font-bold uppercase tracking-[0.15em] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Admin Console
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 py-4 px-3 space-y-5 overflow-y-auto scrollbar-thin">
          {MENU_SECTIONS.map(section => (
            <div key={section.title}>
              {!isCollapsed && (
                <p className={`px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] ${dark ? 'text-slate-600' : 'text-slate-300'}`}>
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map(item => (
                  <SidebarItem
                    key={item.path}
                    {...item}
                    active={pathname === item.path || (item.path !== '/admin/dashboard' && pathname.startsWith(item.path + '/'))}
                    collapsed={isCollapsed}
                    dark={dark}
                    onClick={() => navigate(item.path)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className={`px-3 py-3 border-t space-y-1 shrink-0 ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
          <SidebarItem
            icon={<Settings size={18} />}
            label="Settings"
            path="/admin/settings"
            active={pathname === '/admin/settings' || pathname.startsWith('/admin/settings/')}
            collapsed={isCollapsed}
            dark={dark}
            onClick={() => navigate('/admin/settings')}
          />
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer
              transition-all duration-200 text-left group
              ${dark ? 'text-slate-500 hover:bg-rose-500/10 hover:text-rose-400' : 'text-slate-400 hover:bg-rose-50 hover:text-rose-500'}
            `}
          >
            <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
            {!isCollapsed && <span className="font-semibold text-[13px]">Logout</span>}
          </button>
        </div>
      </div>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <ThemeContext.Provider value={{ dark, toggle: toggleDark }}>
      <div className={`flex min-h-screen transition-colors duration-300 ${dark ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-700'}`}>

        {/* ── Desktop Sidebar ── */}
        <aside
          className={`
            hidden lg:flex flex-col border-r transition-all duration-300
            sticky top-0 h-screen z-30
            ${collapsed ? 'w-[72px]' : 'w-[260px]'}
            ${dark ? 'border-slate-800' : 'border-slate-200/60'}
          `}
        >
          <SidebarContent />
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`
              absolute -right-3 top-20 w-6 h-6 rounded-full border-2 flex items-center justify-center
              transition-all z-50 shadow-md
              ${dark
                ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
              }
            `}
          >
            <ChevronLeft size={12} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </aside>

        {/* ── Main Content ── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* ── Top Header ── */}
          <header
            className={`
              h-16 px-4 md:px-6 border-b sticky top-0 z-40 flex items-center justify-between
              backdrop-blur-xl transition-colors duration-300
              ${dark
                ? 'bg-slate-900/80 border-slate-800'
                : 'bg-white/80 border-slate-200/60'
              }
            `}
          >
            <div className="flex items-center gap-3">
              {/* Mobile menu trigger */}
              <button
                onClick={() => setShowMobileMenu(true)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${dark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <Menu size={20} />
              </button>

              {/* Search */}
              <div className={`
                hidden md:flex items-center gap-2.5 rounded-xl px-3.5 py-2 w-[320px]
                transition-all duration-200 border
                ${searchFocused
                  ? dark ? 'bg-slate-800 border-blue-500/40' : 'bg-white border-blue-400 ring-4 ring-blue-500/10'
                  : dark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-100/70 border-transparent'
                }
              `}>
                <Search size={15} className={dark ? 'text-slate-500' : 'text-slate-400'} />
                <input
                  type="text"
                  placeholder="Search users, jobs, orders..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={`
                    bg-transparent border-none outline-none text-sm w-full font-medium
                    ${dark ? 'text-slate-200 placeholder:text-slate-600' : 'text-slate-900 placeholder:text-slate-400'}
                  `}
                />
                <kbd className={`
                  hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold
                  ${dark ? 'bg-slate-700 text-slate-400' : 'bg-white border border-slate-200 text-slate-400'}
                `}>
                  <Command size={9} /> K
                </kbd>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              {/* System status */}
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider
                ${dark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </div>

              {/* Dark mode toggle */}
              <button
                onClick={toggleDark}
                className={`p-2 rounded-xl transition-all ${dark ? 'hover:bg-slate-800 text-amber-400' : 'hover:bg-slate-100 text-slate-400'}`}
                title="Toggle Dark Mode"
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Notifications */}
              <button
                className={`relative p-2 rounded-xl transition-all ${dark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              </button>

              {/* Admin avatar */}
              <div className={`
                w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs cursor-pointer
                transition-all hover:scale-105
                bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20
              `}>
                AD
              </div>
            </div>
          </header>

          {/* ── Page Content ── */}
          <main className={`flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto ${dark ? '' : ''}`}>
            {children}
          </main>
        </div>

        {/* ── Mobile Sidebar Overlay ── */}
        <AnimatePresence>
          {showMobileMenu && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileMenu(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] lg:hidden"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-[280px] z-[101] lg:hidden shadow-2xl"
              >
                <SidebarContent mobile />
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className={`absolute top-4 right-4 p-2 rounded-lg ${dark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}
                >
                  <X size={20} />
                </button>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </ThemeContext.Provider>
  );
}
