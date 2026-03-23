'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Clock, Zap, ArrowUpRight, Trophy } from 'lucide-react';
import { jobsAPI } from '../../services/api';
import { Button, Card } from '../ui';

interface Match {
  freelancer: {
    _id: string;
    name: string;
    avatar: string;
    subscriptionStatus: string;
    trustScore: number;
    avgResponseTime: number;
    badge: string;
  };
  matchScore: number;
}

export default function MatchingFreelancers({ jobId }: { jobId: string }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await jobsAPI.getMatches(jobId);
        setMatches(res);
      } catch (err) {
        console.error('Failed to fetch matches', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [jobId]);

  if (loading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-slate-50 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (matches.length === 0) return null;

  return (
    <div className="space-y-6 font-manrope">
      <div className="flex items-center justify-between">
         <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Zap size={20} className="text-blue-600 fill-blue-600" />
            AI Top Matches
         </h3>
         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
            Real-time Analysis
         </span>
      </div>

      <div className="grid gap-4">
        {matches.map((item, index) => (
          <motion.div
            key={item.freelancer._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`group p-6 border-0 relative shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden ${index === 0 ? 'bg-white ring-2 ring-blue-600 shadow-blue-500/10' : 'bg-slate-50/50 hover:bg-white'}`}>
              
              {/* TOP 1 Glow/Badge */}
              {index === 0 && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[8px] font-black px-4 py-1.5 rounded-bl-xl uppercase tracking-widest flex items-center gap-1">
                   <Trophy size={10} /> Best Match
                </div>
              )}

              <div className="flex gap-4">
                {/* Avatar */}
                <div className="relative">
                   <div className="w-16 h-16 rounded-2xl bg-slate-200 overflow-hidden">
                      <img 
                        src={item.freelancer.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.freelancer.name}`} 
                        alt={item.freelancer.name} 
                        className="w-full h-full object-cover"
                      />
                   </div>
                   {item.freelancer.subscriptionStatus === 'pro' && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 border-2 border-white rounded-lg flex items-center justify-center text-white">
                         <Zap size={10} fill="currentColor" />
                      </div>
                   )}
                </div>

                <div className="flex-1 space-y-1">
                   <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                         {item.freelancer.name}
                      </h4>
                      {item.freelancer.badge === 'BharatGig Pro' && (
                         <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">PRO</span>
                      )}
                   </div>

                   {/* Stats Row */}
                   <div className="flex items-center gap-6 pt-1">
                      <div className="flex items-center gap-1.5">
                         <ShieldCheck size={14} className="text-emerald-500" />
                         <span className="text-[10px] font-bold text-slate-500">{item.freelancer.trustScore}% Trust</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                         <Clock size={14} className="text-blue-500" />
                         <span className="text-[10px] font-bold text-slate-500">{item.freelancer.avgResponseTime}m Response</span>
                      </div>
                   </div>
                </div>

                {/* Score Circle */}
                <div className="text-right flex flex-col items-end justify-center">
                   <div className={`text-2xl font-black ${item.matchScore > 80 ? 'text-blue-600' : 'text-slate-900'}`}>{item.matchScore}%</div>
                   <div className="text-[8px] font-black text-slate-400 tracking-widest uppercase">Match</div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                 <div className="text-[10px] font-bold text-slate-400 capitalize">
                    {item.freelancer.subscriptionStatus === 'pro' ? 'Proprietary Boost Active' : 'Standard Ranking'}
                 </div>
                 <Button variant="outline" className="h-8 rounded-xl text-[10px] font-black uppercase group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                    View Profile <ArrowUpRight size={12} className="ml-1" />
                 </Button>
              </div>

              {/* Decorative Background for Index 0 */}
              {index === 0 && (
                <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-blue-600/5 blur-3xl rounded-full" />
              )}
            </Card>
          </motion.div>
        ))}
      </div>
      
      <p className="text-[10px] font-bold text-center text-slate-400 px-4 leading-relaxed">
         Scores are computed based on skill overlap, historical trust metrics, activity recency, and subscription status. 
         <span className="text-blue-600"> Upgrade to Pro</span> to boost your visibility by 15% here.
      </p>
    </div>
  );
}
