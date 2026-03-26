'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Cpu, MessageCircle, FileText, CheckCircle2, Scale, User, Briefcase } from 'lucide-react';
import { disputesAPI } from '../../../services/api';
import { Button, Card, Skeleton } from '../../../components/ui';

export default function DisputeCenter() {
  const { id } = useParams();
  const [dispute, setDispute] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDispute = async () => {
       try {
          const res = await disputesAPI.getById(id as string);
          setDispute(res);
       } catch (err) {
          console.error(err);
       } finally {
          setLoading(false);
       }
    };
    fetchDispute();
  }, [id]);

  if (loading) return <div className="p-12"><Skeleton className="h-96 w-full rounded-3xl" /></div>;
  if (!dispute) return <div className="p-12 text-center font-bold text-slate-400">Dispute record not found.</div>;

  const ProgressBar = ({ label, percentage, color }: { label: string, percentage: number, color: string }) => (
    <div className="space-y-2">
       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span>{label}</span>
          <span>{percentage}%</span>
       </div>
       <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} className={`h-full ${color}`} />
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12 font-manrope">
       <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
             <div className="space-y-2">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                      <AlertTriangle size={24} />
                   </div>
                   <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">DISPUTE CENTER</h1>
                </div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Case ID: <span className="text-slate-900">#GIG-{(id as string)?.slice(0, 8).toUpperCase()}</span></p>
             </div>
             
             <div className="flex items-center gap-3">
                <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${dispute.status === 'resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'} shadow-sm`}>
                   {dispute.status === 'resolved' ? '✔ CASE RESOLVED' : '● UNDER AI REVIEW'}
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
             
             {/* LEFT: AI ANALYSIS ENGINE */}
             <div className="lg:col-span-4 space-y-8">
                <Card className="p-8 border-0 bg-slate-900 text-white relative overflow-hidden shadow-2xl">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Cpu size={120} />
                   </div>

                   <div className="relative z-10 space-y-8">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Cpu size={20} />
                         </div>
                         <h2 className="text-xl font-black italic tracking-tight">AI JUDGEMENT</h2>
                      </div>

                      <div className="space-y-6">
                         <ProgressBar label="Client Responsibility" percentage={dispute.aiFaultProbability?.client || 0} color="bg-rose-500 shadow-lg shadow-rose-500/20" />
                         <ProgressBar label="Freelancer Responsibility" percentage={dispute.aiFaultProbability?.freelancer || 0} color="bg-emerald-500 shadow-lg shadow-emerald-500/20" />
                      </div>

                      <div className="space-y-3 pt-4 border-t border-white/10">
                         <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Verdict Summary</label>
                         <p className="text-sm font-medium text-slate-300 leading-relaxed italic">
                            "{dispute.aiSummary || "Analysis in progress... our LLM is reviewing the transaction history and artifacts."}"
                         </p>
                      </div>

                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                         <div className="space-y-1">
                            <div className="text-[8px] font-black text-white/40 uppercase tracking-widest">Recommended Resolution</div>
                            <div className="text-sm font-bold text-blue-400 capitalize">{dispute.aiRecommendedResolution || "Pending"}</div>
                         </div>
                         <div className="p-2 bg-blue-600 rounded-lg text-white">
                            <Scale size={16} />
                         </div>
                      </div>
                   </div>
                </Card>

                <Card className="p-8 space-y-6 border-0 shadow-sm bg-white">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">About the Parties</h3>
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <User size={16} className="text-slate-300" />
                         <div className="text-xs font-bold text-slate-900">Registered Authority (Client)</div>
                      </div>
                      <div className="flex items-center gap-3">
                         <Briefcase size={16} className="text-slate-300" />
                         <div className="text-xs font-bold text-slate-900">Verified Professional (Freelancer)</div>
                      </div>
                   </div>
                </Card>
             </div>

             {/* RIGHT: TIMELINE & MESSAGES */}
             <div className="lg:col-span-8 space-y-8">
                <Card className="p-10 space-y-10 border-0 bg-white shadow-sm">
                   
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">EVIDENCE CHRONOLOGY</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Public record of the dispute context.</p>
                   </div>

                   <div className="space-y-12 relative">
                      {/* Vertical Line */}
                      <div className="absolute left-6 top-8 bottom-0 w-px bg-slate-100" />

                      {/* Dispute Raised */}
                      <div className="relative pl-16 space-y-3">
                         <div className="absolute left-4 top-1 w-4 h-4 rounded-full border-4 border-white bg-blue-600 ring-4 ring-blue-50" />
                         <div className="flex items-center justify-between">
                            <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Case Initiated</h4>
                            <span className="text-[10px] font-bold text-slate-400">Mar 23, 2026</span>
                         </div>
                         <Card className="p-6 bg-slate-50 border-0 shadow-none space-y-4">
                            <div className="flex items-center gap-2 text-slate-900 font-bold">
                               <MessageCircle size={16} className="text-blue-500" />
                               {dispute.reason}
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">{dispute.description}</p>
                         </Card>
                      </div>

                      {/* AI Review Started */}
                      <div className="relative pl-16 space-y-3">
                         <div className="absolute left-5 top-1 w-2 h-2 rounded-full border-2 border-white bg-slate-200" />
                         <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-widest italic">AI Synthesis Pipeline Engaged</h4>
                            <div className="flex -space-x-1 animate-pulse">
                               {[1, 2, 3].map(i => <div key={i} className="w-4 h-4 rounded-full bg-blue-600/10 border border-blue-600/20" />)}
                            </div>
                         </div>
                      </div>

                      {/* Final Resolution (If exists) */}
                      {dispute.status === 'resolved' && (
                        <div className="relative pl-16 space-y-3">
                           <div className="absolute left-4 top-1 w-4 h-4 rounded-full border-4 border-white bg-emerald-500 ring-4 ring-emerald-50" />
                           <div className="flex items-center justify-between">
                              <h4 className="font-black text-emerald-600 uppercase text-xs tracking-widest underline underline-offset-4 decoration-emerald-200">FINAL VERDICT</h4>
                              <span className="text-[10px] font-bold text-slate-400">{new Date(dispute.updatedAt).toLocaleDateString()}</span>
                           </div>
                           <Card className="p-6 bg-emerald-50/50 border border-emerald-100 shadow-none space-y-4">
                              <div className="flex items-center gap-2 text-emerald-900 font-bold text-lg">
                                 <CheckCircle2 size={24} className="text-emerald-500" />
                                 {dispute.resolution === 'refund' ? "Total Refund to Client" : dispute.resolution === 'release' ? "Total Milestone Release" : "Partial Split Settlement"}
                              </div>
                              <p className="text-xs font-semibold text-emerald-700/70 italic">Verified by AI Conciliation Engine and finalized by GigIndia Operations.</p>
                           </Card>
                        </div>
                      )}
                   </div>
                </Card>

                {dispute.status !== 'resolved' && (
                  <div className="flex justify-end gap-4 p-8 bg-blue-600/5 rounded-[2.5rem] border-2 border-dashed border-blue-200 italic font-bold text-blue-600 text-center">
                     Our human investigators are currently validating the AI recommendations.
                  </div>
                )}
             </div>

          </div>
       </div>
    </div>
  );
}
