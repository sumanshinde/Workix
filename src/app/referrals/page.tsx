'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, Gift, 
  Copy, Check, Share2, 
  TrendingUp, Wallet, ArrowRight,
  ShieldCheck, Zap, Sparkles, Globe
} from 'lucide-react';
import { Card, Button, Skeleton } from '@/components/ui';
import { referralAPI } from '@/services/api';

export default function ReferralDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      fetchStats(parsed.id || parsed._id);
    }
  }, []);

  const fetchStats = async (userId: string) => {
    try {
      if (!userId) return;
      const data = await referralAPI.getStats(userId);
      setStats(data);
    } catch (err) {
      console.error('Referral Fetch Failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const link = `https://bharatgig.com/register?ref=${stats?.code || ''}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto p-10 space-y-10">
       <Skeleton height={200} />
       <div className="grid grid-cols-3 gap-6">
          <Skeleton height={150} />
          <Skeleton height={150} />
          <Skeleton height={150} />
       </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-12 pb-24 selection:bg-blue-100 selection:text-blue-600">
      
      {/* ── Header ── */}
      <div className="text-center space-y-4">
         <h1 className="text-5xl font-semibold text-[#111827] tracking-tight">Refer friends & <br/><span className="text-blue-600">earn ₹500</span> for each signup</h1>
         <p className="max-w-xl mx-auto text-sm text-gray-500 font-medium">Invite your friends and earn ₹500 when they complete their first project.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         
         {/* ── LEFT: REWARDS ENGINE ── */}
         <div className="lg:col-span-8 space-y-10">
            
            {/* Invite Card */}
            <Card className="p-10 border-blue-100 from-white rounded-[40px] shadow-sm shadow-blue-500/5 relative overflow-hidden group">
               
               
               <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="w-16 bg-blue-600 text-white rounded-[24px] flex items-center justify-center shadow-sm shadow-blue-500/20">
                        <Gift size={32} />
                     </div>
                     <div>
                        <h2 className="text-2xl font-bold text-[#111827]">Your Referral Link</h2>
                        <p className="text-sm text-gray-400 font-medium tracking-tight">Share your link to invite new professionals.</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Universal Invitation Link</label>
                     <div className="flex gap-4">
                        <div className="flex-1 bg-white border border-gray-100 rounded-lg flex items-center justify-between shadow-sm group-focus-within:border-blue-500 transition-all">
                           <span className="text-sm font-bold text-gray-900 truncate">https://bharatgig.com/register?ref={stats?.code || 'YOUR_CODE'}</span>
                           <Globe size={16} className="text-gray-300" />
                        </div>
                        <button 
                          onClick={copyToClipboard}
                          className="bg-blue-600 text-white rounded-lg font-bold shadow-sm shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-3"
                        >
                           {copied ? <Check size={20} /> : <Copy size={20} />}
                           {copied ? 'Copied' : 'Copy'}
                        </button>
                     </div>
                  </div>
               </div>
            </Card>

            {/* History Table */}
            <Card className="p-10 rounded-[40px] border-gray-100 shadow-sm">
               <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xl font-bold text-[#111827]">Referral Activity</h3>
                  <div className="flex items-center gap-3 text-blue-600 font-bold text-xs uppercase tracking-widest">
                     <Users size={14} /> {stats?.totalReferrals || 0} Network Hits
                  </div>
               </div>

               {stats?.history?.length > 0 ? (
                 <div className="divide-y divide-gray-50">
                    {stats.history.map((item: any) => (
                      <div key={item._id} className="py-6 flex items-center justify-between group hover:bg-gray-50/50 px-4 -mx-4 rounded-lg transition-all">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                               <User size={20} />
                            </div>
                            <div>
                               <h4 className="font-bold text-gray-900">{item.referredUserId?.name || 'New Member'}</h4>
                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(item.createdAt).toLocaleDateString()}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border uppercase tracking-widest ${
                               item.status === 'rewarded' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                               item.status === 'pending' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                               'bg-gray-50 border-gray-100 text-gray-400'
                            }`}>
                               {item.status}
                            </span>
                            {item.rewardAmount > 0 && (
                              <div className="text-sm font-bold text-emerald-600 mt-1">+₹{item.rewardAmount / 100}</div>
                            )}
                         </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="py-20 flex flex-col items-center justify-center space-y-6">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center opacity-50">
                       <Users size={32} className="text-gray-300" />
                    </div>
                    <p className="text-base text-gray-900 font-bold">Invite your first friend to start earning</p>
                    <a 
                      href={`https://wa.me/?text=${encodeURIComponent(`Join BharatGig and get premium freelance jobs. Sign up here: https://bharatgig.com/register?ref=${stats?.code || ''}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-3 shadow-sm shadow-emerald-500/20 hover:bg-emerald-600 active:scale-95 transition-all"
                    >
                       <Share2 size={18} /> Share on WhatsApp
                    </a>
                 </div>
               )}
            </Card>

         </div>

         {/* ── RIGHT: STATS ── */}
         <div className="lg:col-span-4 space-y-6">
            
            <Card className="p-8 bg-[#111827] text-white border-transparent rounded-[40px] shadow-sm shadow-blue-900/10 group overflow-hidden relative">
               
               <div className="relative z-10 space-y-6">
                  <div className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em]">Liquid Earnings</div>
                  <div className="text-5xl font-bold tracking-tight">₹{stats?.totalEarned || 0}</div>
                  <div className="h-px w-full bg-white/10" />
                  <p className="text-xs text-blue-100/50 leading-relaxed font-medium">Automatic payout to your wallet once milestones are cleared.</p>
                  <Button className="w-full bg-white text-gray-900 hover:bg-blue-50 rounded-lg font-bold">Withdraw to Bank</Button>
               </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
               <Card className="p-6 text-center rounded-[32px] border-gray-100">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stats?.successful || 0}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Successful</div>
               </Card>
               <Card className="p-6 text-center rounded-[32px] border-gray-100">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stats?.pending || 0}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending</div>
               </Card>
            </div>

            <div className="p-10 bg-blue-50/50 border border-blue-100 rounded-[40px] space-y-6">
               <h4 className="font-bold text-gray-900 flex items-center gap-3">
                  <Sparkles size={18} className="text-blue-600" /> System Tips
               </h4>
               <ul className="space-y-4">
                  {[
                    'Share on LinkedIn for 3x reach',
                    'Invite former colleagues',
                    'Group referrals get premium badges'
                  ].map((tip, i) => (
                    <li key={i} className="flex gap-3 text-xs text-gray-500 font-medium items-start">
                       <Check size={14} className="text-blue-600 mt-0.5" /> {tip}
                    </li>
                  ))}
               </ul>
            </div>

         </div>

      </div>

    </div>
  );
}

function User({ size, className }: { size: number, className?: string }) {
  return (
    <Users size={size} className={className} />
  );
}
