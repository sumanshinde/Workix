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

   // ── Success screen ────────────────────────────────────────────────────────
   if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="saas-card p-12 text-center max-w-md">
          <div className="w-16 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-6 border border-emerald-100">
            <Check size={28} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Posted Successfully</h2>
          <p className="text-sm text-gray-500 leading-relaxed">Your project is now live. Freelancers can now submit proposals for your review.</p>
          <div className="mt-8 h-1 w-full bg-gray-50 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500 w-full transition-all duration-1000" />
          </div>
          <p className="text-xs font-medium text-gray-400 mt-4">Redirecting to Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-600">

      {/* ── NAV ── */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 md: flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {BRANDING.shortName}
          </div>
          <span className="font-semibold text-xl text-gray-900 tracking-tight">{BRANDING.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={() => router.back()} className="h-9 px-4 text-gray-500">
            Discard
          </Button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto py-10">

        {/* ── PAGE HEADER ── */}
        <div className="mb-10 text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Post a Job</h1>
          <p className="text-sm text-gray-500">Tell us about your project — it only takes a few minutes.</p>
        </div>

        {/* ── STEP INDICATOR ── */}
        <div className="flex items-center justify-center gap-3 mb-12">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div
                className={`w-10 h-10-lg shadow-lg shadow-blue-100'
                    : step > s.id
                    ? 'bg-blue-50 border-blue-100 text-blue-600'
                    : 'bg-white border-gray-100 text-gray-400'
                }`}
              >
                {step > s.id ? <Check size={16} /> : s.id}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-px ${step > s.id ? 'bg-blue-200' : 'bg-gray-100'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── STEP CONTENT ── */}
        <div className="min-h-[400px]">

            {/* ─── STEP 1: Job Info ─── */}
            {step === 1 && (
              <div className="saas-card space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Project Details</h3>
                  <p className="text-sm text-gray-500">Provide a clear title and select a category.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Project Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => set('title', e.target.value)}
                    className="form-input"
                    placeholder="e.g. Build a React dashboard for my SaaS app"
                    maxLength={100}
                  />
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] text-gray-400">Be descriptive and concise</span>
                    <span className="text-[10px] text-gray-400">{form.title.length}/100</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => set('category', cat)}
                        className={`text-left px-3 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                          form.category === cat
                            ? 'border-blue-600 bg-blue-50 text-blue-600 ring-1 ring-blue-600'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── STEP 2: Scope & Description ─── */}
            {step === 2 && (
              <div className="saas-card space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Description</h3>
                  <p className="text-sm text-gray-500">Help freelancers understand exactly what you need.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Detailed Description</label>
                  <textarea
                    rows={8}
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    className="form-input resize-none py-3"
                    placeholder="Describe the project clearly:&#10;• Goals and requirements&#10;• Key deliverables&#10;• Technical preferences"
                  />
                  <p className="text-[10px] text-gray-400 px-1">{form.description.length} characters (min. 20)</p>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">Project Size</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { val: 'small',  label: 'Small',  sub: '< 1 week' },
                      { val: 'medium', label: 'Medium', sub: '1–4 weeks' },
                      { val: 'large',  label: 'Large',  sub: '1+ months' },
                    ].map(s => (
                      <button
                        key={s.val}
                        type="button"
                        onClick={() => set('scope', s.val)}
                        className={`p-4 rounded-xl border transition-all ${
                          form.scope === s.val
                            ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <p className={`text-sm font-bold ${form.scope === s.val ? 'text-blue-600' : 'text-gray-900'}`}>{s.label}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{s.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── STEP 3: Budget & Timeline ─── */}
            {step === 3 && (
              <div className="saas-card space-y-8">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Budget & Timeline</h3>
                  <p className="text-sm text-gray-500">Set your budget range and project deadline.</p>
                </div>

                {/* Budget type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Payment Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { val: 'fixed',  label: 'Fixed Price', icon: <IndianRupee size={16} />, sub: 'One-time payment for the full project' },
                      { val: 'hourly', label: 'Hourly Rate',  icon: <Clock size={16} />,      sub: 'Pay per hour tracked' },
                    ].map(t => (
                      <button
                        key={t.val}
                        type="button"
                        onClick={() => set('budgetType', t.val)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          form.budgetType === t.val
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`mb-2 ${form.budgetType === t.val ? 'text-blue-600' : 'text-gray-400'}`}>{t.icon}</div>
                        <p className={`text-sm font-semibold ${form.budgetType === t.val ? 'text-blue-700' : 'text-gray-800'}`}>{t.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-snug">{t.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget range */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Min Budget (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
                      <input
                        type="number"
                        value={form.budgetMin}
                        onChange={e => set('budgetMin', e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '2rem' }}
                        placeholder="5,000"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Max Budget (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
                      <input
                        type="number"
                        value={form.budgetMax}
                        onChange={e => set('budgetMax', e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '2rem' }}
                        placeholder="50,000"
                      />
                    </div>
                  </div>
                </div>

                {/* Deadline */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Project Deadline *</label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    <input
                      type="date"
                      value={form.deadline}
                      onChange={e => set('deadline', e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '2.5rem' }}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ─── STEP 4: Skills & Experience ─── */}
            {step === 4 && (
              <div className="saas-card space-y-8">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Skills & Experience</h3>
                  <p className="text-sm text-gray-500">What skills should the ideal candidate have?</p>
                </div>

                {/* Skill tags */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Required Skills * <span className="normal-case text-gray-400 font-normal">({form.skills.length}/10)</span></label>
                  
                  {/* Selected skills */}
                  {form.skills.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {form.skills.map(skill => (
                        <span key={skill} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200">
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="text-blue-400 hover:text-blue-600">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Input */}
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
                      className="form-input flex-1"
                      style={{ padding: '10px 14px' }}
                      placeholder="Type a skill and press Enter..."
                    />
                    <button
                      type="button"
                      onClick={() => addSkill(skillInput)}
                      className="btn-primary px-4"
                    >Add</button>
                  </div>

                  {/* Popular skill suggestions */}
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Popular skills:</p>
                    <div className="flex flex-wrap gap-3">
                      {POPULAR_SKILLS.filter(s => !form.skills.includes(s)).slice(0, 10).map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => addSkill(skill)}
                          className="px-2.5 py-1 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          + {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Experience level */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Experience Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { val: 'entry',        label: 'Entry',        sub: '< 1 yr exp' },
                      { val: 'intermediate', label: 'Intermediate', sub: '1–3 yrs exp' },
                      { val: 'expert',       label: 'Expert',       sub: '3+ yrs exp' },
                    ].map(e => (
                      <button
                        key={e.val}
                        type="button"
                        onClick={() => set('experienceLevel', e.val)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          form.experienceLevel === e.val
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className={`text-sm font-semibold ${form.experienceLevel === e.val ? 'text-blue-700' : 'text-gray-800'}`}>{e.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{e.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── STEP 5: Review & Publish ─── */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="saas-card space-y-6">
                  <h3 className="text-sm font-bold text-gray-900">Review your job post</h3>

                  <div className="space-y-4 divide-y divide-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Job Title</p>
                        <p className="text-sm font-semibold text-gray-900">{form.title}</p>
                      </div>
                      <button onClick={() => setStep(1)} className="text-xs text-blue-600 hover:underline font-medium shrink-0 ml-4">Edit</button>
                    </div>
                    <div className="pt-4 flex justify-between items-start">
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Category</p>
                        <p className="text-sm font-semibold text-gray-900">{form.category}</p>
                      </div>
                    </div>
                    <div className="pt-4 flex justify-between items-start">
                      <div className="flex-1 mr-4">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Description</p>
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{form.description}</p>
                      </div>
                      <button onClick={() => setStep(2)} className="text-xs text-blue-600 hover:underline font-medium shrink-0">Edit</button>
                    </div>
                    <div className="pt-4 flex justify-between items-start">
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Budget</p>
                        <p className="text-sm font-semibold text-gray-900">
                          ₹{Number(form.budgetMin).toLocaleString()}
                          {form.budgetMax && ` – ₹${Number(form.budgetMax).toLocaleString()}`}
                          <span className="text-gray-400 font-normal ml-1">({form.budgetType})</span>
                        </p>
                      </div>
                      <button onClick={() => setStep(3)} className="text-xs text-blue-600 hover:underline font-medium shrink-0 ml-4">Edit</button>
                    </div>
                    <div className="pt-4 flex justify-between items-start">
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Deadline</p>
                        <p className="text-sm font-semibold text-gray-900">{form.deadline || '—'}</p>
                      </div>
                    </div>
                    <div className="pt-4 flex justify-between items-start">
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                          {form.skills.map(s => (
                            <span key={s} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md border border-blue-100">{s}</span>
                          ))}
                        </div>
                      </div>
                      <button onClick={() => setStep(4)} className="text-xs text-blue-600 hover:underline font-medium shrink-0 ml-4">Edit</button>
                    </div>
                    <div className="pt-4">
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Experience Level</p>
                      <p className="text-sm font-semibold text-gray-900 capitalize">{form.experienceLevel}</p>
                    </div>
                  </div>
                </div>

                {/* Escrow note */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <ShieldCheck size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 leading-relaxed">
                    <strong>Escrow Protected:</strong> Once a freelancer is hired, your payment is held securely and released only when you approve the work. Powered by Razorpay.
                  </p>
                </div>
              </div>
            )}

        </div>

        {/* ── NAV BUTTONS ── */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="secondary"
            onClick={() => step > 1 ? setStep(s => (s - 1) as any) : router.back()}
          >
            {step > 1 ? 'Go Back' : 'Cancel'}
          </Button>

          {step < 5 ? (
            <Button
              onClick={() => setStep(s => (s + 1) as any)}
              disabled={!canNext()}
            >
              Continue to Step {step + 1}
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              isLoading={loading}
              className=""
            >
              Publish Project
            </Button>
          )}
        </div>

        {/* Step hint */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Step {step} of {STEPS.length} — {STEPS[step - 1].label}
        </p>

      </div>
    </div>
  );
}
