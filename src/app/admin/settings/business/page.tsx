'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, IndianRupee, Megaphone, Save, Loader2, CheckCircle2, Globe, CreditCard, Zap, Map, ShieldCheck } from 'lucide-react';
import { BRANDING } from '@/lib/config';
import { platformAPI } from '@/services/api';

export default function AdminBusinessSettings() {
  const t = BRANDING.theme;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<any>({
    requirementPostFee: 500,
    freelancerEarnFixed: 900,
    platformMarginPaise: 400,
    adPricing: {
      post: { perDay: 1000, minDays: 1, maxDays: 30 },
      image: { perDay: 2500, minDays: 1, maxDays: 30 },
      category: { perDay: 5000, minDays: 3, maxDays: 90 },
    },
    thirdParty: {
      mapProvider: 'google',
      mapApiKey: '',
      paymentGateway: 'razorpay',
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await platformAPI.getSettings();
      if (data) setSettings(data);
    } catch {}
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await platformAPI.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
    setSaving(false);
  };

  const updateNested = (path: string, value: any) => {
    const keys = path.split('.');
    const newSettings = { ...settings };
    let current: any = newSettings;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setSettings(newSettings);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={32} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Business Settings</h1>
          <p className="text-sm text-slate-400">Configure platform pricing, ads, and third-party integrations</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-60"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pay-as-you-go Pricing */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-blue-500/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <IndianRupee size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Marketplace Pricing</h3>
              <p className="text-xs text-slate-400">Pay-as-you-go model</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Requirement Post Fee (paise)</label>
              <input
                type="number"
                value={settings.requirementPostFee}
                onChange={(e) => setSettings({ ...settings, requirementPostFee: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 font-medium focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <p className="text-xs text-slate-400 mt-1">₹{(settings.requirementPostFee / 100).toFixed(2)} per post</p>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Freelancer Earn Per Lead (paise)</label>
              <input
                type="number"
                value={settings.freelancerEarnFixed}
                onChange={(e) => setSettings({ ...settings, freelancerEarnFixed: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 font-medium focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <p className="text-xs text-slate-400 mt-1">₹{(settings.freelancerEarnFixed / 100).toFixed(2)} per lead</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <p className="text-sm font-bold text-emerald-700">
                Platform Margin: ₹{((settings.freelancerEarnFixed - settings.requirementPostFee) / 100).toFixed(2)} per transaction
              </p>
            </div>
          </div>
        </motion.div>

        {/* Ad Pricing */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-purple-500/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Megaphone size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Ad Pricing</h3>
              <p className="text-xs text-slate-400">Per-day rates by ad type (in paise)</p>
            </div>
          </div>

          <div className="space-y-4">
            {(['post', 'image', 'category'] as const).map(type => (
              <div key={type} className="p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block capitalize">{type} Ad — Per Day</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <input
                      type="number"
                      value={settings.adPricing?.[type]?.perDay || 0}
                      onChange={(e) => updateNested(`adPricing.${type}.perDay`, Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-400"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">₹/day (paise)</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={settings.adPricing?.[type]?.minDays || 1}
                      onChange={(e) => updateNested(`adPricing.${type}.minDays`, Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-400"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Min days</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={settings.adPricing?.[type]?.maxDays || 30}
                      onChange={(e) => updateNested(`adPricing.${type}.maxDays`, Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-400"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Max days</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Third Party Config */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-slate-100 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Globe size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Third-Party Integrations</h3>
              <p className="text-xs text-slate-400">Map and payment gateway config</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Map Provider</label>
              <select
                value={settings.thirdParty?.mapProvider || 'google'}
                onChange={(e) => updateNested('thirdParty.mapProvider', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 font-medium focus:outline-none focus:border-blue-400"
              >
                <option value="google">Google Maps</option>
                <option value="mapbox">Mapbox</option>
                <option value="openstreetmap">OpenStreetMap</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Map API Key</label>
              <input
                type="password"
                value={settings.thirdParty?.mapApiKey || ''}
                onChange={(e) => updateNested('thirdParty.mapApiKey', e.target.value)}
                placeholder="Enter API key"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 font-medium focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Payment Gateway</label>
              <select
                value={settings.thirdParty?.paymentGateway || 'razorpay'}
                onChange={(e) => updateNested('thirdParty.paymentGateway', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 font-medium focus:outline-none focus:border-blue-400"
              >
                <option value="razorpay">Razorpay</option>
                <option value="stripe">Stripe</option>
                <option value="paytm">Paytm</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Quick Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl border border-slate-100 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Business Model Summary</h3>
              <p className="text-xs text-slate-400">Current revenue model overview</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: 'User posts requirement', value: `₹${(settings.requirementPostFee / 100).toFixed(0)}`, icon: '📝' },
              { label: 'Freelancer earns per lead', value: `₹${(settings.freelancerEarnFixed / 100).toFixed(0)}`, icon: '💰' },
              { label: 'Platform margin', value: `₹${((settings.freelancerEarnFixed - settings.requirementPostFee) / 100).toFixed(0)}`, icon: '📊' },
              { label: 'Text ad per day', value: `₹${((settings.adPricing?.post?.perDay || 0) / 100).toFixed(0)}`, icon: '📢' },
              { label: 'Image ad per day', value: `₹${((settings.adPricing?.image?.perDay || 0) / 100).toFixed(0)}`, icon: '🖼️' },
              { label: 'Category boost per day', value: `₹${((settings.adPricing?.category?.perDay || 0) / 100).toFixed(0)}`, icon: '🚀' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <span>{item.icon}</span> {item.label}
                </span>
                <span className="font-bold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
