'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Search, ShieldBan, ShieldCheck, Eye,
  Loader2, ChevronLeft, ChevronRight, AlertTriangle,
  Mail, Phone, Star, MapPin, Crown, XCircle
} from 'lucide-react';
import { BRANDING } from '@/lib/config';
import { platformAPI } from '@/services/api';

interface PlatformUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  rating: number;
  reviewsCount: number;
  subscriptionStatus: string;
  isBlocked: boolean;
  blockReason?: string;
  city?: string;
  isKycVerified: boolean;
  isFlagged: boolean;
  createdAt: string;
  completedJobs: number;
  trustScore: number;
}

export default function AdminUserManagement() {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);
  const [blockModal, setBlockModal] = useState<{ user: PlatformUser; action: 'block' | 'unblock' } | null>(null);
  const [blockReason, setBlockReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const data = await platformAPI.getAllUsers(params);
      setUsers(data.users || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      setUsers([]);
    }
    setLoading(false);
  }, [page, search, roleFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleBlockToggle = async () => {
    if (!blockModal) return;
    setActionLoading(true);
    try {
      await platformAPI.toggleBlockUser({
        userId: blockModal.user._id,
        blocked: blockModal.action === 'block',
        reason: blockReason,
      });
      await loadUsers();
      setBlockModal(null);
      setBlockReason('');
    } catch {}
    setActionLoading(false);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-50 text-red-600 border-red-100';
      case 'client': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'freelancer': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-sm text-slate-400">View, search, and manage platform users</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 flex items-center gap-3 bg-white rounded-xl border border-slate-100 px-4 py-2.5 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Search size={16} className="text-slate-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, or phone..."
            className="bg-transparent border-none outline-none w-full text-sm text-slate-800 placeholder:text-slate-300 font-medium"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl border border-slate-100 bg-white text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:border-blue-400"
        >
          <option value="">All Roles</option>
          <option value="freelancer">Freelancers</option>
          <option value="client">Clients</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-2 mb-4 text-sm text-slate-400">
        <Users size={14} />
        <span>{total} users found</span>
        <span>•</span>
        <span>Page {page} of {totalPages}</span>
      </div>

      {/* User Table */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-blue-500" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">User</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Location</th>
                  <th className="text-center px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Rating</th>
                  <th className="text-center px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Trust</th>
                  <th className="text-center px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                          {user.avatar ? (
                            <img src={user.avatar} alt="" className="w-full h-full rounded-xl object-cover" />
                          ) : (
                            user.name?.charAt(0)?.toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate text-sm flex items-center gap-1">
                            {user.name}
                            {user.isKycVerified && <ShieldCheck size={12} className="text-emerald-500" />}
                            {user.subscriptionStatus === 'pro' && <Crown size={12} className="text-amber-500" />}
                          </p>
                          <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase border ${getRoleBadge(user.role)}`}>{user.role}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={12} /> {user.city || '—'}</span>
                    </td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      <span className="flex items-center justify-center gap-1 text-xs">
                        <Star size={12} className="text-amber-400 fill-amber-400" /> {user.rating?.toFixed(1) || '0.0'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      <span className={`text-xs font-bold ${user.trustScore >= 70 ? 'text-emerald-600' : user.trustScore >= 40 ? 'text-amber-600' : 'text-red-500'}`}>
                        {user.trustScore || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {user.isBlocked ? (
                        <span className="px-2 py-0.5 rounded-lg bg-red-50 text-red-500 text-[10px] font-bold uppercase border border-red-100">Blocked</span>
                      ) : user.isFlagged ? (
                        <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-500 text-[10px] font-bold uppercase border border-amber-100 flex items-center gap-1 justify-center"><AlertTriangle size={10} /> Flagged</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-500 text-[10px] font-bold uppercase border border-emerald-100">Active</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setBlockModal({ user, action: user.isBlocked ? 'unblock' : 'block' })}
                          className={`p-1.5 rounded-lg transition-all ${
                            user.isBlocked
                              ? 'hover:bg-emerald-50 text-emerald-500'
                              : 'hover:bg-red-50 text-red-400'
                          }`}
                          title={user.isBlocked ? 'Unblock' : 'Block'}
                        >
                          {user.isBlocked ? <ShieldCheck size={16} /> : <ShieldBan size={16} />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Block/Unblock Modal */}
      {blockModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm" onClick={() => setBlockModal(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              {blockModal.action === 'block' ? (
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center"><ShieldBan size={24} className="text-red-500" /></div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center"><ShieldCheck size={24} className="text-emerald-500" /></div>
              )}
              <div>
                <h3 className="font-bold text-slate-800">{blockModal.action === 'block' ? 'Block User' : 'Unblock User'}</h3>
                <p className="text-sm text-slate-400">{blockModal.user.name} ({blockModal.user.email})</p>
              </div>
            </div>

            {blockModal.action === 'block' && (
              <div className="mb-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Reason</label>
                <textarea
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Reason for blocking..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:border-blue-400 resize-none"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setBlockModal(null)}
                className="flex-1 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockToggle}
                disabled={actionLoading}
                className={`flex-1 py-3 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 ${
                  blockModal.action === 'block'
                    ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/20'
                    : 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/20'
                }`}
              >
                {actionLoading && <Loader2 size={16} className="animate-spin" />}
                {blockModal.action === 'block' ? 'Block User' : 'Unblock User'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
