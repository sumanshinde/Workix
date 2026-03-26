'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, MoreVertical, ShieldAlert, 
  CheckCircle2, Ban, Mail, ExternalLink,
  ChevronLeft, ChevronRight, UserMinus, UserPlus,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui';
import { platformAPI } from '@/services/api';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await platformAPI.getAllUsers();
      if (res) setUsers(res as any[]);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || 
                         (filter === 'Freelancers' && u.role === 'freelancer') || 
                         (filter === 'Clients' && u.role === 'client') || 
                         (filter === 'Banned' && u.isBlocked);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8 lg:p-12 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Users</h1>
          <p className="text-gray-500 text-sm font-medium">Verify credentials and manage platform access rules.</p>
        </div>
        <div className="flex gap-4">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-3">
            <UserPlus size={16} /> Onboard Admin
          </Button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-6 bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email or ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 h-10 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Filter</span>
          {['All', 'Freelancers', 'Clients', 'Banned'].map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 h-10 rounded-lg text-sm font-medium transition-all border ${filter === f ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Synchronizing User Matrix...</div>
          ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredUsers.map((user) => (
                <tr key={user._id || user.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                         {user.name?.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                           <p className="text-gray-900 font-bold text-sm truncate">{user.name}</p>
                           {user.isKycVerified && <ShieldCheck size={14} className="text-blue-500" />}
                        </div>
                        <p className="text-gray-500 text-xs font-medium truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium capitalize">
                        {user.role}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className={`w-2 h-2 rounded-full ${user.isBlocked ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                       <span className="text-gray-700 font-medium text-sm">{user.isBlocked ? 'Banned' : 'Active'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900 font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                       <button className="p-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-blue-600 rounded-lg transition-colors" title="Contact"><Mail size={16} /></button>
                       <button className="p-2 bg-white border border-gray-200 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors" title="Restrict Access"><Ban size={16} /></button>
                       <button className="p-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-900 rounded-lg transition-colors"><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>

        {/* Pagination placeholder */}
        <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between">
          <p className="text-gray-500 text-xs font-medium">Viewing <span className="text-gray-900 font-bold">{filteredUsers.length}</span> user(s)</p>
        </div>
      </div>
    </div>
  );
}
