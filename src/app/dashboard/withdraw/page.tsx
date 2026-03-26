'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  IndianRupee, Landmark, Send, Info, Clock, 
  CheckCircle, AlertCircle, ChevronRight, 
  Plus, ArrowRight, ShieldCheck, Wallet, 
  Building2, Smartphone, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { payoutsAPI, authAPI } from '@/services/api';
import { Button, Card, Input } from '@/components/ui';

export default function WithdrawPage() {
  const [profile, setProfile] = useState<any>(null);
  const [payoutRequests, setPayoutRequests] = useState<any[]>([]);
  const [payoutMethod, setPayoutMethod] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  
  // Setup Form State
  const [setupData, setSetupData] = useState({
    accountType: 'bank_account',
    name: '',
    email: '',
    contact: '',
    details: {
      accountNumber: '',
      ifsc: '',
      vpa: '',
      name: ''
    }
  });

  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [me, stats, method] = await Promise.all([
        authAPI.me(),
        payoutsAPI.getUserStats('me'),
        payoutsAPI.getPayoutMethod()
      ]);
      setProfile(me);
      setPayoutRequests(stats);
      setPayoutMethod(method);
    } catch (e: any) {
      console.error('Fetch Failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    
    setSubmitting(true);
    try {
      await payoutsAPI.requestPayout(Number(amount), profile?._id);
      setAmount('');
      alert('Withdrawal request submitted successfully! Funds will be processed within 24-48 hours.');
      fetchData();
    } catch (e: any) {
      alert(e.message || 'Failed to request withdrawal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = {
        ...setupData,
        name: setupData.name || profile?.name,
        email: setupData.email || profile?.email,
        contact: setupData.contact || profile?.phone,
        details: setupData.accountType === 'bank_account' 
          ? { accountNumber: setupData.details.accountNumber, ifsc: setupData.details.ifsc, name: setupData.details.name }
          : { vpa: setupData.details.vpa, name: setupData.details.name }
      };
      const res = await payoutsAPI.setupMethod(data);
      setPayoutMethod(res);
      setShowSetup(false);
      alert('Withdrawal destination configured successfully.');
    } catch (e: any) {
      alert(e.message || 'Failed to setup payout method');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Wallet...</p>
      </div>
    );
  }

  const balanceInRupees = (profile?.walletBalance || 0) / 100;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-900">
      
      {/* 1. Header Section */}
      <header className="bg-white border-b border-slate-200 pt-16 pb-12 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-3">
             <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.3em]">
                <ShieldCheck size={14} /> Secure Financial Tunnel
             </div>
             <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase leading-none">
                Capital <br /> <span className="text-blue-600">Extraction.</span>
             </h1>
             <p className="text-slate-400 font-bold text-sm uppercase tracking-tight">Move your hard-earned revenue to your primary accounts.</p>
          </div>
          
          <Card className="p-8 bg-slate-900 border-0 shadow-2xl rounded-[2.5rem] min-w-[320px] relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><Wallet size={80} /></div>
             <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Available Flux</span>
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-4xl font-black text-white tracking-tighter italic">
                   ₹{balanceInRupees.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                   <Info size={12} /> Balance cleared for withdrawal
                </div>
             </div>
          </Card>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           
           {/* LEFT COLUMN: ACTIONS */}
           <div className="lg:col-span-7 space-y-12">
              
              {showSetup ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="p-10 border-0 shadow-sm rounded-[3rem] bg-white space-y-8">
                    <div className="flex items-center justify-between">
                       <h2 className="text-2xl font-black italic tracking-tight uppercase">Setup Destination</h2>
                       <button onClick={() => setShowSetup(false)} className="text-slate-400 hover:text-slate-900 font-bold text-xs uppercase underline">Cancel</button>
                    </div>

                    <form onSubmit={handleSetupSubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                         <button 
                           type="button"
                           onClick={() => setSetupData({...setupData, accountType: 'bank_account'})}
                           className={`p-6 rounded-3xl border-2 transition-all flex flex-col gap-3 items-start ${setupData.accountType === 'bank_account' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                         >
                            <Building2 size={24} className={setupData.accountType === 'bank_account' ? 'text-blue-600' : 'text-slate-400'} />
                            <span className="font-black text-xs uppercase tracking-widest">Bank Account</span>
                         </button>
                         <button 
                           type="button"
                           onClick={() => setSetupData({...setupData, accountType: 'vpa'})}
                           className={`p-6 rounded-3xl border-2 transition-all flex flex-col gap-3 items-start ${setupData.accountType === 'vpa' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                         >
                            <Smartphone size={24} className={setupData.accountType === 'vpa' ? 'text-blue-600' : 'text-slate-400'} />
                            <span className="font-black text-xs uppercase tracking-widest">UPI / VPA</span>
                         </button>
                      </div>

                      <div className="space-y-4 pt-4">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Holder Name</label>
                            <Input 
                              placeholder="Full Name as per Bank"
                              value={setupData.details.name}
                              onChange={(e) => setSetupData({...setupData, details: {...setupData.details, name: e.target.value}})}
                              className="h-14 rounded-2xl border-slate-100 text-sm font-bold"
                              required
                            />
                         </div>

                         {setupData.accountType === 'bank_account' ? (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Number</label>
                                 <Input 
                                   placeholder="0000 0000 0000"
                                   value={setupData.details.accountNumber}
                                   onChange={(e) => setSetupData({...setupData, details: {...setupData.details, accountNumber: e.target.value}})}
                                   className="h-14 rounded-2xl border-slate-100 text-sm font-bold"
                                   required
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">IFSC Code</label>
                                 <Input 
                                   placeholder="HDFC0001234"
                                   value={setupData.details.ifsc}
                                   onChange={(e) => setSetupData({...setupData, details: {...setupData.details, ifsc: e.target.value.toUpperCase()}})}
                                   className="h-14 rounded-2xl border-slate-100 text-sm font-bold"
                                   required
                                 />
                              </div>
                           </div>
                         ) : (
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">UPI ID (VPA)</label>
                              <Input 
                                placeholder="name@upi"
                                value={setupData.details.vpa}
                                onChange={(e) => setSetupData({...setupData, details: {...setupData.details, vpa: e.target.value}})}
                                className="h-14 rounded-2xl border-slate-100 text-sm font-bold"
                                required
                              />
                           </div>
                         )}
                      </div>

                      <Button 
                        type="submit" 
                        disabled={submitting}
                        className="w-full h-16 rounded-[2rem] bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all"
                      >
                         {submitting ? 'Verifying...' : 'Authenticate Withdrawal Destination'}
                      </Button>
                    </form>
                  </Card>
                </motion.div>
              ) : (
                <div className="space-y-8">
                   {/* Amount Entry */}
                   <Card className="p-10 border-0 shadow-sm rounded-[3rem] bg-white space-y-10">
                      <div className="space-y-2">
                         <h2 className="text-2xl font-black italic tracking-tight uppercase">Request Transfer</h2>
                         <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest">Specify the quantum of funds to extract.</p>
                      </div>

                      <form onSubmit={handleWithdraw} className="space-y-10">
                         <div className="relative">
                            <IndianRupee size={40} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-900" />
                            <input 
                              type="number"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="0.00"
                              className="w-full bg-transparent border-b-4 border-slate-100 pb-6 pl-12 text-6xl font-black text-slate-900 outline-none focus:border-blue-600 transition-colors tracking-tighter"
                              required
                            />
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-1">
                               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Fee (10%)</div>
                               <div className="text-xl font-black text-slate-600 italic">- ₹{((Number(amount) || 0) * 0.1).toFixed(2)}</div>
                            </div>
                            <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 space-y-1">
                               <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Net Credited</div>
                               <div className="text-xl font-black text-blue-700 italic">₹{((Number(amount) || 0) * 0.9).toFixed(2)}</div>
                            </div>
                         </div>

                         <div className="flex flex-col gap-6 pt-4">
                             <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${payoutMethod ? 'bg-slate-100 text-slate-500' : 'bg-rose-50 text-rose-500'}`}>
                                      {payoutMethod?.accountType === 'vpa' ? <Smartphone size={20} /> : <Landmark size={20} />}
                                   </div>
                                   <div className="space-y-0.5">
                                      <div className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                                        {payoutMethod ? 'Registered Destination' : 'Destination Missing'}
                                      </div>
                                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {payoutMethod 
                                          ? (payoutMethod.accountType === 'bank_account' 
                                              ? `${payoutMethod.details.ifsc.slice(0, 4)} Bank •••• ${payoutMethod.details.accountNumber.slice(-4)}`
                                              : `UPI: ${payoutMethod.details.vpa}`)
                                          : 'Withdrawal not possible'}
                                      </div>
                                   </div>
                                </div>
                                <button type="button" onClick={() => setShowSetup(true)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                   {payoutMethod ? <ChevronRight size={20} /> : <Plus size={20} />}
                                </button>
                             </div>

                            <Button 
                              type="submit" 
                              disabled={submitting || !amount || Number(amount) > balanceInRupees || !payoutMethod}
                              className="h-20 rounded-[2.5rem] bg-blue-600 text-white font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:grayscale"
                            >
                               {submitting ? (
                                 <Loader2 className="animate-spin" />
                               ) : (
                                 <>Initialize Extraction <ArrowRight size={20} /></>
                               )}
                            </Button>
                         </div>
                      </form>
                   </Card>
                </div>
              )}

              {/* History Table */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between px-4">
                    <h2 className="text-xl font-black italic tracking-tight uppercase">Audit Logs</h2>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{payoutRequests.length} Transactions Found</span>
                 </div>
                 
                 <div className="space-y-3">
                    {payoutRequests.length === 0 ? (
                      <div className="p-16 text-center border-2 border-dashed border-slate-200 rounded-[3rem] space-y-4">
                         <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                            <Clock size={32} />
                         </div>
                         <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No prior extractions detected.</p>
                      </div>
                    ) : (
                      payoutRequests.map((req, i) => (
                        <motion.div 
                          key={req._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Card className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-shadow rounded-3xl flex items-center justify-between">
                             <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                  req.status === 'processed' ? 'bg-emerald-50 text-emerald-600' : 
                                  req.status === 'rejected' ? 'bg-rose-50 text-rose-600' : 
                                  'bg-amber-50 text-amber-600'
                                }`}>
                                   {req.status === 'processed' ? <CheckCircle size={22} /> : 
                                    req.status === 'rejected' ? <AlertCircle size={22} /> : 
                                    <Clock size={22} />}
                                </div>
                                <div className="space-y-0.5">
                                   <div className="text-sm font-black text-slate-900 uppercase italic tracking-tight">Fund Extraction</div>
                                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(req.createdAt).toLocaleDateString()} • ID: #{req._id.slice(-6).toUpperCase()}</div>
                                </div>
                             </div>
                             <div className="text-right space-y-1">
                                <div className="text-lg font-black text-slate-900 tracking-tighter italic">- ₹{(req.amount / 100).toLocaleString()}</div>
                                <div className={`text-[9px] font-black uppercase tracking-[0.25em] ${
                                   req.status === 'processed' ? 'text-emerald-500' : 
                                   req.status === 'rejected' ? 'text-rose-500' : 
                                   'text-amber-500'
                                }`}>{req.status}</div>
                             </div>
                          </Card>
                        </motion.div>
                      ))
                    )}
                 </div>
              </div>
           </div>

           {/* RIGHT COLUMN: INFO */}
           <div className="lg:col-span-5 space-y-8">
              <Card className="p-10 bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-[3rem] space-y-10 sticky top-24">
                 <div className="space-y-2">
                    <h3 className="text-xl font-black italic tracking-tight uppercase">Protocol Details</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                       Review the technical constraints of the GigIndia extraction system before proceeding.
                    </p>
                 </div>

                 <div className="space-y-8">
                    {[
                      { icon: Clock, title: 'Velocity', desc: 'Processed via IMPS/NEFT within 24-48 standard cycles.' },
                      { icon: ShieldCheck, title: 'Compliance', desc: 'All extractions are subject to e-KYC and tax verification.' },
                      { icon: AlertCircle, title: 'Threshold', desc: 'Minimum 500.00 base units required for initiation.' },
                      { icon: Landmark, title: 'Network', desc: 'Direct mapping to supported Indian banking gateways.' }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-5">
                         <div className="shrink-0 w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-slate-900">
                            <item.icon size={18} />
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900">{item.title}</h4>
                            <p className="text-xs font-medium text-slate-500 leading-relaxed">{item.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="pt-6 border-t border-slate-200">
                    <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4">
                       <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">
                          Extraction fees contribute to the stability and insurance coverage of the Lead Lock protocol.
                       </p>
                       <div className="flex items-center justify-between">
                          <span className="text-xs font-black italic tracking-widest text-blue-400 uppercase">Status: Nominal</span>
                          <div className="px-3 py-1 bg-white/10 rounded-full text-[8px] font-black uppercase">v4.5.1 STABLE</div>
                       </div>
                    </div>
                 </div>
              </Card>
           </div>

        </div>
      </main>
    </div>
  );
}
