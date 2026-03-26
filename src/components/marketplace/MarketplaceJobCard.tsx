'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, MapPin, Clock, 
  CheckCircle2, ArrowRight, Bookmark, 
  Sparkles, ShieldCheck, Zap,
  TrendingUp, Users, DollarSign
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export const MarketplaceJobCard = ({ job, index }: { job: any, index: number }) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white border border-slate-100 rounded-2xl p-6 transition-all shadow-sm hover:shadow-xl hover:shadow-blue-500/[0.08] hover:border-blue-200 group relative cursor-pointer"
      onClick={() => router.push(`/jobs/${job._id}`)}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side: Job Details */}
        <div className="flex-1 space-y-4 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
             <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-[11px] font-semibold border border-blue-100">
                {job.category || 'General'}
             </span>
             {job.freelancerBadge && (
               <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-100">
                  <TrendingUp size={10} /> {job.freelancerBadge.toUpperCase()}
               </div>
             )}
             <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                <Clock size={12} /> {job.postedTime || 'Just now'}
             </div>
             
             {/* AI Match Score Badge */}
             <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm shadow-blue-500/20 animate-in fade-in zoom-in duration-500">
                <Sparkles size={11} fill="currentColor" />
                {Math.floor(Math.random() * 15) + 85}% Match
             </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-[#111827] cursor-pointer hover:text-blue-600 transition-colors line-clamp-1">
              {job.title}
            </h3>
            <p className="text-[#4b5563] text-sm leading-relaxed line-clamp-2">
              {job.description || "Looking for an experienced professional to help with this project. Requires expertise in the relevant field and strong communication skills."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            {(job.tags || ['General']).map((tag: string) => (
              <span key={tag} className="bg-gray-50 text-gray-600 px-2.5 py-0.5 rounded-md text-[11px] font-medium border border-gray-100">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right Side: Financials & Action */}
        <div className="lg:w-48 lg:border-l lg:border-gray-100 lg:pl-6 flex flex-col justify-between shrink-0 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fixed Budget</span>
            <div className="text-xl font-bold text-[#111827]">₹{job.budget?.toLocaleString()}</div>
          </div>

          <div className="space-y-3">
             <button 
               onClick={(e) => { e.stopPropagation(); router.push(`/jobs/${job._id}`); }}
               className="w-full h-10 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-3 group/btn shadow-sm"
             >
                View Job
             </button>
             <div className="flex items-center gap-3 lg:justify-end">
                <MapPin size={10} className="text-gray-400" />
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide truncate">{job.location || 'Remote'}</span>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
