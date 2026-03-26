'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Phone, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { authAPI } from '../../../services/api';
import { Button, Input, Card } from '../../../components/ui';

export default function OTPLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async (method: 'whatsapp' | 'sms') => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid mobile number');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await authAPI.sendOTP(phone);
      setStep(2);
      setCountdown(30);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) return;

    setLoading(true);
    setError('');
    try {
      const res = await authAPI.verifyOTP({ phone, code: fullOtp });
      setSuccess(true);
      
      // Store token locally if needed (though backend sets HTTP-only cookie)
      if (res.token) localStorage.setItem('token', res.token);
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6 selection:bg-blue-100 selection:text-blue-600 font-manrope">
      
      {/* Background Blobs (SaaS Style) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Branding */}
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">GigIndia</h1>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Work with India's Best</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="p-10 shadow-2xl shadow-blue-500/5 rounded-3xl border-0 overflow-hidden relative">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-slate-900">Sign in to your account</h2>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">
                      Enter your mobile number to receive a secure login code.
                    </p>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
                      <AlertCircle size={14} /> {error}
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="relative group">
                       <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg pointer-events-none">+91</span>
                       <input 
                         type="tel" 
                         placeholder="98765 43210"
                         value={phone}
                         onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0,10))}
                         className="w-full h-16 pl-20 pr-6 bg-slate-50 border-0 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all text-xl font-bold text-slate-900 placeholder:text-slate-200"
                         autoFocus
                       />
                    </div>

                    <div className="space-y-4 pt-2">
                      <Button 
                        onClick={() => handleSendOTP('whatsapp')}
                        className="w-full h-16 bg-[#25d366] hover:bg-[#128c7e] text-white rounded-2xl text-lg font-bold shadow-lg shadow-emerald-500/10 transition-all group border-0"
                        isLoading={loading}
                      >
                         Continue with WhatsApp 
                         <MessageSquare size={20} className="ml-3 group-hover:translate-x-1 transition-transform" fill="currentColor" />
                      </Button>

                      <div className="flex items-center gap-4 py-2">
                        <div className="h-px w-full bg-slate-100" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Or use SMS</span>
                        <div className="h-px w-full bg-slate-100" />
                      </div>

                      <Button 
                        onClick={() => handleSendOTP('sms')}
                        variant="outline"
                        className="w-full h-16 rounded-2xl text-lg font-bold hover:bg-slate-50 border-slate-200"
                        disabled={loading}
                      >
                        Receive code via SMS
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Decorative Bottom Gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="p-10 shadow-2xl shadow-blue-500/5 rounded-3xl border-0">
                <div className="space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                       <h2 className="text-2xl font-bold text-slate-900">Check your phone</h2>
                       <p className="text-sm font-medium text-slate-500">Code sent to <span className="text-slate-900 font-bold">+91 {phone}</span></p>
                    </div>
                    <button 
                      onClick={() => setStep(1)}
                      className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                    >
                      Edit 
                    </button>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
                      <AlertCircle size={14} /> {error}
                    </div>
                  )}

                  <div className="space-y-8">
                    <div className="flex justify-between gap-3">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => { otpRefs.current[i] = el; }}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(i, e)}
                          className="w-12 h-16 sm:w-14 sm:h-16 text-center text-3xl font-extrabold bg-slate-50 border-0 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900"
                          autoFocus={i === 0}
                        />
                      ))}
                    </div>

                    <div className="space-y-6">
                      <Button 
                        onClick={handleVerifyOTP}
                        className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-bold shadow-xl shadow-blue-500/20"
                        isLoading={loading}
                        disabled={otp.join('').length < 6}
                      >
                         {success ? 'Verifying...' : 'Verify and Continue'}
                         {!success && <CheckCircle2 size={20} className="ml-3" />}
                      </Button>

                      <div className="text-center">
                         {countdown > 0 ? (
                            <p className="text-xs font-bold text-slate-400 tracking-wide">RESEND CODE IN {countdown}s</p>
                         ) : (
                            <button 
                              onClick={() => handleSendOTP('whatsapp')}
                              className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline"
                            >
                              Resend Verification Code
                            </button>
                         )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Links */}
        <div className="mt-12 flex justify-center gap-10">
          <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600">Privacy Policy</button>
          <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600">Terms of Service</button>
        </div>

        {/* Success Modal Overlay */}
        <AnimatePresence>
          {success && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 text-center space-y-8"
            >
               <motion.div
                 initial={{ scale: 0.5, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 transition={{ type: "spring", stiffness: 200 }}
                 className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500"
               >
                 <CheckCircle2 size={48} strokeWidth={3} />
               </motion.div>
               <div className="space-y-2">
                  <h3 className="text-3xl font-black text-slate-900 leading-tight">Identity Confirmed</h3>
                  <p className="text-slate-500 font-medium">Entering your secure work cluster...</p>
               </div>
               <Loader2 className="animate-spin text-blue-600 mt-8" size={32} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
