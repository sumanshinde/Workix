'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Scale, CheckCircle2, XCircle, AlertTriangle, Eye, ArrowRight, Gavel, History, MessageSquare } from 'lucide-react';
import { adminAPI } from '../../../services/api';
import { Button, Card, Skeleton } from '../../../components/ui';

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [resolving, setResolving] = useState(false);

  const fetchDisputes = async () => {
    try {
      const res = await adminAPI.getAllDisputes();
      setDisputes(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleResolve = async (decision: string) => {
    const reason = prompt('Provide official reason for this decision:');
    if (!reason) return;

    setResolving(true);
    try {
      await adminAPI.resolveDispute({ disputeId: selectedDispute._id, decision, reason });
      await fetchDisputes();
      setSelectedDispute(null);
      alert('Dispute officially resolved and closed.');
    } catch (err) {
      alert('Resolution failed');
    } finally {
      setResolving(false);
    }
  };

  if (loading) return <div className="p-12 space-y-8"><Skeleton className="h-20 w-full rounded-2xl" /><Skeleton className="h-96 w-full rounded-3xl" /></div>;

  return (
    <div className="min-h-screen bg-slate-50/50 font-manrope">
       
       <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="space-y-2">
                <div className="flex items-center gap-3 text-rose-600 font-black text-[10px] uppercase tracking-[0.2em]">
                   <ShieldAlert size={16} /> Legal & Compliance
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Admin Dispute Tribunal</h1>
             </div>
             <div className="flex gap-4">
                <Card className="px-6 py-4 bg-white border-0 shadow-sm flex flex-col items-center">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Cases</div>
                   <div className="text-2xl font-black text-rose-600">{disputes.filter(d => d.status !== 'resolved').length}</div>
                </Card>
                <Card className="px-6 py-4 bg-white border-0 shadow-sm flex flex-col items-center">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting AI</div>
                   <div className="text-2xl font-black text-blue-600">0</div>
                </Card>
             </div>
          </div>

          {!selectedDispute ? (
             <div className="space-y-6">
                <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="border-b border-slate-50">
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dispute Case</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parties</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {disputes.map(dispute => (
                            <tr key={dispute._id} className="group hover:bg-slate-50/50 transition-colors">
                               <td className="px-10 py-6">
                                  <div className="font-bold text-slate-900 text-sm italic uppercase truncate max-w-[200px]">{dispute.reason}</div>
                                  <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">ID: {dispute._id.slice(-8)}</div>
                               </td>
                               <td className="px-10 py-6">
                                  <div className="flex flex-col gap-1">
                                     <div className="text-xs font-bold text-slate-700">C: {dispute.clientId?.name}</div>
                                     <div className="text-xs font-bold text-slate-400">F: {dispute.freelancerId?.name}</div>
                                  </div>
                               </td>
                               <td className="px-10 py-6">
                                  <div className="text-sm font-black text-slate-900 tracking-tight">₹{(dispute.orderId?.amount / 100).toLocaleString()}</div>
                               </td>
                               <td className="px-10 py-6">
                                  <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${dispute.status === 'resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                     {dispute.status}
                                  </span>
                               </td>
                               <td className="px-10 py-6 text-right">
                                  <Button onClick={() => setSelectedDispute(dispute)} variant="ghost" className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-slate-900 group-hover:text-white transition-all">
                                     Review Case <Eye size={14} className="ml-2" />
                                  </Button>
                               </td>
                            </tr>
                         ))}
                         {disputes.length === 0 && (
                            <tr><td colSpan={5} className="px-10 py-20 text-center text-[10px] font-black text-slate-300 uppercase italic">No active disputes in the tribunal.</td></tr>
                         )}
                      </tbody>
                   </table>
                </div>
             </div>
          ) : (
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                <Button onClick={() => setSelectedDispute(null)} variant="ghost" className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                   ← Back to Tribunal
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                   
                   {/* CASE DETAILS */}
                   <div className="lg:col-span-8 space-y-10">
                      <Card className="p-10 border-0 bg-white shadow-sm space-y-10">
                         <div className="flex items-center justify-between border-b border-slate-50 pb-8">
                            <div>
                               <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter">{selectedDispute.reason}</h2>
                               <p className="text-sm font-medium text-slate-400 italic">Raised by {selectedDispute.raisedBy === 'client' ? 'Client' : 'Freelancer'}</p>
                            </div>
                            <div className="text-right">
                               <div className="text-3xl font-black text-slate-900 tracking-tight italic">₹{(selectedDispute.orderId?.amount / 100).toLocaleString()}</div>
                               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Impact</div>
                            </div>
                         </div>

                         <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Case Description</h4>
                            <p className="p-6 bg-slate-50 rounded-[2rem] text-sm font-medium text-slate-700 leading-relaxed italic border border-slate-100">
                               "{selectedDispute.description}"
                            </p>
                         </div>

                         <div className="grid grid-cols-2 gap-8">
                            <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] space-y-4 relative overflow-hidden">
                               <div className="absolute top-0 right-0 p-4 opacity-10"><Scale size={60} /></div>
                               <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest">AI Verdict Intelligence</h4>
                               <div className="text-lg font-black italic uppercase tracking-tight">{selectedDispute.aiVerdict?.summary || "AI Analysis Failed"}</div>
                               <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase">
                                  Probability: {selectedDispute.aiVerdict?.faultProbability || 50}% Fault
                               </div>
                            </div>
                            
                            <div className="space-y-4">
                               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Parties History</h4>
                               <div className="space-y-3">
                                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                     <div className="text-xs font-bold text-slate-700">C: {selectedDispute.clientId?.name}</div>
                                     <div className="text-[10px] font-black text-amber-600">Trust: {selectedDispute.clientId?.trustScore}%</div>
                                  </div>
                                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                     <div className="text-xs font-bold text-slate-700">F: {selectedDispute.freelancerId?.name}</div>
                                     <div className="text-[10px] font-black text-emerald-600">Trust: {selectedDispute.freelancerId?.trustScore}%</div>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </Card>

                      <div className="p-8 border-2 border-dashed border-slate-200 rounded-[3rem] flex items-center justify-center gap-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">
                         <MessageSquare size={16} /> Secure Chat History Transcript Locked.
                      </div>
                   </div>

                   {/* RESOLUTION PANEL */}
                   <div className="lg:col-span-4 space-y-8">
                      <Card className="p-10 border-0 bg-white shadow-xl space-y-10 border-2 border-slate-900 shadow-slate-900/10">
                         <div className="space-y-2">
                            <div className="flex items-center gap-2 text-rose-600 font-black text-[10px] uppercase tracking-widest">
                               <Gavel size={18} /> Official Judgment
                            </div>
                            <h3 className="text-xl font-black text-slate-900 italic uppercase">Tribunal Action</h3>
                         </div>

                         <div className="space-y-4">
                            <Button 
                               onClick={() => handleResolve('release')}
                               isLoading={resolving}
                               className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                            >
                               Release to Freelancer
                            </Button>
                            <Button 
                               onClick={() => handleResolve('refund')}
                               isLoading={resolving}
                               className="w-full h-16 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-500/20"
                            >
                               Refund to Client
                            </Button>
                            <Button 
                               onClick={() => handleResolve('split')}
                               variant="outline"
                               className="w-full h-16 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                            >
                               50/50 Partial Split
                            </Button>
                         </div>

                         <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                            <AlertTriangle size={18} className="text-amber-600 mt-1" />
                            <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                               Judgment is final and irrevocable. Corrective impact on Trust Scores will be auto-calculated.
                            </p>
                         </div>
                      </Card>

                      <Card className="p-8 bg-slate-50 border-0 shadow-sm space-y-6">
                         <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                            <History size={16} /> Case Timeline
                         </div>
                         <div className="space-y-4">
                            <div className="flex items-start gap-3">
                               <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5" />
                               <div className="text-xs font-bold text-slate-700 uppercase tracking-tight">Dispute Opened <span className="text-[10px] text-slate-300 font-medium">12:30 PM</span></div>
                            </div>
                            <div className="flex items-start gap-3">
                               <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5" />
                               <div className="text-xs font-bold text-slate-700 uppercase tracking-tight">AI Verdict Generated <span className="text-[10px] text-slate-300 font-medium">12:31 PM</span></div>
                            </div>
                            <div className="flex items-start gap-3">
                               <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5" />
                               <div className="text-xs font-bold text-slate-400 uppercase tracking-tight italic">Awaiting Admin Signature</div>
                            </div>
                         </div>
                      </Card>
                   </div>

                </div>
             </motion.div>
          )}

       </div>

    </div>
  );
}
