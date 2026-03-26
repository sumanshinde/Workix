'use client';

import React, { useState, useEffect } from 'react';
import { Check, Zap, Sparkles, Shield, Rocket, ArrowRight, Star, Globe, HelpCircle, ChevronDown, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { paymentsAPI } from '../../services/api';
import { Button, Card } from '../../components/ui';

const basicOptions = [
  { price: 29, profiles: 5 }, { price: 49, profiles: 10 }, { price: 69, profiles: 15 },
  { price: 99, profiles: 25 }, { price: 129, profiles: 40 }, { price: 149, profiles: 70 },
  { price: 199, profiles: 85 }, { price: 229, profiles: 100 }
];

const premiumOptions = [
  { price: 249, profiles: 120 }, { price: 268, profiles: 140 }, { price: 299, profiles: 150 },
  { price: 339, profiles: 180 }, { price: 349, profiles: 200 }, { price: 399, profiles: 239 }
];

const professionalOptions = [
  { price: 499, profiles: 350 }, { price: 599, profiles: 500 }, { price: 799, profiles: 800 }
];

const eliteOptions = [
  { price: 999, profiles: 'Unlimited' }
];

function PlanFeature({ text, bold }: { text: string; bold?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 flex-shrink-0">
        <Check size={12} className="text-blue-600" />
      </div>
      <span className={`text-sm ${bold ? 'font-bold text-slate-900' : 'font-medium text-slate-500'}`}>{text}</span>
    </div>
  );
}

function PricingCard({ 
  title, 
  icon: Icon, 
  options, 
  isPopular, 
  features,
  colorClass,
  btnClass,
  onUpgrade,
  loading
}: any) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const currentOption = options[selectedIdx];

  return (
    <Card className={`p-8 relative overflow-hidden bg-white hover:-translate-y-1 transition-all duration-300 flex flex-col h-full ${isPopular ? 'border-2 border-blue-600 shadow-xl shadow-blue-600/10' : 'border border-slate-200 shadow-sm hover:shadow-lg'}`}>
       {isPopular && (
         <div className="absolute top-0 inset-x-0 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest text-center py-1.5">
            Most Popular
         </div>
       )}
       
       <div className={`mt-${isPopular ? '4' : '0'} space-y-5 flex-1`}>
          <div className="flex items-center gap-2">
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
               <Icon size={20} />
             </div>
             <h3 className="text-xl font-black text-slate-900">{title}</h3>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Package</p>
            <div className="relative">
              <select 
                value={selectedIdx} 
                onChange={(e) => setSelectedIdx(Number(e.target.value))}
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {options.map((opt: any, i: number) => (
                  <option key={i} value={i}>
                    {opt.profiles} Client Profiles
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          <div className="pt-2 pb-4 border-b border-slate-100">
             <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">₹{currentOption.price}</span>
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">/ Pack</span>
             </div>
          </div>
          
          <div className="space-y-4 pt-2">
             {features.map((feat: any, i: number) => (
                <PlanFeature key={i} text={feat.text} bold={feat.bold} />
             ))}
          </div>
       </div>

       <div className="mt-8 pt-4">
          <Button 
             onClick={(e) => onUpgrade(e, title, currentOption.price, currentOption.profiles)}
             isLoading={loading}
             className={`w-full h-14 rounded-xl text-sm font-bold shadow-lg transition-transform hover:scale-[1.02] ${btnClass}`}
          >
             Choose {title}
          </Button>
       </div>
    </Card>
  );
}

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    
    return () => { document.body.removeChild(script); };
  }, []);

  const handleUpgrade = async (e: any, planName: string, amount: number, profiles: any) => {
    if (e?.preventDefault) e.preventDefault();
    
    if (!user) {
       alert("Please login to proceed with upgrade.");
       return;
    }
    
    setLoading(true);
    try {
      // 1. Create a Global Payment Order for the dynamic amount 
      const res = await paymentsAPI.createGlobal({ amount, currency: 'INR', country: 'IN' });
      
      if (!res.order || !res.order.id) {
         throw new Error("Could not generate order. Please try again.");
       }
       
       const keyToUse = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder';
       
       const options = {
         key: keyToUse,
         amount: amount * 100, 
         currency: 'INR',
         order_id: res.order.id, 
         name: `GigIndia ${planName}`,
         description: `Unlock ${profiles} Client Profiles`,
         image: '/logo.png',
         handler: function (response: any) {
            // Success call back - avoid immediate hard redirect if we want a message first
            alert("Payment Verified! Synchronizing your account...");
            window.location.href = '/dashboard?success=pack_purchased';
         },
         prefill: { name: user.name, email: user.email },
         theme: { color: '#2563eb' },
         modal: {
            ondismiss: function() { setLoading(false); }
         }
       };
       
       // Handle Test Mode logic
       if (keyToUse === 'rzp_test_placeholder' || keyToUse === 'your_razorpay_key') {
          setTimeout(() => {
            alert(`Mock Payment Process Initiated for ${planName}.`);
            setLoading(false);
            // In mock mode, we manually trigger the success view after confirmation
            if (confirm("Confirm Mock Purchase?")) {
              window.location.href = '/dashboard?success=pack_purchased';
            }
          }, 1000);
          return;
       }
 
       const rzp = new (window as any).Razorpay(options);
       rzp.on('payment.failed', function (response: any) {
         alert(response.error.description || 'Payment Failed');
       });
       rzp.open();
     } catch (err: any) {
       alert(err.message || 'Payment initiation failed.');
     } finally {
       // Only finalize loading if not redirecting immediately
       // In real rzp.open(), loading should stay until handler or ondismiss
     }
   };

  return (
    <div className="min-h-screen bg-[#fafbff] font-manrope selection:bg-blue-100 selection:text-blue-600">
      
      {/* 1. HERO */}
      <section className="relative pt-24 pb-16 overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 text-center space-y-6 relative z-10">
            <motion.div 
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest"
            >
               <Star size={12} fill="currentColor" /> Elevate Your Reach
            </motion.div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
               Connect with Clients. <br />
               <span className="text-blue-600">On Your Terms.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg font-medium text-slate-500 leading-relaxed md:px-0 px-4">
               Choose the exact number of client profiles you need. No hidden fees. Pay for access, get hired faster.
            </p>
         </div>
         {/* Background ambient glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-400/10 blur-[120px] rounded-full point-events-none" />
      </section>

      {/* 2. PRICING GRID */}
      <section className="py-12 bg-transparent relative z-10">
         <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
               
               {/* BASIC */}
               <PricingCard 
                  title="Basic"
                  icon={Shield}
                  options={basicOptions}
                  colorClass="bg-slate-100 text-slate-600"
                  btnClass="bg-white text-slate-900 border border-slate-200 hover:bg-slate-50"
                  features={[
                     { text: "Standard Marketplace Visibility" },
                     { text: "Basic Client Insights" },
                     { text: "Email Support" }
                  ]}
                  onUpgrade={handleUpgrade}
                  loading={loading}
               />

               {/* PREMIUM */}
               <PricingCard 
                  title="Premium"
                  icon={Zap}
                  options={premiumOptions}
                  isPopular={true}
                  colorClass="bg-blue-100 text-blue-600"
                  btnClass="bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-600/25"
                  features={[
                     { text: "Priority Highlight in Search", bold: true },
                     { text: "Advanced Client History" },
                     { text: "24/7 Priority Support" },
                     { text: "Verified Premium Badge", bold: true }
                  ]}
                  onUpgrade={handleUpgrade}
                  loading={loading}
               />

               {/* PROFESSIONAL */}
               <PricingCard 
                  title="Professional"
                  icon={Sparkles}
                  options={professionalOptions}
                  colorClass="bg-purple-100 text-purple-600"
                  btnClass="bg-purple-600 text-white hover:bg-purple-700 hover:shadow-purple-600/25"
                  features={[
                     { text: "Top 3 Search Placement", bold: true },
                     { text: "AI Proposal Assistant" },
                     { text: "Dedicated Success Manager" },
                     { text: "Unlimited Client Messaging", bold: true }
                  ]}
                  onUpgrade={handleUpgrade}
                  loading={loading}
               />

               {/* ELITE */}
               <PricingCard 
                  title="Elite"
                  icon={Crown}
                  options={eliteOptions}
                  colorClass="bg-amber-100 text-amber-600"
                  btnClass="bg-slate-900 text-white hover:bg-slate-800 hover:shadow-slate-900/25"
                  features={[
                     { text: "Direct Lead Injection (Exclusive)", bold: true },
                     { text: "White-glove matching service" },
                     { text: "NDA & Enterprise Contracts" },
                     { text: "Instant Payouts", bold: true }
                  ]}
                  onUpgrade={handleUpgrade}
                  loading={loading}
               />

            </div>
         </div>
      </section>

      {/* 3. FAQ */}
      <section className="py-24 bg-white mt-12 border-t border-slate-100">
         <div className="max-w-4xl mx-auto px-6 space-y-16">
            <div className="text-center space-y-4">
               <div className="flex items-center justify-center gap-3 text-blue-500">
                  <HelpCircle size={32} />
               </div>
               <h4 className="text-3xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {[
                  { q: "How do client profiles work?", a: "Each plan comes with a specific amount of client profile views. This lets you access their direct contact information and hiring history." },
                  { q: "Can I upgrade my package later?", a: "Yes, you can buy larger profile packs anytime. They safely stack on top of your existing views." },
                  { q: "Do the views expire?", a: "No, purchased profile views do not expire as long as your account remains active." },
                  { q: "Are the payments secure?", a: "Absolutely. We use Razorpay's high-grade encryption and 3D Secure verification for all transactions." }
               ].map((item, i) => (
                  <div key={i} className="space-y-3">
                     <h5 className="font-bold text-slate-900 text-lg">{item.q}</h5>
                     <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.a}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 4. FOOTER CTA */}
      <section className="bg-slate-900 py-24 sm:py-32 overflow-hidden relative">
         <div className="max-w-7xl mx-auto px-6 text-center space-y-8 relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
               Build your freelancing empire.
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
               <Button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="h-14 px-10 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-xl shadow-blue-500/20">
                  Select a Plan
               </Button>
            </div>
         </div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none" />
      </section>

    </div>
  );
}
