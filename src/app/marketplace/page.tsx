'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, ChevronDown, Grid, List, 
  ShoppingBag, Zap, X, Sliders, MapPin, 
  Briefcase, MessageSquare, User, Menu,
  Bookmark, ChevronRight, Sparkles, FilterX
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BRANDING } from '@/lib/config';
import { MarketplaceJobCard } from '@/components/marketplace/MarketplaceJobCard';
import { jobsAPI } from '@/services/api';

const CATEGORIES = [
  'All Categories', 'Software Development', 'Web Development', 'Mobile Apps', 
  'Cloud Computing', 'AI & Machine Learning', 'UI/UX Design', 'Digital Marketing', 
  'Content Strategy', 'Video Engineering', 'Data Analytics', 'Blockchain Architecture'
];

const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Expert', 'Elite'];
const JOB_TYPES = ['Fixed Price', 'Hourly Rate', 'Monthly Retainer'];
const LOCATIONS = ['Remote', 'India', 'USA', 'UK', 'Singapore', 'European Union'];

export default function MarketplacePage() {
  const [jobs, setJobs] = useState<any[]>([]);
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
    fetchJobs();
  };

  const toggleExperience = (level: string) => {
    setSelectedExperience(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const router = useRouter();
  const t = BRANDING.theme;

  const fetchJobs = async (search = '', category = '') => {
    setLoading(true);
    // Mimicking API latency
    setTimeout(async () => {
        try {
            const data = await jobsAPI.getAll({ search, category: category === 'All Categories' ? '' : category });
            if (!data || data.length === 0) {
              setJobs(MOCK_JOBS);
            } else {
              setJobs(data);
            }
          } catch (e) {
            console.error('Fetch Failed:', e);
            setJobs(MOCK_JOBS);
          }
          setLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-blue-100 selection:text-blue-700">
      
      {/* 1. TOP NAVIGATION BAR */}
      <nav className="sticky top-0 z-[100] bg-white border-b border-gray-100 md: flex items-center justify-between">
         <div className="flex items-center gap-10">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {BRANDING.shortName}
               </div>
               <span className="font-bold text-xl text-gray-900 tracking-tight">{BRANDING.name}</span>
            </div>

            <div className="hidden lg:flex items-center gap-8">
               <a href="/marketplace" className="text-sm font-semibold text-blue-600">Find Work</a>
               <a href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Dashboard</a>
               <a href="/messages" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Messages</a>
            </div>
         </div>

         <div className="hidden xl:flex flex-1 max-w-xl mx-12">
            <div className="relative w-full group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
               <input 
                  type="text" 
                  placeholder="Search for jobs, skills, or companies..." 
                  className="w-full h-11 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchJobs(searchTerm)}
               />
            </div>
         </div>

         <div className="flex items-center gap-4">
            <button className="hidden sm:flex w-10 h-10-lg-600 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100">
               <MessageSquare size={18} />
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-100 overflow-hidden cursor-pointer">
               <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" alt="avatar" className="w-full h-full object-cover" />
            </div>
         </div>
      </nav>

      {/* 2. PAGE HEADER */}
      <section className="bg-white py-12 border-b border-gray-100">
         <div className="max-w-7xl mx-auto md:">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
               <div className="space-y-4">
                  <h1 className="text-3xl font-bold text-[#111827] leading-tight">
                    Find your next <span className="text-blue-600">opportunity</span>
                  </h1>
                  <p className="max-w-2xl text-[#6b7280]">
                     BharatGig is home to India&apos;s most ambitious projects. Filter through thousands of verified opportunities and apply in one click.
                  </p>
               </div>

               <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                     <button className="h-9 px-3 bg-white text-blue-600 rounded shadow-sm flex items-center gap-3 text-xs font-semibold">
                        <List size={16} /> List
                     </button>
                     <button className="h-9 px-3 text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-3 text-xs font-semibold">
                        <Grid size={16} /> Grid
                     </button>
                  </div>
                  <div className="relative">
                     <select className="appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 transition-all cursor-pointer">
                        <option>Sort by: Newest</option>
                        <option>Sort by: Budget</option>
                        <option>Sort by: Rating</option>
                     </select>
                     <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 3. MAIN LAYOUT */}
      <main className="max-w-7xl mx-auto md: py-12 bg-gray-50/30">
         <div className="flex flex-col lg:flex-row gap-10">
            
            {/* LEFT SIDEBAR — 256px wide, sticky */}
            <aside className="hidden lg:block w-64 shrink-0">
               <div className="sticky top-24 space-y-8">

                  {/* Category Filter */}
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</h4>
                        <button onClick={() => setActiveCategory('All Categories')} className="text-xs font-semibold text-blue-600 hover:underline">Clear</button>
                     </div>
                     <div className="space-y-1">
                        {CATEGORIES.slice(0, 6).map((cat) => (
                          <div 
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-colors ${
                              activeCategory === cat
                                ? 'bg-blue-50 text-blue-600 font-semibold border border-blue-100'
                                : 'text-gray-500 border border-transparent hover:bg-gray-50'
                            }`}
                          >
                             <span className="text-sm">{cat}</span>
                             {activeCategory === cat && <ChevronRight size={13} />}
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Budget Range */}
                  <div className="space-y-4">
                     <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Budget Range</h4>
                     <input 
                        type="range" 
                        min="0" max="100000" step="1000"
                        className="w-full h-1.5 rounded-lg cursor-pointer accent-blue-600"
                        value={budgetRange}
                        onChange={(e) => setBudgetRange(Number(e.target.value))}
                     />
                     <div className="flex justify-between items-center bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">
                        <span className="text-xs font-medium text-gray-500">Min. Budget</span>
                        <span className="text-sm font-bold text-gray-900">₹{budgetRange.toLocaleString()}</span>
                     </div>
                  </div>

                  {/* Experience Level */}
                  <div className="space-y-4">
                     <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Experience Level</h4>
                     <div className="space-y-1">
                        {EXPERIENCE_LEVELS.map((level) => (
                           <label key={level} className="flex items-center gap-3 cursor-pointer py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                              <input type="checkbox" className="w-4 h-4 rounded accent-blue-600 shrink-0" checked={selectedExperience.includes(level)} onChange={() => toggleExperience(level)} />
                              <span className="text-sm text-gray-700">{level}</span>
                           </label>
                        ))}
                     </div>
                  </div>

                   {/* Location Filter */}
                   <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Region</h4>
                      <select 
                        className="w-full h-11 px-4 rounded-xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all appearance-none cursor-pointer"
                        value={selectedLocation}
                        onChange={e => setSelectedLocation(e.target.value)}
                      >
                         {LOCATIONS.map(loc => (
                           <option key={loc} value={loc}>{loc}</option>
                         ))}
                      </select>
                   </div>

                   {/* Minimum Rating */}
                   <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Minimum Rating</h4>
                      <div className="flex items-center gap-3">
                         {[4, 4.5, 4.8].map(r => (
                           <button 
                             key={r}
                             className="flex-1 py-2 rounded-lg border border-gray-100 text-[10px] font-bold hover:border-blue-600 hover:text-blue-600 transition-all bg-white"
                           >
                             {r}+ ★
                           </button>
                         ))}
                      </div>
                   </div>

                   {/* Reset */}
                   <button onClick={handleReset} className="w-full border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-white hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center gap-3 bg-gray-50/50">
                     <FilterX size={16} /> Reset Filters
                   </button>

               </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 min-w-0 space-y-6">
               
               {/* Mobile search */}
               <div className="xl:hidden relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                     type="text" 
                     placeholder="Search jobs..." 
                     className="form-input pl-11 bg-white shadow-sm w-full"
                  />
               </div>

               {/* Result count + sorting row */}
               <div className="flex items-center justify-between py-1">
                  <p className="text-sm text-gray-600">
                     Showing <span className="font-semibold text-gray-900">{jobs.length} jobs</span>
                  </p>
               </div>

               {/* Cards *                <section className="space-y-4">
                  {loading ? (
                    <div className="space-y-4">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="h-40 bg-gray-100/50 border border-[#e5e7eb] rounded-xl animate-pulse" />
                       ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                       {jobs.length > 0 ? (
                          jobs.map((job, index) => (
                             <MarketplaceJobCard key={job._id} job={job} index={index} />
                          ))
                       ) : (
                        <div className="py-24 flex flex-col items-center justify-center text-center space-y-4 bg-white border border-[#e5e7eb] rounded-xl">
                           <div className="w-16 bg-blue-50 text-blue-400 rounded-lg flex items-center justify-center">
                              <Search size={28} />
                           </div>
                           <div className="space-y-1">
                              <h3 className="text-base font-semibold text-[#111827]">No results found</h3>
                              <p className="text-sm text-[#6b7280]">Try adjusting or clearing your filters.</p>
                           </div>
                           <button onClick={handleReset} className="h-10 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">Clear Filters</button>
                        </div>
                      )}
                    </div>
                  )}
               </section>

               {/* Pagination */}
               {!loading && jobs.length > 0 && (
                  <div className="pt-8 flex justify-center items-center gap-3">
                     <button className="w-10 h-10-lg-600 hover:border-blue-300 transition-all">
                       <ChevronRight size={16} className="rotate-180" />
                     </button>
                     <span className="w-10 h-10-lg font-semibold">1</span>
                     <span className="w-10 h-10-lg-600 hover:bg-gray-50 cursor-pointer">2</span>
                     <span className="w-10 h-10-lg-600 hover:bg-gray-50 cursor-pointer">3</span>
                     <button className="w-10 h-10-lg-600 hover:border-blue-300 transition-all">
                       <ChevronRight size={16} />
                     </button>
                  </div>
               )}
            </div>
         </div>
      </main>

      {/* MOBILE FILTERS DRAWER */}
      <AnimatePresence>
         {showMobileFilters && (
            <>
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMobileFilters(false)}
                  className="fixed inset-0 bg-gray-900/40 z-[200]" 
               />
               <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  className="fixed top-0 right-0 w-[85%] h-full bg-white z-[201] shadow-sm p-8 overflow-y-auto"
               >
                  <div className="flex items-center justify-between mb-10">
                     <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                     <button className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-400" onClick={() => setShowMobileFilters(false)}>
                        <X size={20} />
                     </button>
                  </div>

                  <div className="space-y-10 pb-32">
                     <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category</h4>
                        <div className="space-y-2">
                           {CATEGORIES.slice(0, 6).map(c => (
                              <button 
                                key={c} 
                                onClick={() => { setActiveCategory(c); setShowMobileFilters(false); }}
                                className={`w-full text-left px-4 py-3 border rounded-lg text-sm font-medium transition-all ${activeCategory === c ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-200 text-gray-600'}`}
                              >
                                {c}
                              </button>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Budget Range</h4>
                        <input 
                           type="range" min="0" max="100000" step="1000"
                           className="w-full accent-blue-600 h-2 rounded-lg cursor-pointer"
                           value={budgetRange}
                           onChange={(e) => setBudgetRange(Number(e.target.value))}
                        />
                        <div className="flex justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                           <span className="text-xs font-medium text-gray-500">Min. Budget</span>
                           <span className="text-sm font-bold text-gray-900">₹{budgetRange.toLocaleString()}</span>
                        </div>
                     </div>

                     <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Experience Level</h4>
                        <div className="grid grid-cols-2 gap-3">
                           {EXPERIENCE_LEVELS.map(level => (
                              <button key={level} onClick={() => toggleExperience(level)} className={`px-4 py-2.5 border rounded-lg text-sm font-medium transition-all text-center ${selectedExperience.includes(level) ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600'}`}>
                                 {level}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="fixed bottom-0 right-0 left-0 p-5 bg-white border-t border-gray-100">
                     <button className="btn-primary w-full justify-center" onClick={() => setShowMobileFilters(false)}>
                        Show Results
                     </button>
                  </div>
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
  },
  { 
    _id: '3', 
    title: 'High-Conversion Growth Strategy & Content Authority', 
    category: 'Content Strategy', 
    budget: 45000, 
    postedTime: '6h ago',
    description: 'Lead the technical content initiative for a Series B fin-tech system. You will be responsible for whitepapers, high-conversion landing page copy, and strategic engineering-focused narratives.',
    tags: ['Copywriting', 'SEO', 'Technical Writing', 'GTM Strategy'],
    clientId: { name: 'FinFlow System', avatar: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&q=80' },
    location: 'London / Remote'
  }
];
