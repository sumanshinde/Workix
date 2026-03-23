'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowUpRight, Megaphone, Target, ExternalLink } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export function AdsSidebar() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between px-2">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
             <Megaphone size={12} /> Strategic Promotions
          </h4>
          <span className="text-[8px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase">Sponsored</span>
       </div>

       <div className="space-y-4">
          {[
            { title: 'Nexus Enterprise Pro', desc: 'Secure the first 50 slots for the elite SaaS infrastructure mission.', color: 'border-blue-500', bg: 'bg-blue-600', icon: <Target size={14} /> },
            { title: 'Cloud Logic Airdrop', desc: 'Free cloud credits for the first 100 freelancers who verify KYC this week.', color: 'border-rose-500', bg: 'bg-rose-600', icon: <Zap size={14} /> }
          ].map((ad, i) => (
             <Card key={i} className={`p-6 bg-white border-l-4 ${ad.color} shadow-sm hover:shadow-lg hover:translate-y-[-2px] transition-all cursor-pointer relative overflow-hidden group`}>
                <div className={`absolute top-0 right-0 p-4 opacity-5 ${ad.bg} text-white rounded-bl-3xl translate-x-1 translate-y-[-1] transition-transform group-hover:scale-110`}>
                   {ad.icon}
                </div>
                <h5 className="font-black text-slate-900 uppercase italic text-xs tracking-tight mb-2 group-hover:text-blue-600 transition-colors">{ad.title}</h5>
                <p className="text-[10px] font-medium text-slate-500 leading-relaxed italic">{ad.desc}</p>
                <div className="mt-4 flex items-center text-[8px] font-black text-blue-600 uppercase tracking-widest">
                   Apply Mission <ArrowUpRight size={10} className="ml-1" />
                </div>
             </Card>
          ))}
       </div>

       <Button variant="outline" className="w-full h-12 rounded-2xl border-2 border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 hover:text-slate-900 transition-all">
          Launch Your Own Ad <ExternalLink size={12} className="ml-2" />
       </Button>
    </div>
  );
}

export function FeaturedAdBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full p-10 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden"
    >
       <div className="absolute top-0 right-0 h-full w-[40%] bg-white/5 skew-x-[-20deg] translate-x-20" />
       
       <div className="space-y-4 relative z-10 max-w-xl">
          <div className="px-4 py-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-[9px] font-black uppercase tracking-widest w-fit">Featured Opportunity</div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">The 2026 Developer <br /> <span className="text-blue-300">Aura Summit.</span></h2>
          <p className="text-sm font-medium text-white/50 leading-relaxed italic">Direct pitch your high-end solutions to Series-C investors. 0% Commission on wins for the first 3 months.</p>
       </div>

       <div className="relative z-10">
          <Button className="h-16 px-12 bg-white text-blue-800 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-300 shadow-2xl shadow-blue-900/40">
             Register Intent Now
          </Button>
       </div>
    </motion.div>
  );
}
