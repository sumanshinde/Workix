'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Upload, Save, CreditCard, Key, Shield,
  Globe, IndianRupee, Eye, EyeOff, Copy, CheckCircle2,
  FileText, Landmark, Smartphone, AlertCircle,
} from 'lucide-react';

export default function BusinessSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Business Profile', icon: <Building2 size={16} /> },
    { id: 'bank', label: 'Bank Details', icon: <Landmark size={16} /> },
    { id: 'gateway', label: 'Payment Gateway', icon: <CreditCard size={16} /> },
    { id: 'api', label: 'API Keys', icon: <Key size={16} /> },
  ];

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 pb-10">

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Business Settings</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">Manage your business profile, banking, and integrations</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>

        {/* Business Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 space-y-8">
            <h3 className="text-lg font-bold text-slate-900">Business Profile</h3>

            {/* Logo */}
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer group">
                <Upload size={24} className="group-hover:text-blue-500 transition-colors" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Company Logo</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, or SVG • Max 2MB</p>
                <button className="mt-2 text-xs font-bold text-blue-600 hover:underline">Upload Logo</button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Business Name</label>
                <input
                  type="text"
                  defaultValue="Arjun Mehra Designs"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-11 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Business Type</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-11 text-sm text-slate-900 outline-none focus:border-blue-500 transition-all font-medium">
                  <option>Individual / Freelancer</option>
                  <option>LLP</option>
                  <option>Private Limited</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">GSTIN</label>
                <input
                  type="text"
                  placeholder="e.g. 22AAAAA0000A1Z5"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-11 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">PAN Number</label>
                <input
                  type="text"
                  placeholder="e.g. AAAAA0000A"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-11 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Business Address</label>
                <textarea
                  placeholder="Street, City, State, Pincode"
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Website</label>
                <div className="relative">
                  <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    placeholder="https://example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 h-11 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Phone</label>
                <div className="relative">
                  <Smartphone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    defaultValue="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 h-11 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Bank Details */}
        {activeTab === 'bank' && (
          <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 space-y-8">
            <h3 className="text-lg font-bold text-slate-900">Bank Account Details</h3>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
              <Shield size={18} className="text-blue-600 mt-0.5 shrink-0" />
              <p className="text-sm text-blue-700">Your bank details are encrypted and securely stored. We use AES-256 encryption to protect your financial data.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Account Holder Name</label>
                <input type="text" defaultValue="Arjun Mehra" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-11 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Bank Name</label>
                <input type="text" defaultValue="HDFC Bank" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-11 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Account Number</label>
                <input type="text" defaultValue="•••• •••• •••• 4829" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-11 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">IFSC Code</label>
                <input type="text" defaultValue="HDFC0001234" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-11 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">UPI ID</label>
                <input type="text" defaultValue="arjun@hdfc" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-11 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Account Type</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-11 text-sm text-slate-900 outline-none focus:border-blue-500 transition-all font-medium">
                  <option>Savings Account</option>
                  <option>Current Account</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20">
                <Save size={16} /> Update Bank Details
              </button>
            </div>
          </div>
        )}

        {/* Payment Gateway */}
        {activeTab === 'gateway' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Razorpay', desc: 'Primary payment gateway', status: 'Connected', color: 'emerald', icon: <IndianRupee size={20} /> },
                { name: 'Stripe', desc: 'International payments', status: 'Not Connected', color: 'slate', icon: <CreditCard size={20} /> },
              ].map(gw => (
                <div key={gw.name} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                      {gw.icon}
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      gw.status === 'Connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                    }`}>
                      {gw.status === 'Connected' && <CheckCircle2 size={10} />}
                      {gw.status}
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">{gw.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 mb-4">{gw.desc}</p>
                  <button className={`w-full py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    gw.status === 'Connected'
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
                  }`}>
                    {gw.status === 'Connected' ? 'Configure' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-slate-900 mb-4">Webhook URL</h4>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  readOnly
                  value="https://api.GigIndia.in/webhooks/razorpay"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 h-11 text-sm text-slate-600 outline-none font-mono"
                />
                <button
                  onClick={() => handleCopy('webhook', 'https://api.GigIndia.in/webhooks/razorpay')}
                  className="p-3 bg-slate-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 text-slate-500 transition-colors"
                >
                  {copied === 'webhook' ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* API Keys */}
        {activeTab === 'api' && (
          <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">API Keys</h3>
              <button className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-colors">
                Generate New Key
              </button>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-600 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-700">Keep your API keys secure. Never share them in client-side code or public repositories.</p>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Publishable Key (Test)', key: 'pk_test_aBcDeFgHiJkLmNoPqRsT', env: 'test', platform: 'Razorpay' },
                { label: 'Secret Key (Test)', key: 'sk_test_xYzAbCdEfGhIjKlMnOpQ', env: 'test', secret: true, platform: 'Razorpay' },
                { label: 'Publishable Key (Live)', key: 'pk_live_1234567890abcdefghij', env: 'live', platform: 'Razorpay' },
                { label: 'Secret Key (Live)', key: 'sk_live_abcdefghij1234567890', env: 'live', secret: true, platform: 'Razorpay' },
                { label: 'Google Maps API Key', key: 'AIzaSyTestKey1234567890abcdefghijklm', env: 'live', secret: true, platform: 'Maps' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-bold text-slate-700">{item.label}</p>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        item.env === 'live' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-500'
                      }`}>{item.env}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-50 text-blue-600">{item.platform}</span>
                    </div>
                    <p className="text-sm font-mono text-slate-500 truncate">
                      {item.secret && !showKey ? '•'.repeat(32) : item.key}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {item.secret && (
                      <button onClick={() => setShowKey(!showKey)} className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-slate-700 transition-colors">
                        {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    )}
                    <button
                      onClick={() => handleCopy(item.label, item.key)}
                      className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      {copied === item.label ? <CheckCircle2 size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
