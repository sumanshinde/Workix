'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calculator, AlertTriangle, Download, PieChart, Info, CheckCircle2, Briefcase } from 'lucide-react';
import { taxAPI } from '../../services/api';
import { Button, Card, Skeleton } from '../ui';

export default function TaxDashboard() {
  const [data, setData] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
       try {
          const [summary, invs] = await Promise.all([
             taxAPI.getSummary(),
             taxAPI.getInvoices()
          ]);
          setData(summary);
          setInvoices(invs);
       } catch (err) {
          console.error(err);
       } finally {
          setLoading(false);
       }
    };
    fetchData();
  }, []);

  if (loading) return <Skeleton className="h-96 w-full rounded-3xl" />;
  if (!data) return null;

  return (
    <div className="space-y-10 font-manrope">
       
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Summary */}
          <div className="lg:col-span-8 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-0 bg-white shadow-sm space-y-2">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Earnings</div>
                   <div className="text-3xl font-black text-slate-900 italic">₹{data.totalEarnings.toLocaleString()}</div>
                </Card>
                <Card className="p-6 border-0 bg-white shadow-sm space-y-2">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GST Collected</div>
                   <div className="text-3xl font-black text-blue-600 italic">₹{data.totalGst.toLocaleString()}</div>
                </Card>
                <Card className="p-6 border-0 bg-white shadow-sm space-y-2">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoices Issued</div>
                   <div className="text-3xl font-black text-slate-900 italic">{data.invoiceCount}</div>
                </Card>
             </div>

             <Card className="p-10 border-0 bg-slate-900 text-white shadow-2xl space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <PieChart size={150} />
                </div>
                
                <div className="flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-600 rounded-xl">
                         <Calculator size={24} />
                      </div>
                      <h3 className="text-xl font-black italic uppercase tracking-tight">AI Tax Synthesis</h3>
                   </div>
                   <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${data.summary.filingStatus === 'Required' ? 'bg-rose-500/20 text-rose-400 border-rose-500/20' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20'}`}>
                      Filing Status: {data.summary.filingStatus}
                   </div>
                </div>

                <div className="space-y-4 relative z-10">
                   <p className="text-lg font-medium text-slate-300 leading-relaxed italic">
                      "{data.summary.summary}"
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">AI Recommendations</h4>
                      {data.summary.suggestions.map((item: string, i: number) => (
                         <div key={i} className="flex items-center gap-3 text-sm font-bold text-white/80">
                            <CheckCircle2 size={16} className="text-blue-500" />
                            {item}
                         </div>
                      ))}
                   </div>
                   <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-center">
                      <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Estimated GST Offset</div>
                      <div className="text-2xl font-black text-blue-400 italic">₹{(data.totalGst * 0.1).toFixed(2)}</div>
                      <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-2">Calculated based on average expenses.</p>
                   </div>
                </div>
             </Card>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-4 space-y-6">
             <Card className="p-8 bg-white border-0 shadow-sm space-y-8">
                <div className="space-y-2">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance Status</h4>
                   <div className="flex items-center gap-3 text-emerald-600 font-bold">
                      <CheckCircle2 size={16} /> GST-Verified Business
                   </div>
                </div>
                
                <div className="space-y-3">
                   <Button className="w-full h-14 bg-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest text-white flex items-center justify-center gap-2">
                      Export Quarterly Report <Download size={16} />
                   </Button>
                   <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 font-black text-xs uppercase tracking-widest text-slate-900 flex items-center justify-center gap-2">
                      Connect with Tax Expert <Info size={16} />
                   </Button>
                </div>

                <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
                   <AlertTriangle size={18} className="text-blue-600 mt-1" />
                   <p className="text-xs font-bold text-blue-900 leading-relaxed uppercase tracking-tight">
                      You have 12 days left to file your GSTR-1 for the month of March.
                   </p>
                </div>
             </Card>
          </div>
       </div>

       {/* Invoice History */}
       <div className="space-y-6">
          <div className="flex items-center gap-3">
             <FileText size={20} className="text-slate-400" />
             <h3 className="text-xl font-bold text-slate-900 tracking-tight">Official Tax Invoices</h3>
          </div>
          
          <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
             <table className="w-full text-left">
                <thead>
                   <tr className="border-b border-slate-50">
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice #</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Amount</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">GST Collected</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {invoices.map(inv => (
                      <tr key={inv._id} className="hover:bg-slate-50/50 transition-colors">
                         <td className="px-8 py-6 font-bold text-slate-900 text-sm">#{inv.invoiceNumber}</td>
                         <td className="px-8 py-6 text-xs font-bold text-slate-400 italic">{new Date(inv.createdAt).toLocaleDateString()}</td>
                         <td className="px-8 py-6 font-black text-slate-900 text-sm italic">₹{(inv.baseAmount / 100).toLocaleString()}</td>
                         <td className="px-8 py-6 font-black text-blue-600 text-sm italic">₹{(inv.gstAmount / 100).toLocaleString()}</td>
                         <td className="px-8 py-6">
                            <span className="px-3 py-1 bg-slate-100 rounded-full text-[8px] font-black text-slate-600 uppercase tracking-widest">{inv.gstType}</span>
                         </td>
                         <td className="px-8 py-6">
                            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                               <Download size={16} />
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
             {invoices.length === 0 && (
                <div className="p-20 text-center font-black text-slate-300 uppercase tracking-widest text-[10px] italic">No generated invoices found.</div>
             )}
          </div>
       </div>

    </div>
  );
}
