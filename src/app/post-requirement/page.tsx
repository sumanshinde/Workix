'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, MapPin, IndianRupee, Zap, ArrowLeft,
  Tag, AlignLeft, CheckCircle2, Sparkles, Loader2, 
  CreditCard, Image as ImageIcon, X, Plus, Rocket
} from 'lucide-react';
import { BRANDING } from '@/lib/config';
import { requirementsAPI } from '@/services/api';
import { Button, Input } from '@/components/ui';

const CATEGORIES = [
  'Web Development', 'Mobile App', 'UI/UX Design', 'Graphic Design',
  'Content Writing', 'SEO & Marketing', 'Video Editing', 'Data Entry',
  'Photography', 'Accounting', 'Legal', 'Teaching & Tutoring',
  'Plumbing', 'Electrical Work', 'Carpentry', 'Home Cleaning',
  'Delivery', 'Driving', 'Cooking', 'Other'
];

const PRESET_FEATURES: Record<string, string[]> = {
  'Web Development': ['Responsive Design', 'E-commerce', 'Payment Gateway', 'Admin Panel', 'SEO Optimized'],
  'Mobile App': ['iOS & Android', 'Push Notifications', 'Social Login', 'Off-line Mode'],
  'Graphic Design': ['Logo Design', 'Social Media Kit', 'Source File', 'High Resolution'],
};

