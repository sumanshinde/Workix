'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { 
  ShieldCheck, Zap, Star, Trophy, ArrowRight, CheckCircle2, 
  MessageCircle, Info, Gavel, Scale, Sparkles
} from 'lucide-react';
import { shortlistsAPI } from '../../../services/api';
import { Button, Card, Skeleton } from '../../../components/ui';

export default function ShortlistPage() {
  const { id } = useParams();
  const router = useRouter();
  const [shortlist, setShortlist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hiring, setHiring] = useState(false);

  useEffect(() => {
    const fetchShortlist = async () => {
       try {
          const res = await shortlistsAPI.get(id as string);
          setShortlist(res);
       } catch (err) {
          console.error(err);
       } finally {
          setLoading(false);
       }
    };
    fetchShortlist();
  }, [id]);

  const handleApprove = async (freelancerUserId: string) => {
    if (!confirm('Hire this expert and activate the contract?')) return;
    setHiring(true);
    try {
       await shortlistsAPI.approve(id as string, freelancerUserId);
       alert('Hire finalized! Welcome to BharatGig Enterprise.');
       router.push('/dashboard');
    } catch (err) {
       alert('Hiring failed');
    } finally {
       setHiring(false);
    }
  };

  if (loading) return <div className="p-12 space-y-8"><Skeleton className="h-20 w-full rounded-2xl" /><Skeleton className="h-96 w-full rounded-3xl" /></div>;

  if (!shortlist) return <div className="h-screen flex items-center justify-center font-black uppercase text-slate-300">Shortlist Expired.</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-manrope selection:bg-rose-100 selection:text-rose-600">
       
       <div className="p-8 md:p-12 lg:p-24 max-w-7xl mx-auto space-y-16">
          
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
             <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-sm">
                   <ShieldCheck size={14} /> Official Shortlist
                </div>
                <h1 className="text-6xl font-black text-slate-900 tracking-tighter italic uppercase leading-[0.85]">
                   HAND-PICKED <br />
                   <span className="text-rose-600">EXPERTS</span> FOR YOU.
                </h1>
                <p className="text-lg font-medium text-slate-500 max-w-xl italic">
                   Prepared for {shortlist.leadId?.name} ({shortlist.leadId?.company}). <br />
                   These experts have been manually verified by our Growth Team for your specific project.
                </p>
             </div>
             <Card className="p-8 bg-slate-900 text-white rounded-[2.5rem] border-0 shadow-2xl space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={100} /></div>
                <div className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Platform Note</div>
                <p className="text-sm font-medium italic text-slate-300 leading-relaxed">
                   "{shortlist.notes}"
                </p>
             </Card>
          </div>

          {/* GRID OF EXPERTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             {shortlist.freelancers.map((item: any, i: number) => (
                <motion.div 
                   key={item.userId?._id}
                   initial={{ opacity: 0, y: 30 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                >
                   <Card className={`group p-8 md:p-12 bg-white rounded-[4rem] border-0 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all relative overflow-hidden ${i === 0 ? 'ring-4 ring-rose-500/10 border-2 border-rose-500/20' : ''}`}>
                      {i === 0 && (
                         <div className="absolute top-0 right-0 px-8 py-3 bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest rounded-bl-[2rem] shadow-xl">
                            Elite Choice
                         </div>
                      )}

                      <div className="space-y-10">
                         <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-[2.5rem] bg-slate-100 overflow-hidden shadow-inner flex items-center justify-center">
                               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.userId?.name}`} alt="avatar" />
                            </div>
                            <div className="space-y-1">
                               <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter">{item.userId?.name}</h3>
                               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.userId?.role}</div>
                               <div className="flex items-center gap-2 pt-2">
                                  <div className="flex gap-0.5">
                                     {[1,2,3,4,5].map(s => <Star key={s} size={10} fill="#f59e0b" className="text-amber-500" />)}
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.userId?.trustScore}% Trust Score</span>
                               </div>
                            </div>
                         </div>

                         <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-50 space-y-4">
                            <div className="flex items-center gap-2 text-rose-600 font-black text-[10px] uppercase tracking-widest">
                               <Sparkles size={14} /> AI Relevance Match
                            </div>
                            <p className="text-sm font-medium italic text-slate-500 leading-relaxed italic">
                               "{item.relevanceNote}"
                            </p>
                            <div className="text-3xl font-black text-slate-900 italic tracking-tighter">
                               {item.matchScore}% Match
                            </div>
                         </div>

                         <div className="flex flex-wrap gap-2">
                            {item.userId?.skills?.slice(0, 4).map((skill: string) => (
                               <span key={skill} className="px-5 py-2 bg-slate-100/50 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400">
                                  {skill}
                               </span>
                            ))}
                         </div>

                         <div className="flex gap-4">
                            <Button 
                               onClick={() => handleApprove(item.userId?._id)}
                               isLoading={hiring}
                               className={`flex-1 h-16 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${i === 0 ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20' : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10'}`}
                            >
                               Hire This Expert <ArrowRight size={16} className="ml-2" />
                            </Button>
                            <Button variant="outline" className="h-16 px-6 border-2 border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900">
                               <MessageCircle size={20} />
                            </Button>
                         </div>
                      </div>
                   </Card>
                </motion.div>
             ))}
          </div>

          {/* HELP FOOTER */}
          <div className="pt-20 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-10">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-600 shadow-sm ring-1 ring-slate-100">
                   <Info size={24} />
                </div>
                <div className="space-y-1">
                   <div className="text-sm font-black text-slate-900 uppercase italic">Dedicated Manager Assigned</div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Need custom adjustments? Request a sync via chat.</div>
                </div>
             </div>
             <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 border-2 border-transparent hover:border-rose-100 rounded-2xl h-14 px-8">
                Request Change in Shortlist
             </Button>
          </div>

       </div>

    </div>
  );
}
