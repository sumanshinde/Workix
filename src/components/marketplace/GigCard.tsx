'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Clock, Heart, ArrowRight, CheckCircle, ShieldCheck, Zap } from 'lucide-react';
import { Gig } from '@/types';
import { useRouter } from 'next/navigation';
import { BRANDING } from '@/lib/config';

export const GigCard = ({ gig, index }: { gig: Gig, index: number }) => {
  const router = useRouter();
  const t = BRANDING.theme;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      style={{ 
        backgroundColor: t.surface, 
        borderColor: t.border,
        boxShadow: `0 4px 6px -1px rgba(0,0,0,0.02)`
      }}
      className="border rounded-lg group cursor-pointer overflow-hidden transition-all duration-300 hover:border-blue-500 hover:shadow-sm hover:shadow-blue-500/5"
      onClick={() => router.push(`/gigs/${gig._id}`)}
    >
      {/* COMPACT IMAGE CONTAINER */}
      <div className="relative h-44 w-full overflow-hidden p-1.5">
        <div className="absolute inset-0 m-1.5 rounded-xl overflow-hidden">
          {gig.image ? (
            <Image 
              src={gig.image} 
              alt={gig.title} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div style={{ background: `linear-gradient(135deg, ${t.surfaceElevated}, ${t.border})` }} className="w-full h-full flex flex-col items-center justify-center p-4">
               <Zap size={24} className="text-slate-300" />
            </div>
          )}
        </div>
        
        {/* OVERLAYS */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none">
           <span className="bg-white/95 text-slate-900 text-[8px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-lg border border-slate-100 shadow-sm">
              {gig.category}
           </span>
           <button className="pointer-events-auto w-8 h-8 bg-white/95 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all border border-slate-100 shadow-sm active:scale-95">
              <Heart size={14} />
           </button>
        </div>

        {gig.badge && (
          <div className="absolute bottom-4 left-4">
             <div 
               style={{ backgroundColor: t.primary }}
               className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg shadow-sm shadow-blue-500/20"
             >
                <ShieldCheck size={10} className="text-white fill-white/20" />
                <span className="text-[8px] font-bold text-white uppercase tracking-widest">{gig.badge}</span>
             </div>
          </div>
        )}
      </div>

      <div className="p-5 pt-1">
         {/* AUTHOR NODE */}
         <div className="flex items-center gap-3 mb-3">
            <div className="relative w-6 h-6 rounded-md overflow-hidden border border-slate-50 shadow-inner">
               <Image src={gig.userId?.avatar || `https://ui-avatars.com/api/?name=${gig.userId?.name}`} alt="Avatar" fill />
            </div>
            <div className="flex items-center gap-1">
               <span style={{ color: t.textPrimary }} className="text-[10px] font-bold hover:text-blue-600 transition-colors uppercase truncate max-w-[100px]">{gig.userId?.name}</span>
               <CheckCircle size={10} className="text-blue-500" />
            </div>
         </div>

         {/* COMPACT TITLE */}
         <h3 style={{ color: t.textPrimary }} className="text-[15px] font-bold leading-tight mb-4 line-clamp-2 h-[40px] tracking-tight uppercase group-hover:text-blue-600 transition-colors">
            {gig.title}
         </h3>

         {/* SPECS ROW */}
         <div style={{ borderColor: t.border }} className="flex items-center justify-between mb-4 pb-4 border-b border-dashed">
            <div className="flex items-center gap-1">
               <Star size={14} fill="#F59E0B" color="#F59E0B" />
               <span style={{ color: t.textPrimary }} className="text-[11px] font-bold">{gig.rating || 5.0}</span>
               <span style={{ color: t.textMuted }} className="text-[8px] font-bold uppercase tracking-widest ml-0.5 opacity-60">({gig.reviews || 0})</span>
            </div>
            <div style={{ color: t.textMuted }} className="flex items-center gap-1">
               <Clock size={12} className="opacity-40" />
               <span className="text-[8px] font-bold uppercase tracking-widest opacity-40">Priority Node</span>
            </div>
         </div>

         {/* TRANSACTION ROW */}
         <div className="flex items-center justify-between">
            <div>
               <p style={{ color: t.textMuted }} className="text-[8px] font-bold uppercase tracking-widest mb-0.5 opacity-50">Liquidity Hub</p>
               <h4 style={{ color: t.textPrimary }} className="text-xl font-bold tracking-tight uppercase">₹{gig.price.toLocaleString()}</h4>
            </div>
            <button 
              style={{ backgroundColor: '#F8FAFC', borderColor: t.border }}
              className="flex items-center justify-center w-10 h-10-lg hover:border-blue-600 rounded-xl transition-all group/btn active:scale-95 shadow-sm"
            >
               <ArrowRight size={18} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
         </div>
      </div>
    </motion.div>
  );
};
