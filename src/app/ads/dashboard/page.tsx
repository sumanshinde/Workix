'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Megaphone, Plus, Eye, MousePointerClick, Clock,
  IndianRupee, TrendingUp, ArrowLeft, Loader2, Zap,
  BarChart3, Pause, Play, AlertTriangle
} from 'lucide-react';
import { BRANDING } from '@/lib/config';
import { adsAPI } from '@/services/api';

interface AdItem {
  _id: string;
  title: string;
  description: string;
  adType: string;
  status: string;
  durationDays: number;
  totalPrice: number;
  views: number;
  clicks: number;
  startsAt?: string;
  expiresAt?: string;
  createdAt: string;
  isPaid: boolean;
}

export default function AdDashboardPage() {
  const router = useRouter();
  const t = BRANDING.theme;
  const [ads, setAds] = useState<AdItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      const data = await adsAPI.getMy();
      setAds(Array.isArray(data) ? data : []);
    } catch {
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = ads.filter(a => a.isPaid).reduce((sum, a) => sum + (a.totalPrice || 0), 0);
  const totalViews = ads.reduce((sum, a) => sum + (a.views || 0), 0);
  const totalClicks = ads.reduce((sum, a) => sum + (a.clicks || 0), 0);
  const activeAds = ads.filter(a => a.status === 'active').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'pending_payment': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'expired': return 'bg-slate-50 text-slate-400 border-slate-100';
      case 'paused': return 'bg-blue-50 text-blue-500 border-blue-100';
      case 'rejected': return 'bg-red-50 text-red-500 border-red-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  const getDaysRemaining = (expiresAt?: string) => {
    if (!expiresAt) return null;
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <button
            onClick={() => router.push('/ads/create')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all"
          >
            <Plus size={16} /> Create Ad
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Ad Dashboard</h1>
          <p className="text-slate-500">Manage and track your advertising campaigns</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Ads', value: activeAds, icon: <Megaphone size={18} />, color: 'from-purple-500 to-purple-600' },
            { label: 'Total Views', value: totalViews.toLocaleString(), icon: <Eye size={18} />, color: 'from-blue-500 to-blue-600' },
            { label: 'Total Clicks', value: totalClicks.toLocaleString(), icon: <MousePointerClick size={18} />, color: 'from-emerald-500 to-emerald-600' },
            { label: 'Total Spent', value: `₹${(totalSpent / 100).toFixed(0)}`, icon: <IndianRupee size={18} />, color: 'from-amber-500 to-amber-600' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-500/5 p-5"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Ad List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-purple-500" />
          </div>
        ) : ads.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mx-auto mb-4">
              <Megaphone size={32} className="text-purple-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">No Ads Yet</h3>
            <p className="text-slate-400 mb-6">Create your first ad to boost your visibility</p>
            <button
              onClick={() => router.push('/ads/create')}
              className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg shadow-purple-500/20 transition-all"
            >
              Create Your First Ad
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {ads.map((ad, i) => {
              const daysLeft = getDaysRemaining(ad.expiresAt);
              const ctr = ad.views > 0 ? ((ad.clicks / ad.views) * 100).toFixed(1) : '0.0';

              return (
                <motion.div
                  key={ad._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-500/5 p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase border ${getStatusColor(ad.status)}`}>
                          {ad.status.replace('_', ' ')}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-400 text-[10px] font-bold uppercase">{ad.adType}</span>
                        {daysLeft !== null && ad.status === 'active' && (
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock size={12} /> {daysLeft}d left
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 truncate">{ad.title}</h3>
                      <p className="text-sm text-slate-400 truncate">{ad.description}</p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-slate-700">{ad.views}</div>
                        <div className="text-[10px] text-slate-400 uppercase">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-slate-700">{ad.clicks}</div>
                        <div className="text-[10px] text-slate-400 uppercase">Clicks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-emerald-600">{ctr}%</div>
                        <div className="text-[10px] text-slate-400 uppercase">CTR</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">₹{(ad.totalPrice / 100).toFixed(0)}</div>
                        <div className="text-[10px] text-slate-400 uppercase">Spent</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
