'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Clock, DollarSign, Sparkles, Bell, ArrowUpRight, BarChart3, ChevronRight 
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { Button, Skeleton } from '@/components/ui';
import LocationPicker from '@/components/LocationPicker';

const MOCK_REVENUE = [
  { name: 'Jan', revenue: 12000 },
  { name: 'Feb', revenue: 17000 },
  { name: 'Mar', revenue: 15000 },
  { name: 'Apr', revenue: 28000 },
  { name: 'May', revenue: 23000 },
  { name: 'Jun', revenue: 38000 },
  { name: 'Jul', revenue: 42000 },
];

const RECENT_TRANSACTIONS = [
  { id: 'txn_948j3', type: 'Subscription', amount: 999, status: 'Success', date: 'Oct 12, 2026', icon: <Sparkles size={14} className="text-purple-500"/>, bg: 'bg-purple-50' },
  { id: 'txn_284kd', type: 'Ad Campaign', amount: 5000, status: 'Success', date: 'Oct 10, 2026', icon: <TrendingUp size={14} className="text-emerald-500"/>, bg: 'bg-emerald-50' },
  { id: 'txn_9djen', type: 'Payout', amount: 28500, status: 'Pending', date: 'Oct 09, 2026', icon: <Clock size={14} className="text-amber-500"/>, bg: 'bg-amber-50' },
  { id: 'txn_10xkf', type: 'Subscription', amount: 999, status: 'Failed', date: 'Oct 08, 2026', icon: <DollarSign size={14} className="text-rose-500"/>, bg: 'bg-rose-50' },
];

const NOTIFICATIONS = [
  {
    icon: <DollarSign size={14} className="text-emerald-500" />,
    bg: 'bg-emerald-50',
    title: 'Payment of ₹15,000 received from Alpha Systems',
    time: '2 min ago'
  },
  {
    icon: <Clock size={14} className="text-amber-500" />,
    bg: 'bg-amber-50',
    title: 'Subscription renews in 5 days',
    time: '1 hr ago'
  },
  {
    icon: <Clock size={14} className="text-blue-500" />,
    bg: 'bg-blue-50',
    title: 'Payout of ₹8,500 is processing',
    time: '3 hr ago'
  },
  {
    icon: <Sparkles size={14} className="text-emerald-500" />,
    bg: 'bg-emerald-50',
    title: 'Your profile score improved to 92/100',
    time: '1 day ago'
  }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-bold text-[#2563eb]">₹{payload[0]?.value?.toLocaleString()}</p>
    </div>
  );
};

