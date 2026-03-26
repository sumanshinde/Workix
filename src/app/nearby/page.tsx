'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Search, 
  Filter, 
  Users, 
  Zap, 
  Star, 
  Navigation, 
  Radar as RadarIcon, 
  Crosshair,
  ArrowUpRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { adsAPI } from '@/services/api';

const CATEGORIES = ['All Operators', 'Software Dev', 'UI/UX Design', 'AI / ML', 'Marketing', 'Cybersecurity'];

export default function NearbyRadarPage() {
  const [radius, setRadius] = useState(25);
  const [activeCategory, setActiveCategory] = useState('All Operators');
  const [isScanning, setIsScanning] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [citySearch, setCitySearch] = useState('');
  const [pincodeSearch, setPincodeSearch] = useState('');

  useEffect(() => {
    // Initial scan animation
    const timer = setTimeout(() => setIsScanning(false), 3000);
    setResults(MOCK_NEARBY);
    return () => clearTimeout(timer);
  }, []);

  const handleScan = async () => {
    setIsScanning(true);
    
    try {
      let lat, lng;
      
      // Request location if city/pincode are empty
      if (!citySearch.trim() && !pincodeSearch.trim()) {
        const getLoc = (): Promise<GeolocationPosition> => new Promise((resolve, reject) => {
          if (!navigator.geolocation) return reject('No geolocation');
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
        });
        
        try {
          const position = await getLoc();
          lat = position.coords.latitude;
          lng = position.coords.longitude;
        } catch (e) {
          console.warn("Could not get user location. Falling back to mock.");
        }
      }

      if (citySearch.trim() || pincodeSearch.trim() || (lat && lng)) {
        const apiResults = await adsAPI.getNearby({
          city: citySearch.trim() || undefined,
          pincode: pincodeSearch.trim() || undefined,
          lat,
          lng
        });

        if (Array.isArray(apiResults) && apiResults.length > 0) {
          const mapped = apiResults.map((u: any, i: number) => ({
            _id: u._id || String(i),
            name: u.name,
            category: u.skills?.[0] || 'Operator',
            distance: Math.round(Math.random() * radius),
            rating: u.rating || 4.5,
            skills: u.skills?.slice(0, 3) || ['Verified'],
            avatar: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=1e40af&color=fff`,
            isOnline: true,
            lastActive: 'Now',
            city: u.city || '',
            pos: { x: `${15 + Math.random() * 70}%`, y: `${15 + Math.random() * 70}%` },
          }));
          setResults(mapped);
          setIsScanning(false);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    
    // Fallback to MOCK data if API fails or returns empty
    setTimeout(() => {
      setResults(MOCK_NEARBY);
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#060e20] text-[#dee5ff] font-['Manrope'] selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* 1. INTEL HEADER */}
      <header className="sticky top-0 z-[100] bg-[#060e20]/80 backdrop-blur-2xl border-b border-[#192540]">
        <div className="max-w-[1440px] mx-auto px-10 h-24 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50">
                 <RadarIcon size={24} className="text-white animate-pulse" />
              </div>
              <div className="space-y-0.5">
                 <h1 className="text-2xl font-black uppercase italic tracking-tighter">Nearby Radar <span className="text-blue-500 text-sm align-top ml-2">v4.0</span></h1>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={10} className="text-emerald-500" /> Active Geospatial Sweep Operational
                 </p>
              </div>
           </div>

           <div className="flex items-center gap-8 bg-[#0f1930] px-8 py-3 rounded-2xl border border-[#192540] shadow-sm flex-wrap">
              {/* Location Search */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  placeholder="City..."
                  className="w-28 px-3 py-1.5 bg-[#192540] border border-[#2a3a5c] rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  value={pincodeSearch}
                  onChange={(e) => setPincodeSearch(e.target.value)}
                  placeholder="Pincode..."
                  maxLength={6}
                  className="w-24 px-3 py-1.5 bg-[#192540] border border-[#2a3a5c] rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="h-10 w-[1px] bg-[#192540]" />

              <div className="flex flex-col gap-1 w-48">
                 <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <span>Radius</span>
                    <span className="text-blue-400">{radius}km</span>
                 </div>
                 <input 
                   type="range" 
                   min="5" max="50" step="5"
                   value={radius}
                   onChange={(e) => setRadius(Number(e.target.value))}
                   className="w-full accent-blue-500 h-1 bg-slate-800 rounded-full appearance-none cursor-pointer"
                 />
              </div>
              
              <div className="h-10 w-[1px] bg-[#192540]" />

              <div className="flex gap-2">
                 {CATEGORIES.slice(0, 4).map(cat => (
                   <button 
                     key={cat}
                     onClick={() => setActiveCategory(cat)}
                     className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-[#192540] text-slate-400 hover:text-white'}`}
                   >
                     {cat}
                   </button>
                 ))}
              </div>
           </div>

           <button 
             onClick={handleScan}
             disabled={isScanning}
             className={`h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-3 ${isScanning ? 'bg-slate-800 text-slate-500' : 'bg-white text-blue-900 shadow-2xl hover:scale-105 active:scale-95'}`}
           >
              {isScanning ? <Activity className="animate-spin" size={18} /> : <Crosshair size={18} />}
              {isScanning ? 'Syncing...' : 'Initiate Sweep'}
           </button>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-10 py-12 grid grid-cols-12 gap-12">
        
        {/* 2. THE RADAR GRID (CENTRAL VISUAL) */}
        <div className="col-span-12 lg:col-span-7 relative h-[700px] bg-[#091328] rounded-[3rem] border border-[#192540] overflow-hidden group">
           {/* Radar Waves */}
           <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              {[1, 2, 3, 4, 5].map(i => (
                <div 
                  key={i} 
                  className="absolute border border-blue-500/50 rounded-full" 
                  style={{ width: `${i * 200}px`, height: `${i * 200}px` }} 
                />
              ))}
              <div className="absolute w-full h-[1px] bg-blue-500/10 rotate-45" />
              <div className="absolute w-full h-[1px] bg-blue-500/10 -rotate-45" />
              <div className="absolute w-[1px] h-full bg-blue-500/10" />
              <div className="absolute w-full h-[1px] bg-blue-500/10" />
           </div>

           {/* Sweep Animation */}
           <AnimatePresence>
              {isScanning && (
                <motion.div 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 z-10 origin-center pointer-events-none"
                >
                   <div className="absolute top-1/2 left-1/2 w-1/2 h-40 bg-gradient-to-r from-blue-500/40 to-transparent -translate-y-full origin-left skew-y-[20deg] blur-3xl opacity-60" />
                </motion.div>
              )}
           </AnimatePresence>

           {/* Interactive Map dots */}
           <div className="absolute inset-0">
              {results.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="absolute cursor-pointer group"
                  style={{ top: item.pos.y, left: item.pos.x }}
                >
                   <div className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center relative hover:scale-125 transition-transform">
                      <div className={`w-3 h-3 rounded-full ${item.isOnline ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-slate-500 shadow-none'}`} />
                      
                      {/* Hover Info Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-48 z-50">
                         <div className="bg-[#0f1930] p-4 rounded-2xl border border-blue-500/30 shadow-2xl">
                            <h5 className="font-black text-[12px] text-white uppercase italic">{item.name}</h5>
                            <p className="text-[10px] text-blue-400 font-bold">{item.category}</p>
                            <div className="mt-2 flex items-center justify-between text-[8px] font-black text-slate-400 uppercase">
                               <span>{item.distance}km away</span>
                               <span className="flex items-center gap-1"><Star size={8} className="text-yellow-500" /> {item.rating}</span>
                            </div>
                         </div>
                         <div className="w-4 h-4 bg-[#0f1930] rotate-45 border-r border-b border-blue-500/30 absolute left-1/2 -translate-x-1/2 -bottom-2" />
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>

           {/* Central Pivot */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-8 h-8 bg-[#060e20] rounded-full border-4 border-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.6)]">
                 <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
              </div>
           </div>

           <div className="absolute bottom-10 left-10 z-20">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-[#060e20]/60 px-4 py-2 rounded-xl backdrop-blur-md border border-[#192540]">
                 Coordinates: <span className="text-blue-400 font-mono">18.5204° N, 73.8567° E</span>
              </p>
           </div>
        </div>

        {/* 3. LIST SIDEBAR — Detailed Intel */}
        <div className="col-span-12 lg:col-span-5 space-y-8 h-[700px] overflow-y-auto pr-4 scrollbar-hide">
           <div className="space-y-2">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Nearby Operators <span className="text-slate-500 ml-2">({results.length})</span></h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Verified talent within your tactical range.</p>
           </div>

           <div className="space-y-4">
              {results.map((item, i) => (
                <motion.div 
                  key={item._id}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-[#0f1930] rounded-[2rem] border border-[#192540] hover:border-blue-500/40 transition-all group relative overflow-hidden"
                >
                   <div className="absolute top-0 right-0 p-8 bg-blue-500/5 rotate-[15deg] translate-x-10 translate-y-[-10px] scale-150 transition-transform group-hover:scale-110">
                      <Navigation size={40} className="text-blue-500 opacity-20" />
                   </div>

                   <div className="flex items-center gap-6 relative z-10">
                      <div className="relative">
                         <div className="w-20 h-20 rounded-2xl bg-slate-800 overflow-hidden border-2 border-[#192540] group-hover:border-blue-500 transition-colors shadow-2xl">
                            <img src={item.avatar} alt="op" className="w-full h-full object-cover" />
                         </div>
                         <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg border-4 border-[#0f1930] flex items-center justify-center ${item.isOnline ? 'bg-emerald-500' : 'bg-slate-500'}`}>
                            <Activity size={10} className="text-white" />
                         </div>
                      </div>

                      <div className="flex-1 space-y-2">
                         <div className="flex items-center justify-between">
                            <h4 className="text-lg font-black uppercase tracking-tighter text-white">{item.name}</h4>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/50 rounded-lg border border-slate-700">
                               <Star size={12} className="text-blue-400 fill-blue-400" />
                               <span className="text-[12px] font-black text-white">{item.rating}</span>
                            </div>
                         </div>
                         
                         <p className="text-[11px] font-bold text-blue-400 uppercase tracking-[0.2em]">{item.category}</p>
                         
                         <div className="flex flex-wrap gap-2 pt-1">
                            {item.skills.map((s: string) => (
                              <span key={s} className="px-2 py-1 bg-blue-500/5 text-blue-400 border border-blue-500/10 rounded-md text-[9px] font-black uppercase tracking-widest">{s}</span>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="mt-8 pt-6 border-t border-[#192540] flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Distance</span>
                            <span className="text-sm font-black text-white">{item.distance}km</span>
                         </div>
                         <div className="w-[1px] h-8 bg-slate-800" />
                         <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Last Active</span>
                            <span className="text-sm font-black text-white">{item.lastActive}</span>
                         </div>
                      </div>

                      <button className="h-12 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-blue-900/40 flex items-center gap-2 group-hover:scale-105 transition-all">
                         Engage Target <ArrowUpRight size={14} />
                      </button>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>

      </main>
      
      {/* 4. FOOTER STATUS BAR */}
      <footer className="fixed bottom-0 w-full bg-[#060e20]/80 backdrop-blur-xl border-t border-[#192540] py-4 px-10">
         <div className="max-w-[1440px] mx-auto flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
            <div className="flex items-center gap-6">
               <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Nodes Verified</span>
               <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Neural Sync Active</span>
            </div>
            <div className="flex items-center gap-4 text-blue-500">
               <ShieldCheck size={14} /> Encrypted Session
            </div>
         </div>
      </footer>
    </div>
  );
}

const MOCK_NEARBY = [
  {
    _id: '1',
    name: 'Ghost Operator X',
    category: 'Cybersecurity',
    distance: 3.2,
    rating: 5.0,
    skills: ['Pentesting', 'Solidity', 'Rust'],
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&q=80',
    isOnline: true,
    lastActive: 'Now',
    pos: { x: '20%', y: '15%' }
  },
  {
    _id: '2',
    name: 'Aura Intelligence',
    category: 'AI / ML Specialist',
    distance: 12.8,
    rating: 4.9,
    skills: ['PyTorch', 'Next.js', 'LLM Tuning'],
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
    isOnline: true,
    lastActive: '5m ago',
    pos: { x: '65%', y: '40%' }
  },
  {
    _id: '3',
    name: 'Visual Architect',
    category: 'UI/UX Design',
    distance: 24.5,
    rating: 4.8,
    skills: ['Figma', 'Prototyping', 'Design Systems'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    isOnline: false,
    lastActive: '2h ago',
    pos: { x: '40%', y: '75%' }
  },
  {
    _id: '4',
    name: 'Nexus Alpha',
    category: 'Full Stack Dev',
    distance: 8.1,
    rating: 5.0,
    skills: ['Typescript', 'Go', 'Kubernetes'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    isOnline: true,
    lastActive: 'Now',
    pos: { x: '80%', y: '60%' }
  }
];
