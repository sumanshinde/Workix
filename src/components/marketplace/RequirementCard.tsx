'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap, MapPin, IndianRupee, Clock,
  CheckCircle2, Sparkles, Image as ImageIcon,
  MessageSquare, User, Rocket, Info
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export const RequirementCard = ({ post, index }: { post: any, index: number }) => {
  const router = useRouter();

  const isBoosted = post.isBoosted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => router.push(`/requirements/${post._id}`)}
      className={`relative bg-white rounded-[32px] overflow-hidden transition-all duration-500 border-2 group cursor-pointer ${
        isBoosted 
          ? 'border-blue-500 shadow-xl shadow-blue-500/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20' 
          : 'border-slate-50 hover:border-slate-200 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/40'
      }`}
    >
      {isBoosted && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 py-1.5 px-4 flex items-center justify-between">
           <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1.5">
             <Rocket size={12} fill="white" /> Featured High Priority
           </span>
           <span className="text-[9px] font-bold text-white/80 uppercase tracking-widest">Active Ad Cluster</span>
        </div>
      )}

      <div className={`p-8 ${isBoosted ? 'pt-12' : ''} space-y-6`}>
        {/* Header: Cat + Time */}
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-slate-100">
                {post.category}
              </span>
              {isBoosted && (
                <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest border border-blue-100">
                  ⚡ 5x Reach
                </span>
              )}
           </div>
           <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Clock size={12} /> {new Date(post.createdAt).toLocaleDateString()}
           </div>
        </div>

        {/* Content Section */}
        <div className="flex gap-6">
           {post.image && (
             <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-100 shrink-0 bg-slate-50">
               <img src={post.image} alt="prev" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
             </div>
           )}
           <div className="space-y-2 min-w-0 flex-1">
              <h3 className="text-xl font-extrabold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors tracking-tight">
                {post.title}
              </h3>
              <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
                {post.description}
              </p>
           </div>
        </div>

        {/* Features/Requirements */}
        {post.features && post.features.length > 0 && (
           <div className="flex flex-wrap gap-2">
              {post.features.slice(0, 3).map((f: string) => (
                <span key={f} className="text-[11px] font-bold text-slate-600 bg-slate-50/50 border border-slate-100 px-2.5 py-1 rounded-lg">
                   {f}
                </span>
              ))}
              {post.features.length > 3 && (
                <span className="text-[10px] font-bold text-slate-400 py-1">+{post.features.length - 3} more</span>
              )}
           </div>
        )}

        {/* Footer: User + Location + Budget */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                 {post.userId?.name?.[0]?.toUpperCase() || <User size={16} />}
              </div>
              <div>
                 <p className="text-xs font-extrabold text-slate-800 tracking-tight leading-none mb-1">{post.userId?.name || 'Client'}</p>
                 <div className="flex items-center gap-1">
                    <MapPin size={10} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.city || 'Remote'}</span>
                 </div>
              </div>
           </div>
           
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Max Budget</p>
              <p className="text-xl font-black text-emerald-600">₹{post.budget?.toLocaleString()}</p>
           </div>
        </div>
      </div>
    </motion.div>
  );
};
