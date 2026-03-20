'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Zap, TrendingUp, Users, 
  CheckCircle2, ArrowRight, Star, 
  Sparkles, ShieldCheck, Globe, Code, 
  Palette, Terminal, Shield, BriefcaseIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BRANDING } from '@/lib/config';
import { analyticsAPI } from '@/services/api';

export default function Home() {
  const router = useRouter();
  React.useEffect(() => {
    analyticsAPI.track('landing_hero_view', 'growth');
  }, []);

  const categories = [
    { name: 'Engineering',   icon: <Code size={20} />,        gradient: 'from-[#2563eb] to-[#4f46e5]',     light: 'bg-blue-50',   text: 'text-blue-600' },
    { name: 'Creative',      icon: <Palette size={20} />,     gradient: 'from-[#8b5cf6] to-[#d946ef]',     light: 'bg-purple-50', text: 'text-purple-600' },
    { name: 'Intelligence',  icon: <Terminal size={20} />,    gradient: 'from-[#4338ca] to-[#3b82f6]',     light: 'bg-indigo-50', text: 'text-indigo-600' },
    { name: 'Performance',   icon: <TrendingUp size={20} />,  gradient: 'from-[#059669] to-[#10b981]',     light: 'bg-emerald-50',text: 'text-emerald-600' },
    { name: 'Advisory',      icon: <BriefcaseIcon size={20} />, gradient: 'from-[#f59e0b] to-[#ea580c]',   light: 'bg-orange-50', text: 'text-orange-600' },
    { name: 'Compliance',    icon: <Shield size={20} />,      gradient: 'from-[#dc2626] to-[#991b1b]',     light: 'bg-rose-50',   text: 'text-rose-600' },
  ];

  const featuredFreelancers = [
    { name: 'Aditya Sharma', role: 'Full-Stack Architect',  rating: 4.95, reviews: 154, price: 1500, avatar: 'AS', color: 'from-[#2563eb] to-[#4f46e5]' },
    { name: 'Priya Verma',   role: 'Product Designer',      rating: 5.0,  reviews: 92,  price: 1200, avatar: 'PV', color: 'from-[#8b5cf6] to-[#d946ef]' },
    { name: 'Karan Mehra',   role: 'ML Engineer',           rating: 4.8,  reviews: 67,  price: 2000, avatar: 'KM', color: 'from-[#059669] to-[#10b981]' },
    { name: 'Sneha Rao',     role: 'Cloud Specialist',      rating: 4.9,  reviews: 110, price: 1800, avatar: 'SR', color: 'from-[#f59e0b] to-[#ea580c]' },
  ];

  const stats = [
    { label: 'Elite Professionals', value: '50K+',  icon: <Users size={18} /> },
    { label: 'Gigs Fulfilled',      value: '120K+', icon: <BriefcaseIcon size={18} /> },
    { label: 'Platform Rating',     value: '4.9★',  icon: <Star size={18} /> },
    { label: 'Success Velocity',    value: '98%',   icon: <CheckCircle2 size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-600">
      
      {/* ── NAV ── */}
      <nav className="fixed top-0 w-full z-[100] h-16 px-6 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
            <div className="w-9 h-9 bg-gradient-to-br from-[#2563eb] to-[#4f46e5] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              {BRANDING.shortName}
            </div>
            <span className="text-xl font-extrabold tracking-tight text-gray-900">{BRANDING.name}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-6 text-[12px] font-bold uppercase tracking-widest text-gray-400">
              <a href="/marketplace" className="hover:text-blue-600 transition-colors">Find Talent</a>
              <a href="/job-board"   className="hover:text-blue-600 transition-colors">Find Work</a>
              <a href="/help"        className="hover:text-blue-600 transition-colors">Resources</a>
            </nav>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <button 
                onClick={() => router.push('/login')} 
                className="h-10 text-sm font-bold text-gray-900 bg-gray-50 hover:bg-gray-100 px-5 rounded-lg transition-all"
              >
                Log In
              </button>
              <button 
                onClick={() => router.push('/register')} 
                className="h-10 bg-gradient-to-r from-[#2563eb] to-[#4f46e5] text-white px-5 rounded-lg font-bold text-sm shadow-lg shadow-blue-500/20 hover:opacity-90 transition-all active:scale-95"
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-16 pb-12 md:pt-24 md:pb-16 overflow-hidden bg-white">

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl mx-auto text-center px-4"
          >
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/50 border border-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest mb-6">
              <span className="w-1 h-1 bg-blue-600 rounded-full mr-1.5" />
              <span>Trusted by 500+ Top Indian Companies</span>
            </div>

            {/* Hero headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tighter leading-[0.95] text-gray-900">
              Hire India's <span className="text-[#2563eb]">Top <br />
              Freelancers,</span> <br />
              Faster
            </h1>

            <p className="text-gray-500 max-w-2xl mx-auto mb-10 text-base md:text-lg font-medium leading-relaxed">
              Discover verified experts for your next project. Fast, reliable, and specialized expertise at your fingertips.
            </p>

            <div className="max-w-2xl mx-auto mb-6 relative">
              <div className="bg-white p-1 rounded-[24px] shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-gray-100 flex items-center group focus-within:ring-2 ring-blue-500/10 transition-all">
                <Search size={20} className="ml-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search for services (e.g. Web Dev, UI Design, AI)" 
                  className="w-full h-12 bg-transparent border-none focus:ring-0 px-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 text-center md:text-left"
                />
              </div>
              <div className="mt-4 flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                <span>Popular:</span>
                <button className="hover:text-blue-600 transition-colors">Design</button>
                <button className="hover:text-blue-600 transition-colors">Web Dev</button>
                <button className="hover:text-blue-600 transition-colors">Writing</button>
                <button className="hover:text-blue-600 transition-colors">AI</button>
              </div>
            </div>

            {/* Action Meta (Hidden for cleaner hero, or used elsewhere) */}
            <p className="absolute bottom-10 right-10 text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 group cursor-pointer hover:text-gray-900 transition-colors">
              View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="py-12 border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <p className="text-4xl font-extrabold text-gray-900 tracking-tight">{s.value}</p>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-2">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-32 md:py-48 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
            <div className="space-y-4 max-w-2xl text-left">
              <div className="text-[11px] font-bold uppercase tracking-[0.4em] text-blue-600">Expertise Network</div>
              <h2 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">Browse by industry leading categories</h2>
            </div>
            <button className="flex items-center gap-3 text-[13px] font-extrabold uppercase tracking-widest text-[#2563eb] border-b-2 border-transparent hover:border-blue-600 pb-2 transition-all">
              Explore All <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => router.push('/marketplace')}
                className="p-10 bg-gray-50/50 rounded-[32px] border border-gray-100 flex flex-col items-start gap-8 cursor-pointer group hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white flex items-center justify-center shadow-lg shadow-blue-500/10`}>
                  {cat.icon}
                </div>
                <div>
                  <div className="font-black text-xl tracking-tight text-gray-900 mb-2">{cat.name}</div>
                  <p className="text-sm font-medium text-gray-400 group-hover:text-blue-600 transition-colors">Discover World-Class Professionals &rarr;</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS (Saas Style Cards) ── */}
      <section className="py-32 bg-[#FAFBFD] border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6 mb-24">
            <p className="text-[#22c55e] font-black text-xs uppercase tracking-[0.5em]">Global Standards</p>
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter max-w-4xl mx-auto leading-tight">Trusted by India&apos;s leading tech entrepreneurs & professionals</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { name: 'Rajesh Kumar', role: 'CTO, TechFlow', content: 'BharatGig has redefined our hiring velocity. The pre-vetted network is truly Tier-1.', avatar: 'RK' },
              { name: 'Ananya Singh', role: 'Founder, CloudScale', content: 'The UPI escrow and compliance tools are game changers for Indian startups.', avatar: 'AS' },
              { name: 'Vikram Seth', role: 'Solutions Architect', content: 'Finally, a platform that respects the craft. Zero-commission start is brilliant.', avatar: 'VS' },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 flex flex-col justify-between"
              >
                <div className="mb-10">
                  <div className="flex gap-1 mb-6">
                    {[1,2,3,4,5].map(star => <Star key={star} size={14} fill="#22c55e" className="text-[#22c55e]" />)}
                  </div>
                  <p className="text-lg font-medium text-gray-600 leading-relaxed italic">&quot;{t.content}&quot;</p>
                </div>
                <div className="flex items-center gap-4 pt-8 border-t border-gray-100">
                  <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 tracking-tight">{t.name}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 pb-20 border-b border-gray-100">
            <div className="col-span-1 md:col-span-1 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2563eb] to-[#4f46e5] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/10">
                  {BRANDING.shortName}
                </div>
                <span className="text-2xl font-black text-gray-900 tracking-tight">{BRANDING.name}</span>
              </div>
              <p className="text-sm font-medium text-gray-400 leading-relaxed uppercase tracking-wider">India&apos;s Premium Marketplace — Tier-1 Talent, UPI-Powered, Zero Compliance Burden.</p>
            </div>

            <div className="col-span-1 md:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-10">
              {[
                { title: 'Marketplace', links: ['Hire Talent', 'Find Work', 'Categories', 'Verify Now'] },
                { title: 'Resources', links: ['Legal & Compliance', 'Help Center', 'API Docs', 'Affiliates'] },
                { title: 'Governance', links: ['Aadhaar Policy', 'Escrow Security', 'GST Compliance', 'Privacy'] },
                { title: 'Company',   links: ['About Us', 'Mission', 'Twitter', 'Careers'] },
              ].map(col => (
                <div key={col.title} className="space-y-6 text-left">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-900">{col.title}</h4>
                  <ul className="space-y-4">
                    {col.links.map(l => (
                      <li key={l}><a href="#" className="text-[13px] font-bold text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest">{l}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">© 2026 {BRANDING.companyName}. SECURE IDENTITY VERIFIED.</p>
            <div className="flex gap-6">
              {['Twitter', 'LinkedIn', 'GitHub'].map(s => (
                <a key={s} href="#" className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] hover:text-blue-600 transition-colors">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
