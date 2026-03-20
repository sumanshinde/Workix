'use client';

import React, { useState } from 'react';
import { 
  Search, Filter, MoreVertical, ShieldAlert, 
  CheckCircle2, Ban, Mail, ExternalLink,
  ChevronLeft, ChevronRight, UserMinus, UserPlus,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui';

const DUMMY_USERS = [
  { id: '1', name: 'Arjun Mehra', email: 'arjun@workix.com', role: 'Freelancer', status: 'Active', joined: 'Oct 12, 2023', verified: true },
  { id: '2', name: 'Sonal Verma', email: 'sonal@design.io', role: 'Freelancer', status: 'Banned', joined: 'Nov 04, 2023', verified: false },
  { id: '3', name: 'Rahul Gupta', email: 'rahul@techcorp.in', role: 'Client', status: 'Active', joined: 'Dec 01, 2023', verified: true },
  { id: '4', name: 'Priya Singh', email: 'priya@freelance.org', role: 'Freelancer', status: 'Pending', joined: 'Jan 15, 2024', verified: false },
  { id: '5', name: 'Amit Shah', email: 'amit@business.com', role: 'Client', status: 'Active', joined: 'Feb 10, 2024', verified: true },
];

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

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
              {DUMMY_USERS.map((user) => (
                <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10-lg shrink-0">
                         {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                           <p className="text-gray-900 font-bold text-sm truncate">{user.name}</p>
                           {user.verified && <ShieldCheck size={14} className="text-blue-500" />}
                        </div>
                        <p className="text-gray-500 text-xs font-medium truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                        {user.role}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : user.status === 'Banned' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                       <span className="text-gray-700 font-medium text-sm">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900 font-medium">{user.joined}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                       <button className="p-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-blue-600 rounded-lg transition-colors" title="Edit Profile"><Mail size={16} /></button>
                       <button className="p-2 bg-white border border-gray-200 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors" title="Restrict Access"><Ban size={16} /></button>
                       <button className="p-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-900 rounded-lg transition-colors"><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between">
          <p className="text-gray-500 text-xs font-medium">Viewing <span className="text-gray-900 font-bold">1 - 5</span> of <span className="text-gray-900 font-bold">1,248</span> users</p>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 text-gray-400 rounded-lg cursor-not-allowed opacity-50"><ChevronLeft size={16} /></button>
            <div className="flex items-center gap-1">
              <span className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-900 font-bold rounded-lg text-xs">1</span>
              <span className="w-8 h-8 flex items-center justify-center text-gray-500 font-medium hover:bg-gray-50 hover:text-gray-900 cursor-pointer rounded-lg text-xs transition-colors">2</span>
              <span className="w-8 h-8 flex items-center justify-center text-gray-500 font-medium hover:bg-gray-50 hover:text-gray-900 cursor-pointer rounded-lg text-xs transition-colors">3</span>
            </div>
            <button className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
