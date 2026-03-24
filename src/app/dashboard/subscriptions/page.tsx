'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, CheckCircle2, Crown, Zap, Star,
  Clock, Calendar, ArrowUpRight, Shield, X,
} from 'lucide-react';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    period: 'Forever free',
    desc: 'Get started with essential tools',
    features: ['5 proposals/month', 'Basic profile', 'Community support', 'Standard visibility'],
    icon: <Star size={20} />,
    color: 'from-slate-500 to-slate-600',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 999,
    period: '/month',
    desc: 'Everything you need to scale',
    features: ['Unlimited proposals', 'Boosted profile', 'Priority support', 'Featured badge', 'Analytics dashboard', 'Custom invoice branding'],
    icon: <Zap size={20} />,
    color: 'from-blue-600 to-indigo-600',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 2499,
    period: '/month',
    desc: 'For power users and agencies',
    features: ['Everything in Pro', 'Dedicated manager', 'API access', 'White-label tools', 'Priority matching', 'Team workspace', 'SLA guarantee'],
    icon: <Crown size={20} />,
    color: 'from-amber-500 to-orange-500',
    popular: false,
  },
];

export default function SubscriptionManagementPage() {
  const [activePlan, setActivePlan] = useState('pro');
  const [autoRenew, setAutoRenew] = useState(true);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10">

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Subscriptions</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">Manage your plan, billing, and features</p>
      </div>

      {/* Active Plan Summary */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-[60px]" />
        <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/5 rounded-full blur-[40px]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Zap size={16} className="text-white fill-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Active Plan</span>
            </div>
            <h2 className="text-3xl font-extrabold">Pro Membership</h2>
            <p className="text-blue-200 text-sm font-medium">All premium features • Priority support • Analytics</p>
          </div>
          <div className="space-y-3 text-right">
            <div>
              <span className="text-4xl font-extrabold">₹999</span>
              <span className="text-blue-200 font-medium">/mo</span>
            </div>
            <div className="flex items-center gap-2 justify-end text-sm">
              <Calendar size={14} className="text-blue-200" />
              <span className="text-blue-100 font-medium">Renews on <strong>April 24, 2026</strong></span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Auto Renew Toggle */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <Shield size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Auto-Renew</p>
            <p className="text-xs text-slate-400">Automatically renew your subscription each billing cycle</p>
          </div>
        </div>
        <button
          onClick={() => setAutoRenew(!autoRenew)}
          className={`w-12 h-7 rounded-full transition-colors duration-200 relative ${autoRenew ? 'bg-blue-600' : 'bg-slate-200'}`}
        >
          <div className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-1 transition-all duration-200 ${autoRenew ? 'left-6' : 'left-1'}`} />
        </button>
      </div>

      {/* Plans Grid */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-5">Choose Your Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const isActive = plan.id === activePlan;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-white rounded-2xl border-2 p-6 transition-all hover:shadow-lg ${
                  isActive ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-slate-100'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-blue-500/20">
                    Most Popular
                  </span>
                )}

                {/* Plan Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white mb-4`}>
                  {plan.icon}
                </div>

                {/* Plan Name & Price */}
                <h4 className="text-lg font-bold text-slate-900 mb-1">{plan.name}</h4>
                <p className="text-xs text-slate-400 mb-4">{plan.desc}</p>
                <div className="mb-6">
                  {plan.price === 0 ? (
                    <span className="text-3xl font-extrabold text-slate-900">Free</span>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900">₹{plan.price.toLocaleString()}</span>
                      <span className="text-sm text-slate-400">{plan.period}</span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle2 size={14} className={isActive ? 'text-blue-600' : 'text-emerald-500'} />
                      <span className="text-sm text-slate-600">{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                {isActive ? (
                  <div className="space-y-2">
                    <div className="w-full py-3 bg-blue-50 text-blue-700 text-center rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} /> Current Plan
                    </div>
                    <button
                      onClick={() => setShowConfirm('cancel')}
                      className="w-full py-2 text-center text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      Cancel Subscription
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setActivePlan(plan.id)}
                    className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                      plan.id === 'premium'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-xl'
                        : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10'
                    }`}
                  >
                    {plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Cancel Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Cancel Subscription?</h3>
              <button onClick={() => setShowConfirm(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              Your Pro benefits will remain active until the end of your current billing period (April 24, 2026). After that, you'll be downgraded to the Basic plan.
            </p>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowConfirm(null)} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                Keep Plan
              </button>
              <button onClick={() => { setActivePlan('basic'); setShowConfirm(null); }} className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 transition-colors">
                Cancel Plan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
