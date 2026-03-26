'use client';

import React, { useState } from 'react';
import { 
  HelpCircle, Search, MessageCircle, 
  FileText, Shield, CreditCard, 
  User, Briefcase, ChevronRight, 
  Mail, Phone, ExternalLink, ArrowLeft,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Input } from '@/components/ui';

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSupportForm, setShowSupportForm] = useState(false);

  const categories = [
    { id: 'freelancer', title: 'For Freelancers', icon: <User size={20} />, count: 18, color: 'bg-blue-50 text-blue-600' },
    { id: 'client',     title: 'For Clients',     icon: <Briefcase size={20} />, count: 12, color: 'bg-purple-50 text-purple-600' },
    { id: 'payments',   title: 'Payments & Fees', icon: <CreditCard size={20} />, count: 8,  color: 'bg-emerald-50 text-emerald-600' },
    { id: 'trust',      title: 'Trust & Safety', icon: <Shield size={20} />, count: 6,  color: 'bg-rose-50 text-rose-600' },
  ];

  const faqs = [
    { q: 'How does Lead Lock work?', a: 'Lead Lock is our proprietary escrow system where payments are held securely until project completion.' },
    { q: 'How do I get verified?', a: 'Visit our /verify page to upload your identity documents. Verification takes 24-48 hours.' },
    { q: 'What is the platform fee?', a: 'GigIndia charges a flat 5% service fee on successful project completions.' },
    { q: 'Can I withdraw anytime?', a: 'Funds are available for withdrawal 10 days after project approval.' },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] selection:bg-blue-100 selection:text-blue-600">
      
      {/* ── Hero Search Cluster ── */}
      <section className="bg-white border-b border-gray-100 pt-32 pb-20 md:pt-48 md:pb-32 relative overflow-hidden">
         
         
         <div className="max-w-4xl mx-auto relative z-10 text-center space-y-8">
            <h1 className="text-4xl md:text-5xl font-semibold text-[#111827] tracking-tight">How can we help?</h1>
            <p className="text-gray-500 font-medium text-sm max-w-2xl mx-auto">Explore our knowledge base or reach out to our trust support commanders.</p>
            
            <div className="relative max-w-2xl mx-auto">
               <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={22} />
               </div>
               <input 
                 className="w-full h-18 pl-16 pr-8 bg-white border border-gray-100 rounded-[32px] shadow-sm shadow-gray-200/50 text-sm font-medium text-gray-900 focus:border-blue-600 outline-none transition-all"
                 placeholder="Search for articles, guides, or rules..."
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
               />
            </div>
         </div>
      </section>

      <div className="max-w-6xl mx-auto py-20 space-y-32">
         
         {/* ── Categories ── */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Card key={cat.id} className="p-8 border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all group flex flex-col justify-between h-56 rounded-[32px]">
                 <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center mb-6`}>
                    {cat.icon}
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{cat.title}</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{cat.count} Articles</p>
                 </div>
                 <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={24} className="text-blue-600" />
                 </div>
              </Card>
            ))}
         </div>

         {/* ── FAQ Cluster ── */}
         <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-4">
               <div className="section-label">General FAQ</div>
               <h2 className="text-3xl font-semibold text-[#111827]">Common rules</h2>
            </div>

            <div className="space-y-4">
               {faqs.map((faq, i) => (
                 <motion.div 
                   key={i} 
                   className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer overflow-hidden group"
                 >
                    <div className="flex justify-between items-center">
                       <h4 className="font-bold text-gray-900 pr-8">{faq.q}</h4>
                       <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-600 group-hover:rotate-90 transition-all" />
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>

         {/* ── Support Hub ── */}
         <section className="bg-gray-900 rounded-[48px] p-12 md:p-20 text-white flex flex-col items-center text-center space-y-12 relative overflow-hidden">
            
            
            
            <div className="max-w-2xl space-y-6 relative z-10">
               <div className="w-20 h-20 bg-white/10 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                  <MessageSquare size={32} className="text-blue-500" />
               </div>
               <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">Still can&apos;t find an answer?</h2>
               <p className="text-gray-400 text-sm font-medium">Our trust commanders are available 24/7 to resolve any system discrepancies.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl relative z-10">
               <button 
                 onClick={() => setShowSupportForm(true)}
                 className="h-18 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3"
               >
                 <Mail size={20} /> Open Support Ticket
               </button>
               <button className="h-18 bg-white/10 border border-white/20 text-white rounded-lg font-bold text-sm hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center gap-3">
                 <MessageCircle size={20} /> Live Chat System
               </button>
            </div>
         </section>

      </div>

      {/* ── Support Form Modal ── */}
      <AnimatePresence>
         {showSupportForm && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-gray-900/60"
                 onClick={() => setShowSupportForm(false)}
               />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95, y: 20 }}
                 className="bg-white w-full max-w-xl rounded-[40px] shadow-sm relative z-[120] overflow-hidden p-10 space-y-10"
               >
                  <div className="flex justify-between items-center">
                     <h3 className="text-2xl font-semibold text-[#111827]">Contact Support</h3>
                     <button onClick={() => setShowSupportForm(false)} className="text-gray-400 hover:text-gray-600"><HelpCircle /></button>
                  </div>
                  <form className="space-y-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Topic Cluster</label>
                        <select className="w-full rounded-lg border border-gray-100 bg-gray-50/50 text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all cursor-pointer">
                           <option>Payment Ingress Issues</option>
                           <option>Identity Verification</option>
                           <option>Contractual Dispute</option>
                           <option>Account Sync</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Message Payload</label>
                        <textarea 
                          className="w-full h-32 p-6 rounded-lg border border-gray-100 bg-gray-50/50 text-sm font-medium focus:bg-white focus:border-blue-600 outline-none transition-all resize-none"
                          placeholder="Describe the discrepancy in detail..."
                        />
                     </div>
                     <button 
                       type="button"
                       onClick={() => setShowSupportForm(false)}
                       className="w-full bg-blue-600 text-white rounded-lg font-bold text-sm shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition-all"
                     >
                        Initiate Support System
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
}
