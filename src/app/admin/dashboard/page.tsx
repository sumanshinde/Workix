'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Briefcase, DollarSign, TrendingUp,
  ArrowUpRight, ArrowDownRight, CheckCircle2,
  AlertCircle, Activity, ShieldCheck, MessageSquare,
  Zap, Target, UserCheck, Clock, BarChart3,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { adminAPI } from '@/services/api';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL || '';

// ── Mock data ────────────────────────────────────────────────────────────────
const revenueData = [
  { name: 'Jan', revenue: 24000, users: 120 },
  { name: 'Feb', revenue: 36000, users: 180 },
  { name: 'Mar', revenue: 31000, users: 160 },
  { name: 'Apr', revenue: 52000, users: 240 },
  { name: 'May', revenue: 48000, users: 220 },
  { name: 'Jun', revenue: 61000, users: 310 },
  { name: 'Jul', revenue: 72000, users: 380 },
];

const growthData = [
  { name: 'W1', freelancers: 42, clients: 28 },
  { name: 'W2', freelancers: 56, clients: 35 },
  { name: 'W3', freelancers: 48, clients: 42 },
  { name: 'W4', freelancers: 72, clients: 51 },
];

const funnelData = [
  { name: 'Visitors', value: 10000, color: '#3B82F6' },
  { name: 'Signups', value: 4200, color: '#6366F1' },
  { name: 'Jobs Posted', value: 1800, color: '#8B5CF6' },
  { name: 'Hired', value: 620, color: '#10B981' },
];

// ── Stat Card ────────────────────────────────────────────────────────────────
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

// ── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs font-bold text-slate-500 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-extrabold text-slate-900">
          {p.name}: {typeof p.value === 'number' && p.name.toLowerCase().includes('revenue') ? `₹${p.value.toLocaleString()}` : p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    liveUsers: 0,
    liveChats: 0,
    totalRevenue: 0,
    signups: 0,
    flaggedUsers: 0,
  });

  useEffect(() => {
    fetchStats();
    const socket = io(SOCKET_URL, { withCredentials: true });

    socket.on('new_activity', (act: any) => {
      if (act?.action === 'signup') setStats(s => ({ ...s, liveUsers: s.liveUsers + 1, signups: s.signups + 1 }));
      if (act?.action === 'fraud_alert') setStats(s => ({ ...s, flaggedUsers: s.flaggedUsers + 1 }));
    });
    socket.on('receive_msg', () => setStats(s => ({ ...s, liveChats: s.liveChats + 1 })));
    return () => { socket.disconnect(); };
  }, []);

  const fetchStats = async () => {
    try {
      const res = await adminAPI.getDashboardStats();
      if (res) setStats(res as any);
    } catch {}
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Real-time platform intelligence and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          {stats.flaggedUsers > 0 && (
            <button className="px-4 py-2 bg-rose-50 border border-rose-200 text-rose-600 font-bold rounded-xl text-sm flex items-center gap-2 hover:bg-rose-100 transition-colors">
              <AlertCircle size={16} className="animate-pulse" />
              {stats.flaggedUsers} Flagged
            </button>
          )}
          <div className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Last 7 days
          </div>
        </div>
      </motion.div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Users"
          value={stats.signups > 0 ? stats.signups.toLocaleString() : '1,248'}
          change="+12%"
          trend="up"
          icon={<Users size={18} className="text-blue-600" />}
          color="bg-blue-50"
          delay={0}
        />
        <StatCard
          title="Active Users"
          value={stats.liveUsers > 0 ? stats.liveUsers.toLocaleString() : '342'}
          change="Real-time"
          trend="neutral"
          icon={<Activity size={18} className="text-indigo-600" />}
          color="bg-indigo-50"
          delay={0.05}
        />
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue > 0 ? `₹${stats.totalRevenue.toLocaleString()}` : '₹4.2L'}
          change="+24%"
          trend="up"
          icon={<DollarSign size={18} className="text-emerald-600" />}
          color="bg-emerald-50"
          delay={0.1}
        />
        <StatCard
          title="GMV"
          value="₹42L"
          change="+18%"
          trend="up"
          icon={<TrendingUp size={18} className="text-amber-600" />}
          color="bg-amber-50"
          delay={0.15}
        />
        <StatCard
          title="Jobs Posted"
          value="1,542"
          change="+102 this wk"
          trend="up"
          icon={<Briefcase size={18} className="text-violet-600" />}
          color="bg-violet-50"
          delay={0.2}
        />
        <StatCard
          title="Successful Hires"
          value="620"
          change="+8.2%"
          trend="up"
          icon={<UserCheck size={18} className="text-cyan-600" />}
          color="bg-cyan-50"
          delay={0.25}
        />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <BarChart3 size={16} className="text-blue-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Revenue Growth</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">Monthly</span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#revGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Conversion Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="xl:col-span-4 bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center">
              <Target size={16} className="text-violet-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Conversion Funnel</h3>
          </div>
          <div className="space-y-4">
            {funnelData.map((stage, i) => {
              const maxVal = funnelData[0].value;
              const pct = ((stage.value / maxVal) * 100).toFixed(0);
              return (
                <div key={stage.name} className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-semibold text-slate-600">{stage.name}</span>
                    <span className="text-xs font-bold text-slate-900">{stage.value.toLocaleString()}</span>
                  </div>
                  <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                  </div>
                  {i < funnelData.length - 1 && (
                    <p className="text-[10px] font-semibold text-slate-400">
                      {((1 - funnelData[i + 1].value / stage.value) * 100).toFixed(0)}% drop-off
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ── Growth Trend + Verification ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Weekly Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <TrendingUp size={16} className="text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Weekly Growth</h3>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="freelancers" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Freelancers" />
                <Bar dataKey="clients" fill="#10B981" radius={[6, 6, 0, 0]} name="Clients" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-50">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <div className="w-3 h-3 rounded bg-blue-500" /> Freelancers
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <div className="w-3 h-3 rounded bg-emerald-500" /> Clients
            </div>
          </div>
        </motion.div>

        {/* Transactions + Verification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="xl:col-span-7 bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="p-6 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <ShieldCheck size={16} className="text-slate-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Recent Transactions</h3>
            </div>
            <button
              className="text-blue-600 font-bold text-xs hover:underline"
              onClick={() => {}}
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-3 px-6">ID</th>
                  <th className="pb-3 px-6">Type</th>
                  <th className="pb-3 px-6 text-right">Amount</th>
                  <th className="pb-3 px-6">Time</th>
                  <th className="pb-3 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { id: 'TXN-5235', type: 'Escrow Release', amount: 9000, time: '12:34 PM', status: 'success' },
                  { id: 'TXN-5236', type: 'Ad Payment', amount: 2500, time: '11:20 AM', status: 'success' },
                  { id: 'TXN-5237', type: 'Subscription', amount: 1499, time: '10:05 AM', status: 'pending' },
                  { id: 'TXN-5238', type: 'Payout', amount: 18000, time: '9:42 AM', status: 'success' },
                  { id: 'TXN-5239', type: 'Refund', amount: 4500, time: '8:15 AM', status: 'refund' },
                ].map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-6 text-sm font-bold text-slate-900">#{tx.id}</td>
                    <td className="py-3.5 px-6 text-sm text-slate-600">{tx.type}</td>
                    <td className="py-3.5 px-6 text-sm font-bold text-slate-900 text-right">₹{tx.amount.toLocaleString()}</td>
                    <td className="py-3.5 px-6 text-xs text-slate-400 flex items-center gap-1"><Clock size={12} />{tx.time}</td>
                    <td className="py-3.5 px-6 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                        tx.status === 'success' ? 'bg-emerald-50 text-emerald-600' :
                        tx.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                        'bg-rose-50 text-rose-600'
                      }`}>{tx.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
