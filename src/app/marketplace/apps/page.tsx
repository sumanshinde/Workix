'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Search, Filter, ShieldCheck, 
  Download, ExternalLink, Box, Tag, Zap,
  ArrowRight, Globe, Layers, Laptop, Smartphone
} from 'lucide-react';
import { Button, Card, Skeleton } from '@/components/ui';

export default function AppMarketplace() {
  const [apps, setApps] = useState<any[]>(MOCK_APPS);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');

  return (
    <div className="min-h-screen bg-[#050505] text-white font-manrope selection:bg-blue-600/30">
        
        {/* HERO HEADER */}
        <section className="relative h-[50vh] flex flex-col items-center justify-center overflow-hidden border-b border-white/5">
           <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-[#050505]" />
           <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
           
           {/* Floating elements */}
           <motion.div 
             animate={{ y: [0, -20, 0] }}
             transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
             className="z-10 bg-white/5 backdrop-blur-2xl border border-white/10 px-6 py-3 rounded-full mb-8"
           >
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">
                 <Rocket size={14} /> Ready-Made Systems
              </div>
           </motion.div>

           <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-center leading-none z-10">
              The App <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">Forge</span>
           </h1>
           <p className="max-w-xl text-center text-white/40 font-medium px-8 mt-6 italic z-10">
              Deploy battle-tested solutions in minutes. Scalable source code, premium architecture, and instant ownership.
           </p>
        </section>

        {/* CONTROLS */}
        <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5">
            <div className="flex gap-4 p-1 bg-white/5 rounded-2xl">
               {['All', 'Mobile', 'Web', 'Logic', 'Enterprise'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-white/40 hover:text-white'}`}
                  >
                    {f}
                  </button>
               ))}
            </div>

            <div className="flex items-center gap-4">
               <div className="relative">
                  <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input 
                    type="text" 
                    placeholder="Search Forge..." 
                    className="h-14 pl-14 pr-6 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-blue-500 transition-all w-72"
                  />
               </div>
               <Button className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 p-0 text-white/60">
                  <Filter size={18} />
               </Button>
            </div>
        </div>

        {/* GRID */}
        <main className="max-w-7xl mx-auto px-8 py-20">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence>
                 {apps.map((app, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                       <Card className="group bg-neutral-900/50 border-white/5 hover:border-blue-500/30 p-0 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:translate-y-[-10px] relative">
                          {/* Top Image */}
                          <div className="h-56 bg-neutral-800 relative overflow-hidden">
                             <img 
                               src={app.image} 
                               alt={app.title} 
                               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />
                             <div className="absolute top-5 right-5 px-4 py-2 bg-black/60 backdrop-blur-xl rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-white/10">
                                {app.category}
                             </div>
                          </div>

                          {/* Content */}
                          <div className="p-10 space-y-6">
                             <div className="space-y-2">
                                <h3 className="text-xl font-bold uppercase italic tracking-tighter">{app.title}</h3>
                                <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">{app.description}</p>
                             </div>

                             <div className="flex flex-wrap gap-2">
                                {app.features.slice(0, 3).map((f: any) => (
                                   <span key={f} className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black text-white/30 uppercase tracking-widest">{f}</span>
                                ))}
                             </div>

                             <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="space-y-1">
                                   <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Global Asset Cost</div>
                                   <div className="text-2xl font-black italic tracking-tighter text-blue-400">₹{app.price.toLocaleString()}</div>
                                </div>
                                <Button className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-white hover:text-black text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-500/10">
                                   Acquire Solution
                                </Button>
                             </div>
                          </div>
                       </Card>
                    </motion.div>
                 ))}
              </AnimatePresence>
           </div>
        </main>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-8 pb-32">
           <Card className="p-20 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-white/5 rounded-[4rem] flex flex-col items-center text-center space-y-8 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full" />
              
              <div className="w-20 h-20 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl flex items-center justify-center text-blue-400">
                 <Globe size={32} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">Become a Solution Forge Partner</h2>
              <p className="max-w-xl text-white/50 font-medium">Sell your high-end app architectures to global clients and earn 100% revenue. Join the BharatGig elite developer circle.</p>
              <Button className="h-16 px-12 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-blue-600 hover:text-white transition-all">Apply to Forge <ArrowRight className="ml-2" /> </Button>
           </Card>
        </section>

    </div>
  );
}

const MOCK_APPS = [
  {
    title: 'Nexus LMS 1.0',
    description: 'A sovereign learning management system with enterprise-grade video streaming, multi-tier subscriptions, and AI student analytics.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    price: 45000,
    category: 'Web',
    features: ['Video Archiving', 'Quiz Engines', 'Automated Grading']
  },
  {
    title: 'ChainFlow ERP',
    description: 'Advanced supply chain tracking using secure blockchain hash records for inventory transparency across multiple logistical sites.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    price: 85000,
    category: 'Enterprise',
    features: ['Immutable Ledger', 'Live Geo-Tracking', 'Asset Auditing']
  },
  {
    title: 'Pulse Mobile Wallet',
    description: 'Complete mobile fintech solution with dark mode aesthetics, QR payments integration, and high-frequency trading simulation UI.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    price: 25000,
    category: 'Mobile',
    features: ['Biometric Auth', 'Live Ticker', 'Cloud Sync']
  },
  {
    title: 'Aura Fitness Core',
    description: 'A revolutionary health platform featuring 3D workout previews, real-time heart rate mapping, and dietitian consulting portal.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    price: 32000,
    category: 'Web',
    features: ['Diet Planners', '3D Workouts', 'Consultation API']
  },
  {
    title: 'Nova Chat Suite',
    description: 'Ultra-fast communication hub for dev teams featuring markdown support, real-time code snippets, and end-to-end encrypted rooms.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    price: 18000,
    category: 'Logic',
    features: ['Dev-Centric UI', 'E2E Encryption', 'Custom Bots']
  },
  {
    title: 'Vortex Real Estate',
    description: 'High-conversion property portal with VR walkthrough support, advanced map filters, and direct mortgage calculator integration.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    price: 55000,
    category: 'Web',
    features: ['VR Support', 'EMI Engines', 'Broker Console']
  }
];
