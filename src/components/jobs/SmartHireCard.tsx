'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Trophy, ShieldCheck, Clock, ArrowRight, Star, AlertCircle } from 'lucide-react';
import { ordersAPI, jobsAPI } from '../../services/api';
import { Button, Card } from '../ui';

interface BestMatch {
  freelancer: {
    _id: string;
    name: string;
    avatar: string;
    trustScore: number;
    avgResponseTime: number;
    completedJobs: number;
    subscriptionStatus: string;
  };
  matchScore: number;
}

export default function SmartHireCard({ jobId, budget }: { jobId: string; budget: number }) {
  const [match, setMatch] = useState<BestMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [hiring, setHiring] = useState(false);

  useEffect(() => {
    // Load Razorpay Script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    const fetchMatches = async () => {
      try {
        const matches = await jobsAPI.getMatches(jobId);
        if (matches && matches.length > 0) setMatch(matches[0]);
      } catch (err) {
        console.error('Matching failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
    
    return () => { document.body.removeChild(script); };
  }, [jobId]);

  const handleHireInstant = async () => {
    if (!match) return;
    setHiring(true);
    try {
      // 1. Create Instant Order Intent
      const { rzpOrder, orderId } = await ordersAPI.createInstant({
        jobId,
        freelancerId: match.freelancer._id,
        amount: budget
      });

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: rzpOrder.amount,
        currency: 'INR',
        name: 'BharatGig Hire',
        description: `Hiring ${match.freelancer.name}`,
        order_id: rzpOrder.id,
        handler: async function (response: any) {
          // 3. Verify Payment
          await ordersAPI.verifyPayment({
            orderId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          });
          window.location.href = `/dashboard/orders/${orderId}?success=true`;
        },
        theme: { color: '#2563eb' }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(err.message || 'Hiring failed');
    } finally {
      setHiring(false);
    }
  };

  if (loading) return <div className="h-40 bg-slate-50 animate-pulse rounded-2xl" />;
  if (!match) return null;

  return (
    <Card className="p-1 border-2 border-blue-600 bg-blue-600/5 shadow-2xl shadow-blue-500/10 overflow-hidden relative font-manrope">
       {/* Badge */}
       <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black px-6 py-2 rounded-bl-3xl z-10 uppercase tracking-widest shadow-xl">
          🔥 Best Match for You
       </div>

       <div className="bg-white p-8 rounded-xl space-y-8">
          <div className="flex items-start gap-6">
             <div className="relative">
                <div className="w-24 h-24 rounded-3xl bg-slate-100 overflow-hidden shadow-inner">
                   <img 
                      src={match.freelancer.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${match.freelancer.name}`} 
                      alt="best match" 
                      className="w-full h-full object-cover"
                   />
                </div>
                {match.freelancer.subscriptionStatus === 'pro' && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                     <Zap size={14} fill="currentColor" />
                  </div>
                )}
             </div>

             <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">{match.freelancer.name}</h3>
                   <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-full uppercase">
                      <ShieldCheck size={12} /> 95% Success
                   </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500">
                   <div className="flex items-center gap-2">
                      <Clock size={16} className="text-blue-500" />
                      Avg response: <span className="text-slate-900 font-bold">{match.freelancer.avgResponseTime} mins</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Star size={16} className="text-amber-500 fill-amber-500" />
                      Rating: <span className="text-slate-900 font-bold">4.9/5</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Trophy size={16} className="text-slate-400" />
                      Jobs: <span className="text-slate-900 font-bold">{match.freelancer.completedJobs}+</span>
                   </div>
                </div>
             </div>

             <div className="text-right">
                <div className="text-4xl font-black text-blue-600 tracking-tighter">{match.matchScore}%</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Match Score</div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-8 border-t border-slate-100">
             <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                   <AlertCircle size={20} />
                </div>
                <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-wide">
                   Expert in your required skills. <br />
                   <span className="text-blue-600">Available to start now.</span>
                </p>
             </div>

             <div className="flex flex-col gap-3">
                <Button 
                   onClick={handleHireInstant}
                   isLoading={hiring}
                   className="h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-500/20 group"
                >
                   Hire Now (₹{budget}) <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-all" />
                </Button>
                <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">
                   No Proposals needed • Instant Commencement
                </p>
             </div>
          </div>
       </div>
    </Card>
  );
}
