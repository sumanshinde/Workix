'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, ChevronDown, Grid, List, 
  ShoppingBag, Zap, X, Sliders, MapPin, 
  Briefcase, MessageSquare, User, Menu,
  Bookmark, ChevronRight, Sparkles, FilterX,
  ShieldCheck, Globe, Activity, TrendingUp,
  Terminal, Shield, ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BRANDING } from '@/lib/config';
import { MarketplaceJobCard } from '@/components/marketplace/MarketplaceJobCard';
import { jobService } from '@/services/api';

const JOB_CATEGORIES = [
  'All Mandates', 'Core Engineering', 'Blockchain Arch', 'AI Intelligence', 
  'Product Defense', 'Cloud Nexus', 'Security Audit', 'Machine Logic',
  'Strategic Ops', 'Visual Identity', 'Data Synthesis', 'Growth'
];

const EXPERIENCE_MODALITIES = ['Entry Node', 'Intermediate Cycle', 'Expert Tier', 'Elite Architect'];
const SETTLEMENT_MODES = ['Fixed Resource', 'Hourly Meter', 'Monthly Retainer'];

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Mandates');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [budgetRange, setBudgetRange] = useState(0);
  
  const router = useRouter();
  const t = BRANDING.theme;

  const fetchJobs = async (search = '', category = '') => {
    setLoading(true);
    // Mimicking API latency
    setTimeout(async () => {
        try {
            const data = await jobService.getAll({ search, category: category === 'All Mandates' ? '' : category });
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
      
      {/* 1. ELITE TOP NAVIGATION (Consistent) */}
      <nav className="sticky top-0 z-[100] h-16 px-6 bg-white border-b border-gray-100 shadow-sm px-4 md: flex items-center justify-between">
         <div className="flex items-center gap-10">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
               <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-[15px] shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  GI
               </div>
               <span className="font-extrabold text-xl text-slate-900 tracking-tight">GigIndia</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-10">
               <a href="/jobs" className="text-xs font-bold uppercase tracking-widest text-blue-600 border-b-2 border-blue-600 pb-1 transition-all">Find Work</a>
               <a href="/marketplace" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">Find Talent</a>
               <a href="/pricing" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">Pricing</a>
               <a href="/admin/dashboard" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">Admin Panel</a>
            </div>
         </div>

         {/* Center Search - Large & Futuristic */}
         <div className="hidden xl:flex flex-1 max-w-2xl mx-16">
            <div className="relative w-full group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={22} />
               <input 
                  type="text" 
                  placeholder="Search rules, technical clusters, or active nodes..." 
                  className="w-full bg-white border border-gray-200 rounded-[24px] pl-16 pr-8 py-4.5 text-sm font-bold text-gray-900 outline-none focus:border-blue-500 focus:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.1)] transition-all tracking-tight shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchJobs(searchTerm)}
               />
               <button className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-sm shadow-blue-500/20 active:scale-90 transition-transform">
                  <ArrowRight size={20} />
               </button>
            </div>
         </div>

         {/* Right Actions */}
         <div className="flex items-center gap-5">
            <button className="hidden sm:flex items-center gap-3 py-3 bg-white border border-gray-200 rounded-lg text-xs font-bold uppercase tracking-widest text-gray-500 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm">
               <Briefcase size={14} /> My Proposals
            </button>
            <div className="h-4 w-px bg-gray-100 mx-2 hidden sm:block" />
            <div className="w-11 h-11 rounded-lg bg-white border border-gray-200 overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-100 transition-all shadow-sm">
               <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" alt="avatar" className="w-full h-full object-cover" />
            </div>
         </div>
      </nav>

      {/* 2. HERO / HEADER */}
      <section className="relative bg-[#f9fafb] border-b border-gray-100 overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/[0.02] blur-[150px] pointer-events-none" />
         <div className="max-w-[1600px] mx-auto px-4 md: py-16 md:py-24">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12">
               <div className="space-y-6 max-w-3xl">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 text-blue-600"
                  >
                     <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                     <span className="text-xs font-bold uppercase tracking-[0.4em] leading-none">Live Mandate Synchronization Active</span>
                  </motion.div>
                  <h1 className="text-4xl md:text-[40px] font-bold tracking-tight text-gray-900 leading-tight uppercase">
                     gig <br /><span className="text-blue-600">Control.</span>
                  </h1>
                  <p className="text-gray-400 font-bold text-sm leading-relaxed max-w-xl uppercase tracking-tight opacity-80">
                     Provision elite technical mandates and strategic initiatives within the GigIndia federation.
                  </p>
               </div>

               <div className="flex items-center gap-5 flex-wrap">
                  <div className="bg-white p-1.5 rounded-[24px] border border-gray-200 flex items-center shadow-sm">
                     <button className="p-4 bg-white text-blue-600 rounded-xl shadow-md border border-gray-100"><List size={22} /></button>
                     <button className="p-4 text-gray-300 hover:text-gray-600 transition-colors"><Grid size={22} /></button>
                  </div>
                  <div className="relative group min-w-[200px]">
                     <select className="w-full appearance-none bg-white border border-gray-200 rounded-[28px] pl-8 pr-16 py-5 text-[11px] font-bold uppercase tracking-[0.2em] outline-none focus:border-blue-500 cursor-pointer shadow-sm">
                        <option>Target: Latest</option>
                        <option>Target: Valuation</option>
                        <option>Target: Popularity</option>
                     </select>
                     <ChevronDown size={14} className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors pointer-events-none" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 3. CORE LAYOUT (SIDEBAR + CONTENT) */}
      <main className="max-w-[1600px] mx-auto px-4 md: py-16">
         <div className="flex flex-col lg:flex-row gap-16">
            
            {/* LEFT SIDEBAR - TECH STACK */}
            <aside className="hidden lg:block w-80 space-y-16 shrink-0">
               <div className="sticky top-32 space-y-16">
                  
                  {/* Categories */}
                  <div className="space-y-8">
                     <div className="flex items-center justify-between">
                        <h4 className="text-[13px] font-bold uppercase tracking-[0.3em] text-gray-400 leading-none">System Domain</h4>
                        <button className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest">Reset</button>
                     </div>
                     <div className="grid grid-cols-1 gap-3">
                        {JOB_CATEGORIES.slice(0, 6).map((cat) => (
                          <div 
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`group flex items-center justify-between py-5 px-8 rounded-[24px] border transition-all cursor-pointer ${activeCategory === cat ? 'bg-white border-blue-600 text-blue-600 shadow-md ring-1 ring-blue-600/10' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-300 hover:text-blue-600 shadow-sm'}`}
                          >
                             <span className="text-xs font-bold uppercase tracking-widest leading-none">{cat}</span>
                             <ChevronRight size={16} className={`transition-transform duration-300 ${activeCategory === cat ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Valuation Range */}
                  <div className="space-y-8">
                     <h4 className="text-[13px] font-bold uppercase tracking-[0.3em] text-gray-400">Financial Weight</h4>
                     <div className="space-y-6 px-2 text-center">
                        <input 
                           type="range" 
                           min="0" 
                           max="500000" 
                           step="5000"
                           className="w-full accent-blue-600 h-2 bg-gray-100 rounded-lg cursor-pointer appearance-none"
                           value={budgetRange}
                           onChange={(e) => setBudgetRange(Number(e.target.value))}
                        />
                        <div className="bg-slate-900 p-6 rounded-[28px] border border-slate-800 shadow-sm relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 blur-[40px] group-hover:bg-blue-500/20 transition-all pointer-events-none" />
                           <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500 block mb-2 leading-none">Threshold</span>
                           <span className="text-2xl font-bold text-white tracking-tight leading-none">₹{budgetRange.toLocaleString()}+</span>
                        </div>
                     </div>
                  </div>

                  {/* Modality Filter */}
                  <div className="space-y-8">
                     <h4 className="text-[13px] font-bold uppercase tracking-[0.3em] text-gray-400">Node Tier</h4>
                     <div className="space-y-4">
                        {EXPERIENCE_MODALITIES.map((tier) => (
                           <label key={tier} className="flex items-center gap-4 cursor-pointer group py-2 px-4 rounded-lg hover:bg-gray-50 transition-all">
                              <div className="relative w-6 h-6 border-2 border-gray-200 rounded-lg flex items-center justify-center transition-all group-hover:border-blue-400 group-has-[:checked]:border-blue-600 group-has-[:checked]:bg-blue-600">
                                 <input type="checkbox" className="absolute inset-0 opacity-0 cursor-pointer" />
                                 <div className="w-1.5 h-1.5 rounded-full bg-white opacity-0 group-has-[:checked]:opacity-100 transition-opacity" />
                              </div>
                              <span className="text-xs font-bold text-gray-500 group-hover:text-blue-600 transition-colors uppercase tracking-[0.1em]">{tier}</span>
                           </label>
                        ))}
                     </div>
                  </div>

                  {/* Trust Badge */}
                  <div className="p-10 bg-blue-50/50 border border-blue-100 rounded-[44px] space-y-6 shadow-inner relative overflow-hidden text-center group">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors" />
                     <ShieldCheck size={44} className="text-blue-600 mx-auto" />
                     <h4 className="text-sm font-bold text-gray-900 tracking-tight uppercase leading-none">Authorized Node</h4>
                     <p className="text-xs text-gray-400 font-bold leading-relaxed uppercase tracking-tight">
                        All mandates carry e-KYC verified counter-party credentials and smart-escrow liquidity locks.
                     </p>
                  </div>

               </div>
            </aside>

            {/* MAIN CORE - MANDATE STREAM */}
            <div className="flex-1 space-y-10">
               
               <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                     <p className="text-[13px] font-bold uppercase tracking-[0.3em] text-gray-400 leading-none">
                       System Status: <span className="text-blue-600">{jobs.length} Active Initiates Synchronized</span>
                     </p>
                  </div>
                  <button onClick={() => router.push('/post-job')} className="flex items-center gap-3 bg-blue-600 text-white py-4 rounded-lg font-bold text-xs uppercase tracking-widest shadow-[0_15px_30px_-10px_rgba(37,99,235,0.4)] hover:scale-[1.02] active:scale-95 transition-all">
                     <Activity size={14} /> Provision New Mandate
                  </button>
               </div>

               <section className="space-y-10">
                  {loading ? (
                    <div className="space-y-10">
                       {[1,2,3].map(i => (
                         <div key={i} className="h-72 bg-white border border-gray-100 rounded-[44px] animate-pulse p-10 flex flex-col lg:flex-row gap-10">
                            <div className="flex-1 space-y-6">
                               <div className="flex gap-4"><div className="w-24 h-6 bg-gray-50 rounded-full" /><div className="w-40 h-6 bg-gray-50 rounded-full" /></div>
                               <div className="w-full bg-gray-50 rounded-lg" />
                               <div className="w-[90%] h-20 bg-gray-50 rounded-lg" />
                               <div className="flex gap-3"><div className="w-20 h-8 bg-gray-50 rounded-xl" /><div className="w-20 h-8 bg-gray-50 rounded-xl" /><div className="w-20 h-8 bg-gray-50 rounded-xl" /></div>
                            </div>
                            <div className="lg:w-80 h-full bg-gray-50 rounded-[32px] lg:border-l border-gray-100/50" />
                         </div>
                       ))}
                    </div>
                  ) : (
                    <motion.div 
                       layout
                       className="space-y-10"
                    >
                      <AnimatePresence mode="popLayout">
                        {jobs.length > 0 ? (
                           jobs.map((job, index) => (
                              <MarketplaceJobCard key={job._id} job={job} index={index} />
                           ))
                        ) : (
                          <motion.div 
                             initial={{ opacity: 0, scale: 0.95 }}
                             animate={{ opacity: 1, scale: 1 }}
                             className="py-40 flex flex-col items-center justify-center text-center space-y-8 bg-white border border-gray-100 rounded-[44px] shadow-sm relative overflow-hidden"
                          >
                             <div className="absolute inset-0 bg-blue-500/[0.01] pointer-events-none" />
                             <div className="w-28 h-28 bg-blue-50 text-blue-200 rounded-full flex items-center justify-center relative">
                                <Search size={48} />
                                <div className="absolute -top-2 -right-2 w-10 h-10-lg-600 border border-blue-50"><X size={24} /></div>
                             </div>
                             <div className="space-y-3 relative">
                                <h3 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">No Results Found</h3>
                                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] max-w-sm mx-auto leading-relaxed">System failed to synchronize mandates with existing system parameters.</p>
                             </div>
                             <button className="relative z-10 text-blue-600 font-bold uppercase text-[10px] tracking-[0.3em] py-5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all border border-blue-100/50">Expand Search System</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
               </section>

               {/* Sequence Advance */}
               {!loading && jobs.length > 0 && (
                  <div className="pt-24 flex justify-center">
                     <button className="group relative bg-white border border-gray-200 px-16 py-6 rounded-[32px] overflow-hidden transition-all hover:border-blue-500 hover:shadow-sm hover:shadow-blue-500/10 active:scale-95">
                        <div className="absolute inset-0 bg-blue-500/[0.01] transform translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <span className="relative z-10 text-[11px] font-bold uppercase tracking-[0.4em] text-gray-500 group-hover:text-blue-600 transition-colors">Advance Mandate Sequence</span>
                     </button>
                  </div>
               )}
            </div>
         </div>
      </main>

      {/* FOOTER CLUSTER */}
      <footer className="py-24 border-t border-gray-100 bg-[#f9fafb] opacity-80">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-6">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">GI</div>
             <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-gray-900 leading-none">{BRANDING.name} Federation Registry</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">© 2026 NEXUS PROTOCOL v4.5.0-STABLE.AUTH</p>
        </div>
      </footer>

      {/* MOBILE TRIGGER (Sidebar replacement) */}
      <AnimatePresence>
         {showMobileFilters && (
            <>
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMobileFilters(false)}
                  className="fixed inset-0 bg-slate-900/60 z-[200]" 
               />
               <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  className="fixed top-0 right-0 w-[90%] h-full bg-white z-[201] shadow-sm p-10 overflow-y-auto"
               >
                  <div className="flex items-center justify-between mb-16">
                     <h3 className="text-3xl font-bold tracking-tight uppercase leading-none text-gray-900">Mandate <span className="text-blue-600">Filters</span></h3>
                     <button className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400" onClick={() => setShowMobileFilters(false)}>
                        <X size={24} />
                     </button>
                  </div>

                  <div className="space-y-16 pb-32">
                     {/* Mirror Sidebar Filters here if needed for mobile */}
                  </div>

                  <div className="fixed bottom-0 right-0 left-0 p-8 bg-white/80 border-t border-gray-50">
                     <button className="w-full bg-blue-600 text-white py-6 rounded-lg font-bold text-xs uppercase tracking-widest shadow-sm shadow-blue-500/20" onClick={() => setShowMobileFilters(false)}>
                        Confirm Filters
                     </button>
                  </div>
               </motion.div>
            </>
         )}
      </AnimatePresence>

      {/* Floating Mobile Filter Toggle */}
      <button 
        onClick={() => setShowMobileFilters(true)}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 lg:hidden bg-slate-900 text-white py-5 rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-sm z-[150] flex items-center gap-3 animate-pulse group"
      >
        <Sliders size={16} className="text-blue-500 group-hover:rotate-90 transition-transform" /> 
        Modify System Parameters
      </button>

    </div>
  );
}

const MOCK_JOBS: any[] = [
  { 
    _id: '1', 
    title: 'Senior React Architect - DeFi Settlement Cluster', 
    category: 'Blockchain Arch', 
    budget: 180000, 
    postedTime: 'Just now',
    proposalsCount: 8,
    description: 'We require an elite engineer to architect the primary settlement layer for a distributed liquidity pool. Mastery of ZK-proof logic, high-resolution performance tuning, and secure node communication is essential for this gig.',
    tags: ['Next.js 14', 'Solidity', 'Rust', 'Ethers.js', 'PostgreSQL'],
    clientId: { name: 'EtherCore Foundation', avatar: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=100&q=80' },
    location: 'Remote Node / Global'
  },
  { 
    _id: '2', 
    title: 'Visual Identity Nexus Specialist - AI Core Branding', 
    category: 'Visual Identity', 
    budget: 75000, 
    postedTime: '4h ago',
    proposalsCount: 15,
    description: 'Construct a comprehensive brand authority system for a seed-stage AI intelligence startup. Deliverables include a dynamic vector logo nexus, precision typography guidelines, and advanced motion assets for deep interface branding.',
    tags: ['Figma', 'Brand Matrix', 'After Effects', 'Design Systems', 'Motion'],
    clientId: { name: 'Alpha Intel Nexus', avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&q=80' },
    location: 'San Francisco / Global'
  },
  { 
    _id: '3', 
    title: 'ML Strategic Researcher - LLM Fine-Tuning Mandate', 
    category: 'AI Intelligence', 
    budget: 220000, 
    postedTime: '12h ago',
    proposalsCount: 5,
    description: 'Execute deep fine-tuning operations on domain-specific large language models for legal data synthesis. You will be responsible for hyper-parameter optimization, vector database indexing, and performance auditing.',
    tags: ['Python', 'PyTorch', 'Transformers', 'Pinecone', 'Hugging Face'],
    clientId: { name: 'LexisAI Research', avatar: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&q=80' },
    location: 'New York / Remote'
  },
  { 
    _id: '4', 
    title: 'Go-To-Market Strategic Storyteller & Technical SEO', 
    category: 'Strategic Ops', 
    budget: 45000, 
    postedTime: '1d ago',
    proposalsCount: 22,
    description: 'Lead the technical narrative initiative for a high-growth SaaS infrastructure startup. Focus on building technical whitepapers, architectural case studies, and high-conversion landing page narratives for an engineering audience.',
    tags: ['Content Strategy', 'SEO Matrix', 'Copywriting', 'Technical Narrative'],
    clientId: { name: 'CloudScale Infrastructure', avatar: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&q=80' },
    location: 'Remote'
  },
  { 
    _id: '5', 
    title: 'Cybersecurity Architect - Zero-Trust Cloud Provisioning', 
    category: 'Security Audit', 
    budget: 155000, 
    postedTime: '2d ago',
    proposalsCount: 3,
    description: 'Architect a zero-trust security perimeter for a critical financial backend cluster. Candidates must demonstrate expert knowledge of IAM rules, mTLS, and encrypted node discovery.',
    tags: ['Cybersecurity', 'Terraform', 'mTLS', 'WAF', 'Cloud Security'],
    clientId: { name: 'SecureLink System', avatar: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&q=80' },
    location: 'Remote'
  }
];
