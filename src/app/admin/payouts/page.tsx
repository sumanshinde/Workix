'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, ArrowUpRight, ArrowDownRight, 
  Clock, CheckCircle2, XCircle, DollarSign,
  Download, Filter, AlertCircle, TrendingUp,
  ChevronRight, Search
} from 'lucide-react';
import { Button } from '@/components/ui';
import { adminAPI } from '@/services/api';

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getPayoutRequests();
      if (res) setPayouts(res);
    } catch (err) {
      console.error('Failed to fetch payouts', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId: string, action: 'approve' | 'reject') => {
    const reason = action === 'reject' ? prompt('Enter rejection reason:') || 'Rejection reason not provided' : undefined;
    if (action === 'reject' && !reason) return;

    try {
      await adminAPI.processPayout({ requestId, action, adminNotes: reason });
      alert(`Payout ${action}d successfully`);
      fetchPayouts();
    } catch (err) {
      alert(`Failed to ${action} payout`);
    }
  };

  const totalPayouts = payouts.filter(p => p.status === 'processed').reduce((s, p) => s + (p.amount || 0), 0) / 100;
  const pendingPayouts = payouts.filter(p => p.status === 'pending').reduce((s, p) => s + (p.amount || 0), 0) / 100;

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
                 <h2 className="text-5xl font-bold text-gray-900 tracking-tight">₹{(totalPayouts / 100000).toFixed(2)}L</h2>
              </div>
              <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                 <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Fee Yield (Est)</p>
                    <p className="text-lg font-bold text-gray-900">₹{(totalPayouts * 0.1 / 1000).toFixed(1)}K</p>
                 </div>
                 <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Pending Outflow</p>
                    <p className="text-lg font-bold text-gray-900">₹{(pendingPayouts / 1000).toFixed(1)}K</p>
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
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Synchronizing Cashflows...</div>
          ) : payouts.length === 0 ? (
             <div className="p-10 text-center text-gray-500 font-medium text-xs">
                No transactions yet.
             </div>
          ) : (
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                   <th className="px-6 py-4">Freelancer</th>
                   <th className="px-6 py-4">Amount</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4">Date</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 text-sm">
                 {payouts.map((payout) => (
                   <tr key={payout._id} className="group hover:bg-gray-50/50 transition-colors">
                     <td className="px-6 py-4">
                       <div>
                         <p className="text-gray-900 font-bold text-sm truncate">{payout.userId?.name || 'Unknown'}</p>
                         <p className="text-xs text-gray-500 font-medium">{payout.userId?.email}</p>
                       </div>
                     </td>
                     <td className="px-6 py-4 text-xl font-bold text-gray-900 tracking-tight">
                       ₹{(payout.amount / 100).toLocaleString()}
                     </td>
                     <td className="px-6 py-4">
                       <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${
                         payout.status === 'processed' || payout.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                         payout.status === 'processing' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                         payout.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                         'bg-amber-50 text-amber-700 border-amber-100'
                       }`}>
                         {payout.status}
                       </div>
                     </td>
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-3 text-gray-500 font-medium text-xs">
                          <Clock size={14} className="text-gray-400" />
                          {new Date(payout.createdAt).toLocaleDateString()}
                       </div>
                     </td>
                     <td className="px-6 py-4 text-right">
                       {payout.status === 'pending' ? (
                         <div className="flex items-center justify-end gap-3">
                            <button onClick={() => handleAction(payout._id, 'approve')} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[10px] uppercase rounded-lg transition-colors">Approve</button>
                            <button onClick={() => handleAction(payout._id, 'reject')} className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 font-semibold text-[10px] uppercase rounded-lg transition-colors">Reject</button>
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
