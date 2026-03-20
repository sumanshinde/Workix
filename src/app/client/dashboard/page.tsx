'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, Users, Clock, CheckCircle2, 
  Plus, Search, Star, ArrowRight, TrendingUp,
  FileText, MessageSquare, Bell, Settings, LogOut,
  DollarSign, ChevronRight, Filter
} from 'lucide-react';
import { BRANDING } from '@/lib/config';

const MOCK_JOB_POSTS = [
  { id: '1', title: 'Senior React Developer for SaaS Dashboard', budget: 80000, proposals: 12, status: 'Active', category: 'Web Development', posted: '2 days ago' },
  { id: '2', title: 'UI/UX Designer for Mobile App Redesign', budget: 45000, proposals: 8, status: 'Active', category: 'Design', posted: '4 days ago' },
  { id: '3', title: 'Content Writer for Tech Blog (10 Articles)', budget: 15000, proposals: 23, status: 'Filled', category: 'Content', posted: '1 week ago' },
];

const MOCK_HIRED = [
  { name: 'Arjun Mehta', role: 'Full-Stack Developer', avatar: 'A', rating: 4.9, project: 'SaaS Dashboard', status: 'In Progress', due: 'Mar 25' },
  { name: 'Priya Sharma', role: 'UI/UX Designer', avatar: 'P', rating: 5.0, project: 'Mobile Redesign', status: 'Review', due: 'Mar 22' },
];

export default function ClientDashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    else setUser({ name: 'Demo Client', role: 'client' });
  }, []);

  const stats = [
    { label: 'Active Jobs', value: '2', icon: <Briefcase size={18} />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Hired', value: '8', icon: <Users size={18} />, color: 'bg-purple-50 text-purple-600' },
    { label: 'In Review', value: '1', icon: <Clock size={18} />, color: 'bg-amber-50 text-amber-600' },
    { label: 'Completed', value: '14', icon: <CheckCircle2 size={18} />, color: 'bg-green-50 text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb]">

      {/* ── TOP NAV ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {BRANDING.shortName}
            </div>
            <span className="font-bold text-gray-900 text-base tracking-tight">{BRANDING.name}</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="/client/dashboard" className="text-sm font-semibold text-blue-600">Dashboard</a>
            <a href="/post-job" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Post a Job</a>
            <a href="/marketplace" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Find Talent</a>
            <a href="/messages" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Messages</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative w-10 h-10-lg-400 hover:bg-gray-100 transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
          </button>
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
              {user?.name?.[0] || 'C'}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-900 leading-none">{user?.name || 'Client'}</p>
              <p className="text-xs text-gray-400 mt-0.5">Client Account</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-10">

        {/* ── PAGE HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Client Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your projects and hired freelancers</p>
          </div>
          <button
            onClick={() => router.push('/post-job')}
            className="btn-primary"
          >
            <Plus size={16} /> Post a New Job
          </button>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="saas-card p-5"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
                {s.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── MY JOB POSTS ── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">My Job Posts</h2>
              <button className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                View all <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {MOCK_JOB_POSTS.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="saas-card p-5 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/jobs/${job.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          job.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>{job.status}</span>
                        <span className="text-xs text-gray-400">{job.posted}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">{job.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Users size={11} /> {job.proposals} proposals</span>
                        <span className="flex items-center gap-1"><DollarSign size={11} /> ₹{job.budget.toLocaleString()}</span>
                        <span>{job.category}</span>
                      </div>
                    </div>
                    <button className="btn-secondary text-xs px-3 py-1.5 shrink-0">
                      View <ArrowRight size={12} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Post new job CTA */}
            <button
              onClick={() => router.push('/post-job')}
              className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-blue-300 hover:text-blue-600 transition-colors flex items-center justify-center gap-3"
            >
              <Plus size={16} /> Post another job
            </button>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="space-y-6">

            {/* Hired Freelancers */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Active Hires</h2>
                <button className="text-sm text-blue-600 font-medium hover:underline">View all</button>
              </div>
              <div className="space-y-3">
                {MOCK_HIRED.map((h, i) => (
                  <div key={i} className="saas-card p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                        {h.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{h.name}</p>
                        <p className="text-xs text-gray-400 truncate">{h.role}</p>
                      </div>
                      <div className="flex items-center gap-0.5 ml-auto shrink-0">
                        <Star size={11} fill="#F59E0B" className="text-amber-400" />
                        <span className="text-xs font-semibold text-gray-700">{h.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 truncate mr-2">{h.project}</span>
                      <span className={`font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        h.status === 'Review' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                      }`}>{h.status}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">Due {h.due}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="saas-card divide-y divide-gray-100">
                {[
                  { icon: <Search size={16} />, label: 'Browse freelancers', href: '/marketplace' },
                  { icon: <FileText size={16} />, label: 'My contracts', href: '/client/contracts' },
                  { icon: <MessageSquare size={16} />, label: 'Messages', href: '/messages' },
                  { icon: <TrendingUp size={16} />, label: 'Spending reports', href: '/client/reports' },
                  { icon: <Settings size={16} />, label: 'Account settings', href: '/dashboard/settings' },
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={() => router.push(item.href)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors first:rounded-t-xl last:rounded-b-xl"
                  >
                    <span className="text-gray-400">{item.icon}</span>
                    {item.label}
                    <ChevronRight size={14} className="ml-auto text-gray-300" />
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