export default function PostRequirementPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    image: '',
    features: [] as string[],
    isBoosted: false,
  });

  const [newFeature, setNewFeature] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm({ ...form, [name]: val });
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

  const addFeature = (f: string) => {
    if (f && !form.features.includes(f)) {
      setForm({ ...form, features: [...form.features, f] });
      setNewFeature('');
    }
  };

  const removeFeature = (f: string) => {
    setForm({ ...form, features: form.features.filter(feat => feat !== f) });
  };

  const isFormValid = form.title.trim() && form.category && form.budget && form.description.trim();

  const [paymentData, setPaymentData] = useState<any>(null);

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setLoading(true);
    setError('');
    try {
      const res = await requirementsAPI.create({
        ...form,
        budget: Number(form.budget),
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
    try {
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

  const postFee = form.isBoosted ? 999 : 500; // Simplified pricing logic

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 h-16 flex items-center justify-center">
        <div className="max-w-4xl w-full flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-blue-600 fill-blue-600" />
            <span className="text-xl font-bold tracking-tight text-slate-900">{BRANDING.name}</span>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div key="form" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
              
              <div className="mb-10 text-center">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Post Your Requirement</h1>
                <p className="text-slate-500 font-medium">Describe what you need and get instant bids from experts.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* FORM COLUMN */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 space-y-8">
                    
                    {/* Image Section */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 block">Visual Context (Optional)</label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative w-full aspect-video rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group ${
                          form.image ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                        }`}
                      >
                        {form.image ? (
                          <>
                            <img src={form.image} alt="Preview" className="w-full h-full object-contain rounded-[22px]" />
                            <button 
                              onClick={(e) => { e.stopPropagation(); setForm({...form, image: ''}); }}
                              className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-rose-500 hover:scale-110 transition-transform"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <div className="text-center space-y-3">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                               <ImageIcon size={28} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-700">Add an image</p>
                              <p className="text-xs text-slate-400 mt-1">Upload sketches or job references</p>
                            </div>
                          </div>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Role Title</label>
                            <Input
                              name="title"
                              value={form.title}
                              onChange={handleChange}
                              placeholder="e.g. Logo Design"
                              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold placeholder:text-slate-300"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Category</label>
                            <select
                              name="category"
                              value={form.category}
                              onChange={handleChange}
                              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold appearance-none"
                            >
                              <option value="">Select Category</option>
                              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                         </div>
                      </div>

                      {/* Feature Tags */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Key Features Required</label>
                        <div className="flex flex-wrap gap-2">
                          {form.features.map(f => (
                            <span key={f} className="pl-4 pr-2 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs flex items-center gap-2 border border-blue-100">
                              {f}
                              <button onClick={() => removeFeature(f)} className="p-1 hover:bg-blue-100 rounded-lg"><X size={12} /></button>
                            </span>
                          ))}
                          <div className="relative">
                             <input 
                               value={newFeature}
                               onChange={(e) => setNewFeature(e.target.value)}
                               onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature(newFeature))}
                               placeholder="Add feature..."
                               className="w-32 px-4 py-2 rounded-xl border border-dashed border-slate-300 text-xs font-semibold focus:border-blue-500 outline-none"
                             />
                             <button onClick={() => addFeature(newFeature)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500"><Plus size={14} /></button>
                          </div>
                        </div>
                        {form.category && PRESET_FEATURES[form.category] && (
                           <div className="pt-2">
                              <p className="text-[10px] text-slate-400 font-bold mb-2">Suggestions:</p>
                              <div className="flex flex-wrap gap-2">
                                {PRESET_FEATURES[form.category].filter(p => !form.features.includes(p)).map(p => (
                                   <button 
                                    key={p} 
                                    onClick={() => addFeature(p)}
                                    className="px-3 py-1.5 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 text-[11px] font-bold text-slate-500 hover:text-blue-600 transition-all"
                                   >
                                    + {p}
                                   </button>
                                ))}
                              </div>
                           </div>
                        )}
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Description</label>
                         <textarea
                           name="description"
                           value={form.description}
                           onChange={handleChange}
                           rows={4}
                           placeholder="Describe the job in detail. Include any specific tech stack or delivery requirements..."
                           className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 transition-all font-medium resize-none shadow-inner"
                         />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Maximum Budget (₹)</label>
                            <div className="relative">
                               <IndianRupee size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" />
                               <input
                                 name="budget"
                                 type="number"
                                 value={form.budget}
                                 onChange={handleChange}
                                 placeholder="e.g. 5000"
                                 className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 bg-emerald-50/30 focus:bg-white focus:border-emerald-500 transition-all font-bold text-emerald-700 outline-none"
                               />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Location/City</label>
                            <div className="relative">
                               <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                               <input
                                 name="city"
                                 value={form.city}
                                 onChange={handleChange}
                                 placeholder="e.g. Remote or Mumbai"
                                 className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 transition-all font-semibold outline-none"
                               />
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SIDEBAR COLUMN */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Boost Section */}
                  <div className={`rounded-[32px] border-2 transition-all duration-500 p-6 ${
                    form.isBoosted 
                      ? 'border-blue-500 bg-blue-600 shadow-2xl shadow-blue-500/30 text-white' 
                      : 'border-slate-200 bg-white text-slate-900 group'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        form.isBoosted ? 'bg-white/20' : 'bg-blue-50 text-blue-600'
                      }`}>
                         <Rocket size={24} className={form.isBoosted ? 'animate-bounce' : ''} />
                      </div>
                      <div className="pt-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            name="isBoosted"
                            checked={form.isBoosted}
                            onChange={handleChange}
                            className="sr-only peer" 
                          />
                          <div className={`w-11 h-6 rounded-full peer transition-all duration-300 ${
                            form.isBoosted ? 'bg-white/40 ring-2 ring-white/50' : 'bg-slate-200 peer-hover:bg-slate-300'
                          } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm`} />
                        </label>
                      </div>
                    </div>
                    <h3 className="text-lg font-extrabold mb-1">Boost Visibility</h3>
                    <p className={`text-[11px] font-medium leading-relaxed opacity-80 ${form.isBoosted ? 'text-blue-100' : 'text-slate-500'}`}>
                      Get 5x more responses by featuring your requirement at the top of the {BRANDING.name} marketplace for 7 days.
                    </p>
                    <div className={`mt-6 pt-6 border-t font-bold flex justify-between items-center ${
                      form.isBoosted ? 'border-white/20 text-white' : 'border-slate-100 text-blue-600'
                    }`}>
                      <span>Boost Pack</span>
                      <span className="text-xl">₹499</span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 mb-6">Order Summary</h3>
                    <div className="space-y-4">
                       <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                          <span>Listing Fee</span>
                          <span className="text-slate-900">₹500</span>
                       </div>
                       {form.isBoosted && (
                         <div className="flex justify-between text-xs font-bold text-blue-600 uppercase tracking-wider">
                            <span className="flex items-center gap-1.5"><Sparkles size={12} /> Boost Pro</span>
                            <span>₹499</span>
                         </div>
                       )}
                       <div className="border-t border-slate-100 pt-5 mt-2 flex justify-between items-center">
                          <span className="text-sm font-extrabold text-slate-900">Total Payable</span>
                          <span className="text-2xl font-black text-blue-600">₹{postFee}</span>
                       </div>
                    </div>

                    <div className="mt-10 space-y-4">
                       <Button
                         onClick={() => setStep('preview')}
                         disabled={!isFormValid}
                         className="w-full py-7 rounded-[20px] bg-slate-900 text-white font-bold text-sm shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:hover:translate-y-0"
                       >
                          Review Post <AlignLeft size={18} />
                       </Button>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-2 opacity-30 grayscale pointer-events-none">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'preview' && (
             <motion.div key="preview" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
                <div className="max-w-2xl mx-auto space-y-10">
                   <div className="text-center">
                      <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Final Review</h2>
                      <p className="text-slate-500">Your requirement will look like this to freelancers.</p>
                   </div>

                   <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl shadow-blue-600/5 overflow-hidden">
                      {form.isBoosted && (
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-center px-4">
                           <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                             <Sparkles size={14} className="fill-white" /> Featured Campaign Item
                           </p>
                        </div>
                      )}
                      
                      {form.image && (
                        <div className="w-full aspect-[21/9] bg-slate-100 border-b overflow-hidden relative">
                           <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div className="p-10 space-y-8">
                         <div className="flex flex-wrap items-center gap-3">
                            <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">{form.category}</span>
                            <span className="px-4 py-1.5 rounded-full bg-slate-50 text-slate-500 font-bold text-[10px] uppercase flex items-center gap-2"><MapPin size={12}/> {form.city || 'Anywhere'}</span>
                         </div>
                         
                         <div>
                            <h3 className="text-3xl font-extrabold text-slate-900 mb-4">{form.title}</h3>
                            <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-line">{form.description}</p>
                         </div>

                         {form.features.length > 0 && (
                            <div className="space-y-4">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requirements</p>
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {form.features.map(f => (
                                     <div key={f} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                           <CheckCircle2 size={14} className="text-blue-600" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700">{f}</span>
                                     </div>
                                  ))}
                               </div>
                            </div>
                         )}

                         <div className="pt-6 border-t flex flex-wrap items-center justify-between gap-6">
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Budget</p>
                               <p className="text-3xl font-black text-emerald-600">₹{Number(form.budget).toLocaleString()}</p>
                            </div>
                            <div className="flex gap-4">
                               <Button variant="ghost" onClick={() => setStep('form')} className="px-8 py-4 rounded-2xl font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 transition-all">Edit Post</Button>
                               <Button 
                                 onClick={handleSubmit} 
                                 isLoading={loading}
                                 className="px-8 py-7 rounded-2xl font-bold bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:scale-105 transition-all flex items-center gap-2"
                               >
                                  <Zap size={20} /> Confirm & Pay ₹{postFee}
                               </Button>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
          )}

          {step === 'payment' && (
            <motion.div key="payment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto py-12">
               <div className="bg-white rounded-[40px] p-10 border border-slate-200 text-center space-y-8 shadow-2xl shadow-blue-900/5">
                  <div className="w-24 h-24 rounded-[32px] bg-blue-50 flex items-center justify-center mx-auto">
                     <CreditCard size={40} className="text-blue-600" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-extrabold text-slate-900">Final Step</h3>
                     <p className="text-slate-500 font-medium mt-1">Instant publication available</p>
                  </div>
                  <div className="py-6 px-4 bg-slate-50 rounded-3xl border border-slate-100">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Payable Amount</p>
                     <p className="text-5xl font-black text-blue-600">₹{postFee}</p>
                  </div>
                  {error && <p className="text-xs font-bold text-rose-500 bg-rose-50 p-4 rounded-2xl">{error}</p>}
                  <Button 
                    onClick={handlePayment} 
                    isLoading={loading}
                    className="w-full py-8 rounded-[20px] bg-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                  >
                     <Zap size={18} /> Launch Campaign Now
                  </Button>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Secured by Razorpay • 256-bit Encryption</p>
               </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto py-12">
               <div className="bg-white rounded-[48px] p-16 border border-slate-200 text-center space-y-10 shadow-2xl shadow-emerald-900/5">
                  <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600 outline outline-[12px] outline-emerald-50">
                     <CheckCircle2 size={48} />
                  </div>
                  <div className="space-y-4">
                     <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Requirement Live! 🎉</h2>
                     <p className="text-slate-500 font-medium max-w-sm mx-auto">Your post is now visible to all verified professionals. Sit back while the best talent comes to you.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                     <Button variant="outline" onClick={() => router.push('/marketplace')} className="px-10 py-7 rounded-3xl border-2 border-slate-100 font-bold text-slate-900 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 leading-none">
                        View in Marketplace
                     </Button>
                     <Button onClick={() => router.push('/dashboard')} className="px-10 py-7 rounded-3xl bg-slate-900 text-white font-bold hover:shadow-xl hover:shadow-slate-900/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 leading-none">
                        Go to Dashboard <Zap size={18} />
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
