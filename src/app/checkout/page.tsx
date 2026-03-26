'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useRazorpay } from '@/hooks/useRazorpay';
import { ShieldCheck, IndianRupee, Lock, Zap, ArrowLeft, CreditCard, Activity, Globe } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { BRANDING } from '@/lib/config';
import { analyticsAPI, paymentsAPI, feesAPI } from '@/services/api';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { displayRazorpay, loading } = useRazorpay();
  const t = BRANDING.theme;
  
  const amount = Number(searchParams.get('amount') || '15000');
  const [feePercent, setFeePercent] = useState(5);
  const serviceFee = Math.round(amount * (feePercent / 100)); 
  const totalPayable = amount + serviceFee;
  const jobId = searchParams.get('jobId');
  const freelancerId = searchParams.get('freelancerId');
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    
    // Fetch live platform fees
    feesAPI.getFees()
      .then(json => {
        if (json.data && json.data.clientFeePercent) {
          setFeePercent(json.data.clientFeePercent);
        }
      })
      .catch(err => console.error('Fee fetch failed:', err));
  }, []);

  const handlePayment = async () => {
    if (!user) return router.push('/login');

    try {
      const data = await paymentsAPI.createOrder({
        amount,
        jobId: jobId || '',
        clientId: user.id || user._id,
        freelancerId: freelancerId || ''
      });

      let orderData = data;
      if (data.order) {
        orderData = data.order;
      } else if (data.data && data.data.order) {
        orderData = data.data.order;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'GigIndia Escrow',
        description: 'Secure Project Payment',
        order_id: orderData.id || orderData.orderId || data.orderId,
        handler: async (response: any) => {
          try {
            await paymentsAPI.verify(response);
            analyticsAPI.track('checkout_success', 'payment', { amount, jobId });
            router.push('/dashboard?payment=success');
          } catch (err) {
            analyticsAPI.track('checkout_verify_failed', 'payment', { jobId });
            console.error('Verification failed:', err);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: t.primary,
        },
      };

      displayRazorpay(options);
    } catch (err: any) {
      analyticsAPI.track('checkout_error', 'payment', { error: String(err) });
      console.error('Payment Error:', err);
      setError(err?.message || 'Payment initiation failed. Please check your connection or try a different method.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 md:p-10">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT: Branding & Trust */}
        <div className="space-y-10">
           <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/10">
                 <Zap size={20} className="text-white fill-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-[#111827]">{BRANDING.name}</span>
           </div>

           <div className="space-y-4">
              <h1 className="text-5xl font-bold text-[#111827] leading-tight">Secure <span className="text-blue-600">Payment</span> & Escrow</h1>
              <p className="text-sm text-[#6b7280] font-medium leading-relaxed max-w-lg">Complete your payment securely. Funds are held in escrow and only released when you approve the project milestones.</p>
           </div>

           <div className="space-y-8 pt-4">
              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-xl shrink-0">
                    <ShieldCheck size={24} />
                 </div>
                 <div>
                    <h4 className="text-[#111827] font-bold text-sm">Milestone Protection</h4>
                    <p className="text-[#6b7280] text-sm leading-relaxed">Funds are only released to the professional upon successful completion of milestones.</p>
                 </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 bg-blue-50 text-blue-600 flex items-center justify-center rounded-xl shrink-0">
                    <IndianRupee size={24} />
                 </div>
                 <div>
                    <h4 className="text-[#111827] font-bold text-sm">Secure Transaction</h4>
                    <p className="text-[#6b7280] text-sm leading-relaxed">All payments are encrypted and processed through our secure payment gateway.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* RIGHT: Checkout Card */}
        <div className="bg-white rounded-lg border border-gray-100 p-8 md:p-12 shadow-sm shadow-blue-900/5">
           <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#111827]">Order Summary</h2>
              <p className="text-sm text-[#6b7280] mt-1">Review the details of your project payment.</p>
           </div>

           <div className="space-y-6">
              <div className="flex justify-between items-center py-4 border-b border-gray-50">
                 <span className="text-sm font-medium text-[#6b7280]">Project Amount</span>
                 <span className="text-sm font-bold text-[#111827]">₹{amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-50">
                 <span className="text-sm font-medium text-[#6b7280]">Platform Fee ({feePercent}%)</span>
                 <span className="text-sm font-medium text-[#111827]">₹{serviceFee.toLocaleString()}</span>
              </div>
              
              <div className="py-8 text-center bg-[#f9fafb] rounded-xl border border-gray-50">
                 <p className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">Total Payable</p>
                 <h3 className="text-5xl font-bold text-blue-600">₹{totalPayable.toLocaleString()}</h3>
              </div>

              <div className="space-y-4 pt-4">
                 <Button 
                   onClick={handlePayment}
                   disabled={loading}
                   className="w-full rounded-lg text-sm font-bold shadow-sm shadow-blue-600/10"
                 >
                    {loading ? (
                      <div className="flex items-center gap-3">
                         <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                         <span>Processing...</span>
                      </div>
                    ) : (
                      <>Pay Secured Amount <CreditCard size={20} className="ml-2" /></>
                    )}
                 </Button>

                 <Button 
                   variant="ghost"
                   onClick={() => router.back()}
                   className="w-full text-sm font-bold text-[#6b7280] hover:text-[#111827]"
                 >
                    Cancel Transaction
                 </Button>
              </div>

              <div className="flex items-center justify-center gap-3 pt-8 opacity-50">
                 <Lock size={14} className="text-emerald-500" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">Bank-grade 256-bit SSL Encryption</span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
         <div className="flex flex-col items-center gap-4">
            <div className="w-12 border-4 border-blue-50 border-t-blue-600 rounded-lg animate-spin" />
            <p className="text-sm font-bold text-[#6b7280]">Preparing checkout...</p>
         </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
