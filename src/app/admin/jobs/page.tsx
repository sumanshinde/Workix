'use client';

import React, { useState } from 'react';
import { 
  Briefcase, Search, Filter, MoreVertical, 
  CheckCircle2, XCircle, Clock, Eye,
  ArrowUpRight, MapPin, Calendar, Clock4, Database
} from 'lucide-react';

const DUMMY_JOBS = [
  { id: '1', title: 'Senior AI Engineer for Fintech App', client: 'Alpha Systems', budget: '₹1,50,000', category: 'Engineering', status: 'Pending', posted: '2 hr ago', location: 'Remote' },
  { id: '2', title: 'UI/UX Design for E-commerce Platform', client: 'Green Retail', budget: '₹45,000', category: 'Creative', status: 'Approved', posted: '5 hr ago', location: 'Hybrid' },
  { id: '3', title: 'Content Writer for Crypto Blog', client: 'CoinDesk Pro', budget: '₹12,000', category: 'Writing', status: 'Rejected', posted: '1 d ago', location: 'Remote' },
  { id: '4', title: 'Mobile App Developer (Flutter)', client: 'Swift Apps', budget: '₹85,000', category: 'Engineering', status: 'Approved', posted: '2 d ago', location: 'On-site' },
  { id: '5', title: 'Video Editor for YouTube Channel', client: 'Creator Studio', budget: '₹25,000', category: 'Creative', status: 'Pending', posted: '3 d ago', location: 'Remote' },
];

export default function JobManagement() {
  const [filter, setFilter] = useState('All');

  return (
    <div className="p-8 lg:p-12 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-transparent">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Services</h1>
          <p className="text-gray-500 text-sm font-medium">Manage platform services and assignments.</p>
        </div>
      </div>

      {/* Modern Filter / Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        <div className="p-5 rounded-xl border bg-white border-gray-200 shadow-sm flex flex-col justify-between h-32">
          <div className="flex items-center gap-3">
            <Database size={16} className="text-gray-400" />
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Queue Size</p>
          </div>
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">42</h3>
        </div>

        <div className="p-5 rounded-xl border bg-white border-gray-200 shadow-sm flex flex-col justify-between h-32">
          <div className="flex items-center gap-3">
            <Clock4 size={16} className="text-gray-400" />
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Avg Decision Time</p>
          </div>
          <div className="flex items-baseline gap-1">
             <h3 className="text-3xl font-bold tracking-tight text-gray-900">4.2</h3>
             <span className="text-gray-500 font-bold text-sm">h</span>
          </div>
        </div>

        <div className="p-5 rounded-xl border bg-white border-gray-200 shadow-sm flex flex-col justify-between h-32 col-span-1 md:col-span-2">
           <div className="flex items-center gap-3 mb-2">
             <Filter size={16} className="text-gray-400"/>
             <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Filter View</p>
           </div>
           <div className="flex items-center gap-3">
             {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
               <button 
                 key={status}
                 onClick={() => setFilter(status)}
                 className={`flex-1 flex flex-col items-start px-4 py-2.5 rounded-lg border transition-all text-left ${
                   filter === status 
                     ? 'bg-white border-blue-500 ring-1 ring-blue-500 shadow-sm' 
                     : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm text-gray-500 hover:text-gray-900'
                 }`}
               >
                 <span className={`text-[10px] uppercase font-bold tracking-widest ${filter === status ? 'text-blue-600' : 'text-gray-400'}`}>{status}</span>
                 <span className={`text-lg font-bold ${filter === status ? 'text-gray-900' : 'text-gray-600'}`}>
                   {status === 'All' ? '1,542' : status === 'Pending' ? '42' : status === 'Approved' ? '1,420' : '80'}
                 </span>
               </button>
             ))}
           </div>
        </div>

      </div>

      {/* Gig Registry */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mt-8">
        <div className="p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-6 bg-gray-50/50">
           <div className="flex items-center gap-4">
              <h3 className="text-sm font-bold text-gray-900 tracking-tight">Active Services</h3>
           </div>
           <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search services..." 
                  className="bg-white border border-gray-200 rounded-lg pl-9 pr-4 h-9 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium w-64 shadow-sm"
                />
              </div>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4">Service Name</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {DUMMY_JOBS.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-gray-100 text-gray-500 border border-gray-200 rounded-lg flex items-center justify-center shrink-0">
                          <Briefcase size={14} />
                       </div>
                       <div className="min-w-0">
                          <h4 className="text-gray-900 font-bold text-sm tracking-tight truncate">{job.title}</h4>
                          <div className="flex items-center gap-3 text-xs font-medium text-gray-500 mt-1">
                             <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                             <span className="flex items-center gap-1"><Clock size={12} /> {job.posted}</span>
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <p className="text-gray-900 font-semibold text-sm">{job.client}</p>
                  </td>
                  <td className="px-6 py-4">
                     <p className="text-gray-900 font-bold">{job.budget}</p>
                  </td>
                  <td className="px-6 py-4">
                     <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-gray-50 text-gray-700 border border-gray-200">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          job.status === 'Approved' ? 'bg-emerald-500' : 
                          job.status === 'Pending' ? 'bg-amber-500' : 
                          'bg-rose-500'
                        }`} />
                        {job.status}
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex items-center justify-end gap-1">
                        <button className="flex items-center justify-center w-10 h-10-lg-900 hover:bg-gray-100 transition-colors" title="Approve">
                           <CheckCircle2 size={16} />
                        </button>
                        <button className="flex items-center justify-center w-10 h-10-lg-900 hover:bg-gray-100 transition-colors" title="Reject">
                           <XCircle size={16} />
                        </button>
                        <button className="flex items-center justify-center w-10 h-10-lg-900 hover:bg-gray-100 transition-colors" title="Details">
                           <Eye size={16} />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
