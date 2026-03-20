'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/services/api';
import { 
  User, Mail, Lock, ArrowRight, ArrowLeft, 
  Briefcase, Code, Eye, EyeOff, CheckCircle2
} from 'lucide-react';
import { BRANDING } from '@/lib/config';

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
        // Save user data for UI (Token is held in httpOnly cookie by backend)
        const userData = res.user || { name, email, role };
        localStorage.setItem('user', JSON.stringify(userData));
        if (res.token) localStorage.setItem('token', res.token);
        
        router.push('/onboarding');
      } else {
        setError(res.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError('Connection to security server failed. Please try again.');
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
      perks: ['Create gig packages', 'Bid on job posts', 'Track earnings & payouts'],
    },
    {
      id: 'client',
      icon: <Briefcase size={22} />,
      title: 'I want to hire',
      subtitle: 'Client / Business Owner',
      perks: ['Post jobs & projects', 'Search verified talent', 'Manage milestones & payments'],
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 selection:bg-blue-100 selection:text-blue-600">

      {/* Logo */}
      <div
        className="flex items-center gap-3 mb-10 cursor-pointer"
        onClick={() => router.push('/')}
      >
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          {BRANDING.shortName}
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">{BRANDING.name}</span>
      </div>

      {/* Step indicator - Premium Dots Style */}
      <div className="flex items-center gap-2 mb-10">
        {[1, 2].map(s => (
          <div 
            key={s} 
            className={`h-1.5 transition-all duration-300 rounded-full ${
              step === s ? 'w-8 bg-blue-600' : 'w-2 bg-gray-200'
            }`} 
          />
        ))}
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Step {step} of 2</span>
      </div>

      <AnimatePresence mode="wait">

        {/* ── STEP 1: Role Selection ── */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-[440px] bg-white border border-gray-100 rounded-2xl p-8 shadow-sm"
          >
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">How do you want to use BharatGig?</h2>
              <p className="text-sm text-gray-500 font-medium">Select your primary account type to get started.</p>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-8">
              {roles.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 ${
                    role === r.id
                      ? 'border-blue-600 bg-blue-50/30'
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    role === r.id ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400'
                  }`}>
                    {r.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">{r.subtitle.split(' / ')[0]}</p>
                    <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">
                      {r.id === 'freelancer' ? 'Get paid for work' : 'Hire top talent'}
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    role === r.id ? 'border-blue-600 bg-blue-600' : 'border-gray-200 bg-white'
                  }`}>
                    {role === r.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="btn-primary w-full h-11 text-sm font-bold shadow-sm shadow-blue-500/10"
            >
              Continue with Registration
            </button>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400 font-medium tracking-wide">
                ALREADY HAVE AN ACCOUNT?{' '}
                <a href="/login" className="text-blue-600 font-bold hover:underline">SIGN IN</a>
              </p>
            </div>
          </motion.div>
        )}

        {/* ── STEP 2: Account Details ── */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-[420px] bg-white border border-gray-100 rounded-2xl p-8 shadow-sm"
          >
            {/* Header */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-sm text-gray-500 font-medium">Setting up your profile as a <span className="text-blue-600 capitalize font-bold">{role}</span></p>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-600 text-[11px] font-bold uppercase tracking-wider px-4 py-3 rounded-lg border border-rose-100 mb-6 flex items-center gap-2">
                <ShieldAlert size={14} /> {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="form-input bg-gray-50/50 border-gray-100 focus:bg-white text-sm font-medium"
                  placeholder="Arjun Sharma"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="form-input bg-gray-50/50 border-gray-100 focus:bg-white text-sm font-medium"
                  placeholder="arjun@bharatgig.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="form-input bg-gray-50/50 border-gray-100 focus:bg-white text-sm font-medium pr-10"
                    placeholder="Minimal 8 characters"
                    required
                    minLength={8}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full h-11 text-sm font-bold mt-4 shadow-sm shadow-blue-500/10"
              >
                {loading ? 'Securing Identity...' : 'Finalize Account'}
              </button>
            </form>
          </motion.div>
        )}

      </AnimatePresence>

      <button
        onClick={() => step === 2 ? setStep(1) : router.push('/')}
        className="mt-10 flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={14} /> {step === 2 ? 'Role Selection' : 'Home'}
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
