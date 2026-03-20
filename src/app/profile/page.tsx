'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, MapPin, Clock, MessageSquare, ShieldCheck, 
  ExternalLink, Award, Globe, Heart, ArrowLeft, ArrowRight,
  Share2, CheckCircle2, MoreHorizontal, Zap, 
  Search, Bell, Mail, Briefcase, Menu,
  CheckCircle,
  Calendar,
  LayoutGrid,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import ReviewList from '@/components/ReviewList';
import { BRANDING } from '@/lib/config';

const ReviewForm = dynamic(() => import('@/components/ReviewForm'), {
  loading: () => <div className="p-4 text-center text-slate-400 text-xs">Loading Form...</div>,
  ssr: false
});

/**
 * PRODUCTION-READY FREELANCER PROFILE PAGE (POLISHED & COMPACT)
 * Style: Elite White SaaS Marketplace (Compact)
 */

const Section = ({ title, children, className = "", icon }: { title?: string, children: React.ReactNode, className?: string, icon?: React.ReactNode }) => (
  <section className={`bg-white border border-gray-100 rounded-xl p-6 shadow-sm ${className}`}>
    {title && (
      <div className="flex items-center gap-3 mb-6">
        {icon && <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">{React.cloneElement(icon as React.ReactElement, { size: 18 })}</div>}
        <h3 className="text-sm font-bold text-[#111827]">{title}</h3>
      </div>
    )}
    {children}
  </section>
);

export default function ProfilePage() {
  const router = useRouter();
  const t = BRANDING.theme;
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const freelancer = {
    name: "Aditya Sharma",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80",
    role: "Senior Full Stack & AI Architect",
    rating: 4.95,
    reviews: 154,
    badge: "Top Rated",
    location: "Mumbai, India",
    availability: "Available Now",
    hourlyRate: 1500,
    jobSuccess: "99%",
    totalEarned: "₹45L+",
    hoursWorked: "2,450",
    totalJobs: 82,
    joined: "May 2021",
    skills: ["React", "Node.js", "TypeScript", "Next.js", "Figma", "MongoDB", "Tailwind", "AWS", "ML"],
    bio: "Engineer with 6+ years experience in crafting scalable, enterprise web systems. Specializing in high-performance architectures and modern UI/UX principles. Bridging the gap between complex engineering and seamless UX for global startups.",
    portfolio: [
      { title: "FinTech Dashboard", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" },
      { title: "E-commerce Engine", image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80" },
      { title: "AI CRM Nodes", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" },
      { title: "SaaS Landing", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80" },
    ]
  };

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-600">
      
      {/* 1. NAVIGATION */}
      <nav className="sticky top-0 z-[100] bg-white border-b border-gray-100 md: flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-blue-500/10">
              {BRANDING.shortName}
            </div>
            <span className="text-2xl font-semibold tracking-tight text-gray-900">{BRANDING.name}</span>
          </div>
          <button 
            onClick={() => router.push('/dashboard')}
            className="hidden md:flex items-center gap-3 text-sm font-medium text-[#6b7280] hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={16} /> Dashboard
          </button>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-3">
             <div className="p-2 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer">
               <Bell size={20} />
             </div>
             <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-100 cursor-pointer ml-1">
                <Image src={freelancer.avatar} alt="Profile" width={36} height={36} className="object-cover" />
             </div>
           </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto py-8 lg:py-12 md:">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* PROFILE CORE (LEFT 8 COLUMNS) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 2. HERO CARD */}
            <Section className="!p-0 border-none bg-[#f9fafb]">
               <div className="p-8 md:p-10 flex flex-col md:flex-row gap-10 items-center md:items-start bg-white border border-gray-100 rounded-xl">
                  <div className="relative shrink-0">
                    <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-lg overflow-hidden shadow-sm border-4 border-white">
                      <Image src={freelancer.avatar} alt={freelancer.name} fill className="object-cover" priority />
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div className="space-y-1">
                        <div className="flex items-center justify-center md:justify-start gap-4">
                          <h1 className="text-3xl font-bold text-[#111827]">{freelancer.name}</h1>
                          <div className="flex gap-3">
                            <div className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-100 flex items-center gap-1">
                               <CheckCircle2 size={12} /> VERIFIED
                            </div>
                            {freelancer.badge && (
                              <div className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-100 flex items-center gap-1 uppercase">
                                <TrendingUp size={12} /> {freelancer.badge}
                              </div>
                            )}
                          </div>
                        </div>
                        <h2 className="text-sm text-[#6b7280] font-medium">{freelancer.role}</h2>
                    </div>
                    
                    <div className="flex flex-wrap gap-6 justify-center md:justify-start items-center">
                      <div className="flex items-center gap-1.5 font-bold text-[#111827]">
                        <Star size={18} fill="#F59E0B" className="text-amber-400" />
                        <span className="text-xl">{freelancer.rating}</span>
                        <span className="text-sm text-[#6b7280] font-medium ml-1">({freelancer.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-3 text-[#6b7280] font-medium text-sm">
                        <MapPin size={16} className="text-blue-600" />
                        <span>{freelancer.location}</span>
                      </div>
                    </div>
                  </div>
               </div>
            </Section>

            {/* 3. BIO & SKILLS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Section title="Bio" icon={<Briefcase />}>
                <p className="text-base text-[#6b7280] leading-relaxed">
                  {freelancer.bio}
                </p>
              </Section>

              <Section title="Skills" icon={<Zap />}>
                <div className="flex flex-wrap gap-3">
                  {freelancer.skills.map((skill) => (
                    <span 
                      key={skill}
                      className="px-3 py-1.5 bg-gray-50 text-[#4b5563] rounded-lg font-bold text-xs border border-gray-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Section>
            </div>

            {/* 4. PORTFOLIO GRID */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-sm font-bold text-[#111827] flex items-center gap-3">
                    <LayoutGrid size={18} className="text-blue-600" /> Portfolio
                 </h3>
                 <button className="text-blue-600 font-bold text-sm hover:underline">View All</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {freelancer.portfolio.map((item, i) => (
                  <div 
                    key={i} 
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:border-blue-200 group cursor-pointer transition-all duration-300"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                    </div>
                    <div className="p-4 flex items-center justify-between border-t border-gray-50">
                       <h4 className="font-bold text-[#111827] text-sm">{item.title}</h4>
                       <ExternalLink size={14} className="text-gray-400 group-hover:text-blue-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. REPUTATION HUB */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold px-2">Client Reviews</h3>
              <ReviewList userId={freelancer.name} />
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-white border border-gray-100 rounded-xl p-8 space-y-8 shadow-sm">
              <div className="space-y-1">
                <span className="text-sm font-bold text-[#6b7280] uppercase tracking-wider">Starting at</span>
                <div className="flex items-baseline gap-3">
                   <h2 className="text-4xl font-bold text-[#111827]">₹{freelancer.hourlyRate}</h2>
                   <span className="text-base font-medium text-[#6b7280]">/ hour</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full h-11 text-sm font-bold">
                  Hire {freelancer.name.split(' ')[0]}
                </Button>
                <Button variant="outline" className="w-full h-11 text-sm font-bold">
                   Message
                </Button>
              </div>

              <div className="pt-8 border-t border-gray-50 space-y-6">
                 <SidebarMetric label="Job Success" value={freelancer.jobSuccess} color="emerald" progress />
                 <div className="grid grid-cols-1 gap-6">
                    <SidebarMetric label="Total Earned" value={freelancer.totalEarned} color="blue" />
                    <SidebarMetric label="Expertise Level" value="Senior Expert" color="blue" />
                 </div>
              </div>
            </div>
          </aside>

        </div>
      </main>

      {/* MOBILE ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-white border-t border-gray-100 p-4 flex gap-4 shadow-sm">
        <Button variant="outline" className="w-12 p-0">
          <MessageSquare size={20} />
        </Button>
        <Button className="flex-1 text-sm font-bold">
          Hire Freelancer
        </Button>
      </div>

    </div>
  );
}

// PREMIUM COMPACT ATOMIC COMPONENTS
function IconButton({ icon, badge }: { icon: React.ReactNode, badge?: boolean }) {
  return (
    <div className="relative p-2.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 bg-slate-50/50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-blue-100 active:scale-90">
      {icon}
      {badge && <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />}
    </div>
  )
}

function SidebarMetric({ label, value, color, progress }: { label: string, value: string, color: string, progress?: boolean }) {
  const barColor = color === 'emerald' ? 'bg-emerald-500' : 'bg-blue-600';

  return (
    <div className="space-y-2">
       <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
          {progress && <span className="text-xs font-bold text-emerald-600">{value}</span>}
       </div>
       {!progress && <p className="text-sm font-bold text-[#111827]">{value}</p>}
       {progress && (
          <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
            <div 
              style={{ width: value }}
              className={`h-full ${barColor} rounded-full transition-all duration-1000`} 
            />
          </div>
       )}
    </div>
  )
}

function BadgeItem({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-slate-50 text-slate-300 rounded-lg flex items-center justify-center border border-slate-50 px-2 shrink-0">
        {icon}
      </div>
      <h5 className="font-bold text-slate-900 text-[10px] tracking-tight truncate uppercase">{title}</h5>
    </div>
  )
}
