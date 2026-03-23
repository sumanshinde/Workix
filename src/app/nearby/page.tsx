'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, User, Briefcase, Star, Search, Filter, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Skeleton } from '@/components/ui';

export default function NearbyDiscovery() {
  const [users, setUsers] = useState<any[]>(MOCK_NEARBY);
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(20);
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="min-h-screen bg-slate-50 font-manrope selection:bg-blue-100 selection:text-blue-600">
        
        {/* HEADER */}
        <div className="bg-white border-b border-slate-100 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row justify-between items-end gap-10">
           <div className="space-y-4">
              <div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] w-fit">
                 <MapPin size={12} className="inline mr-2" /> Global Presence
              </div>
              <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-slate-900 leading-[0.9]">
                 Local <br />
                 <span className="text-blue-600">Operations.</span>
              </h1>
           </div>
           
           <div className="space-y-6">
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                 {['All', 'Design', 'Tech', 'Video'].map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setActiveCategory(cat)}
                      className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {cat}
                    </button>
                 ))}
              </div>
              <div className="flex items-center gap-4">
                 <div className="relative flex-1">
                    <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Find operators in your sector..." 
                      className="h-14 pl-14 pr-6 bg-slate-100 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-blue-500 transition-all w-80 shadow-inner"
                    />
                 </div>
                 <Button className="h-14 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest px-10 rounded-2xl shadow-xl shadow-slate-900/10">
                    Search Near Me
                 </Button>
              </div>
           </div>
        </div>

        {/* MAP SIMULATION (GRID) */}
        <main className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
           
           <div className="lg:col-span-8 space-y-10">
              <div className="flex items-center justify-between px-4">
                 <p className="text-[10px] font-black underline uppercase text-slate-400 tracking-widest italic">{users.length} Active Operators within {radius}km</p>
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Detection Radius</span>
                    <input type="range" min="1" max="100" value={radius} onChange={e => setRadius(Number(e.target.value))} className="w-40 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                    <span className="text-[10px] font-black text-blue-600">{radius}km</span>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <AnimatePresence>
                    {users.map((u, i) => (
                       <motion.div 
                         key={i}
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         transition={{ delay: i * 0.05 }}
                       >
                          <Card className="p-8 bg-white border-0 shadow-sm hover:shadow-xl transition-all rounded-[3rem] group">
                             <div className="flex items-start justify-between">
                                <div className="flex items-center gap-6">
                                   <div className="w-16 h-16 rounded-[2rem] bg-slate-100 overflow-hidden border-2 border-slate-50 relative">
                                      <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                                      {u.isVerified && (
                                         <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-lg border-2 border-white shadow-xl">
                                            <Shield size={10} fill="currentColor" />
                                         </div>
                                      )}
                                   </div>
                                   <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                         <h3 className="font-black text-slate-900 uppercase italic tracking-tighter">{u.name}</h3>
                                         <Zap size={14} className="text-amber-500 fill-amber-500" />
                                      </div>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{u.skills.join(' / ')}</p>
                                   </div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                   <Navigation size={18} />
                                </div>
                             </div>

                             <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                   <div className="flex items-center text-rose-500 gap-1 font-black underline italic">
                                      <Star size={14} fill="currentColor" /> {u.rating}
                                   </div>
                                   <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{u.distance} away</div>
                                </div>
                                <Button className="h-10 px-6 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                                   Contract Solution
                                </Button>
                             </div>
                          </Card>
                       </motion.div>
                    ))}
                 </AnimatePresence>
              </div>
           </div>

           {/* SIDEBAR */}
           <div className="lg:col-span-4 space-y-10">
              <Card className="p-10 bg-slate-900 text-white border-0 shadow-2xl rounded-[3.5rem] space-y-8 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12"><Briefcase size={120} /></div>
                 <div className="space-y-2 relative">
                    <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Active Radar</div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter">Market Hotspots</h3>
                 </div>

                 <div className="space-y-6 relative">
                    {[
                      { city: 'Mumbai', count: 1240, color: 'bg-rose-500' },
                      { city: 'Bangalore', count: 980, color: 'bg-blue-500' },
                      { city: 'Delhi', count: 860, color: 'bg-amber-500' },
                      { city: 'Pune', count: 420, color: 'bg-emerald-500' }
                    ].map(h => (
                      <div key={h.city} className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${h.color} shadow-lg shadow-current/20`} />
                            <span className="text-sm font-black italic uppercase tracking-tight">{h.city}</span>
                         </div>
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{h.count} Operators</div>
                      </div>
                    ))}
                 </div>
                 
                 <Button className="w-full h-14 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                    Expand Radar Area
                 </Button>
              </Card>

              <Card className="p-10 bg-blue-600 text-white border-0 shadow-xl rounded-[3.5rem] space-y-6">
                 <div className="space-y-2">
                    <h3 className="text-xl font-black italic uppercase italic">Local Boost</h3>
                    <p className="text-[10px] font-medium text-white/50 leading-relaxed uppercase tracking-widest">Appear first to clients in your area.</p>
                 </div>
                 <div className="text-4xl font-black italic tracking-tighter italic">₹499 <span className="text-[10px] uppercase font-bold text-white/40 ml-1">/ Weekly</span></div>
                 <Button className="w-full h-14 bg-white text-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-white/10">
                    Activate Geo-Boost
                 </Button>
              </Card>
           </div>

        </main>

    </div>
  );
}

const MOCK_NEARBY = [
  { name: 'Sameer K.', avatar: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=100&q=80', distance: '1.2km', skills: ['React', 'Node', 'AWS'], rating: 4.9, isVerified: true },
  { name: 'Ananya S.', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80', distance: '3.4km', skills: ['Figma', 'UX Research'], rating: 4.8, isVerified: true },
  { name: 'Rohan M.', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80', distance: '5.1km', skills: ['ML', 'Python', 'Cloud'], rating: 5.0, isVerified: false },
  { name: 'Priya D.', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80', distance: '8.7km', skills: ['Motion Graphics', 'AE'], rating: 4.7, isVerified: true },
  { name: 'Vikram R.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', distance: '12km', skills: ['Fullstack', 'DevOps'], rating: 4.9, isVerified: true },
  { name: 'Sneha L.', avatar: 'https://images.unsplash.com/photo-1563237023-b1e970526dcb?w=100&q=80', distance: '15km', skills: ['Product Mgt', 'Growth'], rating: 4.6, isVerified: false }
];
