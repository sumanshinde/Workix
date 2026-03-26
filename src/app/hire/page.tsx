'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Users, 
  Briefcase, 
  Zap,
  Globe,
  Award
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BRANDING } from '@/lib/config';
import { Button, Card } from '@/components/ui';
import { analyticsAPI } from '@/services/api';

export default function HireLandingPage() {
  const router = useRouter();

  React.useEffect(() => {
    analyticsAPI.track('lp_hire_view', 'ads_traffic');
  }, []);

  const benefits = [
    { title: 'Top 1% Talent', desc: 'Handpicked verified professionals from across Bharat.', icon: <Award className="text-blue-600" /> },
    { title: 'Secure Escrow', desc: 'Secure payments with Lead Lock protection.', icon: <ShieldCheck className="text-emerald-600" /> },
    { title: 'Rapid Hiring', desc: 'From posting to first interview in under 24 hours.', icon: <Zap className="text-amber-500" /> },
  ];

  const handleCTA = () => {
    analyticsAPI.track('lp_hire_cta_click', 'ads_traffic');
    router.push('/register?role=client');
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-600">
      
      {/* ── MINIMAL NAV ── */}
      <nav className="h-16 px-6 md: flex items-center justify-between bg-white border-b border-gray-50 sticky top-0 z-[100]">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-blue-200">
            {BRANDING.shortName}
          </div>
          <span className="text-2xl font-semibold tracking-tight text-gray-900">{BRANDING.name}</span>
        </div>
        <Button variant="ghost" className="text-sm font-bold text-gray-500 hover:text-blue-600" onClick={() => router.push('/login')}>
          Login
        </Button>
      </nav>

      <main>
        {/* ── HERO ── */}
        <section className="pt-24 pb-20 text-center to-white overflow-hidden relative">
          
          
          <div className="max-w-4xl mx-auto space-y-8 relative z-10">
            <div className="inline-flex items-center gap-3 px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-100">
              <Star size={12} fill="currentColor" /> Premium Talent Access
            </div>
            
            <h1 className="text-5xl md:text-7xl font-semibold text-[#111827] tracking-tight leading-[1.05]">
              Hire top 1% <br />
              <span className="text-transparent bg-clip-text">Indian Professionals</span> <br />
              in 60 seconds.
            </h1>

            <p className="max-w-xl mx-auto text-sm text-gray-400 font-medium leading-relaxed">
              Skip the noise. Connect with e-KYC verified developers, designers and specialists. Your project—secured by India's only Lead Lock escrow.
            </p>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={handleCTA} className="rounded-lg text-sm shadow-sm shadow-blue-500/20 font-bold group">
                Post Job (Free) <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <div className="flex items-center gap-3 text-sm text-gray-500 font-semibold px-4">
                <CheckCircle2 size={16} className="text-emerald-500" /> Pay only when satisfied
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="py-12 border-y border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-between gap-12 opacity-50 grayscale contrast-125">
               <div className="font-bold text-2xl tracking-tight">RAZORPAY</div>
               <div className="font-bold text-2xl tracking-tight">ZOMATO</div>
               <div className="font-bold text-2xl tracking-tight">SWIGGY</div>
               <div className="font-bold text-2xl tracking-tight">PAYTM</div>
               <div className="font-bold text-2xl tracking-tight hidden md:block">ZEPTO</div>
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            {benefits.map((b, i) => (
              <Card key={i} className="p-8 border-gray-100 hover:border-blue-100 hover:bg-blue-50/5 transition-all">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6">{b.icon}</div>
                <h3 className="text-sm font-bold text-[#111827] mb-3">{b.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{b.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIAL SNAP ── */}
        <section className="py-24 bg-gray-50">
           <div className="max-w-3xl mx-auto text-center space-y-10">
              <div className="w-16 h-1 bg-blue-600 mx-auto rounded-lg" />
               <p className="text-2xl md:text-3xl font-bold text-[#111827] leading-snug">
                 &quot;GigIndia simplified our hiring process for 3 critical roles. The talent quality and payment security are unmatched in India.&quot;
               </p>
               <div className="flex items-center justify-center gap-4">
                  <div className="w-12 rounded-lg bg-blue-100" />
                  <div className="text-left">
                     <p className="font-bold text-gray-900 leading-none">Aman Gupta</p>
                     <p className="text-[10px] uppercase font-bold text-blue-600 tracking-widest mt-1">Founder, Fintech Scale</p>
                  </div>
               </div>
           </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-24 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Ready to start your next gig?</h2>
            <Button onClick={handleCTA} className="rounded-lg text-sm font-bold shadow-sm shadow-blue-500/30">
               Hire Best Talent Now
            </Button>
            <p className="mt-6 text-sm text-gray-400 font-bold uppercase tracking-widest">Free to join • No hidden costs</p>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="py-12 border-t border-gray-100 bg-white text-center">
        <p className="text-sm text-gray-400 font-medium">© 2026 {BRANDING.companyName}. India&apos;s Professional Cluster.</p>
      </footer>
    </div>
  );
}
