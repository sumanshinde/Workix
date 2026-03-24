'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Megaphone, Search, Filter, DollarSign, TrendingUp,
  ArrowUpRight, CheckCircle2, XCircle, Clock, Eye,
  BarChart3, MousePointerClick, Image as ImageIcon,
  FileText, Sparkles, AlertTriangle, Ban, Play,
  Pause, Settings, IndianRupee,
} from 'lucide-react';

interface Ad {
  id: string;
  advertiser: string;
  title: string;
  type: 'post' | 'image' | 'category';
  status: 'active' | 'pending' | 'rejected' | 'expired' | 'paused';
  dailyRate: number;
  duration: number;
  totalCost: number;
  views: number;
  clicks: number;
  ctr: number;
  startDate: string;
}

const ADS: Ad[] = [
  { id: 'AD-101', advertiser: 'Alpha Systems', title: 'Hiring Senior Devs', type: 'post', status: 'active', dailyRate: 10, duration: 15, totalCost: 150, views: 3200, clicks: 128, ctr: 4.0, startDate: 'Mar 20' },
  { id: 'AD-102', advertiser: 'Green Retail', title: 'Spring Sale Banner', type: 'image', status: 'active', dailyRate: 25, duration: 30, totalCost: 750, views: 8400, clicks: 420, ctr: 5.0, startDate: 'Mar 15' },
  { id: 'AD-103', advertiser: 'CoinDesk Pro', title: 'Crypto Writers Wanted', type: 'category', status: 'pending', dailyRate: 50, duration: 7, totalCost: 350, views: 0, clicks: 0, ctr: 0, startDate: 'Pending' },
  { id: 'AD-104', advertiser: 'Swift Apps', title: 'App Dev Agency Banner', type: 'image', status: 'rejected', dailyRate: 25, duration: 14, totalCost: 350, views: 0, clicks: 0, ctr: 0, startDate: 'Rejected' },
  { id: 'AD-105', advertiser: 'Creator Studio', title: 'Video Editors Needed', type: 'post', status: 'expired', dailyRate: 10, duration: 10, totalCost: 100, views: 1800, clicks: 54, ctr: 3.0, startDate: 'Mar 5' },
  { id: 'AD-106', advertiser: 'TechPrime', title: 'Premium Placement', type: 'category', status: 'paused', dailyRate: 50, duration: 30, totalCost: 1500, views: 5200, clicks: 312, ctr: 6.0, startDate: 'Mar 10' },
];

const typeIcons: Record<string, React.ReactNode> = {
  post: <FileText size={14} />,
  image: <ImageIcon size={14} />,
  category: <Sparkles size={14} />,
};

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  pending: { bg: 'bg-amber-50', text: 'text-amber-600' },
  rejected: { bg: 'bg-rose-50', text: 'text-rose-600' },
  expired: { bg: 'bg-slate-50', text: 'text-slate-400' },
  paused: { bg: 'bg-blue-50', text: 'text-blue-600' },
};

export default function AdsManagementPage() {
  const [filter, setFilter] = useState('All');

  const totalRevenue = ADS.reduce((s, a) => s + a.totalCost, 0);
  const totalViews = ADS.reduce((s, a) => s + a.views, 0);
  const totalClicks = ADS.reduce((s, a) => s + a.clicks, 0);
  const activeAds = ADS.filter(a => a.status === 'active').length;

  const filtered = ADS.filter(a => filter === 'All' || a.status === filter.toLowerCase());

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Ads Management</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Review, approve, and track ad campaigns across the platform.</p>
        </div>
        <button className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-sm flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
          <Settings size={16} /> Pricing Config
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Ad Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: <IndianRupee size={18} className="text-emerald-600" />, bg: 'bg-emerald-50', sub: `${activeAds} active campaigns` },
          { label: 'Total Views', value: totalViews.toLocaleString(), icon: <Eye size={18} className="text-blue-600" />, bg: 'bg-blue-50', sub: 'Across all ads' },
          { label: 'Total Clicks', value: totalClicks.toLocaleString(), icon: <MousePointerClick size={18} className="text-violet-600" />, bg: 'bg-violet-50', sub: `${((totalClicks / totalViews) * 100).toFixed(1)}% avg CTR` },
          { label: 'Pending Review', value: ADS.filter(a => a.status === 'pending').length, icon: <Clock size={18} className="text-amber-600" />, bg: 'bg-amber-50', sub: 'Needs approval' },
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
            <h3 className="text-2xl font-extrabold text-slate-900">{kpi.value}</h3>
            <p className="text-xs text-slate-400 mt-1">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Pricing Reference */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <IndianRupee size={20} className="text-amber-400" />
          <h3 className="text-white font-bold text-sm">Current Ad Pricing</h3>
        </div>
        <div className="flex items-center gap-6">
          {[
            { type: 'Post Ad', price: '₹10/day' },
            { type: 'Image Ad', price: '₹25/day' },
            { type: 'Category Ad', price: '₹50/day' },
          ].map(p => (
            <div key={p.type} className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{p.type}</p>
              <p className="text-lg font-extrabold text-white">{p.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        {['All', 'Active', 'Pending', 'Paused', 'Rejected', 'Expired'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              filter === f
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Ads Table */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4">Ad</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Cost</th>
                <th className="px-6 py-4 text-right">Views</th>
                <th className="px-6 py-4 text-right">Clicks</th>
                <th className="px-6 py-4 text-right">CTR</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filtered.map(ad => {
                const sc = statusColors[ad.status];
                return (
                  <tr key={ad.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{ad.title}</p>
                      <p className="text-[10px] text-slate-400">{ad.advertiser} • {ad.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold capitalize">
                        {typeIcons[ad.type]} {ad.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold capitalize ${sc.bg} ${sc.text}`}>
                        {ad.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-slate-900">₹{ad.totalCost}</p>
                      <p className="text-[10px] text-slate-400">₹{ad.dailyRate}/day × {ad.duration}d</p>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-700">{ad.views.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-700">{ad.clicks.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold ${ad.ctr >= 4 ? 'text-emerald-600' : ad.ctr >= 2 ? 'text-amber-600' : 'text-slate-400'}`}>
                        {ad.ctr}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {ad.status === 'pending' && (
                          <>
                            <button className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors" title="Approve"><CheckCircle2 size={14} /></button>
                            <button className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors" title="Reject"><XCircle size={14} /></button>
                          </>
                        )}
                        {ad.status === 'active' && (
                          <button className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors" title="Pause"><Pause size={14} /></button>
                        )}
                        {ad.status === 'paused' && (
                          <button className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors" title="Resume"><Play size={14} /></button>
                        )}
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors" title="View"><Eye size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
