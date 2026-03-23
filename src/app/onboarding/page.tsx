'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Rocket, Briefcase, User, 
  ArrowRight, ShieldCheck, Sparkles, Trophy, 
  Target, Zap, MousePointer2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { onboardingAPI } from '@/services/api';
import { Button, Card, Skeleton } from '@/components/ui';

export default function OnboardingPage() {
  const router = useRouter();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await onboardingAPI.getStatus();
      setStatus(res);
      if (res.isCompleted && !res.onboardingRewardClaimed) {
         // Optionally auto-trigger claim or show reward UI
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSetRole = async (role: string) => {
    try {
      await onboardingAPI.setRole(role);
      fetchStatus();
    } catch (err) {
      alert('Failed to set role');
    }
  };

  const handleStep = async (step: string) => {
    try {
      await onboardingAPI.updateStep(step);
      fetchStatus();
    } catch (err) {
      alert('Step update failed');
    }
  };

  const claimReward = async () => {
    setClaiming(true);
    try {
       await onboardingAPI.claimReward();
       alert('Reward Claimed! Check your wallet.');
       router.push('/dashboard');
    } catch (err) {
       alert('Claim failed');
    } finally {
       setClaiming(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Skeleton className="h-96 w-full max-w-2xl rounded-[3rem]" /></div>;

  return (
    <div className="min-h-screen bg-white font-manrope selection:bg-blue-100 selection:text-blue-600">
       
       <div className="max-w-4xl mx-auto p-8 md:p-12 lg:p-24 space-y-12">
          
          {/* PROGRESS HEADER */}
          <div className="space-y-6">
             <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                <span>Mission Progress</span>
                <span className="text-blue-600">{Math.round(status.progress)}% Complete</span>
             </div>
             <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: `${status.progress}%` }} 
                   className="h-full bg-blue-600 shadow-lg shadow-blue-500/20" 
                />
             </div>
          </div>

          <AnimatePresence mode="wait">
             
             {/* STEP 1: ROLE SELECTION */}
             {status.role === 'unassigned' && (
                <motion.div key="step1" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-12">
                   <div className="space-y-4 text-center">
                      <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">What is your mission?</h2>
                      <p className="text-lg font-medium text-slate-500 italic">Select your path to continue the onboarding.</p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <button onClick={() => handleSetRole('client')} className="p-10 bg-white border-2 border-slate-100 rounded-[3rem] hover:border-blue-600 hover:shadow-2xl transition-all text-left space-y-6 group">
                         <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Briefcase size={32} />
                         </div>
                         <h3 className="text-2xl font-black text-slate-900 uppercase italic">I want to Hire</h3>
                         <p className="text-sm font-medium text-slate-400 italic leading-relaxed">Find top-tier talent and scale your projects instantly.</p>
                      </button>
                      <button onClick={() => handleSetRole('freelancer')} className="p-10 bg-white border-2 border-slate-100 rounded-[3rem] hover:border-emerald-600 hover:shadow-2xl transition-all text-left space-y-6 group">
                         <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Zap size={32} />
                         </div>
                         <h3 className="text-2xl font-black text-slate-900 uppercase italic">I want to Earn</h3>
                         <p className="text-sm font-medium text-slate-400 italic leading-relaxed">Showcase your skills and land high-value global gigs.</p>
                      </button>
                   </div>
                </motion.div>
             )}

             {/* STEP 2+: GUIDED STEPS */}
             {status.role !== 'unassigned' && !status.isCompleted && (
                <motion.div key="steps" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-12">
                   <div className="space-y-4 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                         <Rocket size={14} /> Activation Phase
                      </div>
                      <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">Complete your setup</h2>
                   </div>

                   <div className="grid grid-cols-1 gap-6">
                      {(status.role === 'client' 
                         ? [
                            { id: 'post_job', title: 'Post your first Job', desc: 'Define your project requirements.', icon: <CheckCircle2 size={24} />, path: '/post-job' },
                            { id: 'view_matches', title: 'View AI Matches', desc: 'See how our intelligent engine ranks talent.', icon: <Sparkles size={24} />, path: '/marketplace' },
                            { id: 'payment_method', title: 'Add Billing Method', desc: 'Secure your first transaction.', icon: <ShieldCheck size={24} />, path: '#' }
                         ]
                         : [
                            { id: 'profile_basic', title: 'Complete Bio & Profile', desc: 'Introduce yourself to the world.', icon: <User size={24} />, path: '/profile' },
                            { id: 'add_skills', title: 'Add Verified Skills', desc: 'Increase your visibility by 400%.', icon: <Target size={24} />, path: '/profile' },
                            { id: 'id_verify', title: 'Start Tier-1 Verification', desc: 'Get the "Verified" badge on your profile.', icon: <ShieldCheck size={24} />, path: '#' },
                            { id: 'get_first_match', title: 'Wait for first Match', desc: 'Our AI will notify you of gigs.', icon: <Zap size={24} />, path: '#' }
                         ]
                      ).map((step, i) => (
                         <div 
                            key={step.id} 
                            onClick={async () => {
                               await handleStep(step.id);
                               if (step.path !== '#') router.push(step.path);
                            }}
                            className={`p-8 bg-white border-2 rounded-[2.5rem] flex items-center justify-between group cursor-pointer transition-all ${status.completedSteps.includes(step.id) ? 'border-emerald-100 bg-emerald-50/20' : 'border-slate-50 hover:border-blue-600'}`}
                         >
                            <div className="flex items-center gap-6">
                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${status.completedSteps.includes(step.id) ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-300 group-hover:bg-blue-600 group-hover:text-white'}`}>
                                  {step.icon}
                               </div>
                               <div>
                                  <h4 className={`text-lg font-black uppercase italic ${status.completedSteps.includes(step.id) ? 'text-emerald-900' : 'text-slate-900'}`}>{step.title}</h4>
                                  <p className="text-xs font-medium text-slate-400 italic">{step.desc}</p>
                               </div>
                            </div>
                            {status.completedSteps.includes(step.id) ? (
                               <CheckCircle2 size={20} className="text-emerald-600" />
                            ) : (
                               <ArrowRight size={20} className="text-slate-200 group-hover:text-blue-600 transition-colors" />
                            )}
                         </div>
                      ))}
                   </div>
                </motion.div>
             )}

             {/* FINAL: REWARD CLAIM */}
             {status.isCompleted && !status.onboardingRewardClaimed && (
                <motion.div key="reward" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12 text-center">
                   <div className="w-40 h-40 bg-gradient-to-br from-amber-400 to-orange-500 rounded-[3rem] mx-auto flex items-center justify-center text-white shadow-2xl relative">
                      <Trophy size={80} />
                      <motion.div 
                         initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                         className="absolute -top-4 -right-4 bg-white text-slate-900 px-4 py-2 rounded-2xl font-black text-xs shadow-xl rotate-12"
                      >
                         +1 Free Bid
                      </motion.div>
                   </div>
                   <div className="space-y-4">
                      <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">Mission Accomplished!</h2>
                      <p className="text-lg font-medium text-slate-500 italic max-w-md mx-auto">
                         You have successfully navigated the BharatGig activation flow. Claim your reward to start your journey.
                      </p>
                   </div>
                   <Button 
                      onClick={claimReward} 
                      isLoading={claiming}
                      className="h-20 px-20 bg-slate-900 hover:bg-slate-800 text-white rounded-[2.5rem] font-black text-xl uppercase tracking-widest shadow-2xl"
                   >
                      Claim My Reward
                   </Button>
                </motion.div>
             )}

             {status.onboardingRewardClaimed && (
                <motion.div key="done" className="text-center space-y-8 py-20">
                   <h2 className="text-4xl font-black text-slate-900 uppercase italic">Successfully Activated</h2>
                   <Button onClick={() => router.push('/dashboard')} className="px-10 h-14 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest">Go to Dashboard</Button>
                </motion.div>
             )}

          </AnimatePresence>

       </div>

    </div>
  );
}
