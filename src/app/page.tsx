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

function TopFreelancersSection() {
  const [expandedId, setExpandedId] = React.useState<number | null>(null);

  const freelancers = [
    { id: 1, name: 'Rahul Sharma', role: 'Full-Stack Developer', price: '₹1,500/hr', rating: 4.9, jobs: 120, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul' },
    { id: 2, name: 'Priya Patel', role: 'UI/UX Designer', price: '₹1,200/hr', rating: 4.8, jobs: 85, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
    { id: 3, name: 'Amit Kumar', role: 'Backend Engineer', price: '₹1,800/hr', rating: 5.0, jobs: 200, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit' },
    { id: 4, name: 'Neha Singh', role: 'Mobile App Developer', price: '₹1,400/hr', rating: 4.7, jobs: 95, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha' },
  ];

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-10 relative z-10 bg-white">
       <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-[12px] font-semibold border border-amber-100/50">
                <Star size={14} /> Elite Talent
             </div>
             <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">Top Freelancers List</h2>
             <p className="text-lg text-slate-500 max-w-xl mx-auto">Hire directly from our curated list of top-performing professionals.</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
             {freelancers.map(freelancer => (
               <div key={freelancer.id} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden ring-2 ring-slate-50">
                           <img src={freelancer.img} alt={freelancer.name} loading="lazy" />
                        </div>
                        <div>
                           <div className="text-lg font-bold text-slate-900">{freelancer.name}</div>
                           <div className="text-sm font-medium text-slate-500">{freelancer.role}</div>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button 
                          onClick={() => setExpandedId(expandedId === freelancer.id ? null : freelancer.id)}
                          className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          {expandedId === freelancer.id ? 'Hide Details' : 'Click to Show'}
                        </button>
                        
                        <button className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all">
                           Hire {freelancer.price}
                        </button>
                     </div>
                  </div>
                  
                  {expandedId === freelancer.id && (
                    <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                       <div className="text-center p-3 bg-slate-50 rounded-xl">
                          <div className="text-lg font-bold text-slate-900">{freelancer.rating}</div>
                          <div className="text-xs font-medium text-slate-500">Rating</div>
                       </div>
                       <div className="text-center p-3 bg-slate-50 rounded-xl">
                          <div className="text-lg font-bold text-slate-900">{freelancer.jobs}</div>
                          <div className="text-xs font-medium text-slate-500">Projects</div>
                       </div>
                       <div className="text-center p-3 bg-slate-50 rounded-xl">
                          <div className="text-lg font-bold text-slate-900">100%</div>
                          <div className="text-xs font-medium text-slate-500">Success</div>
                       </div>
                       <div className="text-center p-3 bg-slate-50 rounded-xl">
                          <div className="text-lg font-bold text-slate-900">2hr</div>
                          <div className="text-xs font-medium text-slate-500">Response</div>
                       </div>
                    </div>
                  )}
               </div>
             ))}
          </div>
       </div>
    </section>
  );
}

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fafbff] font-sans selection:bg-blue-100 selection:text-blue-700 w-full overflow-x-hidden relative">
      
      {/* ── AMBIENT BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-15%] w-[700px] h-[700px] bg-gradient-to-br from-blue-500/[0.07] to-indigo-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-15%] w-[600px] h-[600px] bg-gradient-to-tl from-violet-500/[0.06] to-blue-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-gradient-to-br from-emerald-500/[0.03] to-cyan-500/[0.02] rounded-full blur-[100px]" />
      </div>

      {/* ── NAVIGATION ── */}
      <nav className="fixed top-0 w-full z-[100] h-[72px] px-6 lg:px-10 bg-white/70 backdrop-blur-2xl border-b border-slate-900/[0.04] flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
            <div className="w-9 h-9 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center text-white font-extrabold text-[10px] shadow-lg shadow-slate-900/20 group-hover:scale-110 transition-transform duration-300">
              GI
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">GigIndia</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
             {[
               { label: 'Find Talent', path: '/marketplace' },
               { label: 'Find Work', path: '/jobs' },
               { label: 'Pricing', path: '/pricing' },
               { label: 'Admin Panel', path: '/admin/dashboard' }
             ].map(item => (
                <Link key={item.label} href={item.path} className="text-[13px] font-semibold text-slate-500 hover:text-slate-900 transition-colors duration-200">{item.label}</Link>
             ))}
          </div>

          <div className="flex items-center gap-3">
             <button onClick={() => router.push('/login')} className="text-[13px] font-semibold text-slate-700 hover:text-slate-900 transition-colors px-5 py-2.5 rounded-xl hover:bg-slate-50">Login</button>
             <Button onClick={() => router.push('/register')} className="h-10 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-[13px] shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] border-0">
                Get Started Free
             </Button>
          </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-36 lg:pt-44 pb-20 lg:pb-32 px-6 lg:px-10 z-10">
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
                  className="inline-flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-full text-[12px] font-semibold border border-blue-100/60"
               >
                  <Sparkles size={14} className="text-blue-500" /> AI-Powered Freelance Marketplace
               </motion.div>

               {/* Headline */}
               <motion.h1 variants={fadeUp} custom={1}
                  className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-extrabold text-slate-900 leading-[1.08] tracking-tight"
               >
                  Fix Anything in{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Minutes ⚡</span>
                  {' '}— Your Premium SaaS Booking Platform
               </motion.h1>

               {/* Subtext */}
               <motion.p variants={fadeUp} custom={2}
                  className="text-lg text-slate-500 max-w-xl leading-relaxed font-normal"
               >
                  From plumbing to high-end engineering. Secure a verified expert instantly. No hidden fees. Just results.
               </motion.p>

               {/* CTAs */}
               <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button onClick={() => router.push('/booking')} 
                     className="h-14 px-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-[16px] shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center gap-2.5 group transition-all duration-400 hover:scale-[1.05] border-0"
                  >
                     Book Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="ghost" onClick={() => router.push('/marketplace')} 
                     className="h-14 px-8 rounded-2xl font-semibold text-[15px] text-slate-700 bg-white border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md transition-all duration-300 shadow-sm"
                  >
                     Browse Talent
                  </Button>
               </motion.div>
               
               {/* Trust Bar */}
               <motion.div variants={fadeUp} custom={4}
                  className="flex flex-wrap items-center gap-6 sm:gap-8 pt-8 border-t border-slate-100/80"
               >
                  <div className="flex items-center gap-2.5">
                     <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                        <Star size={16} className="text-amber-500 fill-amber-500" />
                     </div>
                     <div>
                        <div className="text-lg font-extrabold text-slate-900 leading-tight">100+</div>
                        <div className="text-[11px] font-medium text-slate-400">Trusted Clients</div>
                     </div>
                  </div>
                  <div className="w-px h-10 bg-slate-100 hidden sm:block" />
                  <div className="flex items-center gap-2.5">
                     <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <TrendingUp size={16} className="text-emerald-500" />
                     </div>
                     <div>
                        <div className="text-lg font-extrabold text-slate-900 leading-tight">₹10L+</div>
                        <div className="text-[11px] font-medium text-slate-400">Work Completed</div>
                     </div>
                  </div>
                  <div className="w-px h-10 bg-slate-100 hidden sm:block" />
                  <div className="flex items-center gap-2.5">
                     <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Zap size={16} className="text-blue-500" />
                     </div>
                     <div>
                        <div className="text-lg font-extrabold text-slate-900 leading-tight">4 mins</div>
                        <div className="text-[11px] font-medium text-slate-400">Avg. Hire Time</div>
                     </div>
                  </div>
               </motion.div>
            </motion.div>

            {/* RIGHT: Premium Freelancer Card */}
            <motion.div 
               initial={{ opacity: 0, y: 40, scale: 0.95 }} 
               animate={{ opacity: 1, y: 0, scale: 1 }}
               transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
               className="relative"
            >
               {/* Glow ring */}
               <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 rounded-[3rem] blur-2xl opacity-60" />

               {/* Outer container */}
               <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 rounded-[2.5rem] p-1 shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-shadow duration-500">
                  <div className="bg-gradient-to-br from-blue-600/90 to-indigo-700/90 rounded-[2.4rem] p-6 sm:p-8 relative overflow-hidden">
                     
                     {/* BG pattern */}
                     <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-white/[0.04] rounded-full -translate-y-1/2 translate-x-1/2" />
                     <div className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-white/[0.03] rounded-full translate-y-1/2 -translate-x-1/2" />

                     {/* Inner white card */}
                     <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-2xl shadow-black/10 relative space-y-6 hover:-translate-y-1 transition-transform duration-500">
                        
                        {/* Header */}
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-100/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              <span className="text-[11px] font-semibold text-blue-600">Best Match Found</span>
                           </div>
                           <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full">
                              <Sparkles size={12} className="text-emerald-500" />
                              <span className="text-[11px] font-bold text-emerald-600">98% Match</span>
                           </div>
                        </div>

                        {/* Profile */}
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden ring-2 ring-slate-100 flex-shrink-0">
                              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Felix" loading="lazy" />
                           </div>
                           <div className="min-w-0">
                              <div className="text-lg font-extrabold text-slate-900 tracking-tight">Felix D.</div>
                              <div className="text-[12px] font-medium text-slate-400">Full-Stack Engineer</div>
                           </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3">
                           <div className="bg-slate-50/80 rounded-xl p-3 text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                 <Star size={12} className="text-amber-500 fill-amber-500" />
                                 <span className="text-sm font-bold text-slate-900">4.9</span>
                              </div>
                              <div className="text-[10px] font-medium text-slate-400">Rating</div>
                           </div>
                           <div className="bg-slate-50/80 rounded-xl p-3 text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                 <Briefcase size={12} className="text-blue-500" />
                                 <span className="text-sm font-bold text-slate-900">50+</span>
                              </div>
                              <div className="text-[10px] font-medium text-slate-400">Projects</div>
                           </div>
                           <div className="bg-slate-50/80 rounded-xl p-3 text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                 <Clock size={12} className="text-emerald-500" />
                                 <span className="text-sm font-bold text-slate-900">10m</span>
                              </div>
                              <div className="text-[10px] font-medium text-slate-400">Response</div>
                           </div>
                        </div>

                        {/* Animated Match Bar */}
                        <div className="space-y-2">
                           <div className="flex justify-between text-[11px] font-semibold">
                              <span className="text-slate-400">AI Match Score</span>
                              <span className="text-blue-600">98%</span>
                           </div>
                           <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: '98%' }}
                                 transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
                                 className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full relative"
                              >
                                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                              </motion.div>
                           </div>
                        </div>

                        {/* CTA */}
                        <Button className="w-full h-12 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 transition-all duration-300 hover:scale-[1.01] border-0">
                           Hire Instantly <ChevronRight size={16} className="ml-1" />
                        </Button>
                     </div>

                     {/* Floating mini cards */}
                     <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                        className="absolute -left-4 bottom-[30%] bg-white rounded-xl px-3 py-2 shadow-xl shadow-black/10 flex items-center gap-2"
                     >
                        <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                           <CheckCircle2 size={12} className="text-emerald-500" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 whitespace-nowrap">Verified Pro</span>
                     </motion.div>

                     <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4, duration: 0.5 }}
                        className="absolute -right-3 top-[25%] bg-white rounded-xl px-3 py-2 shadow-xl shadow-black/10 flex items-center gap-2"
                     >
                        <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center">
                           <Star size={12} className="text-amber-500 fill-amber-500" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 whitespace-nowrap">Top Rated</span>
                     </motion.div>
                  </div>
               </div>
            </motion.div>
         </div>
      </section>

      {/* ── TOP FREELANCERS LIST ── */}
      <TopFreelancersSection />

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 lg:py-32 px-6 lg:px-10 relative z-10">
         <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="max-w-7xl mx-auto space-y-16"
         >
            <motion.div variants={fadeUp} className="text-center space-y-4">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[12px] font-semibold border border-blue-100/50">
                  <Cpu size={14} /> The Process
               </div>
               <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">Hire in 3 Simple Steps</h2>
               <p className="text-lg text-slate-500 max-w-xl mx-auto">From posting to hiring — in under 5 minutes.</p>
             </motion.div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Step Card with Hover Interactions */}
                {[{ step: '01', title: 'Select Service', desc: 'Choose from hundreds of premium services or describe your specific fix.', icon: <MousePointer2 size={22} />, iconBg: 'bg-blue-50 text-blue-600' },
                  { step: '02', title: 'Enter Details', desc: 'Our AI summarizes your requirements to find the most specialized expert.', icon: <Cpu size={22} />, iconBg: 'bg-indigo-50 text-indigo-600' },
                  { step: '03', title: 'Secure Payment', desc: 'Confirm with one-click escrow protection. Pay only when satisfied.', icon: <Zap size={22} />, iconBg: 'bg-violet-50 text-violet-600' }
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeUp} custom={i}
                     whileHover={{ scale: 1.03, y: -8 }}
                     className="relative bg-white rounded-2xl p-8 space-y-5 group border border-slate-100/80 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-default"
                  >
                     <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6`}>
                           {item.icon}
                        </div>
                        <span className="text-5xl font-extrabold text-slate-100/80 group-hover:text-blue-100 transition-colors duration-500">{item.step}</span>
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{item.title}</h3>
                     <p className="text-[14px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                  </motion.div>
                ))}
             </div>
          </motion.div>
       </section>

      {/* ── FEATURES ── */}
      <section className="py-24 lg:py-32 px-6 lg:px-10 bg-slate-50/50 relative z-10">
         <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
         >
            <motion.div variants={fadeUp} className="space-y-10">
               <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[12px] font-semibold border border-indigo-100/50">
                     <ShieldCheck size={14} /> Why GigIndia
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">Everything You Need to Scale Your Team.</h2>
                  <p className="text-slate-500 text-base max-w-md">Built for speed, trust, and global payments. Every feature is designed to get results faster.</p>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                     { icon: <Sparkles size={18} />, title: 'AI Matching', desc: 'Smart algorithm finds talent by fit, not just keywords.', iconBg: 'bg-blue-50 text-blue-600' },
                     { icon: <Lock size={18} />, title: 'Escrow Secure', desc: 'Funds released only when you are 100% satisfied.', iconBg: 'bg-emerald-50 text-emerald-600' },
                     { icon: <Globe size={18} />, title: 'Global Pay', desc: 'Pay in USD, EUR, or INR via Stripe & Razorpay.', iconBg: 'bg-amber-50 text-amber-600' },
                     { icon: <ShieldCheck size={18} />, title: 'Dispute Resolution', desc: 'Professional admin review for total peace of mind.', iconBg: 'bg-purple-50 text-purple-600' }
                  ].map((f, i) => (
                     <motion.div key={i} variants={fadeUp} custom={i}
                        className="bg-white rounded-2xl p-6 space-y-3 border border-slate-100/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                     >
                        <div className={`w-10 h-10 rounded-xl ${f.iconBg} flex items-center justify-center`}>{f.icon}</div>
                        <h4 className="font-bold text-slate-900 text-[15px]">{f.title}</h4>
                        <p className="text-[13px] text-slate-500 leading-relaxed">{f.desc}</p>
                     </motion.div>
                  ))}
               </div>
            </motion.div>
            
            <motion.div variants={fadeUp} custom={2}
               className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-10 lg:p-14 text-white space-y-8 relative overflow-hidden shadow-2xl shadow-slate-900/40"
            >
               <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/[0.06] rounded-full -translate-y-1/2 translate-x-1/2" />
               <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-indigo-500/[0.06] rounded-full translate-y-1/2 -translate-x-1/2" />
               
               <div className="relative z-10 space-y-8">
                  <h3 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">Join the next-gen of{' '}
                     <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Global Hiring</span>.
                  </h3>
                  <ul className="space-y-5">
                     {['Zero Platform Fees for First Hire', 'Aadhaar Verified Talent Pool', 'Instant UPI Payouts'].map(text => (
                        <li key={text} className="flex items-center gap-3.5">
                           <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                              <CheckCircle2 className="text-blue-400" size={15} />
                           </div>
                           <span className="text-sm font-medium text-slate-300">{text}</span>
                        </li>
                     ))}
                  </ul>
                  <Button onClick={() => router.push('/register')} 
                     className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-semibold text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 border-0"
                  >
                     Create Free Account <ArrowRight size={16} className="ml-2" />
                  </Button>
               </div>
            </motion.div>
         </motion.div>
      </section>

      {/* ── ENTERPRISE LEAD CAPTURE ── */}
      <section className="py-24 lg:py-32 px-6 lg:px-10 relative z-10">
         <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
         >
            <motion.div variants={fadeUp} className="space-y-6">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-600 rounded-full text-[12px] font-semibold border border-violet-100/50">
                  <Users size={14} /> Enterprise Scale
               </div>
               <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Need a{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Custom Squad?</span>
               </h2>
               <p className="text-lg text-slate-500 max-w-lg leading-relaxed">
                  Looking to hire 10+ freelancers or need custom enterprise compliance? Our growth team will build your squad manually.
               </p>
               <div className="flex items-center gap-5 pt-8 border-t border-slate-100">
                  <div className="flex -space-x-2.5">
                     {[1,2,3].map(i => (
                        <div key={i} className="w-11 h-11 rounded-full border-[3px] border-white bg-slate-100 overflow-hidden shadow-sm">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=expert${i}`} alt="expert" loading="lazy" />
                        </div>
                     ))}
                  </div>
                  <p className="text-[13px] font-medium text-slate-400 leading-snug">Our expert concierge team<br />is ready to assist.</p>
               </div>
            </motion.div>

            <motion.div variants={fadeUp} custom={1}>
               <Card className="p-8 lg:p-10 border border-slate-100/80 bg-white shadow-xl shadow-slate-900/[0.04] rounded-3xl space-y-7">
                  <div className="space-y-1.5">
                     <h3 className="text-xl font-bold text-slate-900">Enterprise Inquiry</h3>
                     <p className="text-[13px] text-slate-400 font-medium">Get a response within 2 hours.</p>
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
                     <input name="name" placeholder="Contact Name" required className="w-full h-13 px-5 bg-slate-50/80 border border-slate-100 rounded-xl text-sm font-medium focus:ring-4 ring-blue-500/10 focus:border-blue-200 outline-none transition-all placeholder:text-slate-300" />
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input name="email" type="email" placeholder="Business Email" required className="w-full h-13 px-5 bg-slate-50/80 border border-slate-100 rounded-xl text-sm font-medium focus:ring-4 ring-blue-500/10 focus:border-blue-200 outline-none transition-all placeholder:text-slate-300" />
                        <input name="company" placeholder="Company Name" className="w-full h-13 px-5 bg-slate-50/80 border border-slate-100 rounded-xl text-sm font-medium focus:ring-4 ring-blue-500/10 focus:border-blue-200 outline-none transition-all placeholder:text-slate-300" />
                     </div>
                     <textarea name="requirement" placeholder="Project Requirements..." required className="w-full h-28 p-5 bg-slate-50/80 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 ring-blue-500/10 focus:border-blue-200 outline-none transition-all resize-none placeholder:text-slate-300" />
                     <Button type="submit" className="w-full h-13 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all duration-300 border-0">
                        Send Inquiry <ArrowRight size={16} className="ml-2" />
                     </Button>
                  </form>
               </Card>
            </motion.div>
         </motion.div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-28 lg:py-40 px-6 lg:px-10 text-center relative z-10">
         <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
            className="max-w-3xl mx-auto space-y-8"
         >
            <motion.h2 variants={fadeUp}
               className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]"
            >
               Ready to{' '}
               <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Get It Done?</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1}
               className="text-lg text-slate-500 max-w-lg mx-auto"
            >
               Stop scrolling. Start hiring. Get your first project delivered this week.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
               <Button onClick={() => router.push('/post-job')} 
                  className="h-16 px-12 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-2xl font-semibold text-base shadow-2xl shadow-slate-900/25 hover:shadow-slate-900/35 transition-all duration-300 hover:scale-[1.02] border-0"
               >
                  Start Hiring Now <ArrowRight size={18} className="ml-2" />
               </Button>
            </motion.div>
         </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-16 border-t border-slate-100 px-6 lg:px-10 relative z-10 bg-white/50">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center text-white font-bold text-[10px]">GI</div>
               <span className="text-lg font-extrabold tracking-tight text-slate-900">GigIndia</span>
            </div>
            <div className="flex gap-8 text-[13px] font-medium text-slate-400">
               {['About', 'Privacy', 'Security', 'Twitter'].map(link => (
                  <a key={link} href="#" className="hover:text-slate-900 transition-colors duration-200">{link}</a>
               ))}
            </div>
            <div className="text-[12px] font-medium text-slate-300">
               © 2026 GigIndia. All Rights Reserved.
            </div>
         </div>
      </footer>

      {/* ── Custom shimmer animation ── */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .h-13 {
          height: 3.25rem;
        }
      `}</style>
    </div>
  );
}
