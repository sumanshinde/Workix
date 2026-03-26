'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Megaphone, Search, Filter, DollarSign, TrendingUp,
  ArrowUpRight, CheckCircle2, XCircle, Clock, Eye,
  BarChart3, MousePointerClick, Image as ImageIcon,
  FileText, Sparkles, AlertTriangle, Ban, Play,
  Pause, Settings, IndianRupee,
} from 'lucide-react';
import { platformAPI } from '@/services/api';

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
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await platformAPI.getAllAds();
      if (res) setAds(res);
    } catch (err) {
      console.error('Failed to fetch ads', err);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (adId: string, action: string) => {
    const reason = action === 'reject' ? prompt('Reason for rejection:') || '' : '';
    if (action === 'reject' && !reason) return;

    try {
      await platformAPI.moderateAd({ adId, action, reason });
      alert(`Ad campaign ${action}d`);
      fetchAds();
    } catch (err) {
      alert(`Failed to ${action} ad`);
    }
  };

  const totalRevenue = ads.reduce((s, a) => s + (a.totalPrice || 0), 0) / 100;
  const totalViews = ads.reduce((s, a) => s + (a.views || 0), 0);
  const totalClicks = ads.reduce((s, a) => s + (a.clicks || 0), 0);
  const activeAds = ads.filter(a => a.status === 'active').length;

  const filtered = ads.filter(a => filter === 'All' || a.status === filter.toLowerCase());

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10 p-8 lg:p-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Ad Campaigns</h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Review, approve, and track promotional campaigns.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Ad Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: <IndianRupee size={18} className="text-emerald-600" />, bg: 'bg-emerald-50', sub: `${activeAds} active campaigns` },
          { label: 'Total Views', value: totalViews.toLocaleString(), icon: <Eye size={18} className="text-blue-600" />, bg: 'bg-blue-50', sub: 'Across all ads' },
          { label: 'Total Clicks', value: totalClicks.toLocaleString(), icon: <MousePointerClick size={18} className="text-violet-600" />, bg: 'bg-violet-50', sub: `${totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0}% avg CTR` },
          { label: 'Pending Review', value: ads.filter(a => a.status === 'pending').length, icon: <Clock size={18} className="text-amber-600" />, bg: 'bg-amber-50', sub: 'Needs approval' },
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
          {loading ? (
             <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Synchronizing Campaigns...</div>
          ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4">Campaign</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Budget</th>
                <th className="px-6 py-4 text-right">Analytics</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filtered.map(ad => {
                const sc = statusColors[ad.status] || statusColors.pending;
                const ctr = ad.views > 0 ? ((ad.clicks / ad.views) * 100).toFixed(1) : '0.0';
                
                return (
                  <tr key={ad._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{ad.title || ad.content?.slice(0, 30)}</p>
                      <p className="text-[10px] text-slate-400">{ad.userId?.name || 'User'} • {ad._id.slice(-6).toUpperCase()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold capitalize">
                        {ad.adType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold capitalize ${sc.bg} ${sc.text}`}>
                        {ad.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-slate-900">₹{(ad.totalPrice / 100).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <p className="font-bold text-slate-700">{ad.views.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">views</span></p>
                       <p className="text-[10px] text-emerald-600 font-bold">{ctr}% CTR</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {ad.status === 'pending' && (
                          <>
                            <button onClick={() => handleModerate(ad._id, 'approve')} className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors" title="Approve"><CheckCircle2 size={14} /></button>
                            <button onClick={() => handleModerate(ad._id, 'reject')} className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors" title="Reject"><XCircle size={14} /></button>
                          </>
                        )}
                        {ad.status === 'active' && (
                          <button onClick={() => handleModerate(ad._id, 'pause')} className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors" title="Pause"><Pause size={14} /></button>
                        )}
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors" title="View"><Eye size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </div>
  );
}
