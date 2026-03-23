'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, TrendingUp, Users, CheckCircle2, ArrowRight, Star, 
  Sparkles, ShieldCheck, Globe, Shield, BriefcaseIcon, 
  Cpu, MousePointer2, CreditCard, Lock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '../components/ui';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white font-manrope selection:bg-blue-100 selection:text-blue-600 w-full overflow-x-hidden relative">
      
      {/* ── NAVIGATION ── */}
      <nav className="fixed top-0 w-full z-[100] h-20 px-8 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm shadow-slate-900/10 group-hover:scale-105 transition-transform">
              BG
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 italic uppercase">BharatGig</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
             {['Find Talent', 'Find Work', 'AI Matching', 'Pricing'].map(item => (
                <a key={item} href="#" className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">{item}</a>
             ))}
          </div>

          <div className="flex items-center gap-4">
             <button onClick={() => router.push('/login')} className="text-[11px] font-black uppercase tracking-widest text-slate-900 hover:opacity-70 transition-opacity px-6">Login</button>
             <Button onClick={() => router.push('/register')} className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20">
                Join Now
             </Button>
          </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-44 pb-32 px-8">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
               initial={{ opacity: 0, x: -30 }} 
               animate={{ opacity: 1, x: 0 }} 
               className="space-y-10"
            >
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <Sparkles size={14} /> AI-Powered Marketplace
               </div>
               <h1 className="text-7xl md:text-8xl font-black text-slate-900 leading-[0.85] tracking-tighter">
                  HIRE TOP <br />
                  <span className="text-blue-600 italic">FREELANCERS</span> <br />
                  IN 2 MINS.
               </h1>
               <p className="text-xl font-medium text-slate-500 max-w-lg leading-relaxed italic">
                  Smart matching, secure payments, and zero-hassle hiring. The only platform that guarantees results using AI.
               </p>
               <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={() => router.push('/post-job')} className="h-16 px-10 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 group">
                     Post Job Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="ghost" className="h-16 px-10 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-900 border-2 border-slate-100 hover:bg-slate-50">
                     Explore Talent
                  </Button>
               </div>
               
               {/* SOCIAL PROOF */}
               <div className="flex items-center gap-8 pt-10 border-t border-slate-50">
                  <div className="space-y-1">
                     <div className="text-2xl font-black text-slate-900 italic">100+</div>
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trusted Clients</div>
                  </div>
                  <div className="w-px h-10 bg-slate-100" />
                  <div className="space-y-1">
                     <div className="text-2xl font-black text-slate-900 italic">₹10L+</div>
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processed</div>
                  </div>
                  <div className="w-px h-10 bg-slate-100" />
                  <div className="flex -space-x-3">
                     {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 overflow-hidden">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="user" />
                        </div>
                     ))}
                  </div>
               </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }} 
               animate={{ opacity: 1, scale: 1 }}
               className="relative"
            >
               <div className="aspect-square bg-blue-600 rounded-[4rem] rotate-3 relative overflow-hidden shadow-2xl group flex items-center justify-center p-12">
                  <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors" />
                  <div className="bg-white rounded-[3rem] p-10 shadow-2xl space-y-8 relative -rotate-3 hover:rotate-0 transition-transform duration-500 w-full">
                     <div className="flex items-center justify-between">
                        <div className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[8px] font-black uppercase tracking-widest">🔥 Best Match Found</div>
                        <div className="text-xs font-black text-slate-900 italic">98% Match</div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-3xl bg-slate-100 overflow-hidden">
                           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Felix" />
                        </div>
                        <div>
                           <div className="text-xl font-black text-slate-900 uppercase italic">Felix D.</div>
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full-Stack Engineer</div>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600 w-[98%]" />
                        </div>
                        <Button className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">Hire Instantly</Button>
                     </div>
                  </div>
               </div>
            </motion.div>
         </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-32 bg-slate-50/50 px-8">
         <div className="max-w-7xl mx-auto space-y-20">
            <div className="text-center space-y-4">
               <div className="text-[12px] font-black text-blue-600 uppercase tracking-[0.4em]">The Velocity process</div>
               <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">Hire in 3 Steps</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                  { step: '01', title: 'Post Job', desc: 'Describe your project and budget in seconds.', icon: <MousePointer2 className="text-blue-600" /> },
                  { step: '02', title: 'Get AI Matches', desc: 'Our AI ranks the best candidates instantly.', icon: <Cpu className="text-purple-600" /> },
                  { step: '03', title: 'Hire Instantly', desc: 'One-click contract & secure escrow payment.', icon: <Zap className="text-amber-600" /> }
               ].map((item, i) => (
                  <div key={i} className="space-y-6 group">
                     <div className="text-6xl font-black text-slate-100 group-hover:text-blue-100 transition-colors italic">{item.step}</div>
                     <div className="p-4 bg-white rounded-2xl shadow-sm w-fit group-hover:scale-110 transition-transform">{item.icon}</div>
                     <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">{item.title}</h3>
                     <p className="font-medium text-slate-500 leading-relaxed italic">{item.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-32 px-8">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-12">
               <div className="space-y-4">
                 <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-tight">Everything You Need to Scale Your Team.</h2>
               </div>
               <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <div className="p-3 bg-blue-50 text-blue-600 w-fit rounded-xl"><Sparkles size={20} /></div>
                     <h4 className="font-black text-slate-900 uppercase italic text-sm">AI Matching</h4>
                     <p className="text-xs font-medium text-slate-500 leading-relaxed italic">Proprietary algorithm that finds talent based on fit, not just keywords.</p>
                  </div>
                  <div className="space-y-4">
                     <div className="p-3 bg-emerald-50 text-emerald-600 w-fit rounded-xl"><Lock size={20} /></div>
                     <h4 className="font-black text-slate-900 uppercase italic text-sm">Escrow Secure</h4>
                     <p className="text-xs font-medium text-slate-500 leading-relaxed italic">Funds are only released when you are 100% satisfied with the work.</p>
                  </div>
                  <div className="space-y-4">
                     <div className="p-3 bg-amber-50 text-amber-600 w-fit rounded-xl"><Globe size={20} /></div>
                     <h4 className="font-black text-slate-900 uppercase italic text-sm">Global Pay</h4>
                     <p className="text-xs font-medium text-slate-500 leading-relaxed italic">Pay in USD, EUR, or INR via Stripe & Razorpay seamlessly.</p>
                  </div>
                  <div className="space-y-4">
                     <div className="p-3 bg-purple-50 text-purple-600 w-fit rounded-xl"><ShieldCheck size={20} /></div>
                     <h4 className="font-black text-slate-900 uppercase italic text-sm">Dispute Tribunal</h4>
                     <p className="text-xs font-medium text-slate-500 leading-relaxed italic">Professional admin review for edge cases and total peace of mind.</p>
                  </div>
               </div>
            </div>
            <div className="bg-slate-900 rounded-[4rem] p-16 text-white space-y-10 relative overflow-hidden shadow-2xl shadow-slate-900/50">
               <div className="absolute top-0 right-0 p-12 opacity-5"><Zap size={200} /></div>
               <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-tight">Join the next-gen of <span className="text-blue-500">Global Hiring</span>.</h3>
               <ul className="space-y-6">
                  {['Zero Platform Fees for First Hiring', 'Aadhaar Verified Talent Pool', 'Instant UPI Payouts'].map(text => (
                     <li key={text} className="flex items-center gap-4 text-sm font-black uppercase tracking-widest">
                        <CheckCircle2 className="text-blue-500" size={20} /> {text}
                     </li>
                  ))}
               </ul>
               <Button onClick={() => router.push('/register')} className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20">Create My Account</Button>
            </div>
         </div>
      </section>

      {/* ── ENTERPRISE LEAD CAPTURE ── */}
      <section className="py-32 bg-slate-100/50 px-8">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-6">
               <div className="text-[12px] font-black text-blue-600 uppercase tracking-[0.4em]">Enterprise Scale</div>
               <h2 className="text-6xl font-black text-slate-900 tracking-tighter italic uppercase leading-[0.85]">
                  NEED A <br />
                  <span className="text-blue-600">CUSTOM SQUAD?</span>
               </h2>
               <p className="text-xl font-medium text-slate-500 max-w-lg leading-relaxed italic">
                  Looking to hire 10+ freelancers or need custom enterprise compliance? Our growth team will build your squad manually.
               </p>
               <div className="flex items-center gap-6 pt-10 border-t border-slate-200">
                  <div className="flex -space-x-3">
                     {[1,2,3].map(i => (
                        <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=expert${i}`} alt="expert" />
                        </div>
                     ))}
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed italic">"Our expert concierge team <br /> is ready to assist."</div>
               </div>
            </div>

            <Card className="p-10 border-0 bg-white shadow-2xl rounded-[3rem] space-y-8">
               <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 italic uppercase">Inquiry Form</h3>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Get a response within 2 hours.</div>
               </div>
               <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const data = Object.fromEntries(formData);
                  try {
                    const { leadsAPI } = require('../services/api');
                    await leadsAPI.submit(data);
                    alert('Inquiry sent! Our team will contact you shortly.');
                    (e.target as any).reset();
                  } catch (err) {
                    alert('Submission failed');
                  }
               }} className="space-y-4">
                  <input name="name" placeholder="Contact Name" required className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 ring-blue-500/10 outline-none transition-all font-manrope" />
                  <div className="grid grid-cols-2 gap-4">
                     <input name="email" type="email" placeholder="Business Email" required className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 ring-blue-500/10 outline-none transition-all font-manrope" />
                     <input name="company" placeholder="Company Name" className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 ring-blue-500/10 outline-none transition-all font-manrope" />
                  </div>
                  <textarea name="requirement" placeholder="Project Requirements..." required className="w-full h-32 p-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-medium focus:ring-4 ring-blue-500/10 outline-none transition-all font-manrope resize-none" />
                  <Button type="submit" className="w-full h-16 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20">Send Inquiry</Button>
               </form>
            </Card>
         </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-40 bg-white px-8 text-center bg-gradient-to-b from-white to-slate-50/50">
         <div className="max-w-4xl mx-auto space-y-10">
            <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter italic uppercase leading-[0.85]">
               READY TO <br />
               <span className="text-blue-600">GET IT DONE?</span>
            </h2>
            <p className="text-xl font-medium text-slate-500 italic max-w-lg mx-auto">
               Stop scrolling. Start hiring. Get your first project delivered this week.
            </p>
            <Button onClick={() => router.push('/post-job')} className="h-20 px-16 bg-slate-900 hover:bg-slate-800 text-white rounded-3xl font-black text-lg uppercase tracking-widest shadow-2xl">
               Start Hiring Now
            </Button>
         </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-24 border-t border-slate-100 px-8">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-[10px]">BG</div>
               <span className="text-xl font-black tracking-tighter italic uppercase">BharatGig</span>
            </div>
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
               {['About', 'Privacy', 'Security', 'Twitter'].map(link => (
                  <a key={link} href="#" className="hover:text-slate-900 transition-colors">{link}</a>
               ))}
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-300">
               © 2026 BharatGig. All Rights Reserved.
            </div>
         </div>
      </footer>
    </div>
  );
}
