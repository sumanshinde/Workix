'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard, QrCode, Link2, Copy, CheckCircle2,
  Clock, AlertCircle, Search, Filter, Download,
  Smartphone, Building2, Wallet, ExternalLink,
  ArrowUpRight, DollarSign, IndianRupee, ChevronRight,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────
interface Transaction {
  id: string;
  name: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  date: string;
  method: string;
}

const TRANSACTIONS: Transaction[] = [
  { id: 'PAY-001', name: 'Alpha Systems', amount: 15000, status: 'paid', date: 'Today, 2:30 PM', method: 'UPI' },
  { id: 'PAY-002', name: 'Green Retail', amount: 8500, status: 'paid', date: 'Today, 11:20 AM', method: 'Card' },
  { id: 'PAY-003', name: 'Swift Apps', amount: 22000, status: 'pending', date: 'Yesterday', method: 'Bank' },
  { id: 'PAY-004', name: 'CoinDesk Pro', amount: 2500, status: 'paid', date: '2 days ago', method: 'UPI' },
  { id: 'PAY-005', name: 'Creator Studio', amount: 4500, status: 'failed', date: '3 days ago', method: 'Card' },
  { id: 'PAY-006', name: 'TechPrime', amount: 35000, status: 'paid', date: '4 days ago', method: 'Bank' },
];

export default function ReceivePaymentsPage() {
  const [filter, setFilter] = useState('All');
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | string>(1500);
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    const rawUser = localStorage.getItem('user');
    if (rawUser) {
      setUser(JSON.parse(rawUser));
    }
  }, []);

  const userNameSlug = user?.name ? user.name.toLowerCase().replace(/\s+/g, '-') : 'user';
  const paymentLink = `${typeof window !== 'undefined' ? window.location.origin : 'https://pay.gigindia.in'}/${userNameSlug}/${amount}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = () => {
    setLinkGenerated(true);
  };

  const totalReceived = TRANSACTIONS.filter(t => t.status === 'paid').reduce((s, t) => s + t.amount, 0);
  const pendingAmount = TRANSACTIONS.filter(t => t.status === 'pending').reduce((s, t) => s + t.amount, 0);

  const filtered = TRANSACTIONS.filter(t => filter === 'All' || t.status === filter.toLowerCase());

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10">

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Receive Payments</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">Accept payments via UPI, Card, or Bank Transfer</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Received', value: `₹${totalReceived.toLocaleString()}`, icon: <DollarSign size={18} className="text-emerald-600" />, bg: 'bg-emerald-50', change: '+₹15K today' },
          { label: 'Pending', value: `₹${pendingAmount.toLocaleString()}`, icon: <Clock size={18} className="text-amber-600" />, bg: 'bg-amber-50', change: '1 transaction' },
          { label: 'Payment Methods', value: '3 Active', icon: <CreditCard size={18} className="text-blue-600" />, bg: 'bg-blue-50', change: 'UPI, Card, Bank' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-lg transition-all"
          >
            <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center mb-3`}>{kpi.icon}</div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">{kpi.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-extrabold text-slate-900">{kpi.value}</h3>
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5"><ArrowUpRight size={10} /> {kpi.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Payment Methods + QR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Payment Methods */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-5">Payment Methods</h3>
            <div className="space-y-3">
              {[
                { id: 'upi', icon: <Smartphone size={20} />, label: 'UPI', desc: 'Google Pay, PhonePe, Paytm', color: 'text-violet-600', bg: 'bg-violet-50' },
                { id: 'card', icon: <CreditCard size={20} />, label: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay', color: 'text-blue-600', bg: 'bg-blue-50' },
                { id: 'bank', icon: <Building2 size={20} />, label: 'Bank Transfer', desc: 'NEFT, IMPS, RTGS', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                    selectedMethod === method.id
                      ? 'border-blue-200 bg-blue-50/50 shadow-sm'
                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-11 h-11 ${method.bg} ${method.color} rounded-xl flex items-center justify-center`}>
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">{method.label}</p>
                    <p className="text-xs text-slate-400">{method.desc}</p>
                  </div>
                  {selectedMethod === method.id && <CheckCircle2 size={18} className="text-blue-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Link */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Generate Payment Link</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-11 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Logo Design Payment"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-11 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                />
              </div>
              <button
                onClick={handleGenerate}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <Link2 size={16} /> Generate Payment Link
              </button>
              {linkGenerated && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between gap-2"
                >
                  <p className="text-xs font-medium text-emerald-700 truncate flex-1">{paymentLink}</p>
                  <button
                    onClick={handleCopy}
                    className="p-2 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors shrink-0"
                  >
                    {copied ? <CheckCircle2 size={14} className="text-emerald-600" /> : <Copy size={14} className="text-emerald-600" />}
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="lg:col-span-7">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />
            <div className="relative z-10">
              <h3 className="text-white font-bold text-lg mb-2">Scan & Pay</h3>
              <p className="text-slate-400 text-sm mb-8">Share this QR code with your clients for instant payments</p>

              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* QR Placeholder */}
                <div className="w-48 h-48 bg-white rounded-2xl p-4 flex items-center justify-center shadow-xl">
                  <div className="w-full h-full bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200">
                    <QrCode size={64} className="text-slate-300" />
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">UPI ID</p>
                    <p className="text-white font-bold text-sm">arjun@GigIndia</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Account</p>
                    <p className="text-white font-bold text-sm">HDFC •••• 4829</p>
                  </div>
                  <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white text-sm font-bold transition-colors flex items-center justify-center gap-2">
                    <Download size={16} /> Download QR
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History Mini */}
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden mt-6">
            <div className="p-5 flex items-center justify-between border-b border-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Transaction History</h3>
              <div className="flex items-center gap-2">
                {['All', 'Paid', 'Pending', 'Failed'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                      filter === f ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-50">
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3 text-right">Amount</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {filtered.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-slate-900">{tx.name}</p>
                        <p className="text-[10px] text-slate-400">{tx.method}</p>
                      </td>
                      <td className="px-5 py-3 text-right font-bold text-slate-900">₹{tx.amount.toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                          tx.status === 'paid' ? 'bg-emerald-50 text-emerald-600' :
                          tx.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                          'bg-rose-50 text-rose-600'
                        }`}>
                          {tx.status === 'paid' && <CheckCircle2 size={10} />}
                          {tx.status === 'pending' && <Clock size={10} />}
                          {tx.status === 'failed' && <AlertCircle size={10} />}
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-400">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
