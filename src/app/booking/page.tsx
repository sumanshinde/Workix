'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, Zap, CreditCard, CheckCircle2, 
  ArrowRight, ArrowLeft, Loader2, Sparkles,
  ShieldCheck, Calculator, Star, Clock, Home
} from 'lucide-react';
import { Button, Card } from '@/components/ui';

// ── TYPES ──
type Step = 'service' | 'details' | 'payment' | 'confirmation';

interface Service {
  id: string;
  title: string;
  price: number;
  icon: React.ReactNode;
  description: string;
  category: string;
}

const SERVICES: Service[] = [
  { id: '1', title: 'AC Repair', price: 499, icon: <Zap size={20} />, description: 'Includes gas check & filter cleaning.', category: 'Maintenance' },
  { id: '2', title: 'Plumbing', price: 299, icon: <Wrench size={20} />, description: 'Leak detection & pipe sealing.', category: 'Emergency' },
  { id: '3', title: 'Electrical', price: 399, icon: <Zap size={20} />, description: 'Wiring, switches & circuit fixes.', category: 'Maintenance' },
  { id: '4', title: 'Deep Cleaning', price: 999, icon: <Sparkles size={20} />, description: 'Whole house sanitization & scrub.', category: 'Hygiene' },
];

export default function BookingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('service');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [details, setDetails] = useState({ address: '', phone: '', note: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(25);

  // Update progress bar based on step
  useEffect(() => {
    switch (currentStep) {
      case 'service': setProgress(25); break;
      case 'details': setProgress(50); break;
      case 'payment': setProgress(75); break;
      case 'confirmation': setProgress(100); break;
    }
  }, [currentStep]);

  const handleNext = async () => {
    setIsLoading(true);
    // Simulate API delay for premium feel
    await new Promise(r => setTimeout(r, 800));
    setIsLoading(false);

    if (currentStep === 'service') setCurrentStep('details');
    else if (currentStep === 'details') setCurrentStep('payment');
    else if (currentStep === 'payment') setCurrentStep('confirmation');
  };

  const handleStepBack = () => {
    if (currentStep === 'details') setCurrentStep('service');
    else if (currentStep === 'payment') setCurrentStep('details');
  };

  // ── RENDERERS ──

  const renderProgress = () => (
    <div className="w-full max-w-xl mx-auto mb-16 px-4">
      <div className="flex justify-between items-center mb-4">
        {['Service', 'Details', 'Payment', 'Review'].map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-500 ${
              progress >= (i + 1) * 25 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-110' : 'bg-slate-100 text-slate-400'
            }`}>
              {progress > (i + 1) * 25 ? <CheckCircle2 size={16} /> : i + 1}
            </div>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${progress >= (i + 1) * 25 ? 'text-slate-900' : 'text-slate-400'}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: 'circOut' }}
          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafbff] text-slate-900 font-sans selection:bg-blue-100">
      
      {/* ── HEADER ── */}
      <nav className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-900/[0.04] px-6 lg:px-10 flex items-center justify-between sticky top-0 z-[100]">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs group-hover:bg-blue-600 transition-colors">GI</div>
            <span className="text-lg font-black tracking-tight">GigIndia</span>
          </div>
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-[13px] font-bold text-slate-500 hover:text-slate-900 transition-colors">
            <Home size={16} /> Exit
          </button>
      </nav>

      <div className="max-w-4xl mx-auto pt-16 pb-32 px-6">
        
        {renderProgress()}

        <AnimatePresence mode="wait">
          
          {/* STEP 1: SELECT SERVICE */}
          {currentStep === 'service' && (
            <motion.div 
              key="service"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Select a Service</h1>
                <p className="text-slate-500 font-medium">Choose a category to find specialized professionals near you.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SERVICES.map(s => (
                  <motion.div 
                    key={s.id}
                    onClick={() => setSelectedService(s)}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                      selectedService?.id === s.id 
                      ? 'border-blue-600 bg-blue-50/40 shadow-xl shadow-blue-500/10' 
                      : 'border-slate-100 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start relative z-10">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        selectedService?.id === s.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-500 group-hover:bg-slate-100'
                      }`}>
                        {s.icon}
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{s.category}</div>
                        <div className="text-xl font-black text-slate-900">₹{s.price}</div>
                      </div>
                    </div>
                    
                    <div className="mt-6 relative z-10">
                      <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">{s.title}</h3>
                      <p className="text-[13px] text-slate-500 font-medium leading-relaxed mt-1">{s.description}</p>
                    </div>

                    {selectedService?.id === s.id && (
                      <motion.div 
                        layoutId="active-glow"
                        className="absolute inset-0 bg-blue-600/[0.02]"
                      />
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="pt-8 flex justify-center">
                <Button 
                  onClick={handleNext}
                  disabled={!selectedService || isLoading}
                  className="h-14 px-12 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-base shadow-2xl shadow-slate-900/20 disabled:opacity-50 flex items-center gap-3 transition-all"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <>Continue to Details <ArrowRight size={20} /></>}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: ENTER DETAILS */}
          {currentStep === 'details' && (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Where should we go?</h1>
                <p className="text-slate-500 font-medium">Enter your contact and location details for the verified expert.</p>
              </div>

              <Card className="p-8 lg:p-10 border border-slate-100 shadow-xl shadow-slate-900/[0.02] rounded-[2.5rem] space-y-6">
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Detailed Address</label>
                    <textarea 
                      value={details.address}
                      onChange={e => setDetails({...details, address: e.target.value})}
                      placeholder="e.g. Flat 402, Sunshine Apartment, Sector 12, Pune..."
                      className="w-full min-h-[120px] p-5 bg-slate-50 border border-slate-100 rounded-2xl text-[15px] font-medium focus:ring-4 ring-blue-500/5 focus:border-blue-200 outline-none transition-all resize-none"
                    />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                    <input 
                      type="tel"
                      value={details.phone}
                      onChange={e => setDetails({...details, phone: e.target.value})}
                      placeholder="+91 00000 00000"
                      className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[15px] font-bold focus:ring-4 ring-blue-500/5 focus:border-blue-200 outline-none"
                    />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Notes (Optional)</label>
                    <input 
                      value={details.note}
                      onChange={e => setDetails({...details, note: e.target.value})}
                      placeholder="e.g. Please call before arriving"
                      className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[15px] font-medium focus:ring-4 ring-blue-500/5 focus:border-blue-200 outline-none"
                    />
                 </div>
              </Card>

              <div className="pt-8 flex items-center justify-between">
                <button onClick={handleStepBack} className="text-slate-500 font-bold flex items-center gap-2 hover:text-slate-900 transition-colors">
                  <ArrowLeft size={18} /> Back
                </button>
                <Button 
                  onClick={handleNext}
                  disabled={!details.address || !details.phone || isLoading}
                  className="h-14 px-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-base shadow-2xl shadow-blue-500/20 disabled:opacity-50 flex items-center gap-3 transition-all"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <>Procceed to Payment <ArrowRight size={20} /></>}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PAYMENT & SUMMARY */}
          {currentStep === 'payment' && (
            <motion.div 
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Review & Pay</h1>
                <p className="text-slate-500 font-medium">Your payment is held in escrow and released only after verified work.</p>
              </div>

              <div className="space-y-4">
                {/* Summary Card */}
                <Card className="p-8 border border-slate-100 shadow-xl shadow-slate-900/[0.02] rounded-[2.5rem] bg-white divide-y divide-slate-50">
                   <div className="pb-6">
                      <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Selected Service</div>
                      <div className="flex justify-between items-center">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                              {selectedService?.icon}
                            </div>
                            <div>
                               <div className="text-lg font-black">{selectedService?.title}</div>
                               <div className="text-[13px] font-medium text-slate-500">{selectedService?.category}</div>
                            </div>
                         </div>
                         <div className="text-xl font-black">₹{selectedService?.price}</div>
                      </div>
                   </div>
                   
                   <div className="py-6 space-y-4">
                      <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Pricing Details</div>
                      <div className="flex justify-between text-[15px] font-medium text-slate-600">
                         <span>Service Fee</span>
                         <span>₹{selectedService?.price}</span>
                      </div>
                      <div className="flex justify-between text-[15px] font-medium text-slate-600">
                         <span>Platform Convenience</span>
                         <span>₹99</span>
                      </div>
                      <div className="flex justify-between text-xl font-black text-slate-900 pt-2 border-t border-dashed border-slate-200">
                         <span>Total Pay</span>
                         <span className="text-blue-600">₹{(selectedService?.price || 0) + 99}</span>
                      </div>
                   </div>

                   <div className="pt-6">
                      <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Escrow Security</div>
                      <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100/50">
                         <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={18} />
                         <p className="text-[12px] text-emerald-900 font-medium leading-relaxed">
                           Funds will be locked in our secure escrow wallet. We only release it after you confirm the job completion.
                         </p>
                      </div>
                   </div>
                </Card>

                {/* Secure Badge */}
                <div className="flex items-center justify-center gap-4 py-4 opacity-40 grayscale">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="PayPal" />
                   <div className="w-px h-4 bg-slate-300" />
                   <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/Razorpay_logo.png" className="h-4" alt="Razorpay" />
                    <div className="w-px h-4 bg-slate-300" />
                   <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-4" alt="Stripe" />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button onClick={handleStepBack} className="text-slate-500 font-bold flex items-center gap-2 hover:text-slate-900 transition-colors">
                  <ArrowLeft size={18} /> Back
                </button>
                <Button 
                  onClick={handleNext}
                  disabled={isLoading}
                  className="h-14 px-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-base shadow-2xl shadow-emerald-500/20 flex items-center gap-3 transition-all"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <>Confirm & Pay ₹{(selectedService?.price || 0) + 99} <CheckCircle2 size={20} /></>}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: CONFIRMATION SUCCESS */}
          {currentStep === 'confirmation' && (
            <motion.div 
              key="confirmation"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="max-w-xl mx-auto text-center"
            >
              <div className="relative mb-8">
                 <motion.div 
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ delay: 0.3, type: 'spring' }}
                   className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30 text-white"
                 >
                    <CheckCircle2 size={48} />
                 </motion.div>
                 {/* Sparkle effects */}
                 <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: 'linear' }} className="absolute inset-0 z-0">
                    <Sparkles className="absolute top-0 right-0 text-amber-400 opacity-50" size={24} />
                    <Sparkles className="absolute bottom-4 left-4 text-blue-400 opacity-50" size={16} />
                 </motion.div>
              </div>

              <h1 className="text-4xl font-black tracking-tight mb-4">Booking Confirmed!</h1>
              <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10">
                Your service session for <strong className="text-slate-900">{selectedService?.title}</strong> is locked. 
                Our expert will reach out within the next 15 minutes.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-10">
                 <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Service ID</div>
                    <div className="font-bold text-slate-900">#BK-{Math.floor(Math.random()*90000) + 10000}</div>
                 </div>
                 <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</div>
                    <div className="font-bold text-emerald-600 flex items-center justify-center gap-1.5">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Confirmed
                    </div>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                 <Button onClick={() => router.push('/dashboard')} className="flex-1 h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/10">
                    Track Appointment
                 </Button>
                 <Button onClick={() => router.push('/')} variant="ghost" className="flex-1 h-14 bg-white border border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-50">
                    Back to Home
                 </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* ── Footer Micro-Text ── */}
      <footer className="fixed bottom-0 w-full py-6 text-center z-[50] pointer-events-none">
         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
            Secured by GigIndia Escrow Protocol • v2.4.0
         </p>
      </footer>

      <style jsx global>{`
        .saas-card {
          background: white;
          border-radius: 2.5rem;
          border: 1px solid rgba(0, 0, 0, 0.04);
          box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
}
