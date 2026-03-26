'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/services/api';
import {
  User, Mail, Phone, MapPin, ChevronDown,
  Briefcase, Code, Eye, EyeOff, Loader2,
  AlertCircle, CheckCircle2, ArrowLeft,
} from 'lucide-react';
import { BRANDING } from '@/lib/config';

// ── Types ────────────────────────────────────────────────────────────────────
type Role = 'freelancer' | 'client';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  city: string;
  gender: string;
  category: string;
  password: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  city?: string;
  gender?: string;
  category?: string;
  password?: string;
}

// ── Country codes ────────────────────────────────────────────────────────────
const COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳', country: 'India' },
  { code: '+1', flag: '🇺🇸', country: 'USA' },
  { code: '+44', flag: '🇬🇧', country: 'UK' },
  { code: '+971', flag: '🇦🇪', country: 'UAE' },
  { code: '+65', flag: '🇸🇬', country: 'Singapore' },
  { code: '+61', flag: '🇦🇺', country: 'Australia' },
];

// ── Categories ───────────────────────────────────────────────────────────────
const FREELANCER_CATEGORIES = [
  'Web Development', 'Mobile App Development', 'UI/UX Design',
  'Graphic Design', 'Content Writing', 'Digital Marketing',
  'Video Editing', 'SEO Expert', 'Virtual Assistant', 'Other',
];

const BUSINESS_CATEGORIES = [
  'Technology', 'E-Commerce', 'Healthcare',
  'Education', 'Finance', 'Real Estate',
  'Retail', 'Consulting', 'Logistics', 'Other',
];

// ── Custom Select component ──────────────────────────────────────────────────
interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
  error?: string;
  disabled?: boolean;
}

