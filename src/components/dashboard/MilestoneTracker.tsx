'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, Clock, Zap, CreditCard, ChevronRight } from 'lucide-react';
import { milestonesAPI } from '../../services/api';
import { Button, Card } from '../ui';

interface Milestone {
  _id: string;
  title: string;
  amount: number;
  status: 'pending' | 'funded' | 'released' | 'disputed';
}

export default function MilestoneTracker({ milestones: initialMilestones, isClient }: { milestones: Milestone[], isClient: boolean }) {
  const [milestones, setMilestones] = useState(initialMilestones);
  const [loading, setLoading] = useState<string | null>(null);

  const handleFund = async (milestoneId: string) => {
    setLoading(milestoneId);
    try {
      const { rzpOrder } = await milestonesAPI.fund(milestoneId);
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: rzpOrder.amount,
        currency: 'INR',
        name: 'GigIndia Escrow',
        description: 'Funding Milestone',
        order_id: rzpOrder.id,
        handler: async function (response: any) {
           // In production, confirm on backend. For now, we update local state or re-fetch.
           window.location.reload(); 
        },
        theme: { color: '#2563eb' }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
       alert(err.message || 'Funding failed');
    } finally {
       setLoading(null);
    }
  };

  const handleRelease = async (milestoneId: string) => {
    if (!confirm('Are you sure you want to release these funds to the freelancer? This action cannot be undone.')) return;
    setLoading(milestoneId);
    try {
      await milestonesAPI.release(milestoneId);
      window.location.reload();
    } catch (err: any) {
       alert(err.message || 'Release failed');
    } finally {
       setLoading(null);
    }
  };

  const activeMilestoneIndex = milestones.findIndex(m => m.status === 'funded') !== -1 
    ? milestones.findIndex(m => m.status === 'funded')
    : milestones.findIndex(m => m.status === 'pending');

  return (
    <div className="space-y-8 font-manrope">
       <div className="flex items-center justify-between">
          <div className="space-y-1">
             <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-500" />
                Payment Milestones
             </h3>
             <p className="text-xs font-medium text-slate-500 italic">Secure escrow handling by Razorpay Route.</p>
          </div>
          <div className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-100 italic">
             Escrow Active
          </div>
       </div>

       {/* Progress Bar */}
       <div className="relative h-1 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${(milestones.filter(m => m.status === 'released').length / milestones.length) * 100}%` }}
             className="absolute top-0 left-0 h-full bg-emerald-500"
          />
       </div>

       <div className="grid gap-4">
          {milestones.map((m, i) => (
             <Card key={m._id} className={`p-6 border-0 shadow-sm relative overflow-hidden transition-all duration-500 ${m.status === 'released' ? 'bg-slate-50/50' : i === activeMilestoneIndex ? 'bg-white ring-1 ring-blue-100 shadow-xl' : 'bg-white'}`}>
                
                {m.status === 'released' && (
                   <div className="absolute top-0 right-0 p-2 text-emerald-500">
                      <CheckCircle2 size={16} />
                   </div>
                )}

                <div className="flex items-center justify-between gap-6">
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${m.status === 'released' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'}`}>
                         {i + 1}
                      </div>
                      <div className="space-y-1">
                         <h4 className={`font-bold tracking-tight ${m.status === 'released' ? 'text-slate-400 line-through' : 'text-slate-900 uppercase'}`}>
                            {m.title}
                         </h4>
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            {m.status === 'pending' && <Clock size={12} />}
                            {m.status === 'funded' && <Zap size={12} className="text-amber-500 fill-amber-500" />}
                            {m.status === 'released' && <Zap size={12} className="text-emerald-500" />}
                            {m.status}
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-8">
                      <div className="text-right">
                         <div className="text-lg font-black text-slate-900 tracking-tighter">₹{(m.amount / 100).toLocaleString()}</div>
                         <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Milestone Value</div>
                      </div>

                      {isClient && (
                        <div className="w-40 flex justify-end">
                           {m.status === 'pending' && (
                              <Button 
                                onClick={() => handleFund(m._id)}
                                isLoading={loading === m._id}
                                className="h-10 px-6 rounded-lg bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-700"
                              >
                                Fund <CreditCard size={14} className="ml-2" />
                              </Button>
                           )}
                           {m.status === 'funded' && (
                              <div className="flex flex-col items-end gap-2">
                                <Button 
                                  onClick={() => handleRelease(m._id)}
                                  isLoading={loading === m._id}
                                  className="h-10 px-6 rounded-lg bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700"
                                >
                                  Release <ChevronRight size={14} className="ml-1" />
                                </Button>
                                <button 
                                  onClick={() => window.location.href = `/dispute-raising?milestoneId=${m._id}`}
                                  className="text-[8px] font-black text-rose-500 uppercase tracking-widest hover:underline"
                                >
                                  Raise Dispute
                                </button>
                              </div>
                           )}
                        </div>
                      )}
                      
                      {!isClient && m.status === 'funded' && (
                        <div className="px-4 py-2 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-lg italic">
                           In Review
                        </div>
                      )}
                   </div>
                </div>
             </Card>
          ))}
       </div>

       <p className="text-[10px] font-bold text-center text-slate-400 leading-relaxed max-w-sm mx-auto">
          Funds are held securely in a SEBI-compliant ESCROW account. 
          Released only after client verification. <span className="text-blue-600">Dispute Support Available.</span>
       </p>
    </div>
  );
}
