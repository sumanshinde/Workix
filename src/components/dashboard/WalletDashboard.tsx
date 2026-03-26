'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ArrowUpRight, ArrowDownLeft, Globe, CreditCard, RefreshCw, IndianRupee, DollarSign, Euro, PoundSterling, ChevronRight, History } from 'lucide-react';
import { paymentsAPI } from '../../services/api';
import { Button, Card, Skeleton } from '../ui';

export default function WalletDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('INR');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [withdrawing, setWithdrawing] = useState(false);

  const fetchWallet = async () => {
    try {
      const res = await paymentsAPI.getWallet();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const currencies: any = {
    'INR': { symbol: <IndianRupee size={20} />, rate: 1 },
    'USD': { symbol: <DollarSign size={20} />, rate: 0.012 },
    'EUR': { symbol: <Euro size={20} />, rate: 0.011 },
    'GBP': { symbol: <PoundSterling size={20} />, rate: 0.009 }
  };

  const handleWithdraw = () => {
    // Navigate to the newly built GigIndia withdraw page
    const router = require('next/navigation').useRouter;
    // But wait, router is already in scope? Need to check. Let's just use window.location.href for simplicity inside a component if router is not initialized in the body. Wait, `useRouter()` must be inside a component rendering phase.
    window.location.href = '/dashboard/withdraw';
  };

  if (loading) return <Skeleton className="h-96 w-full rounded-[2.5rem]" />;
  if (!data) return null;

  const currentBalance = (data.wallet.balance / 100) * currencies[currency].rate;

  return (
    <div className="space-y-10 font-manrope">
       
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Card */}
          <Card className="lg:col-span-8 p-1 bg-slate-900 border-0 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
             <div className="absolute top-0 right-0 p-12 opacity-5">
                <Wallet size={200} className="text-white" />
             </div>

             <div className="bg-slate-900 p-12 rounded-[2.4rem] space-y-12 relative z-10">
                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <div className="flex items-center gap-2 text-white/40 font-black text-[10px] uppercase tracking-[0.2em]">
                         <Globe size={14} /> Global Wallet
                      </div>
                      <h3 className="text-2xl font-black text-white italic">GigIndia PAY</h3>
                   </div>
                   
                   <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                      {Object.keys(currencies).map(cur => (
                         <button 
                            key={cur}
                            onClick={() => setCurrency(cur)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${currency === cur ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-white/40 hover:text-white'}`}
                         >
                            {cur}
                         </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-2">
                   <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Available Balance</div>
                   <div className="flex items-baseline gap-2">
                      <span className="text-white/40 text-4xl font-light">{currencies[currency].symbol}</span>
                      <motion.div 
                         key={currency}
                         initial={{ y: 20, opacity: 0 }}
                         animate={{ y: 0, opacity: 1 }}
                         className="text-7xl font-black text-white tracking-tighter"
                      >
                         {currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </motion.div>
                   </div>
                </div>

                <div className="flex flex-wrap gap-4">
                   <Button 
                      onClick={handleWithdraw}
                      isLoading={withdrawing}
                      className="h-16 px-10 rounded-2xl bg-white text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-colors flex items-center gap-3 shadow-xl shadow-black/20"
                   >
                      Withdraw Funds <ArrowUpRight size={18} />
                   </Button>
                   <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-colors flex items-center gap-3">
                      Add Money <ArrowDownLeft size={18} />
                   </Button>
                </div>
             </div>
          </Card>

          {/* Quick Stats */}
          <div className="lg:col-span-4 space-y-6">
             <Card className="p-8 bg-white border-0 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payout Methods</h4>
                   <CreditCard size={16} className="text-blue-600" />
                </div>
                <div className="space-y-3">
                   <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100 group cursor-pointer hover:border-blue-200 transition-colors">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black italic">R</div>
                         <div className="text-xs font-bold text-slate-700 uppercase tracking-tight">Bank (India)</div>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100 group cursor-pointer hover:border-blue-200 transition-colors opacity-50">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black italic">S</div>
                         <div className="text-xs font-bold text-slate-700 uppercase tracking-tight">Stripe (Global)</div>
                      </div>
                      <ChevronRight size={14} className="text-slate-300" />
                   </div>
                </div>
             </Card>

             <Card className="p-8 bg-blue-600 text-white border-0 shadow-xl shadow-blue-500/20 relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                   <RefreshCw size={80} />
                </div>
                <div className="relative z-10 space-y-2">
                   <div className="text-[8px] font-black text-white/60 uppercase tracking-widest">Automatic Payouts</div>
                   <h4 className="text-lg font-black uppercase italic italic">GigIndia PRO</h4>
                   <p className="text-[10px] font-medium text-blue-100 leading-relaxed uppercase tracking-wide">Instant withdrawal settlement enabled for pro users.</p>
                </div>
             </Card>
          </div>
       </div>

       {/* Transactions */}
       <div className="space-y-6">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <History size={20} className="text-slate-400" />
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Activity</h3>
             </div>
             <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All History</button>
          </div>

          <div className="space-y-3">
             {data.transactions.length === 0 ? (
                <div className="p-10 text-center text-slate-400 font-bold italic border-2 border-dashed border-slate-100 rounded-3xl uppercase tracking-widest text-[10px]">No recent transactions detected.</div>
             ) : (
                data.transactions.map((tx: any) => (
                   <Card key={tx._id} className="p-6 bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'deposit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                               {tx.type === 'deposit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                            </div>
                            <div>
                               <div className="font-bold text-slate-900 capitalize italic">{tx.type} via {tx.paymentGateway || 'System'}</div>
                               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(tx.createdAt).toLocaleString()}</div>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className={`text-lg font-black tracking-tighter ${tx.type === 'deposit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                               {tx.type === 'deposit' ? '+' : '-'} ₹{(tx.amount / 100).toLocaleString()}
                            </div>
                            <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{tx.status}</div>
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
