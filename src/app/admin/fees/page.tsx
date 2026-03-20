'use client';

import React, { useState, useEffect } from 'react';
import { 
  Percent, TrendingUp, Settings, Save, 
  AlertCircle, RefreshCw, History, ArrowUpRight
} from 'lucide-react';
import { Card, Button, Input } from '@/components/ui';
import { feesAPI } from '@/services/api';

export default function AdminFeesPage() {
  const [fees, setFees] = useState<any>({ clientFeePercent: 5, freelancerFeePercent: 10 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const { data } = await feesAPI.getFees();
      if (data) setFees(data);
      
      const { data: txs } = await feesAPI.getTransactions?.() || { data: [] };
      setHistory(txs);
    } catch (err) {
      console.error('Fees fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await feesAPI.updateFees(fees);
      alert('Platform fee structure updated successfully.');
    } catch (err) {
      alert('Failed to update fees.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500 font-medium">Loading fee structure...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 lg:p-12 space-y-8 pb-24 selection:bg-blue-100 selection:text-blue-600">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
         <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Fee Settings</h1>
            <p className="text-gray-500 text-sm font-medium">Manage platform service and transaction fees.</p>
         </div>
         <Button 
           onClick={handleSave} 
           disabled={saving}
           className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-3"
         >
            {saving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save Changes'}
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         
         {/* Client Fee */}
         <Card className="p-8 border-gray-200 bg-white">
            <div className="space-y-6">
               <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-blue-600 border border-gray-100 shadow-sm">
                  <Percent size={20} />
               </div>
               <div className="space-y-1">
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">Client Fee</h3>
                  <p className="text-xs text-gray-500 font-medium">Fee applied to the client when starting a project.</p>
               </div>
               <div className="flex items-center gap-4">
                  <Input 
                    type="number"
                    value={fees.clientFeePercent}
                    onChange={e => setFees({...fees, clientFeePercent: Number(e.target.value)})}
                    className="text-xl font-bold text-gray-900 w-24 h-11 border-gray-200 focus:ring-blue-500/10"
                  />
                  <span className="text-lg font-semibold text-gray-400">%</span>
               </div>
            </div>
         </Card>

         {/* Freelancer Fee */}
         <Card className="p-8 border-gray-200 bg-white">
            <div className="space-y-6">
               <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-amber-600 border border-gray-100 shadow-sm">
                  <TrendingUp size={20} />
               </div>
               <div className="space-y-1">
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">Freelancer Fee</h3>
                  <p className="text-xs text-gray-500 font-medium">Fee deducted from the freelancer's final payout.</p>
               </div>
               <div className="flex items-center gap-4">
                  <Input 
                    type="number"
                    value={fees.freelancerFeePercent}
                    onChange={e => setFees({...fees, freelancerFeePercent: Number(e.target.value)})}
                    className="text-xl font-bold text-gray-900 w-24 h-11 border-gray-200 focus:ring-blue-500/10"
                  />
                  <span className="text-lg font-semibold text-gray-400">%</span>
               </div>
            </div>
         </Card>

      </div>

      {/* Logic Warning */}
      <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-4">
         <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 border border-blue-100">
            <AlertCircle size={20} className="text-blue-600" />
         </div>
         <div>
             <h4 className="text-sm font-bold text-blue-900 mb-1">Important Note</h4>
             <p className="text-xs font-medium text-blue-700 leading-relaxed">
                Changes to the fee structure will only apply to new projects and transactions. Active and ongoing contracts will retain the previous fee rates established when they were created.
             </p>
         </div>
      </div>

      {/* Transaction History (Mock) */}
      <Card className="p-8 border-gray-200 bg-white">
         <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-3">
               <History size={16} className="text-gray-400" /> Recent Fee Earnings
            </h3>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700">Export CSV</button>
         </div>

         <div className="divide-y divide-gray-100">
            {[1, 2, 3].map(i => (
              <div key={i} className="py-4 flex items-center justify-between group hover:bg-gray-50 px-4 -mx-4 rounded-lg transition-colors">
                 <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-900">Transaction ID #BG-TX-882{i}</p>
                    <p className="text-xs font-medium text-gray-500">20 Mar 2026 • Successful</p>
                 </div>
                 <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">+₹{150 * i}.00</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fee Added</p>
                 </div>
                 <div className="w-8 flex justify-end">
                    <ArrowUpRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                 </div>
              </div>
            ))}
         </div>
      </Card>

    </div>
  );
}