const StatCard = ({ title, value, subIcon, subText, subColor, mainIcon, mainIconBg, delay = 0, trendText, trendColor, trendBg }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 ${mainIconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
        {mainIcon}
      </div>
      {trendText ? (
         <div className={`flex items-center gap-1 px-2.5 py-1 rounded-[8px] text-[10px] font-bold ${trendBg} ${trendColor}`}>
           <ArrowUpRight size={12} strokeWidth={3} />
           {trendText}
         </div>
      ) : subText ? (
         <p className="text-[11px] font-bold text-slate-500">{subText}</p>
      ) : null}
    </div>
    
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{title}</p>
      <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
    </div>
  </motion.div>
);

export default function SaasDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return (
    <div className="space-y-6">
       <Skeleton className="h-20 w-1/3 rounded-2xl" />
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-36 rounded-2xl" />)}
       </div>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-[400px] rounded-2xl" />
          <Skeleton className="lg:col-span-1 h-[400px] rounded-2xl" />
       </div>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-12">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Dashboard</h1>
        <p className="text-sm font-medium text-slate-500">Your financial overview and recent activity</p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="TOTAL REVENUE"
          value="₹1,42,500"
          mainIcon={<TrendingUp size={18} className="text-emerald-500" />}
          mainIconBg="bg-emerald-50"
          trendText="+18.2%"
          trendColor="text-emerald-600"
          trendBg="bg-emerald-50"
          delay={0}
        />
        <StatCard
          title="ACTIVE SUBSCRIPTIONS"
          value="3"
          mainIcon={<Sparkles size={18} className="text-purple-500" />}
          mainIconBg="bg-purple-50"
          subText="2 renewing"
          delay={0.1}
        />
        <StatCard
          title="PENDING PAYMENTS"
          value="₹22,000"
          mainIcon={<Clock size={18} className="text-amber-500" />}
          mainIconBg="bg-amber-50"
          subText="1 escrow"
          delay={0.2}
        />
        <StatCard
          title="THIS MONTH EARNINGS"
          value="₹42,000"
          mainIcon={<DollarSign size={18} className="text-blue-500" />}
          mainIconBg="bg-blue-50"
          trendText="+24%"
          trendColor="text-emerald-600"
          trendBg="bg-emerald-50"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Analytics Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[#2563eb]">
                   <BarChart3 size={16} />
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 tracking-tight">Revenue Analytics</h3>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400">
                 <button className="hover:text-slate-900 transition-colors">7D</button>
                 <button className="hover:text-slate-900 transition-colors">1M</button>
                 <button className="bg-blue-50 text-[#2563eb] px-3 py-1.5 rounded-lg">3M</button>
                 <button className="hover:text-slate-900 transition-colors">1Y</button>
              </div>
           </div>
           
           <div className="h-[280px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={MOCK_REVENUE} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                 <XAxis dataKey="name" stroke="#cbd5e1" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} dy={10} />
                 <YAxis stroke="#cbd5e1" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} tickFormatter={v => `₹${v/1000}K`} />
                 <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }} />
                 <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Notifications Column */}
        <div className="lg:col-span-1 bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500">
                   <Bell size={16} />
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 tracking-tight">Notifications</h3>
              </div>
              <span className="text-[11px] font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full">
                 4 new
              </span>
           </div>

           <div className="flex-1 space-y-6">
              {NOTIFICATIONS.map((notif, i) => (
                 <div key={i} className="flex gap-4 group cursor-pointer">
                    <div className={`w-9 h-9 rounded-xl ${notif.bg} flex items-center justify-center shrink-0`}>
                       {notif.icon}
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                       <p className="text-[13px] font-bold text-slate-700 leading-snug group-hover:text-[#2563eb] transition-colors">{notif.title}</p>
                       <p className="text-[11px] font-bold text-slate-400 mt-1">{notif.time}</p>
                    </div>
                 </div>
              ))}
           </div>

           <div className="mt-8 pt-6 border-t border-slate-50 text-center">
              <button className="text-[12px] font-bold text-[#2563eb] hover:text-blue-700 transition-colors uppercase tracking-widest">
                 View All Notifications
              </button>
           </div>
        </div>
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recent Transactions</h3>
              <button className="text-[12px] font-bold text-[#2563eb] hover:text-blue-700 transition-colors">
                 View All
              </button>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-slate-100">
                       <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Transaction</th>
                       <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                       <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                       <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right pr-2">Status</th>
                    </tr>
                 </thead>
                 <tbody>
                    {RECENT_TRANSACTIONS.map((txn, i) => (
                       <tr key={txn.id} className="border-b border-slate-50 last:border-none group">
                          <td className="py-4 pl-2">
                             <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg ${txn.bg} flex items-center justify-center shrink-0`}>
                                   {txn.icon}
                                </div>
                                <div>
                                   <p className="text-[13px] font-bold text-slate-900">{txn.type}</p>
                                   <p className="text-[10px] font-mono text-slate-400">{txn.id}</p>
                                </div>
                             </div>
                          </td>
                          <td className="py-4">
                             <span className="text-sm font-bold text-slate-700">₹{txn.amount.toLocaleString()}</span>
                          </td>
                          <td className="py-4">
                             <span className="text-[11px] font-medium text-slate-500">{txn.date}</span>
                          </td>
                          <td className="py-4 pr-2 text-right">
                             <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                                txn.status === 'Success' ? 'bg-emerald-50 text-emerald-600' :
                                txn.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                             }`}>
                                {txn.status}
                             </span>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Location Picker Module */}
        <div className="lg:col-span-1">
           <LocationPicker />
        </div>
      </div>
    </div>
  );
}
