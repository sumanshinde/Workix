'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, TrendingUp, Users, CheckCircle2, ArrowRight, Star, 
  Sparkles, ShieldCheck, Globe, Shield, BriefcaseIcon, 
  Cpu, MousePointer2, CreditCard, Lock, Clock, Briefcase,
  Timer, ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card } from '../components/ui';

/* ── Fade-in animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  })
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } }
};

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fafbff] font-sans selection:bg-blue-100 selection:text-blue-700 w-full overflow-x-hidden relative">
      
      {/* ── AMBIENT BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-15%] w-[700px] h-[700px] bg-gradient-to-br from-blue-500/[0.07] to-indigo-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-15%] w-[600px] h-[600px] bg-gradient-to-tl from-violet-500/[0.06] to-blue-500/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* ── NAVIGATION ── */}
      <nav className="fixed top-0 w-full z-[100] h-[72px] px-6 lg:px-10 bg-white/70 backdrop-blur-2xl border-b border-slate-900/[0.04] flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
            <div className="w-9 h-9 bg-slate-950 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-slate-900/20 group-hover:scale-110 transition-transform duration-300">
              BG
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">BharatGig</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
             {[
               { label: 'Find Talent', path: '/marketplace' },
               { label: 'Find Work', path: '/dashboard/gigs' },
               { label: 'AI Matching', path: '/ai-matching' },
               { label: 'Pricing', path: '/pricing' }
             ].map(item => (
                <Link key={item.label} href={item.path} className="text-[13px] font-bold text-slate-500 hover:text-slate-900 transition-colors duration-200">{item.label}</Link>
             ))}
          </div>

          <div className="flex items-center gap-4">
             <button onClick={() => router.push('/login')} className="text-[14px] font-bold text-slate-700 hover:text-slate-900 transition-colors">Login</button>
             <Button onClick={() => router.push('/register')} className="h-11 px-7 bg-[#2563eb] hover:bg-blue-700 text-white rounded-xl font-bold text-[13px] shadow-lg shadow-blue-500/25 transition-all duration-300 border-0">
                Get Started Free
             </Button>
          </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-36 lg:pt-48 pb-20 lg:pb-32 px-6 lg:px-10 z-10">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* LEFT: Copy */}
            <motion.div 
               initial="hidden"
               animate="visible"
               variants={stagger}
               className="space-y-8"
            >
               {/* Badge */}
               <motion.div variants={fadeUp} custom={0}
                  className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[11px] font-bold border border-blue-100/60"
               >
                  <Sparkles size={14} className="text-blue-500" /> AI-Powered Freelance Marketplace
               </motion.div>

               {/* Headline */}
               <motion.h1 variants={fadeUp} custom={1}
                  className="text-4xl sm:text-5xl lg:text-[4rem] font-black text-slate-900 leading-[1.05] tracking-tight"
               >
                  Get Work Done in <span className="text-[#2563eb]">2 Minutes</span> — We Find the Right Freelancer for You
               </motion.h1>

               {/* Subtext */}
               <motion.p variants={fadeUp} custom={2}
                  className="text-lg text-slate-500 max-w-xl leading-relaxed font-medium"
               >
                  No searching. No hiring headache. Just results powered by AI. Post your job — we handle the rest.
               </motion.p>

               {/* CTAs */}
               <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button onClick={() => router.push('/post-job')} 
                     className="h-14 px-10 bg-[#2563eb] hover:bg-blue-700 text-white rounded-2xl font-bold text-[16px] shadow-xl shadow-blue-500/25 flex items-center gap-2.5 group transition-all duration-300 border-0"
                  >
                     Get My Freelancer Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="ghost" onClick={() => router.push('/marketplace')} 
                     className="h-14 px-8 rounded-2xl font-bold text-[15px] text-slate-700 bg-white border border-slate-100 hover:bg-slate-50 transition-all duration-300"
                  >
                     Browse Talent
                  </Button>
               </motion.div>
               
               {/* Trust Bar */}
               <motion.div variants={fadeUp} custom={4}
                  className="flex flex-wrap items-center gap-8 pt-10 border-t border-slate-100"
               >
                  <div className="flex items-center gap-2.5">
                     <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                        <Star size={16} className="text-amber-500 fill-amber-500" />
                     </div>
                     <div>
                        <div className="text-lg font-bold text-slate-900 leading-tight">100+</div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Clients</div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                     <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <TrendingUp size={16} className="text-emerald-500" />
                     </div>
                     <div>
                        <div className="text-lg font-bold text-slate-900 leading-tight">₹10L+</div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Revenue</div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                     <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Zap size={16} className="text-blue-500" />
                     </div>
                     <div>
                        <div className="text-lg font-bold text-slate-900 leading-tight">4 mins</div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Hire Time</div>
                     </div>
                  </div>
               </motion.div>
            </motion.div>

            {/* RIGHT: Premium Freelancer Card */}
            <motion.div 
               initial={{ opacity: 0, x: 40 }} 
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, delay: 0.3 }}
               className="relative"
            >
               <div className="absolute -inset-10 bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
               <div className="relative bg-[#2563eb] rounded-[2.5rem] p-8 shadow-2xl shadow-blue-500/20">
                  <div className="bg-white rounded-[2rem] p-8 space-y-6">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                           <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                           <span className="text-[10px] font-bold text-green-600">Best Match Found</span>
                        </div>
                        <div className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                           <Sparkles size={12} /> 98% Match
                        </div>
                     </div>

                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden ring-2 ring-slate-50 flex-shrink-0">
                           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Felix" />
                        </div>
                        <div>
                           <div className="text-lg font-bold text-slate-900">Felix D.</div>
                           <div className="text-[11px] font-bold text-slate-400">Full-Stack Engineer</div>
                        </div>
                        <div className="ml-auto flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                           <Star size={12} className="text-amber-500 fill-amber-500" />
                           <span className="text-[10px] font-bold text-amber-600">Top Rated</span>
                        </div>
                     </div>

                     <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-50 rounded-xl p-3 text-center">
                           <div className="text-sm font-bold text-slate-900">4.9</div>
                           <div className="text-[9px] font-bold text-slate-400 uppercase">Rating</div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 text-center">
                           <div className="text-sm font-bold text-slate-900">50+</div>
                           <div className="text-[9px] font-bold text-slate-400 uppercase">Projects</div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 text-center">
                           <div className="text-sm font-bold text-slate-900">10m</div>
                           <div className="text-[9px] font-bold text-slate-400 uppercase">Response</div>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold">
                           <span className="text-slate-400 uppercase">Match Score</span>
                           <span className="text-blue-600">98%</span>
                        </div>
                        <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600 rounded-full w-[98%] shadow-sm shadow-blue-500/50" />
                        </div>
                     </div>

                     <Button className="w-full h-12 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-sm transition-all border-0">
                        Hire Instantly <ChevronRight size={16} className="ml-1" />
                     </Button>
                  </div>

                  <div className="absolute -left-6 bottom-12 bg-white rounded-xl px-3 py-2 shadow-xl border border-slate-50 flex items-center gap-2">
                     <CheckCircle2 size={14} className="text-emerald-500" />
                     <span className="text-[11px] font-bold text-slate-700">Verified Pro</span>
                  </div>
               </div>
            </motion.div>
         </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 border-t border-slate-50 px-6 lg:px-10 bg-white">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-white font-bold text-[10px]">BG</div>
               <span className="text-lg font-bold tracking-tight text-slate-900">BharatGig</span>
            </div>
            <div className="text-[12px] font-bold text-slate-300">
               © 2026 BharatGig. All Rights Reserved.
            </div>
         </div>
      </footer>
    </div>
  );
}
