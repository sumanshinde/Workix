'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowRight, CheckCircle2, 
  MapPin, User, FileText, Upload, 
  Search, Shield, AlertCircle, Building, 
  Clock, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Input } from '@/components/ui';

export default function VerificationPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    idType: 'pancard',
    idNumber: '',
    address: '',
    state: ''
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mimic API processing
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 2000);
  };

  const currentStepLabel = (s: number) => {
    switch(s) {
      case 1: return 'Personal Authentication';
      case 2: return 'Identity Clusters';
      case 3: return 'Review Verification';
      default: return 'Outcome';
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col selection:bg-blue-100 selection:text-blue-600">
      
      {/* ── Progress Cluster ── */}
      <div className="sticky top-0 z-50 bg-white/80 border-b border-gray-100 h-1 flex items-center">
         <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${(step/4)*100}%` }} />
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full py-20 flex flex-col items-center">
         
         <AnimatePresence mode="wait">
           {step < 4 ? (
             <motion.div 
               key="form-container"
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="w-full space-y-12"
             >
                <div className="text-center space-y-4">
                   <div className="w-20 h-20 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto border border-blue-100 mb-6">
                      <ShieldCheck size={32} className="text-blue-600" />
                   </div>
                   <h1 className="text-3xl font-semibold text-[#111827] tracking-tight">Trust Verification</h1>
                   <p className="text-gray-500 font-medium">Get the <span className="text-blue-600 font-bold">GigIndia Verified</span> badge to gain 3x trust.</p>
                </div>

                {/* Progress Indicators */}
                <div className="flex justify-center gap-8 border-b border-gray-100 pb-8">
                   {[1, 2, 3].map((s: number) => (
                     <div key={s} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= s ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
                           {step > s ? <Check size={12} /> : s}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${step === s ? 'text-blue-600' : 'text-gray-300'}`}>Step {s}</span>
                     </div>
                   ))}
                </div>

                <Card className="p-10 border-gray-100 shadow-sm shadow-gray-200/50 rounded-[40px]">
                   <form onSubmit={handleSubmit} className="space-y-10">
                      {step === 1 && (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-8"
                        >
                           <h3 className="text-sm font-bold text-gray-900 flex items-center gap-3">
                             <User size={18} className="text-blue-500" /> Authorized Identity
                           </h3>
                           <div className="grid grid-cols-1 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Legal Full Name</label>
                                 <Input 
                                   required
                                   placeholder="As per Government ID" 
                                   value={formData.fullName}
                                   onChange={e => setFormData({...formData, fullName: e.target.value})}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Primary Address Cluster</label>
                                 <Input 
                                   required
                                   placeholder="Current Residential Address"
                                   value={formData.address}
                                   onChange={e => setFormData({...formData, address: e.target.value})}
                                 />
                              </div>
                           </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-8"
                        >
                           <h3 className="text-sm font-bold text-gray-900 flex items-center gap-3">
                             <FileText size={18} className="text-blue-500" /> Identity Verification
                           </h3>
                           <div className="grid grid-cols-1 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select ID Type</label>
                                 <select 
                                   className="w-full rounded-lg border border-gray-100 bg-gray-50/50 text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all appearance-none cursor-pointer"
                                   value={formData.idType}
                                   onChange={e => setFormData({...formData, idType: e.target.value})}
                                 >
                                    <option value="pancard">Income Tax PAN Card</option>
                                    <option value="aadhar">UIDAI Aadhar Card</option>
                                    <option value="voter">Election Voter ID</option>
                                 </select>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Government ID Number</label>
                                 <Input 
                                   required
                                   placeholder="XXXXX-XXXX-X" 
                                   value={formData.idNumber}
                                   onChange={e => setFormData({...formData, idNumber: e.target.value})}
                                 />
                              </div>
                           </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-8"
                        >
                           <h3 className="text-sm font-bold text-gray-900 flex items-center gap-3">
                             <Upload size={18} className="text-blue-500" /> Supporting Evidence
                           </h3>
                           <div className="p-12 border-2 border-dashed border-blue-100 rounded-[32px] bg-blue-50/20 text-center space-y-4 hover:bg-blue-50/40 transition-all cursor-pointer">
                              <div className="w-16 bg-white rounded-lg flex items-center justify-center mx-auto shadow-sm">
                                 <Upload size={24} className="text-blue-500" />
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-blue-900">Upload Identity Proof</p>
                                 <p className="text-xs text-blue-400">PDF, JPG, or PNG up to 10MB</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                              <ShieldCheck size={20} className="shrink-0" />
                              Secure Indian compliance — your data is encrypted.
                           </div>
                        </motion.div>
                      )}

                      <div className="flex items-center justify-between pt-4">
                         {step > 1 ? (
                           <button 
                             type="button" 
                             onClick={prevStep}
                             className="text-sm text-gray-400 font-bold hover:text-gray-600 transition-colors uppercase tracking-widest"
                           >
                              Back
                           </button>
                         ) : (
                           <div />
                         )}
                         {step < 3 ? (
                           <button 
                             type="button" 
                             onClick={nextStep}
                             className="py-4 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition-all"
                           >
                              Proceed to Step {step + 1}
                           </button>
                         ) : (
                           <button 
                             type="submit" 
                             disabled={loading}
                             className="py-4 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-50"
                           >
                              {loading ? 'Analyzing Compliance...' : 'Submit Verification Node'}
                           </button>
                         )}
                      </div>
                   </form>
                </Card>
             </motion.div>
           ) : (
             <motion.div 
               key="outcome-container"
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="text-center space-y-12"
             >
                <div className="w-32 h-32 bg-emerald-50 rounded-[48px] flex items-center justify-center mx-auto border-2 border-emerald-100 shadow-sm shadow-emerald-500/10">
                   <Check size={64} className="text-emerald-500" strokeWidth={3} />
                </div>
                <div className="space-y-4">
                   <h2 className="text-4xl font-semibold text-[#111827]">Application Queue Entry</h2>
                   <p className="text-gray-500 font-medium max-w-sm mx-auto">Our trust commanders are reviewing your identity node. Expected outcome within <span className="text-blue-600 font-bold">24-48 hours</span>.</p>
                </div>
                <Card className="p-8 border-gray-100 bg-white shadow-sm overflow-hidden relative">
                   <div className="flex items-center gap-6 relative z-10 text-left">
                      <div className="w-14 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                         <Clock size={24} />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verification Status</p>
                         <p className="text-sm font-bold text-gray-900">IDENTITY_SYNC_PENDING</p>
                      </div>
                   </div>
                   
                </Card>
                <Button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="w-full rounded-lg text-sm font-bold"
                >
                  Return to Control Hub
                </Button>
             </motion.div>
           )}
         </AnimatePresence>

      </div>
    </div>
  );
}
