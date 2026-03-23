'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Mail, Building2, MessageSquare, ChevronRight, 
  Search, Filter, Calendar, TrendingUp, CheckCircle2, UserPlus
} from 'lucide-react';
import { leadsAPI } from '../../../services/api';
import { Button, Card, Skeleton } from '../../../components/ui';

export default function CRMDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const fetchLeads = async () => {
    try {
      const res = await leadsAPI.getAll();
      setLeads(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await leadsAPI.updateStatus(id, status);
      fetchLeads();
    } catch (err) {
      alert('Update failed');
    }
  };

  const addNote = async (id: string) => {
    const text = prompt('Enter note:');
    if (!text) return;
    try {
      await leadsAPI.addNote(id, text);
      fetchLeads();
    } catch (err) {
      alert('Note failed');
    }
  };

  if (loading) return <div className="p-12 space-y-8"><Skeleton className="h-20 w-full rounded-2xl" /><Skeleton className="h-96 w-full rounded-3xl" /></div>;

  return (
    <div className="min-h-screen bg-slate-50/50 font-manrope">
       
       <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto space-y-12">
          
          <div className="flex items-center justify-between">
             <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest">
                   <Users size={16} /> Growth Ops
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Client CRM</h1>
             </div>
             <div className="flex gap-4">
                <Card className="px-6 py-4 bg-white border-0 shadow-sm text-center">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Velocity</div>
                   <div className="text-2xl font-black text-slate-900">+12%</div>
                </Card>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
             
             {/* LIST OF LEADS */}
             <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center gap-4 mb-8">
                   <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="text" placeholder="Search leads..." className="w-full h-14 pl-12 pr-6 bg-white border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-4 ring-blue-500/10 transition-all font-manrope" />
                   </div>
                   <Button variant="outline" className="h-14 px-6 rounded-2xl border-slate-100 bg-white font-black text-[10px] uppercase tracking-widest">
                      <Filter size={16} className="mr-2" /> Filters
                   </Button>
                </div>

                <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="border-b border-slate-50">
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Requirement</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {leads.map(lead => (
                            <tr key={lead._id} onClick={() => setSelectedLead(lead)} className={`group hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedLead?._id === lead._id ? 'bg-slate-50' : ''}`}>
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs">
                                        {lead.name[0]}
                                     </div>
                                     <div>
                                        <div className="text-sm font-bold text-slate-900 italic">{lead.name}</div>
                                        <div className="text-[10px] font-black text-slate-300 uppercase truncate max-w-[120px]">{lead.email}</div>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-6">
                                  <div className="text-xs font-medium text-slate-400 line-clamp-1 italic">"{lead.requirement}"</div>
                               </td>
                               <td className="px-8 py-6">
                                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${lead.status === 'converted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                     {lead.status}
                                  </span>
                               </td>
                               <td className="px-8 py-6 text-right">
                                  <button className="text-slate-200 group-hover:text-blue-600 transition-colors">
                                     <ChevronRight size={18} />
                                  </button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>

             {/* DETAIL PANEL */}
             <div className="lg:col-span-4 space-y-8">
                {selectedLead ? (
                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 sticky top-32">
                      <Card className="p-8 border-0 bg-white shadow-xl space-y-8 rounded-[3rem]">
                         <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">{selectedLead.name}</h3>
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                               <Building2 size={12} /> {selectedLead.company || 'Private Entity'}
                            </div>
                         </div>

                         <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Requirement</h4>
                            <p className="p-6 bg-slate-50 rounded-[2rem] text-sm font-medium text-slate-700 leading-relaxed italic border border-slate-100">
                               "{selectedLead.requirement}"
                            </p>
                         </div>

                         <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pipeline Control</h4>
                            <div className="grid grid-cols-2 gap-3">
                               {['contacted', 'qualified', 'converted', 'lost'].map(s => (
                                  <button key={s} onClick={() => updateStatus(selectedLead._id, s)} className={`px-4 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all ${selectedLead.status === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'}`}>
                                     {s}
                                  </button>
                               ))}
                            </div>
                         </div>

                         <div className="space-y-4">
                            <div className="flex items-center justify-between">
                               <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-2">
                                  <TrendingUp size={12} /> Managed Hiring
                               </h4>
                               {selectedLead.isManagedLead && (
                                  <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded">Active</span>
                               )}
                            </div>
                            <Button 
                               onClick={async () => {
                                  const freelancersRaw = await require('../../../services/api').gigAPI.getAll();
                                  const top3 = freelancersRaw.slice(0, 3).map((f: any) => ({
                                     userId: f.userId?._id,
                                     relevanceNote: 'Expert match based on enterprise requirement.',
                                     matchScore: 95
                                  }));
                                  const res = await require('../../../services/api').shortlistsAPI.create({
                                     leadId: selectedLead._id,
                                     freelancers: top3,
                                     notes: 'Hand-picked elite squad for your project.'
                                  });
                                  alert(`Shortlist Generated! Link: /shortlist/${res.shortlist._id}`);
                                  fetchLeads();
                               }}
                               className="w-full h-14 border-2 border-slate-900 text-slate-900 bg-white hover:bg-slate-900 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                            >
                               {selectedLead.isManagedLead ? 'Update Shortlist' : 'Generate Shortlist'}
                            </Button>
                         </div>

                         <div className="space-y-4 pt-6 border-t border-slate-50">
                            <div className="flex items-center justify-between">
                               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Notes</h4>
                               <button onClick={() => addNote(selectedLead._id)} className="text-blue-600 text-[10px] font-black uppercase tracking-widest">+ Add</button>
                            </div>
                            <div className="space-y-3">
                               {selectedLead.notes.length === 0 ? (
                                  <div className="text-[10px] font-bold text-slate-300 uppercase italic">No internal notes yet.</div>
                               ) : (
                                  selectedLead.notes.map((note: any, i: number) => (
                                     <div key={i} className="text-xs font-medium text-slate-600 italic leading-relaxed border-l-2 border-blue-100 pl-4">{note.text}</div>
                                  ))
                               )}
                            </div>
                         </div>
                         
                         <Button className="w-full h-14 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20">
                            Contact via WhatsApp
                         </Button>
                      </Card>
                   </motion.div>
                ) : (
                   <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-[3rem] text-slate-300 font-black uppercase text-[10px] tracking-widest italic">
                      Select a lead to visualize details.
                   </div>
                )}
             </div>

          </div>
       </div>

    </div>
  );
}
