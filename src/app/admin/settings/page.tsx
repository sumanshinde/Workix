'use client';

import React, { useState } from 'react';
import { 
  Settings, Shield, Globe, Zap, Mail, 
  Lock, Save, RefreshCcw, Bell, CreditCard,
  CloudLightning, Landmark, History, MoreHorizontal,
  Activity, ShieldCheck, Cpu, Terminal, Key,
  Eye, EyeOff
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BRANDING } from '@/lib/config';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('Platform');
  const t = BRANDING.theme;

  const SettingRow = ({ label, description, children }: any) => (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 py-12 border-b border-slate-50 last:border-0 group transition-all">
      <div className="space-y-2 max-w-xl">
        <h4 className="text-slate-900 font-bold uppercase tracking-[0.2em] text-[11px] group-hover:text-blue-600 transition-colors flex items-center gap-3">
           <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> {label}
        </h4>
        <p className="text-slate-500 text-[13px] font-medium leading-relaxed uppercase tracking-tight">{description}</p>
      </div>
      <div className="shrink-0 min-w-[280px]">
        {children}
      </div>
    </div>
  );

  return (
    <div className="p-8 lg:p-12 space-y-12">
      {/* 1. PROTOCOL HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 bg-slate-50/50 p-10 rounded-[48px] border border-slate-100">
        <div className="space-y-3">
          <div style={{ color: t.primary }} className="flex items-center gap-3 font-bold tracking-[0.4em] text-[10px] uppercase">
             <Terminal size={14} className="opacity-50" /> System Configuration Cluster
          </div>
          <h1 className="text-6xl font-bold text-slate-900 tracking-tight uppercase leading-tight">System <span style={{ color: t.primary }}>Specs</span>.</h1>
          <p className="text-slate-500 font-medium text-sm tracking-tight uppercase">Calibrate platform mechanics, security parameters, and financial tiers.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-5 py-5 bg-white border border-slate-100 rounded-lg hover:bg-slate-50 transition-all shadow-sm text-slate-400 hover:text-blue-600"><History size={24} /></button>
          <button style={{ backgroundColor: t.primary }} className="py-5 text-white font-bold rounded-lg hover:scale-105 transition-all text-[11px] uppercase tracking-widest flex items-center gap-4 shadow-sm shadow-blue-500/20 active:scale-95">
             <Save size={20} /> Authorize Changes
          </button>
        </div>
      </div>

      {/* 2. TABBED NAVIGATION MATRIX */}
      <div className="flex bg-slate-50 p-2 rounded-xl border border-slate-100 w-fit">
         {['Platform', 'Security', 'Gateways', 'Legal'].map((tab) => (
           <button 
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-xl shadow-blue-900/5' : 'text-slate-400 hover:text-slate-900'}`}
           >
             {tab}
           </button>
         ))}
      </div>

      {/* 3. SETTINGS CORE MODULE */}
      <div className="bg-white border border-slate-100 rounded-[56px] p-12 lg:p-16 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] pointer-events-none" />
        
        {activeTab === 'Platform' && (
          <div className="divide-y divide-slate-50">
            <SettingRow 
              label="Standard Commission Rate" 
              description="Global percentage deducted from freelancer earnings per transaction across the platform ecosystem."
            >
              <div className="flex items-center gap-5 bg-slate-50 border border-slate-100 rounded-lg p-3 shadow-inner group">
                <input type="number" defaultValue={10} className="bg-transparent border-none text-3xl font-bold text-slate-900 outline-none w-24 tracking-tight" />
                <span className="text-slate-300 font-bold text-2xl">%</span>
              </div>
            </SettingRow>

            <SettingRow 
              label="Dispute Resolution SLA" 
              description="The maximum permissible temporal node (in hours) before an admin must take oversight on an active dispute."
            >
               <div className="relative group">
                  <select defaultValue="24" className="w-full bg-slate-50 border border-slate-100 rounded-lg py-5 text-[11px] font-bold uppercase tracking-widest text-slate-900 outline-none hover:border-blue-400 transition-all appearance-none cursor-pointer">
                     <option value="12">12 Hours (Aggressive)</option>
                     <option value="24">24 Hours (Standard)</option>
                     <option value="48">48 Hours (Relaxed)</option>
                  </select>
                  <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 rotate-90 text-slate-300 pointer-events-none" size={20} />
               </div>
            </SettingRow>

            <SettingRow 
              label="Gig Verification Logic" 
              description="Determines if new service node listings require manual administrative approval before going live in the cluster."
            >
               <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-100 shadow-inner">
                  <button className="flex-1 py-3 rounded-xl bg-white border border-transparent shadow-sm text-blue-600 text-[10px] font-bold uppercase tracking-widest">Manual Node Review</button>
                  <button className="flex-1 py-3 rounded-xl text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-slate-900 transition-colors">Automatic Deploy</button>
               </div>
            </SettingRow>

            <SettingRow 
              label="Ecosystem Capacity" 
              description="Limit total concurrent active jobs to maintain platform server stability and computational equilibrium."
            >
               <div className="space-y-4 pt-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                     <span className="text-slate-400">Current Load: 42.4%</span>
                     <span className="text-blue-600">10,000 Capacity Nodes</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-50 rounded-full border border-slate-100 overflow-hidden shadow-inner">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '42.4%' }}
                        className="h-full bg-blue-600 rounded-full shadow-sm shadow-blue-600/50" 
                     />
                  </div>
               </div>
            </SettingRow>
          </div>
        )}

        {activeTab === 'Security' && (
          <div className="divide-y divide-slate-50">
            <SettingRow 
              label="Administrative 2FA System" 
              description="Enforces mandatory multi-factor authentication for all users within the high-level Authorization Node cluster."
            >
               <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest animate-pulse">Encryption Active</span>
                  <div className="w-16 h-9 bg-blue-600 rounded-lg relative cursor-pointer shadow-sm shadow-blue-500/20 transition-all hover:scale-110">
                    <div className="absolute top-1 right-1 w-7 h-7 bg-white rounded-full shadow-md" />
                  </div>
               </div>
            </SettingRow>

            <SettingRow 
              label="IP Ingress Constraints" 
              description="Restrict administrative panel access to specific verified IP ranges and Authorized CIDR node blocks."
            >
               <div className="space-y-4">
                  <div className="flex gap-3 mb-2 flex-wrap">
                     {['192.168.1.1 (Base)', '10.0.0.1 (VPN Node)'].map(ip => (
                       <span key={ip} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 text-[10px] font-bold uppercase tracking-tight">{ip}</span>
                     ))}
                  </div>
                  <button className="text-blue-600 font-bold text-[10px] uppercase tracking-widest flex items-center gap-3 hover:gap-5 transition-all">
                     <Key size={16} /> + Authorize Ingress Node
                  </button>
               </div>
            </SettingRow>

            <SettingRow 
              label="System Key Rotation" 
              description="Automatically rotate secret authorization tokens every 90 operational cycles."
            >
               <button className="py-4 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-900 hover:bg-white hover:border-blue-500 transition-all shadow-sm">Initialize Rotation Cycle</button>
            </SettingRow>
          </div>
        )}

        {activeTab === 'Gateways' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
             {[
               { name: 'Razorpay System', status: 'Optimal', icon: <Landmark size={24} />, color: 'blue' },
               { name: 'Stripe Global Ingress', status: 'Maintenance', icon: <CloudLightning size={24} />, color: 'slate' },
               { name: 'Nexus Hub SMS', status: 'Optimal', icon: <Bell size={24} />, color: 'emerald' },
               { name: 'SMTP Relay Grid', status: 'Degraded', icon: <Mail size={24} />, color: 'rose' },
             ].map((gateway, i) => (
               <div key={i} className="p-10 bg-white border border-slate-100 rounded-[44px] hover:border-blue-500 hover:shadow-sm transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 blur-[40px] pointer-events-none" />
                  <div className="flex items-center justify-between mb-10 relative z-10">
                     <div className={`p-5 rounded-2xl bg-slate-50 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner`}>
                        {gateway.icon}
                     </div>
                     <button className="p-3 text-slate-300 hover:text-slate-900 transition-colors"><MoreHorizontal size={24} /></button>
                  </div>
                  <h4 className="text-slate-900 font-bold uppercase tracking-widest mb-3 relative z-10">{gateway.name}</h4>
                  <div className="flex items-center gap-3 relative z-10">
                     <div className={`w-2 h-2 rounded-full ${gateway.status === 'Optimal' ? 'bg-emerald-500 animate-pulse' : gateway.status === 'Maintenance' ? 'bg-slate-300' : 'bg-rose-500'}`} />
                     <span className={`text-[10px] font-bold uppercase tracking-widest ${gateway.status === 'Optimal' ? 'text-emerald-500' : 'text-slate-400'}`}>{gateway.status}</span>
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>

      {/* 4. REAL-TIME TELEMETRY FOOTER */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 opacity-40 py-10">
         <div className="flex items-center gap-4">
            <RefreshCcw size={18} className="text-slate-300 animate-spin-slow" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">Nexus Sync: 99.98% SUCCESS</span>
         </div>
         <div className="flex items-center gap-4">
            <ShieldCheck size={18} className="text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">End-to-End Encrypted Ingress</span>
         </div>
      </div>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function ChevronRight({ size, className, style }: any) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      style={style}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}

function Network({ size, className, style }: any) {
  return <Cpu size={size} className={className} style={style} />;
}