const CustomSelect = ({ value, onChange, options, placeholder, error, disabled }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full h-12 bg-white border text-left rounded-xl px-4 text-sm font-medium
          transition-all duration-200 outline-none flex items-center gap-3
          ${error ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}
          ${isOpen ? 'border-blue-500 ring-1 ring-blue-500 bg-white' : ''}
          ${disabled ? 'opacity-50 pointer-events-none bg-gray-50' : ''}
        `}
      >
        <span className={`flex-1 truncate ${selected ? 'text-gray-900' : 'text-gray-400'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 mt-1 w-full max-h-48 overflow-auto bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] origin-top"
            >
              <div className="py-1.5">
                {options.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { onChange(opt.value); setIsOpen(false); }}
                    className={`
                      w-full text-left px-4 py-2 text-sm font-medium transition-colors
                      ${value === opt.value ? 'bg-blue-50/70 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}
                    `}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────
export default function GigIndiaRegisterPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<Role>('freelancer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const [form, setForm] = useState<FormData>({
    fullName: '', email: '', phone: '', countryCode: '+91',
    city: '', gender: '', category: '', password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => { setMounted(true); }, []);

  const updateField = useCallback((field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validate = useCallback((): boolean => {
    const e: FormErrors = {};
    if (!form.fullName.trim()) e.fullName = 'Required';
    else if (form.fullName.trim().length < 2) e.fullName = 'Min 2 chars';

    if (!form.email.trim()) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';

    if (!form.phone.trim()) e.phone = 'Required';
    else if (form.phone.length < 10) e.phone = 'Invalid phone';

    if (!form.city.trim()) e.city = 'Required';
    if (!form.gender) e.gender = 'Required';
    if (!form.category) e.category = 'Required';
    
    if (!form.password) e.password = 'Required';
    else if (form.password.length < 8) e.password = 'Min 8 chars';

    setErrors(e);
    setTouched({ fullName: true, email: true, phone: true, city: true, gender: true, category: true, password: true });
    return Object.keys(e).length === 0;
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await authAPI.register({
        name: form.fullName, 
        email: form.email, 
        phone: `${form.countryCode}${form.phone}`,
        city: form.city,
        gender: form.gender,
        category: form.category,
        password: form.password, 
        role,
      });

      if (res.success || res.token) {
        const userData = res.user || { name: form.fullName, email: form.email, role };
        localStorage.setItem('user', JSON.stringify(userData));
        if (res.token) localStorage.setItem('token', res.token);
        
        setSuccess(true);
        setTimeout(() => router.push('/onboarding'), 1500);
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err: any) {
      setError(err?.message || 'Server connection failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setForm(prev => ({ ...prev, category: '' })); }, [role]);

  if (!mounted) return null;

  const categories = role === 'freelancer' ? FREELANCER_CATEGORIES : BUSINESS_CATEGORIES;

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-gray-50">
      
      {/* ── Background Blurred Image Collage ── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80")' }} />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[12px] md:backdrop-blur-[20px]" />
      </div>

      <div className="relative z-10 w-full max-w-[500px]">
        {/* ── Centered White Card ── */}
        <div className="bg-white rounded-2xl md:rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100">
          
          <div className="px-8 pt-10 pb-6 text-center">
            {/* Header */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Signup As Freelancer or Business</h1>
            <p className="text-[13px] text-gray-500 font-medium">Join {BRANDING.name} to connect with top talent & clients.</p>
          </div>

          <div className="px-8 pb-8">
            
            {/* ── Role Toggle (Pill Style) ── */}
            <div className="flex gap-4 mb-7 justify-center">
              <button
                type="button"
                onClick={() => setRole('freelancer')}
                className={`
                  flex-1 py-3 px-4 rounded-full text-sm font-semibold transition-all duration-200 border-2
                  ${role === 'freelancer' 
                    ? 'border-blue-600 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }
                `}
              >
                Freelancer
              </button>
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`
                  flex-1 py-3 px-4 rounded-full text-sm font-semibold transition-all duration-200 border-2
                  ${role === 'client' 
                    ? 'border-blue-600 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }
                `}
              >
                Business
              </button>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <div className="mb-5 bg-red-50 text-red-600 text-[13px] p-3.5 rounded-xl border border-red-100 flex items-start gap-2.5 font-medium leading-snug">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Inputs Form ── */}
            <form onSubmit={handleSubmit} className="space-y-4 relative">
              
              {/* Overlay for success state */}
              <AnimatePresence>
                {success && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] rounded-xl flex items-center justify-center flex-col gap-3"
                  >
                    <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={32} />
                    </div>
                    <p className="font-bold text-gray-900 text-lg">Profile Created!</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Full Name */}
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={e => updateField('fullName', e.target.value)}
                  disabled={loading}
                  className={`w-full h-12 bg-white border ${touched.fullName && errors.fullName ? 'border-red-400' : 'border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} rounded-xl px-4 text-sm font-medium outline-none transition-all placeholder:text-gray-400`}
                />
                {touched.fullName && errors.fullName && <p className="text-[11px] text-red-500 font-semibold mt-1 ml-1">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={e => updateField('email', e.target.value)}
                  disabled={loading}
                  className={`w-full h-12 bg-white border ${touched.email && errors.email ? 'border-red-400' : 'border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} rounded-xl px-4 text-sm font-medium outline-none transition-all placeholder:text-gray-400`}
                />
                {touched.email && errors.email && <p className="text-[11px] text-red-500 font-semibold mt-1 ml-1">{errors.email}</p>}
              </div>

              {/* Phone + Country Code */}
              <div className="flex gap-2">
                <div className="relative shrink-0">
                  <select
                    value={form.countryCode}
                    onChange={e => updateField('countryCode', e.target.value)}
                    disabled={loading}
                    className="h-12 bg-white border border-gray-200 focus:border-blue-500 rounded-xl pl-3 pr-8 text-sm font-medium outline-none appearance-none cursor-pointer"
                  >
                    {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <div className="flex-1">
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={e => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    disabled={loading}
                    className={`w-full h-12 bg-white border ${touched.phone && errors.phone ? 'border-red-400' : 'border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} rounded-xl px-4 text-sm font-medium outline-none transition-all placeholder:text-gray-400`}
                  />
                  {touched.phone && errors.phone && <p className="text-[11px] text-red-500 font-semibold mt-1 ml-1">{errors.phone}</p>}
                </div>
              </div>

              {/* City + Gender */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="City / Town"
                    value={form.city}
                    onChange={e => updateField('city', e.target.value)}
                    disabled={loading}
                    className={`w-full h-12 bg-white border ${touched.city && errors.city ? 'border-red-400' : 'border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} rounded-xl px-4 text-sm font-medium outline-none transition-all placeholder:text-gray-400`}
                  />
                  {touched.city && errors.city && <p className="text-[11px] text-red-500 font-semibold mt-1 ml-1">{errors.city}</p>}
                </div>
                <div className="w-[120px]">
                  <CustomSelect
                    value={form.gender}
                    onChange={v => updateField('gender', v)}
                    placeholder="Gender"
                    options={[{label: 'Male', value: 'male'}, {label: 'Female', value: 'female'}, {label: 'Other', value: 'other'}]}
                    disabled={loading}
                    error={touched.gender ? errors.gender : undefined}
                  />
                  {touched.gender && errors.gender && <p className="text-[11px] text-red-500 font-semibold mt-1 ml-1">{errors.gender}</p>}
                </div>
              </div>

              {/* Category */}
              <div>
                <CustomSelect
                  value={form.category}
                  onChange={v => updateField('category', v)}
                  placeholder="Category"
                  options={categories.map(c => ({ label: c, value: c.toLowerCase() }))}
                  disabled={loading}
                  error={touched.category ? errors.category : undefined}
                />
                {touched.category && errors.category && <p className="text-[11px] text-red-500 font-semibold mt-1 ml-1">{errors.category}</p>}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Account Password"
                  value={form.password}
                  onChange={e => updateField('password', e.target.value)}
                  disabled={loading}
                  className={`w-full h-12 bg-white border ${touched.password && errors.password ? 'border-red-400' : 'border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} rounded-xl px-4 pr-12 text-sm font-medium outline-none transition-all placeholder:text-gray-400`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {touched.password && errors.password && <p className="text-[11px] text-red-500 font-semibold mt-1 ml-1">{errors.password}</p>}
              </div>

              {/* ── CREATE PROFILE BUTTON ── */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-bold text-sm tracking-wide rounded-xl shadow-[0_8px_20px_rgb(249,115,22,0.3)] transition-all hover:-translate-y-0.5 active:scale-[0.98] outline-none flex items-center justify-center gap-2"
                >
                 {loading ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : 'CREATE PROFILE'}
                </button>
              </div>

            </form>
          </div>

          {/* ── Footer ── */}
          <div className="bg-gray-50 border-t border-gray-100 p-6 text-center space-y-4">
            <p className="text-xs text-gray-500 leading-relaxed max-w-[340px] mx-auto">
              By creating your profile you agree to the{' '}
              <a href="/terms" className="text-blue-600 font-semibold hover:underline">Terms of Service</a> and{' '}
              <a href="/privacy" className="text-blue-600 font-semibold hover:underline">Privacy Policy</a>
            </p>
            <div className="pt-2">
              <span className="text-sm font-medium text-gray-600">Already have an account? </span>
              <a href="/login" className="text-blue-600 font-semibold hover:underline">Login here</a>
            </div>
          </div>

        </div>

        {/* Back Button */}
        <div className="text-center mt-6">
          <a href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200">
            <ArrowLeft size={16} /> Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
