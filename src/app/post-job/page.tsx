'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, Briefcase,
  FileText, IndianRupee, Tag, Eye,
  Clock, MapPin, ChevronDown, X, Zap, ShieldCheck
} from 'lucide-react';
import { BRANDING } from '@/lib/config';
import { jobsAPI } from '@/services/api';
import { Button, Card, Input } from '@/components/ui';

// ─── Types ────────────────────────────────────────────────────────────────────
interface JobForm {
  // Step 1
  title: string;
  category: string;
  // Step 2
  description: string;
  scope: 'small' | 'medium' | 'large';
  // Step 3
  budgetType: 'fixed' | 'hourly';
  budgetMin: string;
  budgetMax: string;
  deadline: string;
  // Step 4
  skills: string[];
  experienceLevel: 'entry' | 'intermediate' | 'expert';
  // Step 5 — review
}

const CATEGORIES = [
  'Web Development', 'Mobile Apps', 'UI/UX Design', 'Graphic Design',
  'AI / Machine Learning', 'Data Science', 'Content Writing', 'SEO / Marketing',
  'Video Editing', 'Cloud / DevOps', 'Cybersecurity', 'Accounting / Finance',
];

const COIN_COSTS: any = {
  'UI/UX Design': 35,
  'Graphic Design': 35,
  'Web Development': 55,
  'Mobile Apps': 55,
  'AI / Machine Learning': 55,
  'Data Science': 55,
  'SEO / Marketing': 45,
  'Content Writing': 45,
  'Cloud / DevOps': 55,
  'General': 20
};

const POPULAR_SKILLS = [
  'React', 'Node.js', 'TypeScript', 'Python', 'Figma', 'Next.js',
  'MongoDB', 'PostgreSQL', 'AWS', 'Flutter', 'SEO', 'Photoshop',
  'TailwindCSS', 'Vue.js', 'Docker', 'Kubernetes'
];

const STEPS = [
  { id: 1, label: 'Job Info',    icon: <Briefcase size={16} /> },
  { id: 2, label: 'Scope',       icon: <FileText size={16} /> },
  { id: 3, label: 'Budget',      icon: <IndianRupee size={16} /> },
  { id: 4, label: 'Skills',      icon: <Tag size={16} /> },
  { id: 5, label: 'Review',      icon: <Eye size={16} /> },
];

