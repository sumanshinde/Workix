'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, ChevronDown, Grid, List, 
  ShoppingBag, Zap, X, Sliders, MapPin, 
  Briefcase, MessageSquare, User, Menu,
  Bookmark, ChevronRight, Sparkles, FilterX,
  ClipboardList
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BRANDING } from '@/lib/config';
import { MarketplaceJobCard } from '@/components/marketplace/MarketplaceJobCard';
import { jobsAPI, requirementsAPI } from '@/services/api';
import { FeaturedAdBanner, AdsSidebar } from '@/components/AdsSection';
import { RequirementCard } from '@/components/marketplace/RequirementCard';

const CATEGORIES = [
  'All Categories', 'Software Development', 'Web Development', 'Mobile Apps', 
  'Cloud Computing', 'AI & Machine Learning', 'UI/UX Design', 'Digital Marketing', 
  'Content Strategy', 'Video Engineering', 'Data Analytics', 'Blockchain Architecture'
];

const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Expert', 'Elite'];
const JOB_TYPES = ['Fixed Price', 'Hourly Rate', 'Monthly Retainer'];
const LOCATIONS = ['Remote', 'India', 'USA', 'UK', 'Singapore', 'European Union'];

export default function MarketplacePage() {
  const [items, setItems] = useState<any[]>([]);
  const [view, setView] = useState<'jobs' | 'requirements'>('jobs');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [budgetRange, setBudgetRange] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('Remote');
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);

  const handleReset = () => {
    setActiveCategory('All Categories');
    setBudgetRange(0);
    setSelectedLocation('Remote');
    setSelectedExperience([]);
    setSearchTerm('');
    fetchData();
  };

  const toggleExperience = (level: string) => {
    setSelectedExperience(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const router = useRouter();

  const fetchData = async (search = searchTerm, category = activeCategory) => {
    setLoading(true);
    try {
      if (view === 'jobs') {
        const data = await jobsAPI.getAll({ search, category: category === 'All Categories' ? '' : category });
        setItems(data?.length > 0 ? data : MOCK_JOBS);
      } else {
        const data = await requirementsAPI.getAll({ search, category: category === 'All Categories' ? '' : category });
        setItems(data || []);
      }
    } catch (e) {
      console.error('Fetch Failed:', e);
      setItems(view === 'jobs' ? MOCK_JOBS : []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [view]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 selection:bg-blue-100 selection:text-blue-700 font-sans pb-24">
      
      {/* 1. TOP NAVIGATION BAR */}
      <nav className="sticky top-0 z-[100] bg-white/70 backdrop-blur-xl border-b border-slate-100 h-20 flex items-center justify-between px-6 shadow-sm">
         <div className="flex items-center gap-10">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
               <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-[15px] shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  {BRANDING.shortName}
               </div>
               <span className="font-extrabold text-xl text-slate-900 tracking-tight">{BRANDING.name}</span>
            </div>

            <div className="hidden lg:flex items-center gap-8">
               <button 
                onClick={() => setView('jobs')} 
                className={`text-[12px] font-extrabold uppercase tracking-widest transition-all px-4 py-2 rounded-lg flex items-center gap-2 ${view === 'jobs' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-slate-400 hover:bg-slate-50'}`}
               >
                  <Briefcase size={14} /> Missions
               </button>
               <button 
                onClick={() => setView('requirements')} 
                className={`text-[12px] font-extrabold uppercase tracking-widest transition-all px-4 py-2 rounded-lg flex items-center gap-2 ${view === 'requirements' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-slate-400 hover:bg-slate-50'}`}
               >
                  <ClipboardList size={14} /> Requirements
               </button>
            </div>
         </div>

         <div className="hidden xl:flex flex-1 max-w-xl mx-12">
            <div className="relative w-full group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
               <input 
                  type="text" 
                  placeholder="Search for missions, operators, requirements..." 
                  className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-[15px] font-medium focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchData(searchTerm)}
               />
            </div>
         </div>

         <div className="flex items-center gap-4">
            <button className="hidden sm:flex w-12 h-12 items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all border border-slate-200 hover:border-blue-200">
               <MessageSquare size={20} />
            </button>
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden cursor-pointer shadow-sm hover:scale-105 transition-transform" onClick={() => router.push('/dashboard')}>
               <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" alt="avatar" className="w-full h-full object-cover" />
            </div>
         </div>
      </nav>

      {/* 2. PAGE HEADER */}
      <section className="bg-white py-16 border-b border-slate-100 relative overflow-hidden">
         <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[100px] -z-10 mix-blend-multiply" />
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
               <div className="space-y-4 max-w-2xl">
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                    Explore high-value <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{view === 'jobs' ? 'engagements' : 'local needs'}</span>
                  </h1>
                  <p className="text-[16px] font-medium text-slate-500 leading-relaxed">
                     Navigate elite opportunities globally. Execute critical missions and scale your revenue.
                  </p>
               </div>

               <div className="flex items-center gap-4">
                  <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-200 flex items-center">
                     <button className="h-10 px-4 bg-white text-blue-600 rounded-lg shadow-sm flex items-center gap-2.5 text-[13px] font-extrabold uppercase tracking-widest border border-slate-200">
                        <List size={16} /> List
                     </button>
                     <button className="h-10 px-4 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-2.5 text-[13px] font-extrabold uppercase tracking-widest">
                        <Grid size={16} /> Grid
                     </button>
                  </div>
                  <div className="relative">
                     <select className="appearance-none bg-white border border-slate-200 rounded-xl pl-5 pr-12 py-3.5 text-[14px] font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer shadow-sm">
                        <option>Sort by: Newest</option>
                        <option>Sort by: Budget</option>
                     </select>
                     <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 3. MAIN LAYOUT */}
      <main className="max-w-[1536px] mx-auto px-8 py-12">
         <div className="flex flex-col lg:flex-row xl:gap-14 gap-8">
            
            {/* LEFT SIDEBAR */}
            <aside className="hidden lg:block w-[260px] shrink-0">
               <div className="sticky top-28 space-y-10">
                  <div className="space-y-4">
                     <div className="flex items-center justify-between px-1">
                        <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Vector Area</h4>
                        <button onClick={() => setActiveCategory('All Categories')} className="text-[11px] font-extrabold text-blue-600 hover:text-blue-800 uppercase tracking-widest transition-colors">Clear</button>
                     </div>
                     <div className="space-y-1">
                        {CATEGORIES.slice(0, 6).map((cat) => (
                          <div 
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`flex items-center justify-between py-2.5 px-4 rounded-xl cursor-pointer transition-all ${
                              activeCategory === cat
                                ? 'bg-blue-50/80 text-blue-700 font-extrabold border border-blue-200/50 shadow-sm'
                                : 'text-slate-600 font-bold border border-transparent hover:bg-slate-50 hover:border-slate-200'
                            }`}
                          >
                             <span className="text-[13px]">{cat}</span>
                             {activeCategory === cat && <ChevronRight size={14} className="text-blue-600" />}
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-1">Financial Auth</h4>
                     <input 
                        type="range" 
                        min="0" max="100000" step="1000"
                        className="w-full h-1.5 rounded-full bg-slate-200 appearance-none cursor-pointer accent-blue-600"
                        value={budgetRange}
                        onChange={(e) => setBudgetRange(Number(e.target.value))}
                     />
                     <div className="flex justify-between items-center bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Floor</span>
                        <span className="text-[14px] font-black text-slate-900">₹{budgetRange.toLocaleString()}</span>
                     </div>
                  </div>

                   <div className="space-y-4">
                      <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-1">Geolocation</h4>
                      <div className="relative">
                         <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                         <select 
                           className="w-full h-12 pl-11 pr-10 rounded-xl border border-slate-200 bg-white shadow-sm text-[14px] font-bold text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all appearance-none cursor-pointer"
                           value={selectedLocation}
                           onChange={e => setSelectedLocation(e.target.value)}
                         >
                            {LOCATIONS.map(loc => (
                              <option key={loc} value={loc} className="font-bold">{loc}</option>
                            ))}
                         </select>
                         <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                   </div>

                   <AdsSidebar />
               </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 min-w-0 space-y-6">
               <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <p className="text-[14px] font-bold text-slate-500 uppercase tracking-widest">
                     Target Lock: <span className="font-black text-slate-900">{items.length} {view === 'jobs' ? 'Operations' : 'Requirements'}</span>
                  </p>
                  <button onClick={() => setShowMobileFilters(true)} className="lg:hidden h-10 px-4 rounded-xl border border-slate-200 bg-white font-bold text-[13px] uppercase tracking-widest text-slate-600 flex items-center gap-2 shadow-sm">
                    <Filter size={16} /> Filters
                  </button>
               </div>

               <FeaturedAdBanner />

               <section className="space-y-6">
                  {loading ? (
                    <div className="space-y-6">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="h-44 bg-white border border-slate-100 shadow-sm rounded-2xl animate-pulse" />
                       ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                       {items.length > 0 ? (
                          items.map((item, index) => (
                             view === 'jobs' 
                              ? <MarketplaceJobCard key={item._id} job={item} index={index} />
                              : <RequirementCard key={item._id} post={item} index={index} />
                          ))
                       ) : (
                        <div className="py-24 flex flex-col items-center justify-center text-center space-y-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                           <div className="w-20 h-20 bg-blue-50/80 border border-blue-100 text-blue-500 rounded-2xl flex items-center justify-center shadow-sm shadow-blue-500/10">
                              <Search size={32} />
                           </div>
                           <div className="space-y-1">
                              <h3 className="text-xl font-black text-slate-900 tracking-tight">No data found</h3>
                              <p className="text-[14px] font-medium text-slate-500">Refine your vectors or clear parameters.</p>
                           </div>
                        </div>
                      )}
                    </div>
                  )}
               </section>
            </div>

             {/* RIGHT SIDEBAR */}
             <aside className="hidden xl:block w-[320px] shrink-0">
                <div className="sticky top-28 h-fit">
                   <AdsSidebar />
                </div>
             </aside>
          </div>
       </main>

      {/* MOBILE FILTERS DRAWER (Simplified for this rewrite) */}
      <AnimatePresence>
         {showMobileFilters && (
            <>
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setShowMobileFilters(false)}
                  className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200]" 
               />
               <motion.div 
                  initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                  className="fixed top-0 right-0 w-[85%] h-full bg-white z-[201] shadow-2xl p-8 overflow-y-auto"
               >
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-xl font-black">Filters</h3>
                     <button onClick={() => setShowMobileFilters(false)}><X /></button>
                  </div>
                  {/* ... filters ... */}
               </motion.div>
            </>
         )}
      </AnimatePresence>

    </div>
  );
}

const MOCK_JOBS: any[] = [
  { 
    _id: '1', 
    title: 'Senior Next.js 14 Developer for Enterprise SaaS Infrastructure', 
    category: 'Software Development', 
    budget: 180000, 
    postedTime: '2h ago',
    description: 'We require an elite engineer to architect and implement the next phase of our distributed cloud resource manager. Deep mastery of React Server Components, high-concurrency Node.js patterns, and PostgreSQL optimization is mandatory.',
    tags: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
    clientId: { name: 'NexusScale Systems', avatar: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=100&q=80' },
    location: 'Remote / Global'
  },
  { 
    _id: '2', 
    title: 'Visual Identity Nexus Specialist for AI Core Branding', 
    category: 'UI/UX Design', 
    budget: 75000, 
    postedTime: '4h ago',
    description: 'Develop a comprehensive visual language and identity system for a seed-stage AI intelligence startup. Deliverables include a dynamic logo system, precision typography guidelines, and advanced motion assets.',
    tags: ['Brand Identity', 'Figma', 'After Effects', 'Design Systems'],
    clientId: { name: 'Alpha Intelligence', avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&q=80' },
    location: 'San Francisco / Remote'
  }
];
