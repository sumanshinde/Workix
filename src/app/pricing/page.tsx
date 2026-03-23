'use client';

import React, { useState, useEffect } from 'react';
import { Check, Zap, Sparkles, Shield, Rocket, ArrowRight, Star, Globe, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { subscriptionAPI } from '../../services/api';
import { Button, Card } from '../../components/ui';

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Load script for Razorpay
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    // Fetch local user session
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    
    return () => { document.body.removeChild(script); };
  }, []);

  const handleUpgrade = async () => {
    if (!user) {
       alert("Please login to proceed with upgrade.");
       return;
    }
    
    setLoading(true);
    try {
      const sub = await subscriptionAPI.create(user.id);
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        subscription_id: sub.id,
        name: 'BharatGig Pro',
        description: 'Elite Freelancing Tier',
        image: '/logo.png',
        handler: function (response: any) {
           // On Success (Note: The actual DB status is updated via Webhook)
           window.location.href = '/dashboard?success=pro';
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#2563eb'
        }
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(err.message || 'Payment initiation failed.');
    } finally {
      setLoading(false);
    }
  };

  const PlanFeature = ({ text, bold }: { text: string; bold?: boolean }) => (
    <div className="flex items-start gap-3">
      <div className="mt-1 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 flex-shrink-0">
        <Check size={12} className="text-blue-600" />
      </div>
      <span className={`text-sm ${bold ? 'font-bold text-slate-900' : 'font-medium text-slate-500'}`}>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-manrope selection:bg-blue-100 selection:text-blue-600">
      
      {/* 1. HERO */}
      <section className="relative pt-24 pb-12 overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
            <motion.div 
               initial={{ opacity: 0, y: 10 }} 
               whileInView={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest"
            >
               <Star size={12} fill="currentColor" /> Elevate Your Career
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
               Transparent Pricing for <br />
               <span className="text-blue-600">Elite Professionals.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg font-medium text-slate-500 leading-relaxed">
               Choose BharatGig Pro to unlock high-impact opportunities, 0% lead costs, and AI-driven priority matching.
            </p>
         </div>
      </section>

      {/* 2. PRICING GRID */}
      <section className="py-20 bg-slate-50/50">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* FREE PLAN */}
            <Card className="p-12 space-y-10 border-0 bg-white shadow-sm hover:shadow-xl transition-shadow duration-700">
               <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900">Standard</h3>
                  <div className="flex items-baseline gap-1">
                     <span className="text-5xl font-black text-slate-900">₹0</span>
                     <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">/ Lifetime</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500">Perfect for exploring the ecosystem.</p>
               </div>
               
               <div className="space-y-6">
                  <PlanFeature text="Basic Marketplace Access" />
                  <PlanFeature text="Standard Proposals (2-5 Credits Cost)" />
                  <PlanFeature text="Basic Profile Customization" />
                  <PlanFeature text="24h Support Response" />
               </div>

               <Button variant="outline" className="w-full h-14 rounded-2xl text-lg font-bold">Current Plan</Button>
            </Card>

            {/* PRO PLAN (HIGHLIGHTED) */}
            <Card className="p-12 space-y-10 border-2 border-blue-600 relative overflow-hidden bg-white shadow-2xl shadow-blue-600/10">
               <div className="absolute top-0 right-0 px-6 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
                  Most Valued
               </div>
               
               <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-600">
                     <Zap size={20} fill="currentColor" />
                     <h3 className="text-2xl font-black italic">BHARATGIG PRO</h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                     <span className="text-5xl font-black text-slate-900">₹299</span>
                     <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">/ Per Month</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500">Aggressive visibility for serious builders.</p>
               </div>
               
               <div className="space-y-6">
                  <PlanFeature text="Zero Credit Bid Cost (Fair-Bid Elite)" bold />
                  <PlanFeature text="Priority Marketplace Placement" bold />
                  <PlanFeature text="AI-Driven Direct Lead Injection" bold />
                  <PlanFeature text="Pro Exclusive Verified Badge" bold />
                  <PlanFeature text="One-Click Lead Lock Refunds" />
                  <PlanFeature text="Instant Support (Chat Priority)" />
               </div>

               <Button 
                  onClick={handleUpgrade}
                  isLoading={loading}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-bold shadow-xl shadow-blue-500/20 group"
               >
                  Upgrade to Pro <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
               </Button>
            </Card>

         </div>
      </section>

      {/* 3. FAQ */}
      <section className="py-32">
         <div className="max-w-4xl mx-auto px-6 space-y-16">
            <div className="text-center space-y-4">
               <div className="flex items-center justify-center gap-3 text-slate-300">
                  <HelpCircle size={32} />
               </div>
               <h4 className="text-3xl font-bold text-slate-900">Everything you want to know.</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {[
                  { q: "What is 'Zero Credit Bidding'?", a: "Pro users do not consume any credits when submitting proposals. You can bid on as many jobs as you want." },
                  { q: "How does 'Priority Placement' work?", a: "Your profile and bids appear at the top of the client's dashboard, highlighted with the BharatGig Pro badge." },
                  { q: "Is there a lock-in period?", a: "No. You can cancel your Pro subscription anytime via your billing dashboard." },
                  { q: "Are the payments secure?", a: "Absolutely. We use Razorpay's high-grade encryption and 3D Secure verification for all transactions." }
               ].map((item, i) => (
                  <div key={i} className="space-y-3">
                     <h5 className="font-bold text-slate-900">{item.q}</h5>
                     <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.a}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 4. FOOTER CTA */}
      <section className="bg-slate-900 py-32 overflow-hidden relative">
         <div className="max-w-7xl mx-auto px-6 text-center space-y-8 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Ready to stop hunting and <br /> start building?</h2>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                  <Button className="h-14 px-10 rounded-2xl bg-white text-slate-900 font-bold hover:bg-blue-600 hover:text-white group">
                     Join BharatGig Pro <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <p className="text-slate-400 text-sm font-bold">14-day Money Back Guarantee</p>
               </div>
         </div>
         <div className="absolute top-0 right-0 w-[60%] h-full bg-blue-600/10 blur-[150px] rotate-45" />
      </section>

    </div>
  );
}
