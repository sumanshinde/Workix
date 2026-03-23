'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Info, Lock, Crown, Award, CheckCircle2, Zap } from 'lucide-react';
import { profileAPI } from '../../services/api';
import { Card, Skeleton } from '../ui';

export default function CreditScoreCard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await profileAPI.getCreditScore();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
  }, []);

  if (loading) return <Skeleton className="h-80 w-full rounded-3xl" />;
  if (!data) return null;

  const getLevelColor = (level: string) => {
    switch (level) {
       case 'Platinum': return 'from-indigo-500 to-purple-600';
       case 'Gold': return 'from-amber-400 to-orange-500';
       case 'Silver': return 'from-slate-300 to-slate-400';
       default: return 'from-rose-500 to-rose-600';
    }
  };

  return (
    <Card className={`p-8 border-0 bg-gradient-to-br ${getLevelColor(data.level)} text-white relative overflow-hidden shadow-2xl`}>
       <div className="absolute -top-10 -right-10 opacity-10">
          <Shield size={200} />
       </div>

       <div className="relative z-10 space-y-8">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Crown size={20} className="text-white/80" />
                <h3 className="text-xl font-black italic tracking-tight">BHARATGIG TRUST SCORE</h3>
             </div>
             <div className="px-5 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest shadow-lg">
                Tier: {data.level}
             </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
             <div className="space-y-2">
                <div className="text-8xl font-black tracking-tighter flex items-baseline gap-2">
                   {data.score}
                   <span className="text-white/40 text-sm font-bold tracking-widest">/ 900</span>
                </div>
                <div className="flex items-center gap-3">
                   <Zap size={16} className="text-white/60" />
                   <p className="text-xs font-bold text-white/80 uppercase tracking-widest">
                      Your status is higher than {Math.round((data.score / 900) * 100)}% of freelancers.
                   </p>
                </div>
             </div>

             <div className="space-y-4 max-w-xs">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 underline underline-offset-4 decoration-white/20 mb-4">Unlocking Privileges:</h4>
                <div className="space-y-3">
                   {data.benefits?.map((benefit: string, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                         <CheckCircle2 size={16} className="text-emerald-300" />
                         <span className="text-sm font-black italic uppercase tracking-tight text-white">{benefit}</span>
                      </div>
                   ))}
                   {!data.benefits?.length && (
                      <p className="text-xs font-bold text-white/40 italic">Improve your score to unlock "Instant Payout" and "Priority Leads".</p>
                   )}
                </div>
             </div>
          </div>

          <div className="p-6 bg-black/10 backdrop-blur-sm rounded-2xl border border-white/10 space-y-3">
             <div className="flex items-center gap-2 text-[10px] font-black text-white/60 uppercase tracking-widest">
                <Info size={14} /> AI Score Reasoning
             </div>
             <p className="text-sm font-medium italic text-white/90 leading-relaxed group hover:text-white transition-colors cursor-default">
                "{data.reasoning}"
             </p>
          </div>
       </div>
    </Card>
  );
}
