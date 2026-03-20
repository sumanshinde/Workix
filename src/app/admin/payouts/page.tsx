'use client';

import React, { useState } from 'react';
import { 
  CreditCard, ArrowUpRight, ArrowDownRight, 
  Clock, CheckCircle2, XCircle, DollarSign,
  Download, Filter, AlertCircle, TrendingUp,
  ChevronRight, Search
} from 'lucide-react';
import { Button } from '@/components/ui';

const DUMMY_PAYOUTS = [
  { id: '1', freelancer: 'Aditya Sharma', amount: '₹12,400', method: 'Bank Transfer', status: 'Pending', requested: '3 hours ago' },
  { id: '2', freelancer: 'Priya Singh', amount: '₹8,500', method: 'UPI', status: 'Completed', requested: '5 hours ago' },
  { id: '3', freelancer: 'Rahul Gupta', amount: '₹22,000', method: 'Bank Transfer', status: 'Processing', requested: '12 hours ago' },
  { id: '4', freelancer: 'Sonal Verma', amount: '₹4,200', method: 'UPI', status: 'Pending', requested: '1 day ago' },
];

export default function PayoutsPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="p-8 lg:p-12 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Finances</h1>
          <p className="text-gray-500 text-sm font-medium">Manage payouts, platform growth, and revenue statistics.</p>
        </div>
        <div className="flex gap-4">
          <Button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-3 rounded-lg">
            <Download size={16} /> Export Financials
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Metric Card */}
        <div className="lg:col-span-2 bg-white border border-gray-200 p-8 py-10 rounded-xl shadow-sm relative overflow-hidden group flex flex-col justify-between">
           <div className="space-y-8">
              <div className="flex items-center justify-between">
                 <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                    <DollarSign size={24} />
                 </div>
                 <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-100">
                    <TrendingUp size={14} /> +24% YoY Growth
                 </div>
              </div>
              <div>
                 <p className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-2">Total Settlement Volume</p>
                 <h2 className="text-5xl font-bold text-gray-900 tracking-tight">₹4.2 Cr</h2>
              </div>
              <div className="grid grid-cols-3 gap-8 pt-4 border-t border-gray-100">
                 <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Fee Yield</p>
                    <p className="text-lg font-bold text-gray-900">₹8.4L</p>
                 </div>
                 <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Escrowed</p>
                    <p className="text-lg font-bold text-gray-900">₹1.2 Cr</p>
                 </div>
                 <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Payouts Output</p>
                    <p className="text-lg font-bold text-gray-900">₹2.8 Cr</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Action Card */}
        <div className="bg-white border border-gray-200 p-8 py-10 rounded-xl shadow-sm flex flex-col justify-between">
           <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Platform Fee</h3>
              <p className="text-gray-500 text-sm font-medium">Configure global commission rates for all transactions.</p>
           </div>
           <div className="space-y-6 mt-8">
              <div className="flex items-baseline gap-1 bg-gray-50 p-6 rounded-lg border border-gray-100 justify-center">
                 <span className="text-5xl font-bold text-blue-600">10</span>
                 <span className="text-xl font-bold text-gray-400">%</span>
              </div>
              <Button className="w-full bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 font-semibold rounded-lg">
                Update Fee Tier
              </Button>
           </div>
        </div>
      </div>

      {/* Payout Queue */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <h3 className="text-lg font-bold text-gray-900 tracking-tight">Withdrawal Requests</h3>
             <div className="h-6 w-px bg-gray-200" />
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Query payouts..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 h-10 text-sm text-gray-900 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium w-64"
                />
             </div>
          </div>
          <div className="flex gap-3">
             <button className="p-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-900 rounded-lg transition-colors"><Filter size={18} /></button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {DUMMY_PAYOUTS.length === 0 ? (
             <div className="p-10 text-center text-gray-500 font-medium">
                No transactions yet.
             </div>
          ) : (
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                   <th className="px-6 py-4">Freelancer</th>
                   <th className="px-6 py-4">Amount</th>
                   <th className="px-6 py-4">Method</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4">Date</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 text-sm">
                 {DUMMY_PAYOUTS.map((payout) => (
                   <tr key={payout.id} className="group hover:bg-gray-50/50 transition-colors">
                     <td className="px-6 py-4">
                       <div>
                         <p className="text-gray-900 font-bold text-sm truncate">{payout.freelancer}</p>
                         <p className="text-xs text-gray-500 font-medium">Verified User</p>
                       </div>
                     </td>
                     <td className="px-6 py-4 text-xl font-bold text-gray-900 tracking-tight">
                       {payout.amount}
                     </td>
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-3 text-gray-600 font-medium text-sm">
                          <CreditCard size={16} className="text-blue-500" />
                          {payout.method}
                       </div>
                     </td>
                     <td className="px-6 py-4">
                       <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                         payout.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                         payout.status === 'Processing' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                         'bg-amber-50 text-amber-700 border border-amber-100'
                       }`}>
                         {payout.status}
                       </div>
                     </td>
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-3 text-gray-500 font-medium text-xs">
                          <Clock size={14} className="text-gray-400" />
                          {payout.requested}
                       </div>
                     </td>
                     <td className="px-6 py-4 text-right">
                       {payout.status === 'Pending' ? (
                         <div className="flex items-center justify-end gap-3">
                            <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors">Approve</button>
                            <button className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 font-semibold text-xs rounded-lg transition-colors">Reject</button>
                         </div>
                       ) : (
                          <div className="flex justify-end pr-2">
                             <button className="text-gray-400 hover:text-gray-900 transition-colors"><ChevronRight size={20} /></button>
                          </div>
                       )}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          )}
        </div>
      </div>
    </div>
  );
}
