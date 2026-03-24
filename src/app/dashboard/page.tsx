'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Wallet, Zap, Target, ArrowUpRight,
  CreditCard, Bell, Plus, ChevronRight, Clock,
  CheckCircle2, AlertCircle, DollarSign, Users,
  BarChart3, ArrowDownRight, Sparkles,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { dashboardAPI } from '../../services/api';
import { Button, Card, Skeleton } from '../../components/ui';
import { useRouter } from 'next/navigation';

// ── Mock chart data ──────────────────────────────────────────────────
const revenueData = [
  { name: 'Jan', revenue: 12000 },
  { name: 'Feb', revenue: 18000 },
  { name: 'Mar', revenue: 15000 },
  { name: 'Apr', revenue: 28000 },
  { name: 'May', revenue: 22000 },
  { name: 'Jun', revenue: 35000 },
  { name: 'Jul', revenue: 42000 },
];

const recentTransactions = [
  { id: 'TXN-5001', name: 'Alpha Systems Pvt Ltd', type: 'Project Payment', amount: 15000, status: 'paid', date: 'Today, 2:30 PM' },
  { id: 'TXN-5002', name: 'Green Retail Inc', type: 'Milestone', amount: 8500, status: 'paid', date: 'Today, 11:20 AM' },
  { id: 'TXN-5003', name: 'Swift Apps', type: 'Escrow Hold', amount: 22000, status: 'pending', date: 'Yesterday' },
  { id: 'TXN-5004', name: 'CoinDesk Pro', type: 'Ad Payment', amount: 2500, status: 'paid', date: '2 days ago' },
  { id: 'TXN-5005', name: 'Creator Studio', type: 'Refund', amount: 4500, status: 'failed', date: '3 days ago' },
];

const notifications = [
  { icon: <DollarSign size={14} />, message: 'Payment of ₹15,000 received from Alpha Systems', time: '2 min ago', type: 'success' },
  { icon: <Clock size={14} />, message: 'Subscription renews in 5 days', time: '1 hr ago', type: 'warning' },
  { icon: <AlertCircle size={14} />, message: 'Payout of ₹8,500 is processing', time: '3 hr ago', type: 'info' },
  { icon: <Sparkles size={14} />, message: 'Your profile score improved to 92/100', time: '1 day ago', type: 'success' },
];

// ── Custom Tooltip ───────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs font-bold text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-extrabold text-slate-900">₹{payload[0]?.value?.toLocaleString()}</p>
    </div>
  );
};

// ── Stat Card ────────────────────────────────────────────────────────
const StatCard = ({ title, value, change, trend, icon, color, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-lg hover:border-blue-100 transition-all duration-300 group"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold ${
        trend === 'up' ? 'bg-emerald-50 text-emerald-600' :
        trend === 'down' ? 'bg-rose-50 text-rose-600' :
        'bg-slate-50 text-slate-500'
      }`}>
        {trend === 'up' ? <ArrowUpRight size={12} /> : trend === 'down' ? <ArrowDownRight size={12} /> : null}
        {change}
      </div>
    </div>
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
      <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
    </div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════
export default function MasterDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardAPI.getStats();
        setStats(res);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48 rounded-xl" />
      <div className="grid grid-cols-4 gap-4"><Skeleton className="h-28 rounded-2xl" /><Skeleton className="h-28 rounded-2xl" /><Skeleton className="h-28 rounded-2xl" /><Skeleton className="h-28 rounded-2xl" /></div>
      <Skeleton className="h-80 w-full rounded-2xl" />
    </div>
  );

  const earnings = stats?.summary?.earnings || 0;
  const activeOrders = stats?.summary?.activeOrders || 0;
  const pending = stats?.summary?.pendingPayments || 0;
  const score = stats?.summary?.profileScore || 0;

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-slate-500 font-medium text-sm mt-1">
          Your financial overview and recent activity
        </p>
      </motion.div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`₹${earnings > 0 ? earnings.toLocaleString() : '1,42,500'}`}
          change="+18.2%"
          trend="up"
          icon={<TrendingUp size={18} className="text-emerald-600" />}
          color="bg-emerald-50"
          delay={0}
        />
        <StatCard
          title="Active Subscriptions"
          value={activeOrders > 0 ? activeOrders : '3'}
          change="2 renewing"
          trend="neutral"
          icon={<Sparkles size={18} className="text-violet-600" />}
          color="bg-violet-50"
          delay={0.05}
        />
        <StatCard
          title="Pending Payments"
          value={`₹${pending > 0 ? pending.toLocaleString() : '22,000'}`}
          change="1 escrow"
          trend="neutral"
          icon={<Clock size={18} className="text-amber-600" />}
          color="bg-amber-50"
          delay={0.1}
        />
        <StatCard
          title="This Month Earnings"
          value="₹42,000"
          change="+24%"
          trend="up"
          icon={<DollarSign size={18} className="text-blue-600" />}
          color="bg-blue-50"
          delay={0.15}
        />
      </div>

      {/* ── Revenue Chart + Notifications ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Revenue Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <BarChart3 size={16} className="text-blue-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Revenue Analytics</h3>
            </div>
            <div className="flex items-center gap-2">
              {['7D', '1M', '3M', '1Y'].map((period, i) => (
                <button
                  key={period}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    i === 2
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="userRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#userRevGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="xl:col-span-4 bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">
                <Bell size={16} className="text-rose-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
            </div>
            <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-bold">{notifications.length} new</span>
          </div>
          <div className="space-y-3">
            {notifications.map((n, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 bg-slate-50/50 rounded-xl hover:bg-white hover:border-blue-100 border border-transparent transition-all cursor-pointer"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  n.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                  n.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {n.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 leading-snug">{n.message}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-center text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
            View All Notifications
          </button>
        </motion.div>
      </div>

      {/* ── Recent Transactions ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div className="p-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <CreditCard size={16} className="text-slate-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Recent Transactions</h3>
          </div>
          <button
            onClick={() => router.push('/dashboard/payments')}
            className="text-blue-600 font-bold text-xs hover:underline flex items-center gap-1"
          >
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="pb-3 px-6">From</th>
                <th className="pb-3 px-6">Type</th>
                <th className="pb-3 px-6 text-right">Amount</th>
                <th className="pb-3 px-6">Date</th>
                <th className="pb-3 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-6">
                    <p className="text-sm font-bold text-slate-900">{tx.name}</p>
                    <p className="text-[10px] text-slate-400">#{tx.id}</p>
                  </td>
                  <td className="py-3.5 px-6 text-sm text-slate-600">{tx.type}</td>
                  <td className="py-3.5 px-6 text-sm font-bold text-slate-900 text-right">₹{tx.amount.toLocaleString()}</td>
                  <td className="py-3.5 px-6 text-xs text-slate-400">{tx.date}</td>
                  <td className="py-3.5 px-6 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                      tx.status === 'paid' ? 'bg-emerald-50 text-emerald-600' :
                      tx.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {tx.status === 'paid' && <CheckCircle2 size={10} />}
                      {tx.status === 'pending' && <Clock size={10} />}
                      {tx.status === 'failed' && <AlertCircle size={10} />}
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
