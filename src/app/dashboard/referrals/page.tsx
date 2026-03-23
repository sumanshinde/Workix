'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Gift, Copy, Check, Share2,  
  IndianRupee, MessageCircle, Clock, CheckCircle2
} from 'lucide-react';

export default function ReferralDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock user for testing UI
    const fetchStats = async () => {
      setTimeout(() => {
        setStats({
          code: "BHARAT-ADITYA",
          totalReferrals: 0, // Mocked to 0 to showcase the visually pleasing empty state illustrations
          successful: 0,
          pending: 0,
          totalEarned: 0,
          history: [] // Left empty to verify the clean zero-state graphic rendering
        });
        setLoading(false);
      }, 600);
    };
    fetchStats();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://bharatgig.com/register?ref=${stats?.code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = `https://bharatgig.com/register?ref=${stats?.code}`;

  const shareWA = () => {
    window.open(`https://wa.me/?text=Hey! Join me on BharatGig. Use my code ${stats?.code} to get extra credits on your first project! ${shareLink}`, '_blank');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center p-12 bg-[#f8fafc]">
      <div className="flex items-center gap-3 text-blue-600 font-medium animate-pulse">
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        Loading rewards...
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f8fafc] selection:bg-blue-100 selection:text-blue-600">
      <div className="max-w-7xl mx-auto space-y-10 p-6 md:p-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* ── Left Column: Hero & Referral Card ── */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Hero Section */}
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight leading-tight">
                Invite friends, earn <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 drop-shadow-sm animate-pulse scale-105 origin-left tracking-wide">₹500</span>
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed font-medium">
                Share the BharatGig experience. Empower your professional circle and get rewarded instantly for every successful referral.
              </p>
            </div>

            {/* Main Referral Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-white p-7 md:p-8 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-indigo-50/40 opacity-70 z-0"></div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Your unique referral link</h3>
                <p className="text-sm text-slate-500 mb-8 font-medium">Copy this link or share directly with your network to start earning.</p>

                <div className="flex flex-col gap-5 mb-8">
                  <div className="relative w-full">
                    <input 
                      type="text" 
                      readOnly 
                      value={shareLink}
                      className="w-full h-14 bg-white/90 border border-slate-200 rounded-2xl pl-5 pr-32 text-slate-700 font-semibold text-[15px] focus:outline-none focus:ring-4 focus:ring-blue-500/15 transition-shadow shadow-sm"
                    />
                    <button 
                      onClick={copyToClipboard}
                      className="absolute right-1.5 top-1.5 bottom-1.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg shadow-blue-500/25"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={copyToClipboard}
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-500/25"
                  >
                    <Share2 size={18} fill="currentColor" className="opacity-80" />
                    Share & Earn ₹500
                  </button>
                  <button 
                    onClick={shareWA}
                    className="flex-1 h-12 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#25D366]/25"
                  >
                    <MessageCircle size={18} fill="currentColor" className="opacity-80" />
                    Share on WhatsApp
                  </button>
                </div>
              </div>
            </div>

            {/* Referral Activity Section */}
            <div className="pt-4">
              <h3 className="text-lg font-bold text-slate-900 mb-5">Referral Activity</h3>
              <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-2 min-h-[250px] flex flex-col justify-center transition-shadow hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                {stats?.history?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-50">
                          <th className="p-4 pl-6">User</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Joined</th>
                          <th className="p-4 pr-6">Reward</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {stats.history.map((row: any) => (
                          <tr key={row.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 pl-6 font-semibold text-slate-900 text-sm">{row.name}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center w-max gap-1.5 ${
                                row.status === 'rewarded' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                              }`}>
                                {row.status === 'rewarded' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                {row.status}
                              </span>
                            </td>
                            <td className="p-4 text-xs font-medium text-slate-400">{row.date}</td>
                            <td className="p-4 pr-6 font-bold text-slate-900 text-sm">{row.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-14 px-6 text-center flex flex-col items-center justify-center">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[20px] flex items-center justify-center mb-5 border border-blue-100/50 shadow-inner"
                    >
                      <Users size={36} className="text-blue-600" />
                    </motion.div>
                    <h4 className="text-slate-900 font-extrabold text-lg mb-2">No referrals yet</h4>
                    <p className="text-slate-500 text-[15px] max-w-sm font-medium leading-relaxed">
                      Start earning by inviting your first friend. They get access to premium tools, and you earn <span className="font-bold text-slate-700">₹500!</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
            
          </div>

          {/* ── Right Column: Stats & Checklist ── */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-4">
              <StatItem 
                icon={<IndianRupee size={18} className="text-blue-600" />} 
                label="Total Earnings" 
                value={`₹${stats?.totalEarned.toLocaleString()}`} 
                bg="bg-blue-50/50 text-blue-600"
              />
              <StatItem 
                icon={<Users size={18} className="text-emerald-600" />} 
                label="Successful" 
                value={stats?.successful} 
                bg="bg-emerald-50/50 text-emerald-600"
              />
              <StatItem 
                icon={<Clock size={18} className="text-orange-500" />} 
                label="Pending" 
                value={stats?.pending} 
                bg="bg-orange-50/50 text-orange-500"
              />
            </div>

            {/* Checklist UI / How It Works */}
            <div className="bg-white rounded-[24px] p-7 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden group hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300">
              <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-2xl z-0 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <h3 className="text-slate-900 font-extrabold mb-7 flex items-center gap-3 text-base">
                  <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center border border-blue-100/50 shadow-sm">
                    <Gift size={20} className="text-blue-600" />
                  </span>
                  System Tips
                </h3>
                <div className="space-y-6">
                  <ChecklistItem 
                    number="1" 
                    title="Share your link" 
                    desc="Send your unique link to professional friends." 
                  />
                  <ChecklistItem 
                    number="2" 
                    title="They join & work" 
                    desc="They sign up and complete their first project." 
                  />
                  <ChecklistItem 
                    number="3" 
                    title="Earn ₹500" 
                    desc="₹500 is credited to your wallet instantly." 
                    isLast
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shared Subcomponents ──

function StatItem({ icon, label, value, bg }: any) {
  return (
    <div className="bg-slate-50/40 rounded-[20px] p-6 border border-slate-100 hover:-translate-y-1 transition-transform duration-300 flex items-center gap-5 group hover:bg-white hover:shadow-xl hover:shadow-slate-200/40">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-white transition-colors duration-300 ${bg}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1">{label}</p>
        <p className="text-[28px] font-extrabold text-slate-900 tracking-tight leading-none">{value}</p>
      </div>
    </div>
  );
}

function ChecklistItem({ number, title, desc, isLast }: any) {
  return (
    <div className="flex gap-5 relative">
      {!isLast && (
        <div className="absolute left-4 top-8 bottom-[-16px] w-[2px] bg-slate-100 rounded-full"></div>
      )}
      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-[13px] flex items-center justify-center font-bold shrink-0 mt-0.5 border border-blue-200 z-10 shadow-sm shadow-blue-100">
        {number}
      </div>
      <div>
        <p className="text-slate-900 text-[15px] font-bold mb-1 tracking-tight">{title}</p>
        <p className="text-slate-500 text-[13px] font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
