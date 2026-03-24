'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Megaphone, Image, Tag, Clock, IndianRupee,
  ArrowLeft, Zap, Loader2, CreditCard, CheckCircle2,
  Eye, FileText, Sparkles, BarChart3
} from 'lucide-react';
import { BRANDING } from '@/lib/config';
import { adsAPI } from '@/services/api';

const AD_TYPES = [
  { id: 'post', label: 'Text Post', icon: <FileText size={20} />, desc: 'Simple text-based promotion' },
  { id: 'image', label: 'Image Ad', icon: <Image size={20} />, desc: 'Visual banner ad with image' },
  { id: 'category', label: 'Category Boost', icon: <BarChart3 size={20} />, desc: 'Appear at top of a category' },
];

export default function CreateAdPage() {
  const router = useRouter();
  const t = BRANDING.theme;

  const [step, setStep] = useState<'build' | 'preview' | 'payment' | 'success'>('build');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [priceInfo, setPriceInfo] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    adType: 'post',
    target: 'BOTH',
    category: '',
    durationDays: 7,
    location: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Auto-calculate price when type or duration changes
  const calculatePrice = useCallback(async () => {
    try {
      const res = await adsAPI.calculatePrice({
        adType: form.adType,
        durationDays: form.durationDays,
      });
      setPriceInfo(res);
    } catch {
      // Use client-side fallback
      const tier = BRANDING.adPricing[form.adType as keyof typeof BRANDING.adPricing] || BRANDING.adPricing.post;
      const days = Math.min(Math.max(form.durationDays, tier.minDays), tier.maxDays);
      setPriceInfo({
        adType: form.adType,
        durationDays: days,
        pricePerDay: tier.perDay * 100,
        totalPrice: tier.perDay * days * 100,
        totalDisplay: `₹${tier.perDay * days}`,
      });
    }
  }, [form.adType, form.durationDays]);

  useEffect(() => {
    calculatePrice();
  }, [calculatePrice]);

  const handleSubmit = async () => {
    if (!form.title || !form.description) return;
    setLoading(true);
    setError('');
    try {
      const res = await adsAPI.create(form);
      setPaymentData(res);
      setStep('payment');
    } catch (err: any) {
      setError(err.message || 'Failed to create ad');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentData?.ad?._id) return;
    setLoading(true);
    try {
      await adsAPI.verifyPayment({
        adId: paymentData.ad._id,
        razorpay_order_id: paymentData.payment.orderId,
        razorpay_payment_id: `pay_ad_${Date.now()}`,
        razorpay_signature: 'demo_signature',
      });
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Megaphone size={16} className="text-purple-600" />
            <span className="text-sm font-bold text-slate-800">Create Ad</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* ── BUILD AD ──────────────────────────────────────────────── */}
          {step === 'build' && (
            <motion.div key="build" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Create Your Ad</h1>
                <p className="text-slate-500">Boost your visibility on {BRANDING.displayName}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-purple-500/5 p-6 sm:p-8 space-y-5">
                  {/* Ad Type */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Ad Type</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {AD_TYPES.map(type => (
                        <div
                          key={type.id}
                          onClick={() => setForm({ ...form, adType: type.id })}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            form.adType === type.id
                              ? 'border-purple-500 bg-purple-50/50 shadow-lg shadow-purple-500/10'
                              : 'border-slate-100 hover:border-slate-200'
                          }`}
                        >
                          <div className={`mb-2 ${form.adType === type.id ? 'text-purple-600' : 'text-slate-400'}`}>{type.icon}</div>
                          <p className="text-sm font-bold text-slate-700">{type.label}</p>
                          <p className="text-xs text-slate-400">{type.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Ad Title</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Catchy headline for your ad"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Describe your service or promotion..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all resize-none"
                    />
                  </div>

                  {/* Image URL */}
                  {form.adType === 'image' && (
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Image URL</label>
                      <input
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                        placeholder="https://example.com/banner.jpg"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                      />
                    </div>
                  )}

                  {/* Target Audience */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Target Audience</label>
                    <select
                      name="target"
                      value={form.target}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 font-medium focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                    >
                      <option value="BOTH">Everyone</option>
                      <option value="USER">Clients Only</option>
                      <option value="FREELANCER">Freelancers Only</option>
                    </select>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Clock size={14} /> Duration (Days)
                    </label>
                    <input
                      name="durationDays"
                      type="range"
                      min={1}
                      max={30}
                      value={form.durationDays}
                      onChange={(e) => setForm({ ...form, durationDays: Number(e.target.value) })}
                      className="w-full accent-purple-600"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>1 day</span>
                      <span className="font-bold text-purple-600">{form.durationDays} days</span>
                      <span>30 days</span>
                    </div>
                  </div>

                  {error && <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>}
                </div>

                {/* Price Sidebar */}
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-purple-500/5 p-6 sticky top-24">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Price Summary</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Type</span>
                        <span className="font-bold text-slate-700 capitalize">{form.adType}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Duration</span>
                        <span className="font-bold text-slate-700">{form.durationDays} days</span>
                      </div>
                      {priceInfo && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Per day</span>
                            <span className="font-bold text-slate-700">₹{priceInfo.pricePerDay / 100}</span>
                          </div>
                          <div className="border-t border-slate-100 pt-3">
                            <div className="flex justify-between">
                              <span className="font-bold text-slate-700">Total</span>
                              <span className="text-2xl font-bold text-purple-600">{priceInfo.totalDisplay}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => setStep('preview')}
                      disabled={!form.title || !form.description}
                      className="w-full mt-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-40 shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Eye size={16} /> Preview Ad
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── PREVIEW ───────────────────────────────────────────────── */}
          {step === 'preview' && (
            <motion.div key="preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Ad Preview</h1>
                <p className="text-slate-500">This is how your ad will appear</p>
              </div>

              <div className="max-w-lg mx-auto">
                {/* Ad Preview Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden mb-6">
                  <div className="p-1">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-600 text-[10px] font-bold uppercase">Sponsored</span>
                        <span className="text-[10px] text-slate-400 capitalize">{form.adType} ad</span>
                      </div>
                      {form.image && form.adType === 'image' && (
                        <div className="w-full h-40 bg-slate-100 rounded-lg mb-3 overflow-hidden">
                          <img src={form.image} alt="Ad" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{form.title}</h3>
                      <p className="text-sm text-slate-600">{form.description}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                        <Clock size={12} /> Running for {form.durationDays} days
                      </div>
                    </div>
                  </div>
                </div>

                {error && <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 mb-4">{error}</div>}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('build')}
                    className="flex-1 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
                    {loading ? 'Creating...' : `Pay ${priceInfo?.totalDisplay || ''}`}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── PAYMENT ───────────────────────────────────────────────── */}
          {step === 'payment' && (
            <motion.div key="payment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="max-w-md mx-auto text-center">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-purple-500/5 p-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-6">
                    <Megaphone size={32} className="text-white" />
                  </div>
                  <div className="text-4xl font-bold text-slate-900 mb-2">{paymentData?.payment?.totalDisplay || priceInfo?.totalDisplay}</div>
                  <p className="text-slate-500 mb-1">Ad Campaign Payment</p>
                  <p className="text-xs text-slate-400 mb-8">{form.durationDays} days • {form.adType} ad • Powered by Razorpay</p>

                  {error && <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 mb-4">{error}</div>}

                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                    {loading ? 'Processing...' : 'Pay & Launch Ad'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── SUCCESS ───────────────────────────────────────────────── */}
          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-100 shadow-xl p-8 sm:p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 size={40} className="text-white" />
                </motion.div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Ad is Live! 📢</h1>
                <p className="text-slate-500 mb-8">Your ad campaign is now running. Track performance from your dashboard.</p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => router.push('/ads/dashboard')} className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg shadow-purple-500/20 transition-all">
                    Ad Dashboard
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
