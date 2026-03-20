'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, User, Briefcase, 
  ArrowRight, ShieldCheck, Zap, 
  Target, Rocket, Sparkles, Globe, 
  MessageSquare, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card } from '@/components/ui';
import { analyticsAPI } from '@/services/api';

export default function OnboardingPage() {
  const router = useRouter();
  const [role, setRole] = useState<'client' | 'freelancer' | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const completeOnboarding = () => {
    setLoading(true);
    analyticsAPI.track('onboarding_final_launch', 'onboarding', { role });
    setTimeout(() => {
      if (role === 'client') router.push('/marketplace');
      else router.push('/dashboard');
    }, 1500);
  };

  const handleRoleSelection = (selected: 'client' | 'freelancer') => {
    setRole(selected);
    analyticsAPI.track('onboarding_role_selected', 'onboarding', { role: selected });
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col selection:bg-blue-100 selection:text-blue-600">
      
      {/* ── Progress Cluster ── */}
      <div className="fixed top-0 left-0 w-full z-50 h-1.5 bg-gray-100">
         <div className="h-full bg-blue-600 transition-all duration-700 ease-out" style={{ width: `${(step / 3) * 100}%` }} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-20">
         
         <div className="max-w-3xl w-full">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12 text-center"
                >
                   <div className="space-y-4">
                      <div className="w-20 h-20 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                         <Sparkles size={32} className="text-blue-600" />
                      </div>
                      <h1 className="text-4xl md:text-5xl font-semibold text-[#111827] tracking-tight">Welcome to the elite cluster</h1>
                      <p className="text-sm text-gray-500 font-medium">To personalize your freelance experience, tell us how you intend to use BharatGig.</p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                      <Card 
                        onClick={() => handleRoleSelection('client')}
                        className={`p-10 border-2 cursor-pointer transition-all rounded-[40px] group ${role === 'client' ? 'border-blue-600 bg-blue-50/10 shadow-xl shadow-blue-500/10' : 'border-gray-100 hover:border-blue-200'}`}
                      >
                         <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all ${role === 'client' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                            <Briefcase size={28} />
                         </div>
                         <div className="text-left">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">I want to hire</h3>
                            <p className="text-sm text-gray-500 leading-relaxed font-medium">Access India&apos;s top 1% verified talent and scale your projects.</p>
                         </div>
                      </Card>

                      <Card 
                        onClick={() => handleRoleSelection('freelancer')}
                        className={`p-10 border-2 cursor-pointer transition-all rounded-[40px] group ${role === 'freelancer' ? 'border-blue-600 bg-blue-50/10 shadow-xl shadow-blue-500/10' : 'border-gray-100 hover:border-blue-200'}`}
                      >
                         <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all ${role === 'freelancer' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                            <User size={28} />
                         </div>
                         <div className="text-left">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">I want to work</h3>
                            <p className="text-sm text-gray-500 leading-relaxed font-medium">Connect with high-value clients and build your professional profile.</p>
                         </div>
                      </Card>
                   </div>

                   <button 
                     disabled={!role}
                     onClick={() => setStep(2)}
                     className="bg-blue-600 text-white rounded-[24px] font-bold text-sm shadow-sm shadow-blue-500/30 hover:bg-blue-700 transition-all disabled:opacity-50 active:scale-95 flex items-center gap-3 mx-auto"
                   >
                      Next Step <ArrowRight size={20} />
                   </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                   <div className="text-center space-y-4">
                      <div className="section-label mx-auto">Trust System</div>
                      <h2 className="text-4xl font-semibold text-[#111827] tracking-tight">The BharatGig Guarantee</h2>
                      <p className="text-sm text-gray-500 font-medium">We ensure the highest standards for all participants in our marketplace.</p>
                   </div>

                   <div className="grid grid-cols-1 gap-4 max-w-xl mx-auto">
                      {[
                        { title: 'Verified Identity', desc: 'Every user undergoes e-KYC verification to ensure trust.', icon: <ShieldCheck size={20} /> },
                        { title: 'Secure Escrow', desc: 'Payments are held safely and only released on approval.', icon: <Target size={20} /> },
                        { title: 'Premium Matching', desc: 'AI-driven algorithms connect the right talent with the right project.', icon: <Zap size={20} /> },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-6 p-6 rounded-xl bg-white border border-gray-100 items-start">
                           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                              {item.icon}
                           </div>
                           <div>
                              <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                              <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                           </div>
                        </div>
                      ))}
                   </div>

                   <div className="flex items-center justify-center gap-6">
                      <button onClick={() => setStep(1)} className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-[0.2em]">Go Back</button>
                      <button 
                        onClick={() => setStep(3)}
                        className="bg-blue-600 text-white rounded-[24px] font-bold text-sm shadow-sm shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-3"
                      >
                         Configure Dashboard <ArrowRight size={20} />
                      </button>
                   </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-12 text-center"
                >
                   <div className="w-32 h-32 bg-emerald-50 rounded-[48px] flex items-center justify-center mx-auto border-2 border-emerald-100 shadow-sm shadow-emerald-500/10">
                      <CheckCircle2 size={64} className="text-emerald-500" strokeWidth={3} />
                   </div>
                   <div className="space-y-4">
                      <h2 className="text-4xl font-semibold text-[#111827]">Sync Complete</h2>
                      <p className="text-sm text-gray-500 font-medium max-w-sm mx-auto">Your {role} profile is now initialised. Ready to launch into the BharatGig ecosystem.</p>
                   </div>

                   <button 
                     onClick={completeOnboarding}
                     disabled={loading}
                     className="h-20 bg-blue-600 text-white rounded-[32px] font-bold text-sm shadow-sm shadow-blue-500/40 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-4 mx-auto"
                   >
                      {loading ? (
                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Launch Dashboard <Rocket size={24} /></>
                      )}
                   </button>
                </motion.div>
              )}
            </AnimatePresence>
         </div>

      </div>

      {/* ── Footer Branding ── */}
      <div className="py-12 flex flex-col items-center gap-4 opacity-30 grayscale pointer-events-none">
         <div className="flex items-center gap-8">
            <div className="font-semibold text-xl tracking-tight">RAZORPAY</div>
            <div className="font-semibold text-xl tracking-tight">ZOMATO</div>
            <div className="font-semibold text-xl tracking-tight">SWIGGY</div>
         </div>
      </div>

    </div>
  );
}
