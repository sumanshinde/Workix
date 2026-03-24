'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, MapPin, IndianRupee, Zap, ArrowLeft,
  Tag, AlignLeft, CheckCircle2, Sparkles, Loader2, CreditCard
} from 'lucide-react';
import { BRANDING } from '@/lib/config';
import { requirementsAPI } from '@/services/api';

const CATEGORIES = [
  'Web Development', 'Mobile App', 'UI/UX Design', 'Graphic Design',
  'Content Writing', 'SEO & Marketing', 'Video Editing', 'Data Entry',
  'Photography', 'Accounting', 'Legal', 'Teaching & Tutoring',
  'Plumbing', 'Electrical Work', 'Carpentry', 'Home Cleaning',
  'Delivery', 'Driving', 'Cooking', 'Other'
];

export default function PostRequirementPage() {
  const router = useRouter();
  const t = BRANDING.theme;
  const postFee = BRANDING.marketplace.requirementPostFee;

  const [step, setStep] = useState<'form' | 'preview' | 'payment' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    category: '',
    city: '',
    pincode: '',
    budget: '',
    description: '',
  });
  const [paymentData, setPaymentData] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFormValid = form.title.trim() && form.category && form.budget && form.description.trim();

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setLoading(true);
    setError('');
    try {
      const res = await requirementsAPI.create({
        title: form.title,
        category: form.category,
        city: form.city,
        pincode: form.pincode,
        budget: Number(form.budget),
        description: form.description,
      });
      setPaymentData(res);
      setStep('payment');
    } catch (err: any) {
      setError(err.message || 'Failed to create requirement');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentData?.payment?.orderId) return;
    setLoading(true);
    
    // In production, this would open Razorpay checkout
    // For now, simulate payment verification
    try {
      // When Razorpay SDK is loaded, use:
      // const options = { key: RAZORPAY_KEY_ID, order_id: paymentData.payment.orderId, ... }
      // const rzp = new window.Razorpay(options); rzp.open();
      
      // Simulate successful verification for demo
      await requirementsAPI.verifyPayment({
        postId: paymentData.post._id,
        razorpay_order_id: paymentData.payment.orderId,
        razorpay_payment_id: `pay_demo_${Date.now()}`,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-blue-600" />
            <span className="text-sm font-bold text-slate-800">{BRANDING.displayName}</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-8">
          {['Details', 'Preview', 'Payment', 'Done'].map((label, i) => {
            const stepIndex = ['form', 'preview', 'payment', 'success'].indexOf(step);
            const isActive = i <= stepIndex;
            return (
              <React.Fragment key={label}>
                <div className={`flex items-center gap-2 ${isActive ? 'text-blue-600' : 'text-slate-300'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                    isActive ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-300'
                  }`}>{i + 1}</div>
                  <span className="text-xs font-semibold hidden sm:inline">{label}</span>
                </div>
                {i < 3 && <div className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${i < stepIndex ? 'bg-blue-600' : 'bg-slate-100'}`} />}
              </React.Fragment>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {/* ── STEP 1: FORM ──────────────────────────────────────────────── */}
          {step === 'form' && (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Post a Requirement</h1>
                <p className="text-slate-500">Describe what you need — freelancers nearby will be notified instantly</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-blue-500/5 p-6 sm:p-8 space-y-5">
                {/* Title */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    <FileText size={14} /> Title
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Need a plumber for kitchen repair"
                    maxLength={120}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    <Tag size={14} /> Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 font-medium focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Location Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      <MapPin size={14} /> City
                    </label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="e.g. Mumbai"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      <MapPin size={14} /> Pincode
                    </label>
                    <input
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      placeholder="e.g. 400001"
                      maxLength={6}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    <IndianRupee size={14} /> Budget (₹)
                  </label>
                  <input
                    name="budget"
                    type="number"
                    value={form.budget}
                    onChange={handleChange}
                    placeholder="e.g. 500"
                    min={1}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    <AlignLeft size={14} /> Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your requirement in detail..."
                    maxLength={500}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                  />
                  <div className="text-right mt-1 text-xs text-slate-300">{form.description.length}/500</div>
                </div>

                {/* Fee Notice */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                    <CreditCard size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Posting fee: ₹{postFee}</p>
                    <p className="text-xs text-slate-500">One-time fee to publish your requirement to nearby freelancers</p>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>
                )}

                <button
                  onClick={() => setStep('preview')}
                  disabled={!isFormValid}
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Preview Requirement <Sparkles size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: PREVIEW ───────────────────────────────────────────── */}
          {step === 'preview' && (
            <motion.div key="preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Preview Your Requirement</h1>
                <p className="text-slate-500">Review before paying ₹{postFee} to publish</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-blue-500/5 p-6 sm:p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold uppercase">{form.category}</span>
                    {form.city && (
                      <span className="px-3 py-1 rounded-lg bg-slate-50 text-slate-500 text-xs font-medium flex items-center gap-1">
                        <MapPin size={12} /> {form.city}{form.pincode ? ` - ${form.pincode}` : ''}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{form.title}</h2>
                  <p className="text-slate-600 leading-relaxed">{form.description}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <IndianRupee size={18} className="text-green-600" />
                    <span className="text-xl font-bold text-green-600">₹{form.budget}</span>
                    <span className="text-sm text-slate-400">budget</span>
                  </div>
                </div>

                {error && <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 mt-4 -mb-4">{error}</div>}

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setStep('form')}
                    className="flex-1 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
                    {loading ? 'Creating...' : `Pay ₹${postFee} & Publish`}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: PAYMENT ───────────────────────────────────────────── */}
          {step === 'payment' && (
            <motion.div key="payment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Complete Payment</h1>
                <p className="text-slate-500">Pay ₹{postFee} to publish your requirement</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-blue-500/5 p-6 sm:p-8 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6">
                  <CreditCard size={32} className="text-white" />
                </div>
                <div className="text-4xl font-bold text-slate-900 mb-2">₹{postFee}</div>
                <p className="text-slate-500 mb-1">Requirement Posting Fee</p>
                <p className="text-xs text-slate-400 mb-8">Powered by Razorpay • Instant confirmation</p>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 mb-4">{error}</div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                  {loading ? 'Processing...' : 'Pay & Publish Now'}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 4: SUCCESS ───────────────────────────────────────────── */}
          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-blue-500/5 p-8 sm:p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 size={40} className="text-white" />
                </motion.div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Requirement Published! 🎉</h1>
                <p className="text-slate-500 mb-8">Nearby freelancers have been notified. You'll receive responses soon.</p>
                
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => router.push('/marketplace')}
                    className="px-6 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                  >
                    Browse Marketplace
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/20 transition-all"
                  >
                    Go to Dashboard
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
