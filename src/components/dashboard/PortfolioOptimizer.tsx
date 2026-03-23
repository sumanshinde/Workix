'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2, RefreshCw, Star, Target, DollarSign, Zap } from 'lucide-react';
import { profileAPI } from '../../services/api';
import { Button, Card, Skeleton } from '../ui';

export default function PortfolioOptimizer() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [improving, setImproving] = useState(false);

  const fetchAnalysis = async () => {
    try {
      const res = await profileAPI.getAnalysis();
      setAnalysis(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const handleRewriteBio = async () => {
    setImproving(true);
    try {
      await profileAPI.improve({ action: 'rewrite_bio' });
      await fetchAnalysis();
      alert('Your bio has been rewritten and optimized by AI!');
    } catch (err) {
      alert('Improvement failed');
    } finally {
      setImproving(false);
    }
  };

  if (loading) return <Skeleton className="h-64 w-full rounded-3xl" />;
  if (!analysis) return null;

  const strength = analysis.score > 80 ? 'Strong' : analysis.score > 50 ? 'Good' : 'Weak';
  const strengthColor = strength === 'Strong' ? 'text-emerald-500' : strength === 'Good' ? 'text-blue-500' : 'text-rose-500';

  return (
    <Card className="p-8 border-0 bg-white shadow-xl shadow-slate-200/50 space-y-10 font-manrope">
       
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-1">
             <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-blue-600" />
                <h3 className="text-xl font-bold text-slate-900">Portfolio Optimization</h3>
             </div>
             <p className="text-sm font-medium text-slate-500">AI-driven insights to boost your hiring probability.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <div className="text-4xl font-black text-slate-900 tracking-tighter">
                   {analysis.score}<span className="text-slate-300 text-lg">/100</span>
                </div>
                <div className={`text-[10px] font-black uppercase tracking-widest ${strengthColor}`}>
                   Profile Strength: {strength}
                </div>
             </div>
             <div className="h-14 w-1 bg-slate-100 rounded-full" />
             <div className="w-40 space-y-2">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${analysis.score}%` }} className={`h-full ${strength === 'Strong' ? 'bg-emerald-500' : strength === 'Good' ? 'bg-blue-600' : 'bg-rose-500'}`} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest italic">
                   +22% hiring boost possible
                </p>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
             { label: 'Skills', score: analysis.breakdown?.skills, icon: <Target size={14} />, color: 'text-blue-500' },
             { label: 'Portfolio', score: analysis.breakdown?.portfolio, icon: <TrendingUp size={14} />, color: 'text-emerald-500' },
             { label: 'Trust', score: analysis.breakdown?.trust, icon: <Star size={14} />, color: 'text-amber-500' },
             { label: 'Activity', score: analysis.breakdown?.activity, icon: <Zap size={14} />, color: 'text-purple-500' },
             { label: 'Pricing', score: analysis.breakdown?.pricing, icon: <DollarSign size={14} />, color: 'text-rose-500' }
          ].map(stat => (
             <div key={stat.label} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                   <div className={`${stat.color}`}>{stat.icon}</div>
                   <span className="text-xs font-black text-slate-900">{stat.score}%</span>
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
             </div>
          ))}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 space-y-6">
             <div className="flex items-center gap-2">
                <Target size={18} className="text-slate-400" />
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI IMPROVEMENT PLAN</h4>
             </div>
             <div className="space-y-3">
                {analysis.suggestions?.map((item: string, i: number) => (
                   <div key={i} className="flex items-start gap-4 p-5 bg-white border border-slate-100 rounded-2xl group hover:border-blue-200 transition-all cursor-default shadow-sm">
                      <div className="mt-1 w-5 h-5 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                         <CheckCircle2 size={12} />
                      </div>
                      <p className="text-sm font-medium text-slate-700 leading-relaxed group-hover:text-slate-900">{item}</p>
                   </div>
                ))}
             </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
             <div className="flex items-center gap-2">
                <AlertCircle size={18} className="text-rose-400" />
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">WHY YOU'RE NOT GETTING HIRED</h4>
             </div>
             <div className="space-y-4">
                <div className="space-y-2">
                   {analysis.weakAreas?.map((area: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                         <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                         {area}
                      </div>
                   ))}
                </div>
                
                <div className="pt-6">
                   <Button 
                      onClick={handleRewriteBio}
                      isLoading={improving}
                      className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                   >
                      Rewrite Profile Bio with AI <RefreshCw size={16} />
                   </Button>
                   <p className="text-[9px] font-bold text-slate-400 mt-3 text-center uppercase tracking-widest italic">
                      Boosts visibility by 14.5% instantly.
                   </p>
                </div>
             </div>
          </div>

       </div>
    </Card>
  );
}
