'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, CheckCircle2, Crown, Zap, Star,
  Clock, Calendar, ArrowUpRight, Shield, X, ChevronRight,
  CreditCard, Wallet, Check
} from 'lucide-react';
import { authAPI, paymentsAPI, payoutsAPI } from '@/services/api';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    period: 'Forever free',
    desc: 'Get started with essential tools',
    features: ['5 proposals/month', 'Basic profile', 'Community support', 'Standard visibility'],
    icon: <Star size={20} />,
    color: 'from-slate-500 to-slate-600',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 999,
    period: '/month',
    desc: 'Everything you need to scale',
    features: ['Unlimited proposals', 'Boosted profile', 'Priority support', 'Featured badge', 'Analytics dashboard', 'Custom invoice branding'],
    icon: <Zap size={20} />,
    color: 'from-blue-600 to-indigo-600',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 2499,
    period: '/month',
    desc: 'For power users and agencies',
    features: ['Everything in Pro', 'Dedicated manager', 'API access', 'White-label tools', 'Priority matching', 'Team workspace', 'SLA guarantee'],
    icon: <Crown size={20} />,
    color: 'from-amber-500 to-orange-500',
    popular: false,
  },
];

export default function SubscriptionManagementPage() {
  const [user, setUser] = useState<any>(null);
  const [payoutMethod, setPayoutMethod] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    const fetchData = async () => {
       try {
          const [userRes, payoutRes] = await Promise.all([
             authAPI.me(),
             payoutsAPI.getPayoutMethod().catch(() => null)
          ]);
          setUser(userRes);
          setPayoutMethod(payoutRes);
       } catch (e) {
          console.error("Failed to fetch dashboard state", e);
       } finally {
          setLoading(false);
       }
    };
    fetchData();
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  const handleUpgrade = async (e: React.MouseEvent, planId: string, amount: number, planName: string) => {
    e.preventDefault();
    if (!user) return alert("Session expired. Please login again.");
    
    setActionLoading(planId);
    try {
      const res = await paymentsAPI.createGlobal({ amount, currency: 'INR', country: 'IN', planId });
      
      if (!res.order || !res.order.id) throw new Error("Order creation failed");

      const keyToUse = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder';

      const options = {
        key: keyToUse,
        amount: amount * 100, 
        currency: 'INR',
        order_id: res.order.id, 
        name: `Workix ${planName}`,
        description: `Upgrade to ${planName} Plan`,
        image: '/logo.png',
        handler: async function (response: any) {
           try {
             await paymentsAPI.verifyGlobal(response);
             alert("Payment successful! Updating account...");
             window.location.href = '/dashboard?success=plan_upgraded';
           } catch (err) {
             console.error("Verification failed", err);
             alert("Payment succeeded but verification failed. Please contact support.");
             setActionLoading(null);
           }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: '#2563eb' },
        modal: { ondismiss: () => setActionLoading(null) }
      };

      if (keyToUse === 'rzp_test_placeholder' || keyToUse === 'your_razorpay_key') {
         setTimeout(async () => {
           if (confirm(`Simulator: Confirm upgrade to ${planName}?`)) {
              try {
                await paymentsAPI.verifyGlobal({
                  razorpay_order_id: res.order.id,
                  razorpay_payment_id: 'pay_sim_' + Date.now(),
                  razorpay_signature: 'sim_sig_' + Date.now()
                });
                window.location.href = '/dashboard?success=plan_upgraded';
              } catch (e) {
                alert("Simulated verification failed");
                setActionLoading(null);
              }
           } else {
              setActionLoading(null);
           }
         }, 800);
         return;
      }

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (resp: any) => { alert(resp.error.description); setActionLoading(null); });
      rzp.open();
    } catch (err: any) {
      alert(err.message || "Failed to initiate payment");
      setActionLoading(null);
    }
  };

  const activePlanId = user?.subscriptionStatus === 'pro' ? 'pro' : 'basic';
  const activePlan = plans.find(p => p.id === activePlanId);

  if (loading) {
     return <div className="h-screen w-full flex items-center justify-center bg-slate-50 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Synchronizing Membership...</div>;
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10 px-4 md:px-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Subscriptions</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">Manage your plan, billing, and features</p>
      </div>

      {/* Active Plan Summary */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden bg-gradient-to-r ${activePlanId === 'pro' ? 'from-blue-600 to-indigo-600 shadow-2xl shadow-blue-500/20' : 'from-slate-800 to-slate-900'}`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <Crown size={20} className="text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100">Membership Summary</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase">
               {activePlan?.name} <span className="opacity-60 text-2xl not-italic ml-2">Active</span>
            </h2>
            <div className="flex flex-wrap items-center gap-4 pt-2">
               <div className="px-4 py-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 flex items-center gap-2">
                  <CreditCard size={14} className="text-blue-200" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                     {payoutMethod ? `Linked: ${payoutMethod.accountType || 'Bank'}` : 'No Payment Method'}
                  </span>
               </div>
               <div className="px-4 py-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 flex items-center gap-2">
                  <Calendar size={14} className="text-blue-200" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                     Next Cycle: April 26, 2026
                  </span>
               </div>
            </div>
          </div>
          <div className="text-right space-y-2">
             <div className="text-5xl font-black tracking-tighter">₹{activePlan?.price}</div>
             <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">{activePlan?.period}</p>
          </div>
        </div>
      </motion.div>

      {/* Linked Payment Method - NEW SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white border border-slate-100 rounded-[2rem] p-8 space-y-6 shadow-sm">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-xl">
                   <CreditCard size={20} />
                </div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Payment Method</h4>
             </div>
             
             {payoutMethod ? (
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{payoutMethod.accountType || 'Method'}</span>
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                         <Check size={12} strokeWidth={3} />
                      </div>
                   </div>
                   <p className="text-sm font-bold text-slate-900">
                      {payoutMethod.details?.accountNumber || payoutMethod.details?.vpa || 'Linked Gateway'}
                   </p>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Used for automated settlements</p>
                </div>
             ) : (
                <div className="p-5 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">No Method Found</p>
                   <button 
                      onClick={() => window.location.href = '/dashboard/withdraw'}
                      className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline"
                   >
                      Setup Account +
                   </button>
                </div>
             )}
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 flex items-center justify-center rounded-2xl">
                   <Zap size={32} />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Platform Power</p>
                   <p className="text-2xl font-black text-slate-900 tracking-tighter">{user?.availableCredits || 0} Extraction Credits</p>
                   <div className="flex items-center gap-2 mt-1">
                      <Shield size={12} className="text-emerald-500" />
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Verified Level 2</span>
                   </div>
                </div>
             </div>
             <button 
                onClick={() => window.location.href = '/pricing'}
                className="h-14 px-10 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:scale-105 transition-all"
             >
                Purchase Pack
             </button>
          </div>
      </div>

      {/* Plans List */}
      <div className="space-y-6 pt-4">
        <h3 className="text-xl font-extrabold text-slate-900 italic uppercase tracking-tight flex items-center gap-3">
           <ArrowUpRight size={20} className="text-blue-600" />
           Available Upgrades
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, i) => {
            const isActive = plan.id === activePlanId;
            const isActionLoading = actionLoading === plan.id;

            return (
              <div
                key={plan.id}
                className={`flex flex-col relative bg-white rounded-[2.5rem] border-2 p-10 transition-all ${
                  isActive ? 'border-blue-600 shadow-2xl shadow-blue-500/10' : 'border-slate-100'
                }`}
              >
                {isActive && (
                   <div className="absolute top-6 right-6 px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      Active
                   </div>
                )}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.id === 'pro' ? 'from-blue-600 to-indigo-600' : 'from-slate-400 to-slate-500'} flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-500/10`}>
                   {plan.icon}
                </div>
                <h4 className="text-2xl font-black text-slate-900 italic uppercase tracking-tight">{plan.name}</h4>
                <div className="my-6 space-y-1">
                   <span className="text-3xl font-black text-slate-900 tracking-tighter">₹{plan.price}</span>
                   <span className="block text-[10px] text-slate-400 font-black uppercase tracking-widest"> {plan.period}</span>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                   {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-3 text-xs font-medium text-slate-500 uppercase tracking-tight">
                         <CheckCircle2 size={14} className="text-blue-500 shrink-0 mt-0.5" /> <span>{f}</span>
                      </li>
                   ))}
                </ul>
                <button
                  type="button"
                  disabled={isActive || !!actionLoading}
                  onClick={(e) => {
                    if (plan.price === 0) return;
                    handleUpgrade(e, plan.id, plan.price, plan.name);
                  }}
                  className={`w-full h-16 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                      : 'bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-900/10 active:scale-95 disabled:bg-slate-200'
                  }`}
                >
                  {isActionLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isActive ? (
                    'Your Current Plan'
                  ) : (
                    'Activate This Plan'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
