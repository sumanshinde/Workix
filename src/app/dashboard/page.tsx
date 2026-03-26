'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Wallet, Zap, Target, ArrowUpRight,
  CreditCard, Bell, ChevronRight, Clock,
  DollarSign, Users, BarChart3, Star, Sparkles,
  PlusCircle, LayoutDashboard, Briefcase,
  Layers, Settings, Search, Filter,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { dashboardAPI } from '../../services/api';
import { Button, Card, Skeleton } from '../../components/ui';
import { useRouter } from 'next/navigation';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-bold text-[#2563eb]">₹{payload[0]?.value?.toLocaleString()}</p>
    </div>
  );
};

const StatCard = ({ title, value, sub, icon, trend, delay, prefix = '₹' }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-white border border-slate-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
  >
    <div className="flex items-start justify-between mb-8">
      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
        {icon}
      </div>
      {trend && (
        <div className="flex items-center gap-1.5 p-1 px-2.5 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-600">
           <TrendingUp size={12} /> {trend}%
        </div>
      )}
      {sub && !trend && (
         <div className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg italic">
            {sub}
         </div>
      )}
    </div>
    
    <div>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
      <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
        {prefix}{value}
      </h3>
    </div>
  </motion.div>
);

export default function SaasDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAllData = async () => {
      try {
        const res = await dashboardAPI.getStats();
        if (isMounted) setData(res);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAllData();
    return () => { isMounted = false; };
  }, []);

  const revenueData = useMemo(() => [
    { name: 'Jan', revenue: 12000 },
    { name: 'Feb', revenue: 19000 },
    { name: 'Mar', revenue: 15000 },
    { name: 'Apr', revenue: 25000 },
    { name: 'May', revenue: 22000 },
    { name: 'Jun', revenue: 32000 },
    { name: 'Jul', revenue: 42000 },
  ], []);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
       {[1,2,3,4].map(i => <Skeleton key={i} className="h-44 rounded-2xl" />)}
       <Skeleton className="lg:col-span-8 h-[400px] rounded-2xl" />
       <Skeleton className="lg:col-span-4 h-[400px] rounded-2xl" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12">
      
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Dashboard</h1>
        <p className="text-sm text-slate-500 font-medium">Your financial overview and recent activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="TOTAL REVENUE"
          value="1,42,500"
          trend="18.2"
          icon={<TrendingUp size={20} />}
          delay={0}
        />
        <StatCard
          title="ACTIVE SUBSCRIPTIONS"
          value="3"
          sub="2 renewing"
          icon={<Sparkles size={20} />}
          delay={0.1}
          prefix=""
        />
        <StatCard
          title="PENDING PAYMENTS"
          value="22,000"
          sub="1 escrow"
          icon={<Clock size={20} />}
          delay={0.2}
        />
        <StatCard
          title="THIS MONTH EARNINGS"
          value="42,000"
          trend="24"
          icon={<Briefcase size={20} />}
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Chart Column */}
        <div className="lg:col-span-8 bg-white border border-slate-50 rounded-2xl p-8 shadow-sm">
           <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <BarChart3 size={18} />
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 tracking-tight">Revenue Analytics</h3>
              </div>
              <div className="flex gap-4">
                 {['7D', '1M', '3M', '1Y'].map(t => (
                   <button key={t} className={`text-[10px] font-bold uppercase tracking-widest ${t === '3M' ? 'text-blue-600 bg-blue-50 px-2 py-1 rounded-lg' : 'text-slate-400'}`}>
                      {t}
                   </button>
                 ))}
              </div>
           </div>

           <div className="h-[320px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={revenueData}>
                 <defs>
                   <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#2563eb" stopOpacity={0.08} />
                     <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="name" stroke="#cbd5e1" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} dy={15} />
                 <YAxis stroke="#cbd5e1" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} tickFormatter={v => `₹${v / 1000}K`} />
                 <Tooltip content={<CustomTooltip />} />
                 <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#chartGrad)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Notifications Column */}
        <div className="lg:col-span-4 bg-white border border-slate-50 rounded-2xl p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
                    <Bell size={18} />
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 tracking-tight">Notifications</h3>
              </div>
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded-lg">4 new</span>
           </div>

           <div className="space-y-6">
              {[
                { title: 'Payment of ₹15,000 received from Alpha Systems', time: '2 min ago', icon: <DollarSign size={16} />, color: 'text-emerald-500 bg-emerald-50' },
                { title: 'Subscription renews in 5 days', time: '1 hr ago', icon: <Clock size={16} />, color: 'text-amber-500 bg-amber-50' },
                { title: 'Payout of ₹8,500 is processing', time: '3 hr ago', icon: <Wallet size={16} />, color: 'text-blue-500 bg-blue-50' },
                { title: 'Your profile score improved to 92/100', time: '1 day ago', icon: <Zap size={16} />, color: 'text-emerald-500 bg-emerald-50' },
              ].map((n, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.color} transition-transform group-hover:scale-105`}>
                      {n.icon}
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">{n.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{n.time}</p>
                   </div>
                </div>
              ))}
           </div>

           <Button variant="ghost" className="w-full mt-10 h-12 rounded-xl text-blue-600 text-xs font-bold uppercase tracking-widest hover:bg-blue-50">
              View All Notifications
           </Button>
        </div>
      </div>

    </div>
  );
}
