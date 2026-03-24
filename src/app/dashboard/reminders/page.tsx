'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock, Bell, Calendar, AlertTriangle, CheckCircle2,
  Mail, MessageSquare, Smartphone, Settings, Sparkles,
  CreditCard, IndianRupee, Zap, ArrowUpRight,
} from 'lucide-react';

interface Reminder {
  id: string;
  title: string;
  description: string;
  type: 'renewal' | 'payment' | 'deadline';
  dueDate: string;
  daysLeft: number;
  amount?: number;
  status: 'upcoming' | 'urgent' | 'overdue';
}

const REMINDERS: Reminder[] = [
  { id: '1', title: 'Pro Subscription Renewal', description: 'Your Pro plan auto-renews on April 24', type: 'renewal', dueDate: 'Apr 24, 2026', daysLeft: 30, amount: 999, status: 'upcoming' },
  { id: '2', title: 'Payment Due: Alpha Systems', description: 'Milestone payment for Logo Design project', type: 'payment', dueDate: 'Mar 28, 2026', daysLeft: 4, amount: 15000, status: 'urgent' },
  { id: '3', title: 'Contract Deadline: Green Retail', description: 'Final deliverable due for UI redesign', type: 'deadline', dueDate: 'Mar 26, 2026', daysLeft: 2, status: 'urgent' },
  { id: '4', title: 'Ad Campaign Expires', description: 'Featured listing on marketplace ending', type: 'renewal', dueDate: 'Apr 5, 2026', daysLeft: 12, amount: 250, status: 'upcoming' },
  { id: '5', title: 'Overdue: CoinDesk Pro Payment', description: 'Payment was due yesterday', type: 'payment', dueDate: 'Mar 23, 2026', daysLeft: -1, amount: 2500, status: 'overdue' },
];

export default function RemindersPage() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [appNotif, setAppNotif] = useState(true);

  const urgent = REMINDERS.filter(r => r.status === 'urgent' || r.status === 'overdue').length;
  const upcoming = REMINDERS.filter(r => r.status === 'upcoming').length;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'upcoming': return { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Upcoming', accent: 'border-blue-200' };
      case 'urgent': return { bg: 'bg-amber-50', text: 'text-amber-600', label: 'Urgent', accent: 'border-amber-200' };
      case 'overdue': return { bg: 'bg-rose-50', text: 'text-rose-600', label: 'Overdue', accent: 'border-rose-200' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-600', label: status, accent: 'border-slate-200' };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'renewal': return <Sparkles size={16} />;
      case 'payment': return <IndianRupee size={16} />;
      case 'deadline': return <Clock size={16} />;
      default: return <Bell size={16} />;
    }
  };

  const ToggleSwitch = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <button
        onClick={onChange}
        className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
      >
        <div className={`w-4.5 h-4.5 w-[18px] h-[18px] bg-white rounded-full shadow-md absolute top-[3px] transition-all duration-200 ${checked ? 'left-[22px]' : 'left-[3px]'}`} />
      </button>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10">

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Active Reminders</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">Upcoming renewals, payment alerts, and deadlines</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-lg transition-all">
          <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center mb-3"><AlertTriangle size={18} className="text-rose-600" /></div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Urgent / Overdue</p>
          <h3 className="text-2xl font-extrabold text-slate-900">{urgent}</h3>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-lg transition-all">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3"><Calendar size={18} className="text-blue-600" /></div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Upcoming</p>
          <h3 className="text-2xl font-extrabold text-slate-900">{upcoming}</h3>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-lg transition-all">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-3"><CheckCircle2 size={18} className="text-emerald-600" /></div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Total Reminders</p>
          <h3 className="text-2xl font-extrabold text-slate-900">{REMINDERS.length}</h3>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Reminder Cards */}
        <div className="lg:col-span-8 space-y-4">
          {REMINDERS.sort((a, b) => a.daysLeft - b.daysLeft).map((reminder, i) => {
            const sc = getStatusConfig(reminder.status);
            return (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-white border-2 ${sc.accent} rounded-2xl p-5 hover:shadow-lg transition-all group`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 ${sc.bg} ${sc.text} rounded-xl flex items-center justify-center shrink-0`}>
                    {getTypeIcon(reminder.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{reminder.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{reminder.description}</p>
                      </div>
                      <span className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${sc.bg} ${sc.text}`}>
                        {sc.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 mt-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar size={12} /> {reminder.dueDate}
                      </div>
                      {reminder.amount && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <IndianRupee size={12} /> ₹{reminder.amount.toLocaleString()}
                        </div>
                      )}
                      <div className={`flex items-center gap-1.5 text-xs font-bold ${
                        reminder.daysLeft <= 0 ? 'text-rose-600' :
                        reminder.daysLeft <= 5 ? 'text-amber-600' :
                        'text-slate-500'
                      }`}>
                        <Clock size={12} />
                        {reminder.daysLeft <= 0 ? `${Math.abs(reminder.daysLeft)} day(s) overdue` :
                         reminder.daysLeft === 1 ? 'Tomorrow' :
                         `${reminder.daysLeft} days left`}
                      </div>
                    </div>

                    {/* Countdown bar */}
                    {reminder.daysLeft > 0 && (
                      <div className="mt-3 h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(5, 100 - (reminder.daysLeft * 3))}%` }}
                          transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }}
                          className={`h-full rounded-full ${
                            reminder.daysLeft <= 3 ? 'bg-rose-500' :
                            reminder.daysLeft <= 7 ? 'bg-amber-500' :
                            'bg-blue-500'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Notification Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Settings size={16} className="text-slate-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Reminder Channels</h3>
            </div>
            <div className="divide-y divide-slate-50">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">Email</span>
                </div>
                <button
                  onClick={() => setEmailNotif(!emailNotif)}
                  className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${emailNotif ? 'bg-blue-600' : 'bg-slate-200'}`}
                >
                  <div className={`w-[18px] h-[18px] bg-white rounded-full shadow-md absolute top-[3px] transition-all duration-200 ${emailNotif ? 'left-[22px]' : 'left-[3px]'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Smartphone size={16} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">SMS</span>
                </div>
                <button
                  onClick={() => setSmsNotif(!smsNotif)}
                  className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${smsNotif ? 'bg-blue-600' : 'bg-slate-200'}`}
                >
                  <div className={`w-[18px] h-[18px] bg-white rounded-full shadow-md absolute top-[3px] transition-all duration-200 ${smsNotif ? 'left-[22px]' : 'left-[3px]'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Bell size={16} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">App Push</span>
                </div>
                <button
                  onClick={() => setAppNotif(!appNotif)}
                  className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${appNotif ? 'bg-blue-600' : 'bg-slate-200'}`}
                >
                  <div className={`w-[18px] h-[18px] bg-white rounded-full shadow-md absolute top-[3px] transition-all duration-200 ${appNotif ? 'left-[22px]' : 'left-[3px]'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Tip */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={16} className="text-blue-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600">Pro Tip</h4>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Enable auto-renew on your subscriptions to never miss a payment. You can manage this from the
              <a href="/dashboard/subscriptions" className="text-blue-600 font-bold hover:underline ml-1">Subscriptions</a> page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
