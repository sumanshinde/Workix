'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Gift, Copy, Check, Share2, TrendingUp, 
  ArrowRight, IndianRupee, MessageCircle, Twitter, Linkedin, Clock
} from 'lucide-react';

export default function ReferralDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock user for testing UI
    const fetchStats = async () => {
      // In production: const res = await fetch(`/api/referrals/stats/${user.id}`);
      setTimeout(() => {
        setStats({
          code: "BHARAT-ADITYA",
          totalReferrals: 12,
          successful: 5,
          pending: 7,
          totalEarned: 5000,
          history: [
            { id: 1, name: "Rohan K.", status: "rewarded", date: "2 days ago", amount: "₹1,000" },
            { id: 2, name: "Sneha M.", status: "joined", date: "5 days ago", amount: "Pending" },
            { id: 3, name: "Vikram S.", status: "rewarded", date: "1 week ago", amount: "₹1,000" },
          ]
        });
        setLoading(false);
      }, 800);
    };
    fetchStats();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(stats?.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = `https://bharatgig.com/register?ref=${stats?.code}`;

  const shareWA = () => {
    window.open(`https://wa.me/?text=Hey! Join me on BharatGig, India's premium marketplace for top 3% freelancers. Use my code ${stats?.code} to get extra credits on your first project! ${shareLink}`, '_blank');
  };

  if (loading) return <div className="p-12 text-center text-gray-500 font-medium">Loading your rewards...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Header Card */}
      <div className="bg-blue-600 rounded-lg p-10 md:p-14 relative overflow-hidden shadow-sm shadow-blue-100">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 text-blue-100 font-bold mb-4">
            <Gift size={20} />
            <span className="text-xs uppercase tracking-wider">Refer & Earn Rewards</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Share the BharatGig Experience
          </h1>
          <p className="text-sm text-blue-100 mb-8 leading-relaxed opacity-90">
            Invite your network and earn <span className="text-white font-bold">₹1,000</span> for every successful referral. Empower your professional circle today.
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center bg-white/10 border border-white/20 rounded-xl p-1.5 pl-6">
              <span className="text-white mr-4 font-mono font-bold tracking-wider">{stats?.code}</span>
              <button 
                onClick={copyToClipboard}
                className="bg-white text-blue-600 px-5 py-2.5 rounded-lg transition-all flex items-center gap-3 font-bold text-sm hover:bg-blue-50"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy Code"}
              </button>
            </div>
            <button 
              onClick={shareWA}
              className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-bold flex items-center gap-3 transition-all text-sm shadow-sm shadow-emerald-900/10"
            >
              <MessageCircle size={20} />
              Share on WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatItem icon={<TrendingUp className="text-blue-600" />} label="Total Earned" value={`₹${stats?.totalEarned.toLocaleString()}`} />
        <StatItem icon={<Users className="text-blue-600" />} label="Total Referrals" value={stats?.totalReferrals} />
        <StatItem icon={<Check className="text-emerald-600" />} label="Successful" value={stats?.successful} />
        <StatItem icon={<Clock className="text-gray-500" />} label="Pending Join" value={stats?.pending} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* History Table */}
        <div className="lg:col-span-2 saas-card p-8">
          <h3 className="text-sm font-bold text-[#111827] mb-6">Referral Journey</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-[11px] font-bold uppercase tracking-wider border-b border-gray-50">
                  <th className="pb-4 font-bold">User</th>
                  <th className="pb-4 font-bold">Status</th>
                  <th className="pb-4 font-bold">Joined</th>
                  <th className="pb-4 font-bold">Reward</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats?.history.map((row: any) => (
                  <tr key={row.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-semibold text-[#111827] text-sm">{row.name}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${
                        row.status === 'rewarded' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 text-xs text-gray-400">{row.date}</td>
                    <td className="py-4 font-bold text-gray-900 text-sm">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="saas-card p-8 border-l-4 border-l-blue-600">
            <h4 className="text-[#111827] font-bold mb-4 flex items-center gap-3 text-sm">
              <Gift size={18} className="text-blue-600" />
              How it works
            </h4>
            <div className="space-y-4">
              <Step number="1" text="Share your unique code with professional friends." />
              <Step number="2" text="They sign up and complete their first project." />
              <Step number="3" text="₹1,000 is credited to your wallet instantly." />
            </div>
          </div>

          <div className="saas-card p-8 text-center bg-gray-50/50 border-dashed border-2 border-gray-100">
            <Gift size={32} className="text-blue-600 mx-auto mb-4" />
            <p className="text-gray-500 text-xs font-medium leading-relaxed">Top referrers this month are winning elite rewards. Will you be next?</p>
            <button className="text-blue-600 font-bold mt-4 text-xs flex items-center gap-3 mx-auto hover:gap-3 transition-all">
              View Leaderboard <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ icon, label, value }: any) {
  return (
    <div className="saas-card p-6 flex items-center gap-5">
      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-[#111827] tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function Step({ number, text }: any) {
  return (
    <div className="flex gap-4">
      <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5 border border-blue-100">
        {number}
      </div>
      <p className="text-gray-500 text-xs font-medium leading-relaxed">{text}</p>
    </div>
  );
}
