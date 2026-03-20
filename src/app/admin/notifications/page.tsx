'use client';

import React, { useState } from 'react';
import { 
  Bell, Send, Mail, Smartphone, Globe, 
  Trash2, Eye, ShieldAlert, History, Users,
  Zap, Clock, MessageSquare
} from 'lucide-react';

const DUMMY_ANNOUNCEMENTS = [
  { id: '1', title: 'Platform Maintenance Schedule', type: 'System', audience: 'All Users', status: 'Sent', date: 'Oct 12, 10:30 AM' },
  { id: '2', title: 'New Fee Structure Update', type: 'Billing', audience: 'Freelancers', status: 'Scheduled', date: 'Dec 01, 09:00 AM' },
  { id: '3', title: 'Holiday Commission Discount', type: 'Marketing', audience: 'All Users', status: 'Draft', date: 'Dec 15, 04:00 PM' },
  { id: '4', title: 'Security System Upgrade', type: 'Security', audience: 'Clients', status: 'Sent', date: 'Aug 24, 11:20 AM' },
];

export default function AdminNotifications() {
  const [activeTab, setActiveTab] = useState('Compose');

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-[#111827]">Mass Notifications</h1>
          <p className="text-[#6b7280] text-sm font-medium">Create and manage system-wide announcements for your users.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Composition Hub */}
        <div className="xl:col-span-2 space-y-6">
           <div className="saas-card p-8">
              <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-8">
                 <h3 className="text-sm font-bold text-[#111827] flex items-center gap-3">
                    <Send size={20} className="text-blue-600" /> New Announcement
                 </h3>
                 <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100">
                    <button onClick={() => setActiveTab('Compose')} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'Compose' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Compose</button>
                    <button onClick={() => setActiveTab('Queue')} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'Queue' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Queue</button>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Subject / Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Scheduled System Maintenance" 
                      className="form-input"
                    />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-sm font-semibold text-gray-700">Target Audience</label>
                       <select className="w-full h-11 bg-white border border-gray-200 rounded-lg px-4 text-sm text-gray-700 font-medium focus:outline-none focus:border-blue-500 cursor-pointer">
                          <option>All Users</option>
                          <option>Freelancers Only</option>
                          <option>Clients Only</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-semibold text-gray-700">Priority Level</label>
                       <select className="w-full h-11 bg-white border border-gray-200 rounded-lg px-4 text-sm text-gray-700 font-medium focus:outline-none focus:border-blue-500 cursor-pointer">
                          <option>Low / Informational</option>
                          <option>Medium / Important</option>
                          <option>High / Urgent</option>
                       </select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Message Payload</label>
                    <textarea 
                      placeholder="Enter the full announcement details here..."
                      rows={6}
                      className="form-input py-3 resize-none h-auto min-h-[150px]"
                    />
                 </div>

                 <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-100 mt-6">
                    <div className="flex items-center gap-6">
                       <div className="flex items-center gap-3">
                          <input type="checkbox" id="email" className="w-4 h-4 text-blue-600 rounded cursor-pointer" defaultChecked />
                          <label htmlFor="email" className="text-xs font-semibold text-gray-600 cursor-pointer">Email Users</label>
                       </div>
                       <div className="flex items-center gap-3">
                          <input type="checkbox" id="push" className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                           <label htmlFor="push" className="text-xs font-semibold text-gray-600 cursor-pointer">In-App Notification</label>
                       </div>
                    </div>
                    <button className="btn-primary">
                       Send Announcement
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* History Log */}
        <div className="space-y-8">
           <div className="saas-card p-6">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-sm font-bold text-[#111827] flex items-center gap-3">
                    <History size={16} /> Recent History
                 </h3>
                 <button className="text-blue-600 text-xs font-semibold hover:underline">View All</button>
              </div>

              <div className="space-y-4">
                 {DUMMY_ANNOUNCEMENTS.map((note) => (
                    <div key={note.id} className="p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/10 transition-all cursor-pointer group">
                       <div className="flex justify-between items-start mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            note.status === 'Sent' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                            note.status === 'Scheduled' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                            'bg-gray-50 border-gray-100 text-gray-500'
                          }`}>
                            {note.status}
                          </span>
                          <span className="text-[10px] font-medium text-gray-400">{note.date}</span>
                       </div>
                       <h4 className="text-[#111827] font-bold text-sm tracking-tight mb-1 group-hover:text-blue-600 transition-colors uppercase">{note.title}</h4>
                       <div className="flex items-center gap-3 text-[10px] font-semibold text-gray-500">
                          <span className="flex items-center gap-1"><Users size={12} /> {note.audience}</span>
                          <span className="text-gray-300">•</span>
                          <span className="flex items-center gap-1">{note.type}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-3">
                 <div className="w-10 h-10-lg">
                    S
                 </div>
                 <div>
                    <h4 className="text-[#111827] font-bold text-sm">SMS Gateway</h4>
                    <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wide">99.9% Uptime</p>
                 </div>
              </div>
              <p className="text-[#6b7280] text-xs font-medium leading-relaxed mb-6">
                 Global SMS tier is active. High volumes expected during system maintenance.
              </p>
              <button className="w-full h-9 rounded-lg bg-white border border-blue-100 text-blue-600 text-xs font-semibold hover:bg-blue-600 hover:text-white transition-all">Configure Gateway</button>
           </div>
        </div>
      </div>
    </div>
  );
}
