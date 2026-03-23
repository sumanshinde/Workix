'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Check, Mail, Zap, CreditCard, AlertCircle, TrendingUp, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationsAPI } from '@/services/api';
import { Button, Card } from '@/components/ui';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const data = await notificationsAPI.getAll();
      setNotifications(data);
      setUnreadCount(data.filter((n: any) => !n.isRead).length);
    } catch (err) {
      console.error('Notes fetch failed', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // In production, we'd listen for 'new_notification' via Socket.io here
  }, []);

  const markRead = async (id: string) => {
    try {
      await notificationsAPI.markRead(id);
      fetchNotifications();
    } catch (err) {
      alert('Failed to mark read');
    }
  };

  const markAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      fetchNotifications();
    } catch (err) {
      alert('Failed to mark all read');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':     return <CreditCard size={14} className="text-emerald-500" />;
      case 'job_match':   return <Zap size={14} className="text-blue-500" />;
      case 'profile_view': return <TrendingUp size={14} className="text-rose-500" />;
      case 'dispute':     return <AlertCircle size={14} className="text-orange-500" />;
      case 'message':     return <Mail size={14} className="text-slate-500" />;
      default:            return <Info size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 hover:-translate-y-0.5 transition-all text-slate-400 hover:text-slate-900 group"
      >
        <Bell size={20} className="group-hover:rotate-12 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-rose-600 rounded-full border-2 border-white text-[8px] font-black text-white flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-4 w-[380px] bg-white rounded-[2rem] shadow-2xl border border-slate-50 z-50 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Notification Orbit</h4>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                    <Check size={10} /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-16 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-3xl mx-auto flex items-center justify-center text-slate-300">
                      <Bell size={24} />
                    </div>
                    <p className="text-[10px] font-black text-slate-300 uppercase italic">Your orbit is clear.</p>
                  </div>
                ) : (
                  notifications.map((note) => (
                    <div 
                      key={note._id}
                      onClick={() => markRead(note._id)}
                      className={`p-6 border-b border-slate-50 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer relative ${!note.isRead ? 'bg-blue-50/20' : ''}`}
                    >
                      {!note.isRead && <div className="absolute left-0 top-6 bottom-6 w-1 bg-blue-600 rounded-r-full" />}
                      <div className="pt-1">{getTypeIcon(note.type)}</div>
                      <div className="space-y-1">
                        <div className="text-[11px] font-black text-slate-900 uppercase italic">{note.title}</div>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed italic">{note.message}</p>
                        <div className="text-[8px] font-bold text-slate-300 uppercase pt-2">
                          {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 bg-white border-t border-slate-50 text-center">
                 <Button variant="ghost" className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600">
                    View Full Insight Center
                 </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
