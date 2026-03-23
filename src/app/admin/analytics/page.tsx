'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Briefcase, CreditCard, 
  ArrowUpRight, ArrowDownRight, Filter, Download,
  Target, Zap, Activity, PieChart, BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { adminAnalyticsAPI } from '@/services/api';
import { Button, Card, Skeleton } from '@/components/ui';

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [funnel, setFunnel] = useState<any[]>([]);
  const [performers, setPerformers] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
     try {
        const [m, f, p] = await Promise.all([
           adminAnalyticsAPI.getGrowth(),
           adminAnalyticsAPI.getFunnel(),
           adminAnalyticsAPI.getPerformers()
        ]);
        setMetrics(m);
        setFunnel(f);
        setPerformers(p);
     } catch (err) {
        console.error(err);
     } finally {
        setLoading(false);
     }
  };

  useEffect(() => {
     fetchAll();
  }, []);

  if (loading) return <div className="p-12"><Skeleton className="h-screen w-full rounded-[3rem]" /></div>;

  if (!metrics || !performers || !funnel) {
     return (
        <div className="h-screen flex flex-col items-center justify-center space-y-4 bg-slate-50 font-manrope">
           <div className="text-3xl font-black text-slate-200 uppercase italic">Analytics Offline</div>
           <p className="text-sm font-medium text-slate-400 italic">Could not aggregate market data. Please check your connection.</p>
           <Button onClick={fetchAll} variant="outline" className="h-12 px-8 rounded-xl border-2 border-slate-200">Retry Synchronization</Button>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-manrope selection:bg-blue-100 selection:text-blue-600">
       
       <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto space-y-12">
          
          <div className="flex justify-between items-end">
             <div className="space-y-2">
                <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Corporate Intelligence</div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">Growth Orbit</h1>
             </div>
             <div className="flex gap-4">
                <Button variant="outline" className="h-12 border-2 border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-widest px-6 rounded-2xl">
                   <Download size={14} className="mr-2" /> Export Report
                </Button>
                <Button className="h-12 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest px-8 rounded-2xl shadow-xl shadow-slate-900/10">
                   <Filter size={14} className="mr-2" /> Quick Filters
                </Button>
             </div>
          </div>

          {/* MAIN METRIC GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {[
               { lab: 'Total GMV', val: `₹${metrics.revenue.totalGMV.toLocaleString()}`, change: '+12%', icon: <TrendingUp />, col: 'text-emerald-600', bg: 'bg-emerald-50' },
               { lab: 'Revenue (Fees)', val: `₹${metrics.revenue.platformFees.toLocaleString()}`, change: '+8%', icon: <CreditCard />, col: 'text-blue-600', bg: 'bg-blue-50' },
               { lab: 'Master Ecosystem', val: metrics.users.total, change: '+240 this wk', icon: <Users />, col: 'text-rose-600', bg: 'bg-rose-50' },
               { lab: 'Market Liquidity', val: metrics.activity.activeJobs, change: '102 new', icon: <Briefcase />, col: 'text-amber-600', bg: 'bg-amber-50' }
             ].map((m, i) => (
                <Card key={i} className="p-8 bg-white border-0 shadow-sm hover:shadow-xl transition-all space-y-4 rounded-[2.5rem] group overflow-hidden relative">
                   <div className={`w-12 h-12 ${m.bg} ${m.col} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                      {m.icon}
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.lab}</div>
                      <div className="text-3xl font-black text-slate-900 italic tracking-tighter">{m.val}</div>
                   </div>
                   <div className={`flex items-center gap-1 text-[10px] font-bold ${m.col} uppercase`}>
                      <ArrowUpRight size={10} /> {m.change}
                   </div>
                </Card>
             ))}
          </div>

          {/* FUNNEL & PERFORMANCE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             
             {/* CONVERSION FUNNEL */}
             <Card className="lg:col-span-2 p-10 bg-white border-0 shadow-sm rounded-[3rem] space-y-10">
                <div className="flex items-center justify-between">
                   <h3 className="text-xl font-black text-slate-900 italic uppercase">Conversion Pipeline</h3>
                   <div className="px-4 py-2 bg-slate-50 rounded-full text-[10px] font-black uppercase text-slate-400 tracking-widest">Global Funnel</div>
                </div>
                
                <div className="space-y-6">
                   {funnel.map((f, i) => (
                      <div key={f.stage} className="space-y-2">
                         <div className="flex justify-between items-end">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{f.stage}</div>
                            <div className="text-sm font-black text-slate-900 italic">{f.count.toLocaleString()} <span className="text-[10px] font-bold text-slate-300 ml-2">-{f.dropoff}% drop</span></div>
                         </div>
                         <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                            <motion.div 
                               initial={{ width: 0 }} 
                               animate={{ width: `${100 - (i * 20)}%` }} // Pure visual representation of funnel narrowing
                               className={`h-full rounded-full ${i === 3 ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                            />
                         </div>
                      </div>
                   ))}
                </div>

                <div className="pt-8 grid grid-cols-2 gap-8 border-t border-slate-50">
                   <div className="space-y-1">
                      <div className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">Avg Order Value</div>
                      <div className="text-2xl font-black text-slate-900 italic italic">₹{Math.round(metrics.revenue.aov).toLocaleString()}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">Active Retention</div>
                      <div className="text-2xl font-black text-emerald-600 italic italic">82.4%</div>
                   </div>
                </div>
             </Card>

             {/* TOP PERFORMERS */}
             <Card className="p-10 bg-slate-900 text-white border-0 shadow-2xl rounded-[3rem] space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Trophy size={120} /></div>
                <div className="space-y-2 relative">
                   <h3 className="text-xl font-black italic uppercase">The Elite 1%</h3>
                   <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Top Earners this month</div>
                </div>

                <div className="space-y-6 relative">
                   {performers.topFreelancers.map((f: any, i: number) => (
                      <div key={f._id} className="flex items-center justify-between group">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-blue-400 border border-slate-700">
                               #{i+1}
                            </div>
                            <div className="space-y-0.5">
                               <div className="text-sm font-black italic uppercase">{f.user.name}</div>
                               <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{f.count} Successful Gigs</div>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className="text-sm font-black text-blue-400 tracking-tighter">₹{f.earning.toLocaleString()}</div>
                            <div className="text-[8px] font-bold text-slate-500 uppercase">Total Revenue</div>
                         </div>
                      </div>
                   ))}
                </div>

                <Button className="w-full h-14 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest backdrop-blur-sm border border-white/5 transition-all">
                   Manage High-Value Tiers
                </Button>
             </Card>

          </div>

          {/* REVENUE TRENDS (Visual Simulation) */}
          <div className="pt-10 space-y-8">
             <div className="flex items-center gap-2">
                <Activity size={18} className="text-blue-600" />
                <h3 className="text-xl font-black text-slate-900 italic uppercase">Market Velocity</h3>
             </div>
             <div className="h-64 bg-white rounded-[3.5rem] p-12 flex items-end gap-2 border border-slate-50 shadow-sm relative overflow-hidden">
                {[40, 60, 45, 80, 55, 90, 70, 100, 85, 110, 95, 120].map((h, i) => (
                   <motion.div 
                      key={i} 
                      initial={{ height: 0 }} 
                      animate={{ height: `${h}%` }} 
                      transition={{ delay: i * 0.05 }}
                      className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-xl opacity-80 hover:opacity-100 transition-opacity" 
                   />
                ))}
                <div className="absolute inset-x-12 bottom-4 flex justify-between text-[8px] font-black text-slate-300 uppercase tracking-widest">
                   <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                </div>
             </div>
          </div>

       </div>

    </div>
  );
}

function Trophy(props: any) {
   return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
         <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
         <path d="M4 22h16" />
         <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
         <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
         <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
   );
}
