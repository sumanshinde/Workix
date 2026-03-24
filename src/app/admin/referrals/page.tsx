'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Gift, Search, Users, ArrowUpRight, DollarSign,
  TrendingUp, AlertTriangle, CheckCircle2, XCircle,
  Shield, Eye, Ban, Crown, UserPlus, Zap,
} from 'lucide-react';

interface Referral {
  id: string;
  referrer: string;
  referrerEmail: string;
  referred: string;
  referredEmail: string;
  status: 'completed' | 'pending' | 'fraudulent';
  earning: number;
  date: string;
  method: string;
}

const REFERRALS: Referral[] = [
  { id: 'REF-001', referrer: 'Arjun Mehra', referrerEmail: 'arjun@mail.com', referred: 'Manish Kumar', referredEmail: 'manish@mail.com', status: 'completed', earning: 100, date: '2 hours ago', method: 'WhatsApp' },
  { id: 'REF-002', referrer: 'Priya Singh', referrerEmail: 'priya@mail.com', referred: 'Aisha Khan', referredEmail: 'aisha@mail.com', status: 'completed', earning: 100, date: '5 hours ago', method: 'Link' },
  { id: 'REF-003', referrer: 'Rahul Gupta', referrerEmail: 'rahul@mail.com', referred: 'Deepak Joshi', referredEmail: 'deepak@mail.com', status: 'pending', earning: 0, date: '1 day ago', method: 'Email' },
  { id: 'REF-004', referrer: 'Sonal Verma', referrerEmail: 'sonal@mail.com', referred: 'FakeAccount123', referredEmail: 'fake@temp.com', status: 'fraudulent', earning: 0, date: '2 days ago', method: 'Link' },
  { id: 'REF-005', referrer: 'Amit Shah', referrerEmail: 'amit@mail.com', referred: 'Kavita Nair', referredEmail: 'kavita@mail.com', status: 'completed', earning: 100, date: '3 days ago', method: 'WhatsApp' },
  { id: 'REF-006', referrer: 'Arjun Mehra', referrerEmail: 'arjun@mail.com', referred: 'Suresh Rao', referredEmail: 'suresh@mail.com', status: 'completed', earning: 100, date: '3 days ago', method: 'Link' },
];

export default function ReferralsPage() {
  const [search, setSearch] = useState('');

  const totalReferrals = REFERRALS.length;
  const completedReferrals = REFERRALS.filter(r => r.status === 'completed').length;
  const totalEarnings = REFERRALS.reduce((s, r) => s + r.earning, 0);
  const fraudDetected = REFERRALS.filter(r => r.status === 'fraudulent').length;

  // Top referrers
  const referrerMap: Record<string, { name: string; count: number; earned: number }> = {};
  REFERRALS.forEach(r => {
    if (!referrerMap[r.referrer]) referrerMap[r.referrer] = { name: r.referrer, count: 0, earned: 0 };
    referrerMap[r.referrer].count++;
    referrerMap[r.referrer].earned += r.earning;
  });
  const topReferrers = Object.values(referrerMap).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Referral System</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">Track referrals, earnings, and detect fraud.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Referrals', value: totalReferrals, icon: <UserPlus size={18} className="text-blue-600" />, bg: 'bg-blue-50', change: '+12 this wk' },
          { label: 'Completed', value: completedReferrals, icon: <CheckCircle2 size={18} className="text-emerald-600" />, bg: 'bg-emerald-50', change: `${((completedReferrals/totalReferrals)*100).toFixed(0)}% rate` },
          { label: 'Total Payouts', value: `₹${totalEarnings}`, icon: <DollarSign size={18} className="text-amber-600" />, bg: 'bg-amber-50', change: '+₹200 this wk' },
          { label: 'Fraud Detected', value: fraudDetected, icon: <AlertTriangle size={18} className="text-rose-600" />, bg: 'bg-rose-50', change: fraudDetected > 0 ? 'Requires Action' : 'Clean' },
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
              <span className={`text-xs font-bold flex items-center gap-0.5 ${kpi.label === 'Fraud Detected' && fraudDetected > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {kpi.label !== 'Fraud Detected' && <ArrowUpRight size={10} />} {kpi.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Table */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-sm font-bold text-slate-900">Referral Log</h3>
            <div className="relative max-w-xs flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Search referrals..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 h-9 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="px-5 py-3">Referrer</th>
                  <th className="px-5 py-3">Referred</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Earning</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {REFERRALS.map(ref => (
                  <tr key={ref.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-900">{ref.referrer}</p>
                      <p className="text-[10px] text-slate-400">{ref.referrerEmail}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-700">{ref.referred}</p>
                      <p className="text-[10px] text-slate-400">{ref.referred}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                        ref.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                        ref.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                        'bg-rose-50 text-rose-600'
                      }`}>
                        {ref.status === 'completed' && <CheckCircle2 size={10} />}
                        {ref.status === 'fraudulent' && <AlertTriangle size={10} />}
                        {ref.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-slate-900">
                      {ref.earning > 0 ? `₹${ref.earning}` : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">{ref.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Referrers */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <Crown size={16} className="text-amber-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Top Referrers</h3>
          </div>
          <div className="space-y-3">
            {topReferrers.map((ref, i) => (
              <div key={ref.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                    #{i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{ref.name}</p>
                    <p className="text-[10px] text-slate-400">{ref.count} referrals</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-emerald-600">₹{ref.earned}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
