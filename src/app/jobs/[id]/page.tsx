'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Clock, ShieldCheck, CheckCircle2, 
  ArrowLeft, ArrowRight, Share2, Heart, MessageSquare, 
  Zap, Briefcase, Award, Globe, DollarSign, Users,
  Calendar, FileText, Send, AlertCircle, Sparkles
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { jobsAPI, proposalsAPI } from '../../../services/api';
import { Job } from '../../../types/index';
import { BRANDING } from '../../../lib/config';
import SmartHireCard from '../../../components/jobs/SmartHireCard';
import MatchingFreelancers from '../../../components/jobs/MatchingFreelancers';
import { Button, Card, Input, Skeleton } from '../../../components/ui';

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);
  
  // Proposal Form State
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState(0);
  const [deliveryDays, setDeliveryDays] = useState(7);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await jobsAPI.getById(id as string);
        setJob(data);
        setBidAmount(data.budget || 0);
      } catch (err) {
        console.error('Failed to fetch job:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await proposalsAPI.submit({
        jobId: id as string,
        coverLetter,
        bidAmount,
        deliveryDays
      });
      setSuccess(true);
      setTimeout(() => setShowProposalForm(false), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit proposal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateAI = async () => {
    setAiGenerating(true);
    try {
      const data = await proposalsAPI.generateAI(id as string, "Expert full-stack developer with focus on reliability");
      if (data.proposal) setCoverLetter(data.proposal);
    } catch (err) {
       console.error('AI Error:', err);
    } finally {
      setAiGenerating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
       <div className="flex flex-col items-center gap-6">
          <div className="w-12 border-4 border-gray-100 border-t-blue-600 rounded-lg animate-spin" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Job Mandate...</p>
       </div>
    </div>
  );

  if (!job) return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
       <div className="max-w-md text-center space-y-8">
          <div className="w-20 h-20 bg-rose-50 rounded-xl flex items-center justify-center mx-auto border border-rose-100">
             <AlertCircle size={32} className="text-rose-500" />
          </div>
          <h2 className="text-2xl font-bold">Job Mandate Not Found</h2>
          <p className="text-gray-500">The requested opportunity could not be located in our active clusters.</p>
          <Button 
            onClick={() => router.push('/marketplace')}
            className="w-full"
          >
            Back to Marketplace
          </Button>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfd] selection:bg-blue-100 selection:text-blue-600">
      
      {/* 1. TOP NAV / HEADER */}
      <nav className="sticky top-0 z-[50] bg-white/80 border-b border-gray-100 md: flex items-center justify-between">
         <div className="flex items-center gap-6">
            <button 
              onClick={() => router.push('/marketplace')}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
               <ArrowLeft size={18} className="text-gray-500" />
            </button>
            <div className="h-6 w-px bg-gray-100" />
            <div className="text-sm font-bold text-gray-900 truncate max-w-[300px]">{job.title}</div>
         </div>
         <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="hidden sm:flex">
               <Share2 size={16} />
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex">
               <Heart size={16} />
            </Button>
         </div>
      </nav>

      <main className="max-w-7xl mx-auto md: py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           
           {/* LEFT COLUMN: JOB DETAILS */}
           <div className="lg:col-span-8 space-y-10">
              
              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                       {job.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                       <Clock size={12} /> Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                 </div>
                 
                 <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 tracking-tight leading-tight">
                    {job.title}
                 </h1>

                 <div className="flex flex-wrap items-center gap-8 pt-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-100 overflow-hidden">
                          <img src={job.clientId?.avatar || `https://ui-avatars.com/api/?name=${job.clientId?.name}`} alt="avatar" className="w-full h-full object-cover" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-gray-900">{job.clientId?.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verified Hiring Authority</p>
                       </div>
                    </div>
                    <div className="h-8 w-px bg-gray-100" />
                    <div className="flex items-center gap-3">
                       <ShieldCheck size={18} className="text-emerald-500" />
                       <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Payment Verified</span>
                    </div>
                 </div>
              </div>

              {/* Description */}
              <Card className="space-y-8">
                 <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                    <h3 className="text-xl font-bold text-gray-900">Project Context & Requirements</h3>
                 </div>
                                  <div className="text-gray-600 text-sm font-medium leading-[1.8] whitespace-pre-wrap">
                    {job.description}
                  </div>

                 {job.skills && job.skills.length > 0 && (
                    <div className="space-y-4 pt-6">
                       <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Required Skillsets</h4>
                        <div className="flex flex-wrap gap-3">
                           {job.skills.map((skill: string) => (
                              <span key={skill} className="px-3.5 py-1.5 bg-white border border-gray-100 rounded-xl text-xs font-semibold text-gray-600 hover:border-blue-200 hover:text-blue-600 transition-all cursor-default shadow-sm">
                                 {skill}
                              </span>
                           ))}
                        </div>
                    </div>
                 )}
              </Card>

              {/* Smart Hiring / Proposal Section */}
              <div id="proposal-form" className="space-y-12">
                 <AnimatePresence mode="wait">
                    {user?.role === 'client' && job?.clientId?._id === user?.id ? (
                       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                          <SmartHireCard jobId={id as string} budget={job.budget || 5000} />
                          <MatchingFreelancers jobId={id as string} />
                       </motion.div>
                    ) : user?.role === 'freelancer' && !showProposalForm ? (
                       <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="saas-card bg-blue-600 text-white p-10 space-y-6 overflow-hidden relative group"
                       >
                          <div className="relative z-10">
                             <h3 className="text-2xl font-bold">Ready to contribute?</h3>
                             <p className="text-blue-100 font-medium max-w-md mt-2">
                                Submit a proposal with the <span className="text-white font-bold underline decoration-blue-300">Lead Lock</span> protection. 
                                Refund guaranteed if client stays inactive.
                             </p>
                             <div className="flex flex-wrap items-center gap-4 mt-8">
                                <Button 
                                   onClick={() => setShowProposalForm(true)}
                                   className="bg-white text-blue-600 hover:bg-gray-50 rounded-lg"
                                >
                                   Submit Your Proposal
                                </Button>
                                <div className="px-4 py-2 bg-blue-500/20 border border-white/10 rounded-lg flex items-center gap-2">
                                   <Zap size={14} fill="currentColor" />
                                   <span className="text-[10px] font-bold uppercase tracking-widest text-blue-50">Cost: 2 Credits</span>
                                </div>
                             </div>
                          </div>
                          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full group-hover:bg-white/20 transition-all duration-700" />
                       </motion.div>
                    ) : (
                       <motion.div 
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                       >
                          <Card className="p-10 space-y-8 border-2 border-blue-500/20">
                             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                   <h3 className="text-2xl font-bold text-gray-900">Your Proposal</h3>
                                   <p className="text-sm font-medium text-gray-500 mt-1">Specify your terms and engagement strategy.</p>
                                </div>
                                <Button variant="ghost" onClick={() => setShowProposalForm(false)} className="text-rose-500 hover:bg-rose-50 h-10">Cancel</Button>
                             </div>

                             {success ? (
                                <div className="py-12 flex flex-col items-center text-center space-y-4">
                                   <div className="w-16 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center">
                                      <CheckCircle2 size={32} />
                                   </div>
                                   <div className="space-y-1">
                                      <h4 className="text-xl font-bold text-gray-900">Proposal Transmitted!</h4>
                                      <p className="text-gray-500">Your engagement request has been logged and sent to the client.</p>
                                   </div>
                                </div>
                             ) : (
                                <form onSubmit={handleSubmitProposal} className="space-y-8">
                                   {error && (
                                      <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-sm font-bold">
                                         <AlertCircle size={18} /> {error}
                                      </div>
                                   )}

                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                      <Input 
                                         label="Bid Amount (₹)" 
                                         type="number" 
                                         value={bidAmount} 
                                         onChange={e => setBidAmount(Number(e.target.value))}
                                         leftIcon={<DollarSign size={18} />}
                                         required
                                      />
                                      <Input 
                                         label="Delivery Timeline (Days)" 
                                         type="number" 
                                         value={deliveryDays} 
                                         onChange={e => setDeliveryDays(Number(e.target.value))}
                                         leftIcon={<Calendar size={18} />}
                                         required
                                      />
                                   </div>

                                   <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                         <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cover Narrative</label>
                                         <button 
                                           type="button"
                                           onClick={handleGenerateAI}
                                           disabled={aiGenerating}
                                           className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors disabled:opacity-50"
                                         >
                                            <Sparkles size={12} fill="currentColor" />
                                            {aiGenerating ? 'Synthesizing...' : 'Magic: Write with AI'}
                                         </button>
                                      </div>
                                      <textarea 
                                         className="w-full min-h-[160px] p-6 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-700 font-medium leading-relaxed"
                                         placeholder="Detail your competitive advantages and execution plan..."
                                         value={coverLetter}
                                         onChange={e => setCoverLetter(e.target.value)}
                                         required
                                      />
                                   </div>

                                   <Button 
                                      type="submit" 
                                      isLoading={submitting}
                                      className="w-full rounded-lg"
                                   >
                                      Transmit Proposal <Send size={18} className="ml-2" />
                                   </Button>
                                </form>
                             )}
                          </Card>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           </div>

           {/* RIGHT COLUMN: SUMMARY & CLIENT INFO */}
           <div className="lg:col-span-4 space-y-8">
              <section className="sticky top-28 space-y-8">
                 
                 <Card className="p-8 space-y-8">
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">Total Budget Valuation</p>
                        <h4 className="text-5xl font-bold text-gray-900 tracking-tight">₹{job.budget?.toLocaleString()}</h4>
                        <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mt-2">{job.budgetType === 'fixed' ? 'Fixed Price Mandate' : 'Hourly Rate Model'}</p>
                     </div>

                    <div className="space-y-4 pt-6 border-t border-gray-50 font-medium">
                       <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Experience Level</span>
                          <span className="text-gray-900 uppercase text-[10px] font-bold tracking-widest">{job.experienceLevel}</span>
                       </div>
                       <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Project Scope</span>
                          <span className="text-gray-900 uppercase text-[10px] font-bold tracking-widest">{job.scope}</span>
                       </div>
                       <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Total Proposals</span>
                          <span className="text-blue-600 font-bold">{job.proposals?.length || 0}</span>
                       </div>
                    </div>

                    <Button 
                       onClick={() => {
                          const el = document.getElementById('proposal-form');
                          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          setShowProposalForm(true);
                       }}
                       className="w-full rounded-lg"
                    >
                       Submit Proposal
                    </Button>
                 </Card>

                 <Card className="p-8 space-y-8">
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest">About the Authority</h5>
                    
                    <div className="flex items-center gap-4">
                       <div className="w-12 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-sm font-bold text-gray-900 shadow-sm overflow-hidden">
                          {job.clientId?.avatar ? <img src={job.clientId.avatar} alt="avatar" className="w-full h-full object-cover" /> : job.clientId?.name?.[0]}
                       </div>
                       <div>
                          <h6 className="text-sm font-bold text-gray-900 leading-tight">{job.clientId?.name}</h6>
                          <div className="flex items-center gap-1.5 mt-1">
                             <CheckCircle2 size={12} className="text-blue-600" />
                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verified Identity</span>
                          </div>
                       </div>
                    </div>

                     <div className="space-y-4 pt-4 border-t border-gray-50">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                              <Zap size={14} className="text-blue-500" /> Hire Rate
                           </div>
                           <span className="text-sm font-bold text-blue-600">{job.clientMetrics?.hireRate || 0}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                              <MessageSquare size={14} className="text-emerald-500" /> Response
                           </div>
                           <span className="text-sm font-bold text-gray-900">{job.clientMetrics?.avgResponseTime || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                              <Globe size={14} className="text-gray-300" /> Location
                           </div>
                           <span className="text-sm font-bold text-gray-900">Remote India</span>
                        </div>
                     </div>
                 </Card>

              </section>
           </div>
        </div>
      </main>
    </div>
  );
}
