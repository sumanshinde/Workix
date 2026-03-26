'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Clock, MapPin, IndianRupee, Sparkles, 
  ArrowLeft, CheckCircle2, MessageSquare, 
  Zap, AlertCircle, Image as ImageIcon,
  Rocket, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { requirementsAPI } from '@/services/api';
import { Button, Card, Skeleton } from '@/components/ui';

export default function RequirementDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [responded, setResponded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await requirementsAPI.getById(id as string);
        setPost(data);
      } catch (err) {
        console.error('Failed to fetch requirement:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleRespond = async () => {
    setResponding(true);
    setError('');
    try {
      await requirementsAPI.respond(id as string);
      setResponded(true);
    } catch (err: any) {
      setError(err.message || 'Response failed. Check your wallet balance.');
    } finally {
      setResponding(false);
    }
  };

  if (loading) return (
     <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <Zap className="text-blue-600 animate-pulse" size={32} />
           <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Accessing Cluster...</p>
        </div>
     </div>
  );

  if (!post) return (
     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="max-w-md text-center space-y-8">
           <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto border border-rose-100 shadow-sm">
              <AlertCircle size={32} className="text-rose-500" />
           </div>
           <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Requirement Purged</h2>
              <p className="text-slate-500 font-medium">This opportunity is no longer available in the active marketplace.</p>
           </div>
           <Button onClick={() => router.push('/marketplace')} className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold transition-all hover:shadow-xl">Marketplace Hub</Button>
        </div>
     </div>
  );

  return (
    <div className="min-h-screen bg-[#fafbff] selection:bg-blue-100 selection:text-blue-700">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-[100] bg-white/70 backdrop-blur-2xl border-b border-slate-100 h-20 flex items-center justify-between px-6 lg:px-10">
         <div className="flex items-center gap-6">
            <button onClick={() => router.back()} className="p-2.5 hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-100">
               <ArrowLeft size={20} />
            </button>
            <div className="h-6 w-px bg-slate-100" />
            <div className="flex items-center gap-3">
               <span className="text-sm font-black text-slate-900 tracking-tight truncate max-w-[200px] md:max-w-sm">{post.title}</span>
               {post.isBoosted && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-md border border-blue-100 flex items-center gap-1"><Rocket size={10} fill="currentColor" /> Boosted</span>}
            </div>
         </div>
         <div className="flex items-center gap-4">
            <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50">Share</Button>
         </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* LEFT COLUMN: DETAILS */}
            <div className="lg:col-span-8 space-y-12">
               
               <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-4">
                     <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] shadow-lg shadow-blue-500/20">{post.category}</span>
                     <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border px-3 py-1.5 rounded-full"><Clock size={12} /> Live since {new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-[1.05]">{post.title}</h1>
               </div>

               {post.image && (
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative group">
                    <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-[48px] -z-10 group-hover:bg-blue-600/10 transition-colors" />
                    <div className="bg-white p-4 rounded-[48px] border border-slate-100 shadow-2xl shadow-blue-900/5 aspect-video overflow-hidden">
                       <img src={post.image} alt="prev" className="w-full h-full object-cover rounded-[32px] group-hover:scale-[1.02] transition-transform duration-700" />
                    </div>
                 </motion.div>
               )}

               <div className="space-y-10">
                  <div className="space-y-4">
                     <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Engagement context</h3>
                     <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm leading-[1.8] text-slate-600 font-medium text-lg whitespace-pre-wrap">
                        {post.description}
                     </div>
                  </div>

                  {post.features && post.features.length > 0 && (
                     <div className="space-y-4">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Specific Requirements</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {post.features.map((f: string) => (
                              <div key={f} className="flex items-center gap-4 p-5 rounded-3xl bg-white border border-slate-100 shadow-sm group hover:border-blue-200 transition-all">
                                 <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-50 transition-colors">
                                    <CheckCircle2 size={18} />
                                 </div>
                                 <span className="text-sm font-bold text-slate-700">{f}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            </div>

            {/* RIGHT COLUMN: SUMMARY & ACTION */}
            <div className="lg:col-span-4 space-y-8">
               <div className="sticky top-32 space-y-8">
                  
                  <Card className="p-10 border border-slate-100 shadow-2xl shadow-blue-900/5 space-y-10 rounded-[40px]">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 leading-none">Authority Valuation</p>
                        <h4 className="text-5xl font-black text-slate-900 tracking-tighter">₹{post.budget?.toLocaleString()}</h4>
                        <div className="flex items-center gap-2 mt-4 text-emerald-600 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full w-fit">
                           <ShieldCheck size={14} className="fill-emerald-100" /> Identity Verified
                        </div>
                     </div>

                     <div className="space-y-6 pt-10 border-t border-slate-50">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                           <span>Location Vector</span>
                           <span className="text-slate-900">{post.city || 'Remote'}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                           <span>Cluster Affinity</span>
                           <span className="text-slate-900">{post.category}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                           <span>Responses Received</span>
                           <span className="text-blue-600 font-black">{post.responses || 0}</span>
                        </div>
                     </div>

                     {responded ? (
                        <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 text-center space-y-3">
                           <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
                              <CheckCircle2 size={24} />
                           </div>
                           <h5 className="text-sm font-black text-emerald-700 uppercase tracking-widest">Protocol Accepted!</h5>
                           <p className="text-[11px] font-bold text-emerald-600 leading-relaxed uppercase tracking-wider">Your credentials have been successfully transmitted to the authority.</p>
                        </div>
                     ) : (
                        <div className="space-y-6">
                           {error && <p className="text-[10px] font-bold text-rose-500 bg-rose-50 p-4 rounded-xl border border-rose-100">{error}</p>}
                           <Button 
                              onClick={handleRespond} 
                              isLoading={responding}
                              className="w-full py-8 rounded-3xl bg-blue-600 text-white font-black hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest border-0"
                           >
                              Respond to Mandate <Zap size={18} fill="white" />
                           </Button>
                           <p className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-widest leading-relaxed">System requires 1 Engagement Credit for secure transmission.</p>
                        </div>
                     )}
                  </Card>

                  <div className="p-10 bg-slate-900 rounded-[40px] text-white space-y-8 shadow-2xl shadow-slate-900/30">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/5 font-black text-xl">
                           {post.userId?.name?.[0] || 'C'}
                        </div>
                        <div>
                           <p className="text-sm font-black leading-none mb-1 tracking-tight">{post.userId?.name || 'Vetted Client'}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authority Status: VIP</p>
                        </div>
                     </div>
                     <div className="space-y-4 pt-4 border-t border-white/5">
                         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">This client averages a <span className="text-blue-400">94% hire rate</span> with an average response time of <span className="text-emerald-400">14 minutes</span>.</p>
                         <Button variant="outline" className="w-full rounded-xl border-white/10 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/5 h-12">View Authority Profile</Button>
                     </div>
                  </div>

               </div>
            </div>
         </div>
      </main>

    </div>
  );
}
