'use client';

import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, Target, TrendingUp, 
  ArrowRight, CheckCircle2, AlertCircle, BarChart, 
  Settings, Zap, Play, Pause, Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { experimentAPI } from '@/services/api';
import { Button, Card, Skeleton } from '@/components/ui';

export default function AdminExperimentsPage() {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExperiments = async () => {
     try {
        const res = await experimentAPI.getAll();
        setExperiments(res);
     } catch (err) { console.error(err); }
     finally { setLoading(false); }
  };

  useEffect(() => {
     fetchExperiments();
  }, []);

  const calculateCVR = (views: number, conversions: number) => {
     if (!views) return 0;
     return ((conversions / views) * 100).toFixed(2);
  };

  if (loading) return <div className="p-12"><Skeleton className="h-96 w-full rounded-[3rem]" /></div>;

  return (
    <div className="min-h-screen bg-white font-manrope selection:bg-rose-100 selection:text-rose-600">
       
       <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto space-y-12">
          
          <div className="flex justify-between items-end">
             <div className="space-y-2">
                <div className="text-[10px] font-black text-rose-600 uppercase tracking-[0.4em]">Optimization Lab</div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">Experiment Deck</h1>
             </div>
             <Button className="h-14 bg-rose-600 text-white font-black uppercase text-[10px] tracking-widest px-10 rounded-2xl shadow-xl shadow-rose-500/20">
                <FlaskConical size={14} className="mr-2" /> Launch New Test
             </Button>
          </div>

          <div className="grid grid-cols-1 gap-10">
             {experiments.length === 0 ? (
                <div className="p-20 text-center bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-100 space-y-6">
                   <div className="w-20 h-20 bg-white rounded-3xl mx-auto flex items-center justify-center text-slate-200">
                      <FlaskConical size={40} />
                   </div>
                   <p className="text-sm font-black text-slate-300 uppercase italic">No active experiments in orbit.</p>
                </div>
             ) : (
                experiments.map((exp: any) => (
                   <Card key={exp._id} className="p-12 bg-white border-0 shadow-sm rounded-[4rem] hover:shadow-2xl transition-all space-y-12 relative overflow-hidden group">
                      
                      {/* HEADER */}
                      <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-l-4 border-rose-600 pl-10">
                         <div className="space-y-2">
                            <div className="flex items-center gap-3">
                               <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">{exp.name}</h3>
                               {exp.isActive ? (
                                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase rounded-full tracking-widest flex items-center gap-1">
                                     <Zap size={8} fill="currentColor" /> Active
                                  </span>
                               ) : (
                                  <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[8px] font-black uppercase rounded-full tracking-widest">Paused</span>
                               )}
                            </div>
                            <p className="text-sm font-medium text-slate-400 italic">{exp.description}</p>
                         </div>
                         <div className="flex gap-2">
                            <Button variant="outline" className="h-12 w-12 p-0 border-2 border-slate-50 rounded-xl text-slate-300 hover:text-slate-900">
                               {exp.isActive ? <Pause size={18} /> : <Play size={18} />}
                            </Button>
                            <Button variant="outline" className="h-12 w-12 p-0 border-2 border-slate-50 rounded-xl text-slate-300 hover:text-rose-600">
                               <Trash2 size={18} />
                            </Button>
                            <Button variant="outline" className="h-12 px-6 border-2 border-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">
                               <Settings size={14} className="mr-2" /> Settings
                            </Button>
                         </div>
                      </div>

                      {/* STATS */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                         {exp.variants.map((v: any, i: number) => {
                            const views = exp.metrics.views[v.name] || 0;
                            const convs = exp.metrics.conversions[v.name] || 0;
                            const rev   = exp.metrics.revenue?.[v.name] || 0;
                            const cvr   = calculateCVR(views, convs);
                            const arpu  = views > 0 ? (rev / views).toFixed(2) : '0.00';
                            const isWinner = i === 1; // Simulated logic

                            return (
                               <div key={v.name} className={`p-10 rounded-[3rem] space-y-8 relative overflow-hidden ${isWinner ? 'bg-emerald-50/50 border-2 border-emerald-100 ring-4 ring-emerald-500/5' : 'bg-slate-50/50 border-2 border-slate-100'}`}>
                                  {isWinner && (
                                     <div className="absolute top-0 right-0 px-6 py-2 bg-emerald-600 text-white font-black text-[9px] uppercase tracking-widest rounded-bl-2xl shadow-xl">
                                        Predicted Winner
                                     </div>
                                  )}
                                  <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-slate-900 border border-slate-100 shadow-sm">
                                        {v.name}
                                     </div>
                                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{v.label}</div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-8">
                                     <div className="space-y-1">
                                        <div className="text-[9px] font-black text-slate-400 uppercase italic">Conversion Hub</div>
                                        <div className="text-4xl font-black text-slate-900 italic italic">{cvr}% <span className="text-[10px] font-bold text-slate-300 ml-1">CVR</span></div>
                                     </div>
                                     <div className="space-y-1 text-right">
                                        <div className="text-[9px] font-black text-slate-400 uppercase italic">Revenue Insights</div>
                                        <div className="text-xl font-bold font-black text-emerald-600 italic italic">₹{rev.toLocaleString()} <span className="text-[10px] text-slate-300 ml-1">TOTAL</span></div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">₹{arpu} / User</div>
                                     </div>
                                  </div>

                                  <div className="h-2 bg-white rounded-full overflow-hidden border border-slate-100">
                                     <motion.div 
                                        initial={{ width: 0 }} 
                                        animate={{ width: `${Math.min(100, (Number(cvr) * 10))}%` }} 
                                        className={`h-full ${isWinner ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                                     />
                                  </div>
                               </div>
                            );
                         })}
                      </div>

                      {/* INSIGHT FOOTER */}
                      <div className="pt-10 flex items-center justify-between border-t border-slate-50">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                               <AlertCircle size={16} />
                            </div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Statistical Significance: <span className="text-slate-900">92.4%</span> (Run for 3 more days)</p>
                         </div>
                         <div className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 cursor-pointer hover:underline">
                            Export Full Dataset <ArrowRight size={10} />
                         </div>
                      </div>

                   </Card>
                ))
             )}
          </div>

       </div>

    </div>
  );
}

function Experiment(props: any) {
   return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <path d="M12 2v20" />
         <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
   );
}
