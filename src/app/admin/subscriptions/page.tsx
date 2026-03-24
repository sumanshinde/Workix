'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Loader2, Users, CheckCircle2, XCircle, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { platformAPI } from '@/services/api';

interface Sub {
  _id: string;
  userId: { _id: string; name: string; email: string; role: string; subscriptionStatus: string } | null;
  planId: string;
  subscriptionId: string;
  status: string;
  currentStart?: string;
  currentEnd?: string;
  createdAt: string;
}

export default function AdminSubscriptions() {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { loadSubs(); }, []);

  const loadSubs = async () => {
    setLoading(true);
    try {
      const data = await platformAPI.getAllSubscriptions();
      setSubs(Array.isArray(data) ? data : []);
    } catch { setSubs([]); }
    setLoading(false);
  };

  const handleStatusChange = async (subId: string, newStatus: string) => {
    setActionLoading(subId);
    try {
      await platformAPI.updateSubscription({ subscriptionId: subId, status: newStatus });
      await loadSubs();
    } catch {}
    setActionLoading(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'cancelled': return 'bg-red-50 text-red-500 border-red-100';
      case 'expired': return 'bg-slate-50 text-slate-400 border-slate-100';
      case 'pending': case 'created': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  const activeSubs = subs.filter(s => s.status === 'active').length;
  const totalSubs = subs.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Subscription Management</h1>
          <p className="text-sm text-slate-400">Manage Pro users and subscription plans</p>
        </div>
        <button onClick={loadSubs} className="p-2 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-400 transition-all">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-3">
            <Crown size={18} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{activeSubs}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Active Pro</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3">
            <Users size={18} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalSubs}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Total Subs</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-5 hidden sm:block">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle2 size={18} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalSubs > 0 ? ((activeSubs / totalSubs) * 100).toFixed(0) : 0}%</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Active Rate</div>
        </div>
      </div>

      {/* Subscriptions List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-blue-500" /></div>
      ) : subs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-12 text-center">
          <Crown size={40} className="text-amber-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">No Subscriptions Yet</h3>
          <p className="text-slate-400">Subscriptions will appear here when users upgrade to Pro</p>
        </div>
      ) : (
        <div className="space-y-3">
          {subs.map((sub, i) => (
            <motion.div
              key={sub._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-600 font-bold text-sm shrink-0">
                  {sub.userId?.name?.charAt(0) || '?'}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 truncate flex items-center gap-2">
                    {sub.userId?.name || 'Unknown'}
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase border ${getStatusColor(sub.status)}`}>{sub.status}</span>
                  </p>
                  <p className="text-xs text-slate-400 truncate">{sub.userId?.email} • Plan: {sub.planId}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs shrink-0">
                {sub.currentEnd && (
                  <span className="text-slate-400 flex items-center gap-1 mr-2">
                    <Clock size={12} />
                    Expires {new Date(sub.currentEnd).toLocaleDateString()}
                  </span>
                )}
                {sub.status === 'active' && (
                  <button
                    onClick={() => handleStatusChange(sub._id, 'cancelled')}
                    disabled={actionLoading === sub._id}
                    className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 font-bold hover:bg-red-100 transition-all disabled:opacity-50 flex items-center gap-1"
                  >
                    {actionLoading === sub._id ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                    Cancel
                  </button>
                )}
                {(sub.status === 'cancelled' || sub.status === 'expired') && (
                  <button
                    onClick={() => handleStatusChange(sub._id, 'active')}
                    disabled={actionLoading === sub._id}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 font-bold hover:bg-emerald-100 transition-all disabled:opacity-50 flex items-center gap-1"
                  >
                    {actionLoading === sub._id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                    Reactivate
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
