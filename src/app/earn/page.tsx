'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Zap,
  Globe,
  Award,
  Wallet,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BRANDING } from '@/lib/config';
import { Button, Card } from '@/components/ui';
import { analyticsAPI } from '@/services/api';

export default function EarnLandingPage() {
  const router = useRouter();

  React.useEffect(() => {
    analyticsAPI.track('lp_earn_view', 'ads_traffic');
  }, []);

  const benefits = [
    { title: 'Premium Projects', desc: 'Secure high-paying contracts from top-tier Indian startups.', icon: <Briefcase className="text-blue-600" /> },
    { title: 'Prompt Payments', desc: 'UPI-integrated payments with Lead Lock escrow security.', icon: <Wallet className="text-emerald-600" /> },
    { title: 'Identity Verification', desc: 'Increase your reach with e-KYC verified status.', icon: <ShieldCheck className="text-amber-500" /> },
  ];

  const handleCTA = () => {
    analyticsAPI.track('lp_earn_cta_click', 'ads_traffic');
    router.push('/register?role=freelancer');
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-600">
      
      {/* ── MINIMAL NAV ── */}
      <nav className="h-16 px-6 md: flex items-center justify-between bg-white border-b border-gray-50 sticky top-0 z-[100]">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-10 h-10-lg shadow-sm shadow-blue-200">
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
        <section className="pt-24 pb-20 text-center to-white overflow-hidden relative text-[#111827]">
          
          
          <div className="max-w-4xl mx-auto space-y-8 relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase tracking-widest rounded-full border border-indigo-100 animate-fade-in shadow-sm">
              <Zap size={14} fill="currentColor" /> Limited-time offer: 0% Platform Fee
            </div>
            
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
              Earn high-value <br />
              <span className="text-transparent bg-clip-text">Indian Projects</span> <br />
              on your terms.
            </h1>

            <p className="max-w-xl mx-auto text-sm text-gray-500 font-medium leading-relaxed">
              Don&apos;t just freelance—thrive. Access premium contracts with verified payments and 0% commission for the first 30 days.
            </p>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={handleCTA} className="rounded-lg text-sm shadow-sm shadow-blue-500/20 font-bold group">
                Apply as Freelancer <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <div className="flex items-center gap-3 text-sm text-gray-400 font-semibold px-4">
                <CheckCircle2 size={16} className="text-blue-500" /> Start earning in 24h
              </div>
            </div>
          </div>
        </section>

        {/* ── PERFORMANCE STRIP ── */}
        <section className="py-12 border-y border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center group cursor-pointer">
                   <p className="text-3xl font-bold text-blue-600">₹85K+</p>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Avg. Monthly Earning</p>
                </div>
                <div className="text-center group cursor-pointer">
                   <p className="text-3xl font-bold text-indigo-600">500+</p>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Live Mandates</p>
                </div>
                <div className="text-center group cursor-pointer">
                   <p className="text-3xl font-bold text-emerald-600">0%</p>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Initial Commission</p>
                </div>
                <div className="text-center group cursor-pointer">
                   <p className="text-3xl font-bold text-amber-500">KYC</p>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Aadhaar Integrated</p>
                </div>
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

        {/* ── ANALYTICS SNAP ── */}
        <section className="py-24 bg-slate-900 overflow-hidden relative">
           
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
              <div className="space-y-8">
                 <div className="section-label bg-blue-500/10 text-blue-400 border-blue-500/20">Growth</div>
                 <h2 className="text-4xl font-bold text-white leading-tight tracking-tight">Focus on your craft.<br /><span className="text-blue-500">We handle the rest.</span></h2>
                 <p className="text-sm text-slate-400 font-medium leading-relaxed">
                   GigIndia provides tools for contract management, automated invoicing, and a secure payment pipeline so you never hunt for a payment again.
                 </p>
                 <Button onClick={handleCTA} className="rounded-lg bg-white text-blue-900 hover:bg-gray-100 font-bold shadow-sm shadow-white/5">
                   Apply for Access
                 </Button>
              </div>
              <div className="relative p-8 bg-slate-800 rounded-lg border border-slate-700 shadow-sm">
                 <div className="space-y-4">
                    <div className="h-4 w-1/3 bg-slate-700 rounded-lg animate-pulse" />
                    <div className="w-full bg-slate-700 rounded-lg animate-pulse" />
                    <div className="grid grid-cols-2 gap-4">
                       <div className="h-24 bg-blue-500/20 rounded-lg border border-blue-500/30 flex items-center justify-center text-blue-500 font-bold text-sm">Earnings +12%</div>
                       <div className="h-24 bg-emerald-500/20 rounded-lg border border-emerald-500/30 flex items-center justify-center text-emerald-500 font-bold text-sm">Score 100%</div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-24 text-center">
            <h2 className="text-4xl font-semibold text-[#111827] mb-8 tracking-tight">Ready to revolutionize your freelance career?</h2>
            <Button onClick={handleCTA} className="rounded-lg text-sm font-bold shadow-sm shadow-blue-500/30">
               Join Today Free
            </Button>
            <p className="mt-8 text-xs text-gray-400 font-bold uppercase tracking-[0.3em]">No Credit Card • Aadhaar Verified • Elite Access</p>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="py-12 border-t border-gray-100 bg-white text-center">
        <p className="text-sm text-gray-400 font-medium">© 2026 {BRANDING.companyName}. India&apos;s Professional Backend.</p>
      </footer>
    </div>
  );
}
