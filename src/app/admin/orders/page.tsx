'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Receipt, Search, Filter, Download, ChevronRight,
  CreditCard, Clock, CheckCircle2, XCircle, AlertCircle,
  ArrowUpRight, DollarSign, Shield, RefreshCw, Eye,
  TrendingUp, Lock,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
interface Order {
  id: string;
  client: string;
  freelancer: string;
  type: string;
  amount: number;
  platformFee: number;
  paymentStatus: 'completed' | 'pending' | 'escrow' | 'refunded' | 'failed';
  escrowStatus: 'released' | 'held' | 'refunded' | 'n/a';
  date: string;
  method: string;
}

const ORDERS: Order[] = [
  { id: 'ORD-4821', client: 'Alpha Systems', freelancer: 'Arjun Mehra', type: 'Project', amount: 150000, platformFee: 15000, paymentStatus: 'completed', escrowStatus: 'released', date: '2 hours ago', method: 'Razorpay' },
  { id: 'ORD-4820', client: 'Green Retail', freelancer: 'Priya Singh', type: 'Gig', amount: 45000, platformFee: 4500, paymentStatus: 'escrow', escrowStatus: 'held', date: '5 hours ago', method: 'UPI' },
  { id: 'ORD-4819', client: 'CoinDesk Pro', freelancer: 'Rahul Gupta', type: 'Ad Campaign', amount: 12000, platformFee: 1200, paymentStatus: 'completed', escrowStatus: 'n/a', date: '1 day ago', method: 'Razorpay' },
  { id: 'ORD-4818', client: 'Swift Apps', freelancer: 'Sonal Verma', type: 'Project', amount: 85000, platformFee: 8500, paymentStatus: 'pending', escrowStatus: 'held', date: '1 day ago', method: 'Bank Transfer' },
  { id: 'ORD-4817', client: 'Creator Studio', freelancer: 'Amit Shah', type: 'Subscription', amount: 1499, platformFee: 0, paymentStatus: 'completed', escrowStatus: 'n/a', date: '2 days ago', method: 'Razorpay' },
  { id: 'ORD-4816', client: 'TechPrime', freelancer: 'Neha Kapoor', type: 'Project', amount: 220000, platformFee: 22000, paymentStatus: 'refunded', escrowStatus: 'refunded', date: '3 days ago', method: 'UPI' },
  { id: 'ORD-4815', client: 'MediaFirst', freelancer: 'Vikram Singh', type: 'Gig', amount: 35000, platformFee: 3500, paymentStatus: 'failed', escrowStatus: 'n/a', date: '3 days ago', method: 'Razorpay' },
];

const paymentStatusConfig: Record<string, { bg: string; text: string; label: string }> = {
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Completed' },
  pending: { bg: 'bg-amber-50', text: 'text-amber-600', label: 'Pending' },
  escrow: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'In Escrow' },
  refunded: { bg: 'bg-rose-50', text: 'text-rose-600', label: 'Refunded' },
  failed: { bg: 'bg-red-50', text: 'text-red-600', label: 'Failed' },
};

const escrowConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  released: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: <CheckCircle2 size={12} /> },
  held: { bg: 'bg-blue-50', text: 'text-blue-600', icon: <Lock size={12} /> },
  refunded: { bg: 'bg-rose-50', text: 'text-rose-600', icon: <RefreshCw size={12} /> },
  'n/a': { bg: 'bg-slate-50', text: 'text-slate-400', icon: null },
};

export default function OrdersPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const totalGMV = ORDERS.reduce((s, o) => s + o.amount, 0);
  const totalFees = ORDERS.reduce((s, o) => s + o.platformFee, 0);
  const escrowHeld = ORDERS.filter(o => o.escrowStatus === 'held').reduce((s, o) => s + o.amount, 0);

  const filtered = ORDERS.filter(o => {
    if (filter !== 'All' && o.paymentStatus !== filter.toLowerCase()) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.client.toLowerCase().includes(search.toLowerCase()) && !o.freelancer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Orders & Transactions</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Track all platform payments, escrow status, and revenue.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total GMV', value: `₹${(totalGMV / 100000).toFixed(1)}L`, icon: <DollarSign size={18} className="text-emerald-600" />, bg: 'bg-emerald-50', change: '+24%' },
          { label: 'Platform Fees', value: `₹${(totalFees / 1000).toFixed(1)}K`, icon: <TrendingUp size={18} className="text-blue-600" />, bg: 'bg-blue-50', change: '+18%' },
          { label: 'Escrow Held', value: `₹${(escrowHeld / 1000).toFixed(0)}K`, icon: <Shield size={18} className="text-amber-600" />, bg: 'bg-amber-50', change: '2 orders' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-lg transition-all"
          >
            <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center mb-3`}>{kpi.icon}</div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">{kpi.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-extrabold text-slate-900">{kpi.value}</h3>
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5"><ArrowUpRight size={10} /> {kpi.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-100 p-4 rounded-2xl">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by order ID, client, or freelancer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 h-10 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2">
          {['All', 'Completed', 'Escrow', 'Pending', 'Refunded'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                filter === f
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Client → Freelancer</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Escrow</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filtered.map(order => {
                const ps = paymentStatusConfig[order.paymentStatus];
                const es = escrowConfig[order.escrowStatus];
                return (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">#{order.id}</p>
                      <p className="text-[10px] text-slate-400">{order.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 text-sm">{order.client}</p>
                      <p className="text-xs text-slate-400">→ {order.freelancer}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">{order.type}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-slate-900">₹{order.amount.toLocaleString()}</p>
                      {order.platformFee > 0 && <p className="text-[10px] text-emerald-500 font-semibold">+₹{order.platformFee.toLocaleString()} fee</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold ${ps.bg} ${ps.text}`}>
                        {ps.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${es.bg} ${es.text}`}>
                        {es.icon} {order.escrowStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors" title="View"><Eye size={14} /></button>
                        {order.escrowStatus === 'held' && (
                          <>
                            <button className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors" title="Release"><CheckCircle2 size={14} /></button>
                            <button className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors" title="Refund"><RefreshCw size={14} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">Showing <span className="font-bold text-slate-700">{filtered.length}</span> of <span className="font-bold text-slate-700">{ORDERS.length}</span> orders</p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-700 font-bold rounded-lg text-xs">1</button>
            <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-lg text-xs">2</button>
          </div>
        </div>
      </div>
    </div>
  );
}
