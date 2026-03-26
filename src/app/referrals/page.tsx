'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Share2, Users, TrendingUp, Copy, CheckCircle2, MessageCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { referralAPI } from '../../services/api';
import { Button, Card, Skeleton } from '../../components/ui';

export default function ReferralPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stored = localStorage.getItem('user');
        if (!stored) throw new Error('Not logged in');
        const userId = JSON.parse(stored).id;
        const res = await referralAPI.getStats(userId);
        setData(res);
      } catch (err) {
        console.error('Referral Stats Error:', err);
        // Fallback for logged out users or API errors so the page still renders
        setData({
           referralCode: 'LOGIN-TO-GET-CODE',
           stats: { totalEarned: 0, completed: 0, pending: 0 },
           invites: []
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const copyToClipboard = () => {
    const url = `${window.location.origin}/signup?ref=${data.referralCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const text = `Join GigIndia with my code ${data.referralCode} and get a ₹50 bonus! 🚀 ${window.location.origin}/signup?ref=${data.referralCode}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) return <div className="p-12"><Skeleton className="h-96 w-full rounded-3xl" /></div>;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 font-manrope">
       
       <div className="p-8 md:p-12 lg:p-20 max-w-7xl mx-auto space-y-12">
          
          {/* HERO SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                   <Gift size={14} /> Referral Engine
                </div>
                <h1 className="text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter">
                   INVITE FRIENDS. <br />
                   <span className="text-blue-600 italic">EARN ₹100.</span>
                </h1>
                <p className="text-lg font-medium text-slate-500 leading-relaxed max-w-md">
                   Grow GigIndia and get rewarded. You get ₹100 for every successful referral, and they get ₹50 bonus. Plus, earn from their referrals too!
                </p>
                
                <div className="p-1 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-2">
                   <div className="flex-1 px-8 py-4 text-center md:text-left">
                      <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Unique Code</div>
                      <div className="text-2xl font-black text-slate-900 tracking-tight">{data.referralCode}</div>
                   </div>
                   <div className="flex gap-2 p-2 w-full md:w-fit">
                      <Button onClick={copyToClipboard} className="flex-1 md:flex-none h-14 px-8 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                         {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                         {copied ? 'Copied URL' : 'Copy Link'}
                      </Button>
                      <Button onClick={shareOnWhatsApp} className="h-14 w-14 rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600 flex items-center justify-center p-0">
                         <MessageCircle size={22} />
                      </Button>
                   </div>
                </div>
             </div>

             <div className="relative">
                <div className="aspect-square bg-blue-600 rounded-[4rem] flex items-center justify-center perspective-1000 rotate-3 overflow-hidden shadow-2xl">
                   <motion.div 
                     animate={{ rotate: [0, 5, 0] }} 
                     transition={{ repeat: Infinity, duration: 5 }}
                     className="text-[200px] text-white/10 font-black italic tracking-tighter select-none"
                   >
                     ₹100
                   </motion.div>
                   <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                </div>
             </div>
          </div>

          {/* STATS BAR */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <Card className="p-8 border-0 bg-white shadow-sm space-y-2">
                <div className="p-3 bg-emerald-50 text-emerald-600 w-fit rounded-xl mb-4">
                   <TrendingUp size={24} />
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Earned</div>
                <div className="text-4xl font-black text-slate-900 italic">₹{data.stats.totalEarned.toLocaleString()}</div>
             </Card>
             <Card className="p-8 border-0 bg-white shadow-sm space-y-2">
                <div className="p-3 bg-blue-50 text-blue-600 w-fit rounded-xl mb-4">
                   <Users size={24} />
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Successful Referrals</div>
                <div className="text-4xl font-black text-slate-900 italic">{data.stats.completed}</div>
             </Card>
             <Card className="p-8 border-0 bg-white shadow-sm space-y-2">
                <div className="p-3 bg-amber-50 text-amber-600 w-fit rounded-xl mb-4">
                   <Share2 size={24} />
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Signups</div>
                <div className="text-4xl font-black text-slate-900 italic">{data.stats.pending}</div>
             </Card>
          </div>

          {/* TABLE OF INVITES */}
          <div className="space-y-6">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Referred Squad</h3>
                <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">How it works?</button>
             </div>

             <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                   <thead>
                      <tr className="border-b border-slate-50">
                         <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invitee</th>
                         <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                         <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reward</th>
                         <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tier</th>
                         <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {data.invites.map((invite: any) => (
                         <tr key={invite._id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="px-10 py-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${invite.referredUserId.name}`} alt="user" />
                                  </div>
                                  <div className="font-bold text-slate-900 text-sm italic">{invite.referredUserId.name}</div>
                               </div>
                            </td>
                            <td className="px-10 py-6">
                               <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${invite.status === 'rewarded' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                  {invite.status}
                               </span>
                            </td>
                            <td className="px-10 py-6">
                               <div className="text-sm font-black text-slate-900 tracking-tight">₹{invite.status === 'rewarded' ? '100.00' : '0.00'}</div>
                            </td>
                            <td className="px-10 py-6">
                               <div className="text-[10px] font-bold text-slate-400 uppercase">Lvl {invite.tier}</div>
                            </td>
                            <td className="px-10 py-6 text-right">
                               <button className="text-slate-200 group-hover:text-blue-600 transition-colors">
                                  <ArrowRight size={18} />
                               </button>
                            </td>
                         </tr>
                      ))}
                      {data.invites.length === 0 && (
                         <tr>
                            <td colSpan={5} className="px-10 py-20 text-center font-black text-slate-300 uppercase tracking-widest text-[10px]">Your squad is empty. Start inviting today!</td>
                         </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>

          <Card className="p-12 border-0 bg-slate-900 text-white shadow-2xl relative overflow-hidden flex flex-col items-center text-center space-y-6">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Users size={150} />
             </div>
             <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <TrendingUp size={32} />
             </div>
             <h2 className="text-4xl font-black italic uppercase tracking-tighter">Become a Growth Partner</h2>
             <p className="max-w-xl text-slate-400 font-medium leading-relaxed">Refer 10 active freelancers and unlock the <span className="text-blue-400">Growth Partner Badge</span>. Get 1% recurring share from their platform fees for 6 months.</p>
             <Button variant="outline" className="h-14 px-10 rounded-2xl border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/5 flex items-center gap-3">
                Read Partner Terms <ExternalLink size={16} />
             </Button>
          </Card>

       </div>

    </div>
  );
}
