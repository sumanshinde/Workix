'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/services/api';
import { 
  User, Mail, Lock, ArrowRight, ArrowLeft, 
  Briefcase, Code, Eye, EyeOff
} from 'lucide-react';
import { BRANDING } from '@/lib/config';
import { Button, Input } from '@/components/ui';

type Role = 'freelancer' | 'client';

export default function RegisterPage() {
  const [step, setStep]         = useState<1 | 2>(1);
  const [role, setRole]         = useState<Role>('freelancer');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [mounted, setMounted]   = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.register({ name, email, password, role });
      if (res.success || res.token) {
        const userData = res.user || { name, email, role };
        localStorage.setItem('user', JSON.stringify(userData));
        if (res.token) localStorage.setItem('token', res.token);
        
        router.push('/onboarding');
      } else {
        setError(res.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err?.message || 'Connection to security server failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roles: { id: Role; icon: React.ReactNode; title: string; subtitle: string; perks: string[] }[] = [
    {
      id: 'freelancer',
      icon: <Code size={22} />,
      title: 'I want to work',
      subtitle: 'Freelancer / Service Provider',
      perks: ['Create gig packages', 'Bid on job posts', 'Track earnings'],
    },
    {
      id: 'client',
      icon: <Briefcase size={22} />,
      title: 'I want to hire',
      subtitle: 'Client / Business Owner',
      perks: ['Post jobs & projects', 'Search verified talent', 'Manage payments'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 selection:bg-blue-100 selection:text-blue-600 relative overflow-hidden">

      {/* Abstract Background Elements (Soft Blobs) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-blue-500/10 rounded-full blur-[120px] transform-gpu will-change-transform" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-purple-500/10 rounded-full blur-[120px] transform-gpu will-change-transform" />
      </div>

      {/* Logo */}
      <div
        className="relative z-10 flex items-center gap-3 mb-10 cursor-pointer group"
        onClick={() => router.push('/')}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
          {BRANDING.shortName}
        </div>
        <span className="text-2xl font-bold text-slate-900 tracking-tight">{BRANDING.name}</span>
      </div>

      {/* Center Wrapper */}
      <div className="relative z-10 w-full max-w-[440px]">
        
        {/* Step Indicator */}
        <div className="flex justify-center items-center gap-3 mb-8">
          {[1, 2].map(s => (
            <div 
              key={s} 
              className={`h-1.5 transition-all duration-500 rounded-full ${
                step === s ? 'w-10 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-sm shadow-blue-500/20' : (s < step ? 'w-4 bg-blue-300' : 'w-4 bg-slate-200')
              }`} 
            />
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── STEP 1: Role Selection ── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 backdrop-blur-xl border border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[24px] overflow-hidden"
            >
              <div className="pt-10 pb-4 text-center px-8">
                <h2 className="text-3xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
                  Join BharatGig
                </h2>
                <p className="text-[15px] font-medium text-slate-500">How do you want to use the platform?</p>
              </div>

              <div className="px-8 pb-10 space-y-6 mt-4">
                <div className="grid grid-cols-1 gap-4">
                  {roles.map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`w-full text-left p-4 rounded-[20px] transition-all duration-300 flex items-center gap-5 border-2 relative overflow-hidden group ${
                        role === r.id
                          ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-500/10'
                          : 'border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50'
                      }`}
                    >
                      {role === r.id && (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 pointer-events-none" />
                      )}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm shrink-0 border border-white ${
                        role === r.id ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50'
                      }`}>
                        {r.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`font-extrabold text-[15px] ${role === r.id ? 'text-blue-900' : 'text-slate-900'} tracking-tight`}>
                          {r.subtitle.split(' / ')[0]}
                        </p>
                        <p className="text-[12px] text-slate-500 font-medium mt-0.5">
                          {r.id === 'freelancer' ? 'Get paid for top-tier work' : 'Hire elite verified talent'}
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                        role === r.id ? 'border-blue-600 bg-blue-600' : 'border-slate-200 bg-white'
                      }`}>
                        {role === r.id && <div className="w-1.5 h-1.5 rounded-full bg-white animate-in zoom-in" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <Button
                    onClick={() => setStep(2)}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-[15px] transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-500/25 border-none"
                    rightIcon={<ArrowRight size={18} />}
                  >
                    Continue to Registration
                  </Button>
                </div>
              </div>

              <div className="py-6 bg-slate-50/50 border-t border-slate-100 text-center">
                <p className="text-[13px] font-medium text-slate-500">
                  ALREADY HAVE AN ACCOUNT?{' '}
                  <a href="/login" className="text-blue-600 font-semibold hover:text-indigo-600 transition-colors uppercase tracking-wider text-[11px] ml-1">
                    Sign In
                  </a>
                </p>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Account Details ── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 backdrop-blur-xl border border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[24px] overflow-hidden"
            >
              <div className="pt-10 pb-4 text-center px-8">
                <h2 className="text-3xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
                  Profile Details
                </h2>
                <p className="text-[15px] font-medium text-slate-500">Joining as a <span className="text-blue-600 capitalize font-bold">{role}</span></p>
              </div>

              <div className="px-8 pb-8 space-y-6 mt-2">
                {error && (
                  <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium">
                    <ShieldAlert size={18} className="shrink-0" />
                    <p className="leading-snug">{error}</p>
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 px-1">Full Name</label>
                    <Input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Arjun Sharma"
                      required
                      disabled={loading}
                      className="h-12 rounded-xl bg-[#f9fafb] border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all duration-200 text-[15px]"
                      leftIcon={<User size={20} className="text-slate-400" />}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 px-1">Email Address</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="arjun@company.com"
                      required
                      disabled={loading}
                      className="h-12 rounded-xl bg-[#f9fafb] border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all duration-200 text-[15px]"
                      leftIcon={<Mail size={20} className="text-slate-400" />}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 px-1">Secure Password</label>
                    <Input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      required
                      minLength={8}
                      disabled={loading}
                      className="h-12 rounded-xl bg-[#f9fafb] border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all duration-200 text-[15px]"
                      leftIcon={<Lock size={20} className="text-slate-400" />}
                      rightIcon={
                        <button 
                          type="button" 
                          onClick={() => setShowPw(!showPw)}
                          className="flex items-center h-full px-2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors pointer-events-auto"
                        >
                          {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      }
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      isLoading={loading}
                      disabled={loading}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-[15px] transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-500/25 border-none disabled:opacity-70 disabled:hover:scale-100 disabled:active:scale-100"
                    >
                      Finalize Account
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Nav Links */}
      <button
        onClick={() => step === 2 ? setStep(1) : router.push('/')}
        className="relative z-10 mt-8 text-[13px] font-medium text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1.5"
      >
        <ArrowLeft size={14} /> {step === 2 ? 'Back to Role Selection' : 'Cancel and return home'}
      </button>
    </div>
  );
}

// Minimal icons to replace missing imports if necessary
const ShieldAlert = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