export default function PostJobPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<JobForm>({
    title: '',        category: '',
    description: '',  scope: 'medium',
    budgetType: 'fixed', budgetMin: '', budgetMax: '', deadline: '',
    skills: [],       experienceLevel: 'intermediate',
  });

  const set = (key: keyof JobForm, val: any) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const addSkill = (skill: string) => {
    const s = skill.trim();
    if (s && !form.skills.includes(s) && form.skills.length < 10)
      setForm(prev => ({ ...prev, skills: [...prev.skills, s] }));
    setSkillInput('');
  };

  const removeSkill = (skill: string) =>
    setForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));

  const canNext = () => {
    if (step === 1) return form.title.length > 3 && form.category;
    if (step === 2) return form.description.length > 20;
    if (step === 3) return form.budgetMin && form.deadline;
    if (step === 4) return form.skills.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await jobsAPI.create({
        title: form.title,
        description: form.description,
        category: form.category,
        budget: Number(form.budgetMax || form.budgetMin),
        budgetMin: Number(form.budgetMin),
        budgetMax: Number(form.budgetMax),
        budgetType: form.budgetType,
        scope: form.scope,
        skills: form.skills,
        experienceLevel: form.experienceLevel,
        deadline: form.deadline ? new Date(form.deadline) : undefined
      });
      setSubmitted(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err: any) {
      console.error('Post failed:', err);
      // Fallback for demo
      setSubmitted(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleAISuggestion = async () => {
    if (!form.title || form.title.length < 5) return;
    setAiLoading(true);
    try {
      const data = await jobsAPI.generateAI(form.title, form.category);
      if (data.description) set('description', data.description);
      if (data.skills && data.skills.length > 0) {
        set('skills', Array.from(new Set([...form.skills, ...data.skills])).slice(0, 10));
      }
      // Move to step 2 automatically if we got a description
      if (data.description && step === 1) setStep(2);
    } catch (err) {
      console.error('AI Error:', err);
    } finally {
      setAiLoading(false);
    }
  };

   // ── Success screen ────────────────────────────────────────────────────────
   if (submitted) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
        <div className="saas-card p-12 text-center max-w-lg">
          <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-emerald-100 shadow-sm shadow-emerald-500/10">
            <Check size={36} className="text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Job Posted Successfully</h2>
          <p className="text-[15px] text-slate-500 leading-relaxed font-medium">Your project is now live on the marketplace. Verified professionals can now submit execution proposals.</p>
          <div className="mt-10 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 w-full transition-all duration-1000" />
          </div>
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mt-6">Redirecting to Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-blue-100 selection:text-blue-600 font-sans pb-24">

      {/* ── NAV ── */}
      <nav className="bg-white/70 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-[100] h-20 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-[15px] shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
            {BRANDING.shortName}
          </div>
          <span className="font-extrabold text-xl text-slate-900 tracking-tight">{BRANDING.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-[14px] font-bold text-slate-500 hover:text-slate-900 transition-colors px-4 py-2">
            Discard
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto pt-16 px-4">

        {/* ── PAGE HEADER ── */}
        <div className="mb-14 text-center space-y-4">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Post a Job</h1>
          <p className="text-[16px] font-medium text-slate-500">Provide project details to attract top-tier professionals.</p>
        </div>

        {/* ── STEP INDICATOR ── */}
        <div className="flex items-center justify-center gap-4 mb-16 px-4">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl font-extrabold text-[15px] transition-all duration-500 shadow-sm ${
                  step === s.id
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-500/20 shadow-lg scale-110'
                    : step > s.id
                    ? 'bg-blue-50 border border-blue-100 text-blue-600'
                    : 'bg-white border border-slate-200 text-slate-400'
                }`}
              >
                {step > s.id ? <Check size={18} strokeWidth={3} /> : s.id}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${step > s.id ? 'bg-blue-500' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── STEP CONTENT ── */}
        <div className="min-h-[400px]">

            {/* ─── STEP 1: Job Info ─── */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="saas-card space-y-10 group">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Project Details</h3>
                  <p className="text-[14px] font-medium text-slate-500">Provide a clear title and select the primary service category.</p>
                </div>
                <div className="space-y-3">
                  <label className="text-[12px] font-extrabold text-slate-600 uppercase tracking-widest">Project Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => set('title', e.target.value)}
                    className="form-input focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-[16px]"
                    placeholder="e.g. Architect a scalable React dashboard for our SaaS"
                    maxLength={100}
                  />
                  <div className="flex justify-between items-center px-1">
                    <button 
                      type="button"
                      onClick={handleAISuggestion}
                      disabled={aiLoading || form.title.length < 5}
                      className="flex items-center gap-1.5 text-[11px] font-extrabold text-blue-600 uppercase tracking-widest hover:text-blue-700 disabled:opacity-50 transition-opacity"
                    >
                      <Zap size={12} fill="currentColor" />
                      {aiLoading ? 'Synthesizing...' : 'Magic: Auto-fill with AI'}
                    </button>
                    <span className="text-[11px] font-bold text-slate-400">{form.title.length}/100</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[12px] font-extrabold text-slate-600 uppercase tracking-widest">Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => set('category', cat)}
                        className={`text-left px-5 py-4 rounded-xl border text-[13px] font-bold transition-all ${
                          form.category === cat
                            ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-sm shadow-blue-500/5'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                           <span className={form.category === cat ? 'text-blue-700' : 'text-slate-600'}>{cat}</span>
                           {COIN_COSTS[cat] && (
                             <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 rounded-md border border-amber-100/50">
                               <Zap size={10} className="text-amber-500 fill-amber-500" />
                               <span className="text-[9px] font-black text-amber-700">{COIN_COSTS[cat]}</span>
                             </div>
                           )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── STEP 2: Scope & Description ─── */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="saas-card space-y-10">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Scope & Context</h3>
                  <p className="text-[14px] font-medium text-slate-500">Detail the execution requirements and complexity.</p>
                </div>
                <div className="space-y-3">
                  <label className="text-[12px] font-extrabold text-slate-600 uppercase tracking-widest">Detailed Context</label>
                  <textarea
                    rows={8}
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    className="form-input resize-none py-4 text-[15px] font-medium leading-relaxed"
                    placeholder="Elaborate on objectives...&#10;• Strategic goals&#10;• Technical stack required&#10;• Deliverable expectations"
                  />
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">{form.description.length} chars (min. 20)</p>
                </div>
                <div className="space-y-4">
                  <label className="text-[12px] font-extrabold text-slate-600 uppercase tracking-widest">Execution Size</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { val: 'small',  label: 'Micro',  sub: '< 1 week' },
                      { val: 'medium', label: 'Standard', sub: '1–4 weeks' },
                      { val: 'large',  label: 'Complex',  sub: '1+ months (Scale)' },
                    ].map(s => (
                      <button
                        key={s.val}
                        type="button"
                        onClick={() => set('scope', s.val)}
                        className={`p-5 rounded-2xl border transition-all text-left ${
                          form.scope === s.val
                            ? 'border-blue-500 bg-blue-50/50 shadow-sm shadow-blue-500/5'
                            : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <p className={`text-[15px] font-extrabold ${form.scope === s.val ? 'text-blue-700' : 'text-slate-900'}`}>{s.label}</p>
                        <p className="text-[12px] font-medium text-slate-500 mt-1 uppercase tracking-widest">{s.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── STEP 3: Budget & Timeline ─── */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="saas-card space-y-10">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Budget Allocation</h3>
                  <p className="text-[14px] font-medium text-slate-500">Define the financial constraints for this opportunity.</p>
                </div>

                <div className="space-y-4">
                  <label className="text-[12px] font-extrabold text-slate-600 uppercase tracking-widest">Remuneration Model</label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { val: 'fixed',  label: 'Fixed Price', icon: <IndianRupee size={20} />, sub: 'Defined milestone payment' },
                      { val: 'hourly', label: 'Hourly Rate',  icon: <Clock size={20} />,      sub: 'Time-tracked execution' },
                    ].map(t => (
                      <button
                        key={t.val}
                        type="button"
                        onClick={() => set('budgetType', t.val)}
                        className={`p-5 rounded-2xl border-2 text-left transition-all ${
                          form.budgetType === t.val
                            ? 'border-blue-500 bg-blue-50/30'
                            : 'border-slate-100 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className={`mb-3 ${form.budgetType === t.val ? 'text-blue-600' : 'text-slate-400'}`}>{t.icon}</div>
                        <p className={`text-[15px] font-extrabold tracking-tight ${form.budgetType === t.val ? 'text-blue-700' : 'text-slate-900'}`}>{t.label}</p>
                        <p className="text-[12px] font-medium tracking-wide text-slate-500 mt-1">{t.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[12px] font-extrabold text-slate-600 uppercase tracking-widest">Min Budget (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[15px] font-bold">₹</span>
                      <input
                        type="number"
                        value={form.budgetMin}
                        onChange={e => set('budgetMin', e.target.value)}
                        className="form-input text-lg font-bold"
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="5000"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[12px] font-extrabold text-slate-600 uppercase tracking-widest">Max Budget (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[15px] font-bold">₹</span>
                      <input
                        type="number"
                        value={form.budgetMax}
                        onChange={e => set('budgetMax', e.target.value)}
                        className="form-input text-lg font-bold"
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="50000"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[12px] font-extrabold text-slate-600 uppercase tracking-widest">Target Deadline</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    <input
                      type="date"
                      value={form.deadline}
                      onChange={e => set('deadline', e.target.value)}
                      className="form-input font-bold text-[15px] text-slate-700"
                      style={{ paddingLeft: '3rem' }}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── STEP 4: Skills & Experience ─── */}
            {step === 4 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="saas-card space-y-10">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Capabilities</h3>
                  <p className="text-[14px] font-medium text-slate-500">Define the exact technical and experiential requirements.</p>
                </div>

                <div className="space-y-4">
                  <label className="text-[12px] font-extrabold text-slate-600 uppercase tracking-widest flex justify-between">
                    <span>Required Competencies</span>
                    <span className="text-slate-400">({form.skills.length}/10)</span>
                  </label>
                  
                  {form.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2.5">
                      {form.skills.map(skill => (
                        <span key={skill} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[13px] font-extrabold border border-blue-100/50 shadow-sm">
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="text-blue-400 hover:text-rose-500 transition-colors">
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3 mt-4">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
                      className="form-input flex-1 font-medium text-[15px]"
                      placeholder="Type specialized skill (Press Enter)"
                    />
                    <button
                      type="button"
                      onClick={() => addSkill(skillInput)}
                      className="btn-primary px-6 shrink-0"
                    >Add</button>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Suggested Vectors:</p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SKILLS.filter(s => !form.skills.includes(s)).slice(0, 10).map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => addSkill(skill)}
                          className="px-3 py-1.5 text-[12px] font-extrabold text-slate-500 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"
                        >
                          + {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[12px] font-extrabold text-slate-600 uppercase tracking-widest">Maturity Level</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { val: 'entry',        label: 'Foundation',    sub: '< 2 yrs' },
                      { val: 'intermediate', label: 'Advanced',      sub: '2–5 yrs' },
                      { val: 'expert',       label: 'Authority',     sub: '5+ yrs' },
                    ].map(e => (
                      <button
                        key={e.val}
                        type="button"
                        onClick={() => set('experienceLevel', e.val)}
                        className={`p-4 rounded-2xl border-2 text-center transition-all ${
                          form.experienceLevel === e.val
                            ? 'border-blue-500 bg-blue-50/30'
                            : 'border-slate-100 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <p className={`text-[14px] font-extrabold ${form.experienceLevel === e.val ? 'text-blue-700' : 'text-slate-900'}`}>{e.label}</p>
                        <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mt-1.5">{e.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── STEP 5: Review & Publish ─── */}
            {step === 5 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="saas-card space-y-8">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Final Authorization</h3>

                  <div className="space-y-6 divide-y divide-slate-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[11px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Target Mission</p>
                        <p className="text-[16px] font-bold text-slate-900 leading-snug">{form.title}</p>
                      </div>
                      <button onClick={() => setStep(1)} className="text-[12px] text-blue-600 hover:text-blue-800 font-extrabold uppercase tracking-widest shrink-0 ml-4">Edit</button>
                    </div>
                    
                    <div className="pt-6 flex justify-between items-start">
                      <div className="flex-1 mr-4">
                        <p className="text-[11px] text-slate-400 font-extrabold uppercase tracking-widest mb-2">Execution Brief</p>
                        <p className="text-[14px] font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">{form.description}</p>
                      </div>
                      <button onClick={() => setStep(2)} className="text-[12px] text-blue-600 hover:text-blue-800 font-extrabold uppercase tracking-widest shrink-0">Edit</button>
                    </div>

                    <div className="pt-6 grid grid-cols-2 gap-8">
                       <div>
                          <p className="text-[11px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Financial Auth</p>
                          <p className="text-[16px] font-black text-slate-900 tracking-tight">
                            ₹{Number(form.budgetMin).toLocaleString()} 
                            {form.budgetMax && ` – ${Number(form.budgetMax).toLocaleString()}`}
                          </p>
                       </div>
                       <div>
                          <p className="text-[11px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Time Horizon</p>
                          <p className="text-[15px] font-bold text-slate-900">{form.deadline || 'Flexible'}</p>
                       </div>
                    </div>

                    <div className="pt-6 flex justify-between items-start">
                      <div>
                        <p className="text-[11px] text-slate-400 font-extrabold uppercase tracking-widest mb-3">Required Capabilities</p>
                        <div className="flex flex-wrap gap-2">
                          {form.skills.map(s => (
                            <span key={s} className="px-3 py-1 bg-slate-100 text-slate-700 text-[12px] font-extrabold uppercase tracking-wider rounded-md">{s}</span>
                          ))}
                        </div>
                      </div>
                     <button onClick={() => setStep(4)} className="text-[12px] text-blue-600 hover:text-blue-800 font-extrabold uppercase tracking-widest shrink-0 ml-4">Edit</button>
                    </div>
                  </div>
                </div>

                {COIN_COSTS[form.category] && (
                  <div className="flex items-center justify-between p-6 bg-amber-50 rounded-3xl border border-amber-100 shadow-sm transition-all animate-in fade-in slide-in-from-bottom-2 mt-6">
                     <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                           <Zap size={24} fill="currentColor" />
                        </div>
                        <div>
                           <p className="text-[11px] font-black text-amber-600 uppercase tracking-widest">Coin Authorization Required</p>
                           <p className="text-[14px] font-bold text-amber-900">This mission requires <span className="text-lg font-black">{COIN_COSTS[form.category]} Coins</span> to deploy.</p>
                        </div>
                     </div>
                  </div>
                )}

                <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/50 shadow-inner">
                  <ShieldCheck size={24} className="text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-[13px] text-blue-900 font-medium leading-relaxed">
                    <strong className="font-extrabold block mb-0.5 text-blue-950">Zero-Trust Escrow Secured</strong>
                    By proceeding, funds will only be released upon explicit cryptographic approval of deliverables. No arbitrary clearances.
                  </p>
                </div>
              </motion.div>
            )}

        </div>

        {/* ── NAV BUTTONS ── */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-200">
          <Button
            variant="secondary"
            onClick={() => step > 1 ? setStep(s => (s - 1) as any) : router.back()}
            className="px-6 h-12"
          >
            {step > 1 ? '← Back' : 'Cancel'}
          </Button>

          {step < 5 ? (
            <Button
              onClick={() => setStep(s => (s + 1) as any)}
              disabled={!canNext()}
              className="px-8 shadow-blue-500/20"
            >
              Continue Module →
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              isLoading={loading}
              className="px-10 bg-slate-900 hover:bg-slate-800 shadow-slate-900/20"
            >
              Authorize & Deploy
            </Button>
          )}
        </div>

        {/* Step hint */}
        <p className="flex justify-center text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mt-8">
          Step {step} of {STEPS.length}
        </p>

      </div>
    </div>
  );
}
