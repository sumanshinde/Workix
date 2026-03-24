'use client';

import React, { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Github, ArrowLeft } from 'lucide-react';
import { BRANDING } from '@/lib/config';
import { Button, Card, Input } from '@/components/ui';

// ── Social provider configs ──────────────────────────────────────────────────
const SOCIAL = [
  {
    id: 'google',
    label: 'Continue with Google',
    variant: 'outline' as const,
    className: 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-blue-200 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
  },
  {
    id: 'github',
    label: 'Continue with GitHub',
    variant: 'outline' as const,
    className: 'bg-[#0f172a] border-[#0f172a] text-white hover:bg-[#1e293b] hover:border-[#1e293b] hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200',
    icon: <Github size={20} />,
  },
];

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState<string | null>(null);
  const [error, setError]       = useState('');

  // Automatically redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleSocial = async (provider: string) => {
    setLoading(provider);
    setError('');
    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (err) {
      console.error('Social auth error:', err);
      setError('Social authentication failed. Please try again.');
      setLoading(null);
    }
  };

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('credentials');
    setError('');
    
    try {
      const res = await signIn('credentials', {
        email, 
        password,
        redirect: false,
      });

      console.log('SignIn Response:', res);
      
      if (res?.error) {
        let errorMessage = res.error;
        if (res.error === 'CredentialsSignin') errorMessage = 'Invalid email or password. Please try again.';
        setError(errorMessage);
        setLoading(null);
        return;
      }

      if (res?.ok) {
        router.push('/dashboard');
        router.refresh(); 
      }
      
    } catch (err) {
      console.error('Credentials auth exception:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 selection:bg-blue-100 selection:text-blue-600 relative overflow-hidden">
      
      {/* Background blobs removed to prevent overlap with global layout blurs and reduce rendering lag */}


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

      {/* Center Card */}
      <div className="relative z-10 w-full max-w-[420px]">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[24px] overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)]">
          
          <div className="pt-10 pb-4 text-center px-8">
            <h2 className="text-3xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm font-medium text-slate-500">Secure entry to your workspace</p>
          </div>

          <div className="px-8 pb-10 space-y-7">
            
            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium">
                <AlertCircle size={18} className="shrink-0" />
                <p className="leading-snug">{error}</p>
              </div>
            )}

            {/* Social login */}
            <div className="grid grid-cols-1 gap-3.5">
              {SOCIAL.map((provider) => (
                <Button
                  key={provider.id}
                  variant="outline"
                  type="button"
                  onClick={() => handleSocial(provider.id)}
                  isLoading={loading === provider.id}
                  disabled={!!loading && loading !== provider.id}
                  className={`w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-3 ${provider.className || ''}`}
                  leftIcon={provider.icon}
                >
                  {provider.label}
                </Button>
              ))}
            </div>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="mx-4 text-xs uppercase font-bold tracking-wider text-slate-400 px-2 bg-transparent">
                OR
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleCredentials} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 px-1">Email address</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    disabled={!!loading}
                    className="h-12 rounded-xl bg-[#f9fafb] border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all duration-200 text-[15px]"
                    leftIcon={<Mail size={20} className="text-slate-400" />}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-sm font-medium text-slate-700">Password</label>
                    <a href="#" className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors">Forgot?</a>
                  </div>
                  <Input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={!!loading}
                    className="h-12 rounded-xl bg-[#f9fafb] border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all duration-200 text-[15px]"
                    leftIcon={<Lock size={20} className="text-slate-400" />}
                    rightIcon={
                      <button type="button" onClick={() => setShowPw(!showPw)} className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors pointer-events-auto flex items-center h-full px-2">
                        {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    }
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  isLoading={loading === 'credentials'}
                  disabled={!!loading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-[15px] transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-500/25 border-none disabled:opacity-70 disabled:hover:scale-100 disabled:active:scale-100"
                >
                  Sign In to Dashboard
                </Button>
              </div>
            </form>
          </div>

          <div className="py-6 bg-slate-50/50 border-t border-slate-100 text-center">
            <p className="text-[13px] font-medium text-slate-500">
              Don't have an account?{' '}
              <a href="/register" className="text-blue-600 font-semibold hover:text-indigo-600 transition-colors">
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>

      <a
        href="/"
        className="relative z-10 mt-8 text-[13px] font-medium text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1.5"
      >
        <ArrowLeft size={14} />
        Back to home
      </a>
    </div>
  );
}
