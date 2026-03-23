'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, LayoutGrid, Zap, TrendingUp, Wallet, Shield, 
  FileText, Bell, Plus, ArrowUpRight, Target, ChevronRight, Cpu 
} from 'lucide-react';
import { dashboardAPI } from '../../services/api';
import { Button, Card, Skeleton } from '../../components/ui';

// Widgets
import WalletDashboard from '../../components/dashboard/WalletDashboard';
import PortfolioOptimizer from '../../components/dashboard/PortfolioOptimizer';
import CreditScoreCard from '../../components/dashboard/CreditScoreCard';
import TaxDashboard from '../../components/dashboard/TaxDashboard';

export default function MasterDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchStats = async () => {
       try {
          const res = await dashboardAPI.getStats();
          setStats(res);
       } catch (err) {
          console.error(err);
       } finally {
          setLoading(false);
       }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-12 space-y-8"><Skeleton className="h-20 w-full rounded-2xl" /><Skeleton className="h-96 w-full rounded-3xl" /></div>;
  if (!stats) return null;

  const summaryItems = [
     { label: 'Total Earnings', value: `₹${stats.summary.earnings.toLocaleString()}`, icon: <TrendingUp size={18} className="text-emerald-500" /> },
     { label: 'Active Orders', value: stats.summary.activeOrders, icon: <Zap size={18} className="text-blue-500" /> },
     { label: 'Wallet Balance', value: `₹${stats.summary.pendingPayments.toLocaleString()}`, icon: <Wallet size={18} className="text-amber-500" /> },
     { label: 'Profile Score', value: `${stats.summary.profileScore}/100`, icon: <Target size={18} className="text-purple-500" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 font-manrope">
       
       {/* TOP NAV BAR */}
       <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="p-2.5 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-900/10">
                <LayoutDashboard size={20} />
             </div>
             <h1 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Control Center</h1>
          </div>
          <div className="flex items-center gap-6">
             <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
             </button>
             <div className="h-8 w-px bg-slate-100" />
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
                </div>
                <div className="hidden md:block">
                   <div className="text-xs font-black text-slate-900 uppercase">Felix Dev</div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stats.role}</div>
                </div>
             </div>
          </div>
       </div>

       <div className="p-8 md:p-12 max-w-[1600px] mx-auto space-y-10">
          
          {/* SUMMARY GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {summaryItems.map((item, i) => (
                <Card key={i} className="p-6 border-0 bg-white shadow-sm hover:shadow-md transition-shadow group cursor-default">
                   <div className="flex items-center justify-between mb-2">
                       <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
                          {item.icon}
                       </div>
                       <ArrowUpRight size={14} className="text-slate-200 group-hover:text-slate-400 transition-colors" />
                   </div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</div>
                   <div className="text-2xl font-black text-slate-900 italic">{item.value}</div>
                </Card>
             ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
             
             {/* LEFT COLUMN: PRIMARY INTELLIGENCE */}
             <div className="lg:col-span-8 space-y-10">
                
                {/* TABS CONTROLLER */}
                <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
                   {[
                      { id: 'overview', label: 'Intelligence Hub', icon: <Cpu size={14} /> },
                      { id: 'wallet', label: 'Financials', icon: <Wallet size={14} /> },
                      { id: 'tax', label: 'Tax & GST', icon: <FileText size={14} /> }
                   ].map(tab => (
                      <button 
                         key={tab.id}
                         onClick={() => setActiveTab(tab.id)}
                         className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                         {tab.icon} {tab.label}
                      </button>
                   ))}
                </div>

                <div className="space-y-10">
                   {activeTab === 'overview' && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                         <PortfolioOptimizer />
                         <CreditScoreCard />
                         
                         <div className="space-y-6">
                            <div className="flex items-center justify-between">
                               <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Active Work Streams</h3>
                               <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All Projects</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               {stats.orders.length === 0 ? (
                                  <div className="col-span-2 p-12 text-center border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-300 font-bold uppercase text-[10px] tracking-widest">No active work detected.</div>
                               ) : (
                                  stats.orders.map((order: any) => (
                                     <Card key={order._id} className="p-6 bg-white border-0 shadow-sm space-y-6 group hover:border-blue-100 border-2 border-transparent transition-all">
                                        <div className="flex items-center justify-between">
                                           <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[8px] font-black uppercase tracking-widest">Active Order</div>
                                           <div className="text-[10px] font-black text-slate-900 italic">₹{(order.amount / 100).toLocaleString()}</div>
                                        </div>
                                        <h4 className="font-black text-slate-900 uppercase text-xs tracking-tight">{order.jobId?.title || "Custom Project"}</h4>
                                        <div className="space-y-2">
                                           <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                              <span>Progress</span>
                                              <span>65%</span>
                                           </div>
                                           <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                              <div className="h-full bg-blue-600 w-[65%]" />
                                           </div>
                                        </div>
                                        <Button variant="ghost" className="w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white">
                                           Manage Project <ChevronRight size={14} className="ml-1" />
                                        </Button>
                                     </Card>
                                  ))
                               )}
                            </div>
                         </div>
                      </motion.div>
                   )}

                   {activeTab === 'wallet' && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                         <WalletDashboard />
                      </motion.div>
                   )}

                   {activeTab === 'tax' && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                         <TaxDashboard />
                      </motion.div>
                   )}
                </div>

             </div>

             {/* RIGHT COLUMN: QUICK ACTIONS & INSIGHTS */}
             <div className="lg:col-span-4 space-y-10">
                
                <Card className="p-8 bg-slate-900 text-white border-0 shadow-2xl space-y-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Zap size={100} />
                   </div>
                   <div className="space-y-2 relative z-10">
                      <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Global Insights</div>
                      <h3 className="text-2xl font-black italic tracking-tight">AI POTENTIAL</h3>
                   </div>
                   <div className="space-y-6 relative z-10">
                      <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                         <div className="text-[8px] font-black text-white/40 uppercase tracking-widest">Earning Boost</div>
                         <div className="text-3xl font-black text-white italic">+ ₹12,450</div>
                         <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">"By optimizing your skills for 'React Native', you could unlock high-demand mobile gigs."</p>
                      </div>
                      <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20">
                         View AI Career Roadmap
                      </Button>
                   </div>
                </Card>

                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">System Commands</h4>
                   <div className="grid grid-cols-2 gap-4">
                      <button className="p-6 bg-white rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center gap-3 hover:border-blue-200 transition-all hover:translate-y-[-2px] group">
                         <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Plus size={20} />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest">New Gig</span>
                      </button>
                      <button className="p-6 bg-white rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center gap-3 hover:border-emerald-200 transition-all hover:translate-y-[-2px] group">
                         <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <ArrowUpRight size={20} />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest">Withdraw</span>
                      </button>
                   </div>
                </div>

                <Card className="p-8 bg-white border-0 shadow-sm space-y-6">
                   <div className="flex items-center gap-2">
                      <Shield size={18} className="text-slate-400" />
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Health</h4>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-bold">
                         <span className="text-slate-600">KYC Verification</span>
                         <span className="text-emerald-500">Completed</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold">
                         <span className="text-slate-600">2FA Status</span>
                         <span className="text-rose-500 underline cursor-pointer">Disabled</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold">
                         <span className="text-slate-600">Risk Score</span>
                         <span className="text-slate-900 italic font-black">0.05 (Low)</span>
                      </div>
                   </div>
                </Card>

             </div>

          </div>
       </div>
    </div>
  );
}
