'use client';

import React, { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Github } from 'lucide-react';
import { BRANDING } from '@/lib/config';
import { Button, Card, Input } from '@/components/ui';

// ── Social provider configs ──────────────────────────────────────────────────
const SOCIAL = [
  {
    id: 'google',
    label: 'Continue with Google',
    variant: 'outline' as const,
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
    className: 'bg-gray-900 border-gray-900 text-white hover:bg-gray-800 hover:border-gray-800',
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
  const [mounted, setMounted]   = useState(false);

  useEffect(() => { 
    setMounted(true); 
    router.prefetch('/dashboard');
    router.prefetch('/admin/dashboard');
    router.prefetch('/client/dashboard');
  }, [router]);

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard');
    }
  }, [status, router]);

  if (!mounted) return null;

  const handleSocial = async (provider: string) => {
    setLoading(provider);
    setError('');
    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (err) {
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
      
      if (res?.error) {
        setError('Invalid identity credentials. Please try again.');
        setLoading(null);
        return;
      }

      window.location.href = '/dashboard';
      
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 selection:bg-blue-100 selection:text-blue-600">
      
      {/* Abstract Background Elements (Soft) */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px]" />
      </div>

      {/* Logo */}
      <div
        className="relative z-10 flex items-center gap-3 mb-8 cursor-pointer group"
        onClick={() => router.push('/')}
      >
        <div className="w-9 h-9 bg-gradient-to-br from-[#2563eb] to-[#4f46e5] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
          {BRANDING.shortName}
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">{BRANDING.name}</span>
      </div>

      {/* Card */}
      <Card
        padding="none"
        shadow="none"
        className="relative z-10 w-full max-w-[420px] overflow-hidden bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px]"
      >
        <div className="pt-8 pb-4 text-center">
          <h2 className="text-2xl font-extrabold mb-1.5 bg-clip-text text-transparent bg-gradient-to-r from-[#2563eb] to-[#4f46e5] tracking-tight">
            Welcome back
          </h2>
          <p className="text-xs font-medium text-gray-400">Secure entry to your workspace</p>
        </div>

        <div className="px-8 pb-8 space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-3 text-rose-600 text-sm font-medium animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Social login */}
          <div className="grid grid-cols-1 gap-3">
            {SOCIAL.map((provider) => (
              <Button
                key={provider.id}
                variant="outline"
                onClick={() => handleSocial(provider.id)}
                isLoading={loading === provider.id}
                disabled={!!loading}
                className="w-full h-11 rounded-xl border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all font-semibold text-gray-700"
                leftIcon={provider.icon}
              >
                {provider.label}
              </Button>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-gray-400">
              <span className="bg-white px-4">or identity access</span>
            </div>
          </div>

          <form onSubmit={handleCredentials} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ark@workix.com"
              required
              className="h-11 rounded-xl bg-gray-50/50 border-gray-100 focus:bg-white text-sm"
              leftIcon={<Mail size={18} className="text-gray-400" />}
            />

            <div className="space-y-1">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Password</label>
                <a href="#" className="text-[10px] text-blue-600 font-bold hover:underline">Forgot?</a>
              </div>
              <Input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-11 rounded-xl bg-gray-50/50 border-gray-100 focus:bg-white text-sm"
                leftIcon={<Lock size={18} className="text-gray-400" />}
                rightIcon={
                  <button type="button" onClick={() => setShowPw(!showPw)} className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors">
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
            </div>

            <Button
              type="submit"
              isLoading={loading === 'credentials'}
              disabled={!!loading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#4f46e5] hover:opacity-90 active:scale-[0.98] transition-all font-bold text-sm shadow-lg shadow-blue-600/20 border-none"
            >
              Sign In to Dashboard
            </Button>
          </form>
        </div>

        <div className="py-5 bg-gray-50/50 border-t border-gray-100 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:text-[#4f46e5] transition-colors">
              Create one
            </a>
          </p>
        </div>
      </Card>

      <a
        href="/"
        className="relative z-10 mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
      >
        ← Back to home
      </a>
    </div>
  );
}
