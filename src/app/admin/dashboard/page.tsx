'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Briefcase, DollarSign, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Clock, 
  CheckCircle2, AlertCircle, FileText,
  Activity, ShieldCheck, Zap, Globe, Menu, Search,
  Terminal, Shield, MessageSquare
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { BRANDING } from '@/lib/config';

import { adminAPI } from '@/services/api';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

const data = [
  { name: 'Mon', revenue: 4200, users: 12 },
  { name: 'Tue', revenue: 5800, users: 18 },
  { name: 'Wed', revenue: 3900, users: 15 },
  { name: 'Thu', revenue: 7200, users: 24 },
  { name: 'Fri', revenue: 8100, users: 32 },
  { name: 'Sat', revenue: 4500, users: 10 },
  { name: 'Sun', revenue: 3200, users: 8 },
];

const StatCard = ({ title, value, change, icon, trend }: any) => {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-105 transition-transform">
          {React.cloneElement(icon, { size: 20 })}
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : trend === 'down' ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-600'}`}>
          {change} {trend === 'up' ? <ArrowUpRight size={14} /> : trend === 'down' ? <ArrowDownRight size={14} /> : null}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-[#6b7280] text-xs font-bold uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-[#111827]">{value}</h3>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const t = BRANDING.theme;
  const [stats, setStats] = React.useState({
    liveUsers: 0,
    liveChats: 0,
    totalRevenue: 0,
    signups: 0,
    flaggedUsers: 0
  });

  React.useEffect(() => {
    fetchStats();
    
    const socket = io(SOCKET_URL, { withCredentials: true });
    
    socket.on('new_activity', (act: any) => {
      if (act && act.action === 'signup') {
         setStats(s => ({...s, liveUsers: s.liveUsers + 1, signups: s.signups + 1}));
      }
      if (act && act.action === 'login') {
         // simplified live logic
      }
      if (act && act.action === 'fraud_alert') {
         setStats(s => ({...s, flaggedUsers: s.flaggedUsers + 1}));
      }
    });
    
    socket.on('receive_msg', () => {
       setStats(s => ({...s, liveChats: s.liveChats + 1}));
    });

    return () => { socket.disconnect() };
  }, []);

  const fetchStats = async () => {
    try {
      const res = await adminAPI.getDashboardStats();
      if (res) setStats(res as any);
    } catch(err) {
      console.error(err);
    }
  };
  
  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10 md:">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-[#111827]">Super Admin Dashboard</h1>
          <p className="text-[#6b7280] font-medium text-base">Real-time platform intelligence and fraud oversight.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-white border border-gray-200 text-[#111827] font-bold rounded-lg hover:bg-gray-50 transition-all text-sm shadow-sm flex items-center gap-2">
            <AlertCircle size={16} className={stats.flaggedUsers > 0 ? "text-red-500 animate-pulse" : "text-gray-400"} />
            {stats.flaggedUsers} Flagged Users
          </button>
        </div>
      </div>

      {/* 2. CORE PERFORMANCE GRID - TIGHT */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Live Network Users" 
          value={stats.liveUsers.toLocaleString()} 
          change="Real-time" 
          trend="neutral" 
          icon={<Users />} 
        />
        <StatCard 
          title="Live Chats Sent" 
          value={stats.liveChats.toLocaleString()} 
          change="Real-time" 
          trend="neutral" 
          icon={<MessageSquare className="text-blue-600" />} 
        />
        <StatCard 
          title="Total Signups" 
          value={stats.signups.toLocaleString()} 
          change="Verified" 
          trend="up" 
          icon={<ShieldCheck />} 
        />
        <StatCard 
          title="Total Gross Revenue" 
          value={`₹${stats.totalRevenue.toLocaleString()}`} 
          change="Settled" 
          trend="up" 
          icon={<DollarSign />} 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* 3. REVENUE VELOCITY CHART - COMPACT */}
        <div className="xl:col-span-8 bg-white border border-gray-100 p-8 rounded-xl space-y-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#111827] flex items-center gap-3">
               <Activity size={20} className="text-blue-600" /> Revenue Growth
            </h3>
            <div className="flex gap-3">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold uppercase tracking-wider">Historical Analysis</span>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94A3B8" 
                  fontSize={9} 
                  fontWeight={900}
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ dy: 8 }}
                />
                <YAxis 
                  stroke="#94A3B8" 
                  fontSize={9} 
                  fontWeight={900}
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: '#0F172A', fontWeight: 900, textTransform: 'uppercase', fontSize: '9px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2563EB" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. VERIFICATION DECK - COMPACT */}
        <div className="xl:col-span-4 h-full">
          <div className="bg-white border border-gray-100 p-8 rounded-xl shadow-sm h-full overflow-hidden">
            <h3 className="text-sm font-bold text-[#111827] mb-6">User Verifications</h3>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-50 hover:bg-white hover:border-blue-200 transition-all cursor-pointer group">
                  <div className="w-10 h-10-lg-400">
                     U{i}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#111827] font-bold text-sm">Identity Queue #{1000 + i}</p>
                    <p className="text-[#6b7280] text-xs font-medium">Pending Verification</p>
                  </div>
                  <button className="p-2 text-emerald-600 bg-white border border-gray-100 rounded-lg hover:bg-emerald-50 transition-all"><CheckCircle2 size={16} /></button>
                </div>
              ))}
              <button className="w-full py-4 text-center text-[#6b7280] text-xs font-bold hover:text-blue-600 transition-colors border-t border-gray-50 mt-4">View All Requests</button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. TRANSACTION TABLE */}
      <div className="bg-white border border-gray-100 p-8 rounded-xl shadow-sm space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#111827] flex items-center gap-3">
             <Shield size={20} className="text-blue-600" /> Recent Transactions
          </h3>
          <button className="text-blue-600 font-bold text-xs hover:underline">View All Registry</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#9ca3af] text-[10px] font-bold uppercase tracking-wider border-b border-gray-50">
                <th className="pb-4 px-4">Transaction ID</th>
                <th className="pb-4 px-4">Type</th>
                <th className="pb-4 px-4 text-right">Amount</th>
                <th className="pb-4 px-4">Date</th>
                <th className="pb-4 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <tr key={i} className="group hover:bg-gray-50/50 transition-all">
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10-lg-600 font-bold text-[10px]">TX</div>
                      <span className="font-bold text-[#111827] text-sm">#TXN-{5234 + i}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <p className="text-[#111827] font-bold text-sm leading-none mb-1">Escrow Release</p>
                    <p className="text-[10px] text-[#6b7280] font-medium uppercase tracking-wide">Project Completion</p>
                  </td>
                  <td className="py-5 px-4 text-right font-bold text-[#111827] text-base">₹{(4500 * (i + 1)).toLocaleString()}</td>
                  <td className="py-5 px-4 text-[#6b7280] font-medium text-xs">Today, 12:34 PM</td>
                  <td className="py-5 px-4 text-center">
                    <div className="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold">
                       SUCCESS
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
