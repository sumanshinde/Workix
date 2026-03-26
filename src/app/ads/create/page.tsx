'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Megaphone, Image as ImageIcon, Tag, Clock, IndianRupee,
  ArrowLeft, Zap, Loader2, CreditCard, CheckCircle2, ChevronRight,
  Eye, FileText, Sparkles, BarChart3, Target, Layout, ShieldCheck
} from 'lucide-react';
import { BRANDING } from '@/lib/config';
import { adsAPI } from '@/services/api';
import { Button, Input } from '@/components/ui';

const AD_TYPES = [
  { 
    id: 'post', 
    label: 'Precision Text', 
    icon: <FileText size={24} />, 
    desc: 'High-visibility text focus', 
    color: 'blue' 
  },
  { 
    id: 'image', 
    label: 'Visual Banner', 
    icon: <ImageIcon size={24} />, 
    desc: 'Engaging visual campaign', 
    color: 'purple' 
  },
  { 
    id: 'category', 
    label: 'Contextual Lead', 
    icon: <BarChart3 size={24} />, 
    desc: 'Top of category results', 
    color: 'indigo' 
  },
];

export default function CreateAdPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<'build' | 'preview' | 'payment' | 'success'>('build');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [priceInfo, setPriceInfo] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    adType: 'image',
    target: 'BOTH',
    category: '',
    features: '',
    budget: '',
    boostAd: false,
    durationDays: 7,
    location: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const calculatePrice = useCallback(async () => {
    try {
      const res = await adsAPI.calculatePrice({
        adType: form.adType,
        durationDays: form.durationDays,
      });
      let baseTotal = res.totalPrice;
      if (form.boostAd) baseTotal += 50000; // Adds 500 INR in paise
      setPriceInfo({
        ...res,
        totalDisplay: `₹${baseTotal / 100}`
      });
    } catch {
      const tier = BRANDING.adPricing[form.adType as keyof typeof BRANDING.adPricing] || BRANDING.adPricing.post;
      const days = Math.min(Math.max(form.durationDays, tier.minDays), tier.maxDays);
      let baseTotal = tier.perDay * days;
      if (form.boostAd) baseTotal += 50000;
      setPriceInfo({
        adType: form.adType,
        durationDays: days,
        pricePerDay: tier.perDay,
        totalPrice: baseTotal,
        totalDisplay: `₹${baseTotal / 100}`,
      });
    }
  }, [form.adType, form.durationDays, form.boostAd]);

  useEffect(() => {
    calculatePrice();
  }, [calculatePrice]);

  const handleSubmit = async () => {
    if (!form.title || !form.description) return;
    setLoading(true);
    setError('');
    try {
      // Pass the fully populated form into standard API
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
    <div className="min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 h-16 flex items-center justify-center">
        <div className="max-w-5xl w-full flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Megaphone size={20} className="text-purple-600 fill-purple-600" />
            <span className="text-xl font-bold tracking-tight text-slate-900">Campaign Manager</span>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {step === 'build' && (
            <motion.div 
              key="build" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10"
            >
              <div className="lg:col-span-8 space-y-10">
                <div className="space-y-4">
                   <h1 className="text-4xl font-black text-slate-900 tracking-tight">Create Ad Campaign</h1>
                   <p className="text-slate-500 font-medium">Create a high-impact ad campaign to promote your profile or business.</p>
                </div>

                {/* Ad Type Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {AD_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setForm({ ...form, adType: type.id })}
                      className={`relative p-6 rounded-[28px] border-2 text-left transition-all duration-300 group ${
                        form.adType === type.id
                          ? 'border-purple-500 bg-white shadow-xl shadow-purple-500/10'
                          : 'border-slate-100 bg-white/50 hover:bg-white hover:border-slate-200'
                      }`}
                    >
                      <div className={`mb-4 w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        form.adType === type.id ? 'bg-purple-100 text-purple-600' : 'bg-slate-50 text-slate-400'
                      }`}>
                         {type.icon}
                      </div>
                      <p className="font-extrabold text-slate-900 leading-tight">{type.label}</p>
                      <p className="text-[11px] font-medium text-slate-400 mt-1">{type.desc}</p>
                      {form.adType === type.id && (
                        <div className="absolute top-4 right-4 text-purple-600">
                          <CheckCircle2 size={16} fill="currentColor" stroke="white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="bg-white rounded-[40px] border border-slate-200 p-10 space-y-10 shadow-sm">
                   
                   <div className="space-y-8">
                      {/* Visual Upload */}
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">1. Requirement Image</label>
                        <div 
                           onClick={() => fileInputRef.current?.click()}
                           className="aspect-[21/9] w-full rounded-3xl border-2 border-dashed border-slate-200 hover:border-purple-400 bg-slate-50/50 hover:bg-purple-50/30 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden group"
                        >
                           {form.image ? (
                             <img src={form.image} alt="prev" className="w-full h-full object-cover" />
                           ) : (
                             <div className="text-center space-y-2">
                                <ImageIcon size={32} className="text-slate-300 mx-auto group-hover:scale-110 group-hover:text-purple-500 transition-all" />
                                <p className="text-xs font-bold text-slate-400">Click to Upload Image</p>
                             </div>
                           )}
                           <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">1. Category Choose</label>
                            <div className="relative">
                               <Target size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                               <select
                                 name="category"
                                 value={form.category}
                                 onChange={handleChange}
                                 className="w-full h-[52px] pl-14 pr-5 rounded-2xl bg-slate-50 border border-slate-100 font-bold appearance-none cursor-pointer"
                               >
                                  <option value="">Select Category...</option>
                                  <option value="development">Software & Development</option>
                                  <option value="design">Design & Creative</option>
                                  <option value="marketing">Sales & Marketing</option>
                                  <option value="writing">Writing & Translation</option>
                                  <option value="other">Other Fields</option>
                               </select>
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">3. Budget Set (₹)</label>
                            <Input 
                               name="budget"
                               type="number"
                               value={form.budget}
                               onChange={handleChange}
                               placeholder="e.g. 5000"
                               className="px-6 py-4 rounded-2xl bg-slate-50 border-slate-100 font-bold text-base h-[52px]"
                            />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">2. Features They Want</label>
                         <Input 
                            name="features"
                            value={form.features}
                            onChange={handleChange}
                            placeholder="e.g. Needs React.js, Responsive UI, Admin Dashboard, etc."
                            className="px-6 py-4 rounded-2xl bg-slate-50 border-slate-100 font-bold text-base h-[52px]"
                         />
                      </div>

                      <div className="space-y-6 pt-4 border-t border-slate-100">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Requirement Title</label>
                            <Input 
                               name="title"
                               value={form.title}
                               onChange={handleChange}
                               placeholder="e.g. Seeking expert developer for SaaS platform"
                               className="px-6 py-5 rounded-2xl bg-slate-50 border-slate-100 font-bold text-lg"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">4. Description</label>
                            <textarea
                               name="description"
                               value={form.description}
                               onChange={handleChange}
                               rows={4}
                               placeholder="Describe your project, timeline, and expectations in detail..."
                               className="w-full px-6 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-purple-400 transition-all font-medium resize-none"
                            />
                         </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-100">
                         <label className="flex items-start gap-4 cursor-pointer group p-5 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:bg-white hover:border-purple-200 transition-all">
                            <input 
                               type="checkbox" 
                               checked={form.boostAd} 
                               onChange={(e) => setForm({...form, boostAd: e.target.checked})}
                               className="w-6 h-6 mt-0.5 rounded-lg border-slate-300 text-purple-600 focus:ring-purple-600 transition-all"
                            />
                            <div className="flex-1">
                               <p className="text-lg font-black text-slate-900 group-hover:text-purple-600 transition-colors flex items-center gap-2">5. Boost Ads Option <Zap size={16} className="fill-purple-500 text-purple-500" /></p>
                               <p className="text-sm font-medium text-slate-500 mt-1">Get 10x more visibility by pushing your requirement to the top of all freelancer feeds for a flat ₹500 fee.</p>
                            </div>
                         </label>
                      </div>

                   </div>
                </div>
              </div>

              <div className="lg:col-span-4 lg:pt-14">
                 <div className="sticky top-28 space-y-6">
                    <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl shadow-slate-900/20 space-y-8">
                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estimate & Post</h3>
                       
                       <div className="space-y-4">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                             <span>Market Rate</span>
                             <span className="text-white">₹{priceInfo ? priceInfo.pricePerDay / 100 : '--'} / day</span>
                          </div>
                          <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                             <span>Boost Add-on</span>
                             <span className={form.boostAd ? "text-purple-400" : "text-white"}>{form.boostAd ? '+ ₹500' : '₹0'}</span>
                          </div>
                          <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                             <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Total Investment</p>
                                <p className="text-4xl font-black text-purple-400 tracking-tighter">{priceInfo?.totalDisplay || '₹0'}</p>
                             </div>
                          </div>
                       </div>

                       <Button
                         onClick={() => setStep('preview')}
                         disabled={!form.title || !form.description || !form.category}
                         className="w-full py-7 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-xl shadow-purple-900/40 text-lg"
                       >
                          Analyze Preview <ChevronRight size={20} />
                       </Button>

                       <p className="text-center text-[10px] font-bold text-slate-500 h-10 flex items-center justify-center border-t border-white/5 uppercase tracking-widest">⚡ Instant Distribution</p>
                    </div>

                    <div className="bg-white rounded-[28px] border border-slate-200 p-6 flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <ShieldCheck size={20} />
                       </div>
                       <div>
                          <p className="text-[11px] font-bold text-slate-900 uppercase tracking-widest leading-none mb-1">Guaranteed Reach</p>
                          <p className="text-[10px] font-medium text-slate-500">Your requirement will serve approximately 5,000+ targeted impressions daily.</p>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {step === 'preview' && (
            <motion.div key="preview" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto space-y-10">
               <div className="text-center space-y-4">
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Campaign Visualization</h2>
                  <p className="text-slate-500 font-medium">Verified display render for your requirement.</p>
               </div>

               <div className="bg-white border rounded-[48px] overflow-hidden shadow-2xl shadow-purple-600/5">
                   {form.boostAd && (
                     <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 flex justify-center">
                        <p className="text-[10px] font-black text-white py-1 uppercase tracking-[0.2em] flex items-center gap-2"><Sparkles size={14} fill="currentColor" /> Boosted Placement Active</p>
                     </div>
                   )}
                   
                   <div className="p-10 space-y-8">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                             <div className="px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-widest rounded-lg">{form.category || 'Category'}</div>
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Budget: ₹{form.budget || 'Not specified'}</div>
                         </div>
                         <div className="text-[10px] font-bold text-slate-400 opacity-50 uppercase tracking-widest">Active Status</div>
                      </div>

                      {form.image && (
                        <div className="w-full aspect-video rounded-3xl overflow-hidden bg-slate-100">
                           <img src={form.image} alt="prev" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div className="space-y-4">
                         <h3 className="text-3xl font-black text-slate-900 leading-tight">{form.title}</h3>
                         <p className="text-slate-600 font-medium leading-[1.8] text-lg">{form.description}</p>
                         
                         {form.features && (
                            <div className="pt-4 border-t border-slate-100 mt-6">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Required Features</p>
                               <div className="flex flex-wrap gap-2">
                                  {form.features.split(',').map((feat, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-bold text-slate-700 border border-slate-200">
                                      {feat.trim()}
                                    </span>
                                  ))}
                               </div>
                            </div>
                         )}
                      </div>

                      <div className="pt-10 border-t flex flex-wrap items-center justify-between gap-6">
                         <div className="flex items-center gap-4 w-full sm:w-auto">
                            <button onClick={() => setStep('build')} className="px-8 py-4 rounded-2xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex-1 sm:flex-none">Modify</button>
                            <button 
                               onClick={handleSubmit} 
                               disabled={loading}
                               className="px-8 py-4 rounded-2xl font-bold bg-purple-600 text-white shadow-xl shadow-purple-600/20 hover:scale-105 transition-all flex flex-1 sm:flex-none justify-center items-center gap-2 whitespace-nowrap"
                            >
                               {loading ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} />}
                               5. Launch Ad Campaign
                            </button>
                         </div>
                      </div>
                   </div>
               </div>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div key="payment" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto space-y-10">
               <div className="bg-white rounded-[40px] p-10 border border-slate-200 text-center space-y-8 shadow-2xl">
                  <div className="w-24 h-24 rounded-[32px] bg-purple-50 flex items-center justify-center mx-auto shadow-sm">
                     <CreditCard size={40} className="text-purple-600" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-slate-900">Checkout</h3>
                     <p className="text-slate-500 font-medium mt-1">Authorized payment via Razorpay</p>
                  </div>
                  <div className="py-8 bg-slate-50 rounded-3xl border border-slate-100 space-y-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Settlement Amount</p>
                     <p className="text-5xl font-black text-purple-600 tracking-tighter">{paymentData?.payment?.totalDisplay || priceInfo?.totalDisplay}</p>
                  </div>
                  {error && <p className="p-4 bg-rose-50 text-rose-600 text-xs font-bold rounded-2xl border border-rose-100">{error}</p>}
                  <Button 
                    onClick={handlePayment} 
                    isLoading={loading}
                    className="w-full py-8 rounded-[24px] bg-emerald-600 text-white font-bold text-lg shadow-xl shadow-emerald-600/20 hover:scale-[1.02] transition-all"
                  >
                     Authorize Payment <Zap size={18} fill="currentColor" className="ml-2" />
                  </Button>
               </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto py-12">
               <div className="bg-white rounded-[64px] p-16 border border-slate-200 text-center space-y-10 shadow-2xl">
                  <div className="w-28 h-28 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600 outline outline-[16px] outline-emerald-50">
                     <CheckCircle2 size={56} />
                  </div>
                  <div className="space-y-4">
                     <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Ad Campaign Live! 🚀</h2>
                     <p className="text-slate-500 font-semibold text-lg max-w-sm mx-auto">Your ad campaign is actively running. Target clients will see it instantly.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                     <Button onClick={() => router.push('/dashboard')} className="px-10 py-8 rounded-3xl bg-slate-900 text-white font-bold shadow-xl shadow-slate-900/20 hover:-translate-y-1 transition-all leading-none">
                        Go to Dashboard
                     </Button>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
