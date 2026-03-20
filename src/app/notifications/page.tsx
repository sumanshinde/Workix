'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, MessageSquare, Briefcase, 
  DollarSign, CheckCircle2, Clock, 
  ArrowRight, Search, Filter, Trash2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationsAPI } from '@/services/api';
import { Card, Button, Skeleton } from '@/components/ui';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    const userStored = localStorage.getItem('user');
    if (userStored) {
      const user = JSON.parse(userStored);
      import('@/services/socket').then(({ socketService }) => {
        socketService.connect(user.id || user._id);
        socketService.onNotification((notif) => {
          setNotifications(prev => [notif, ...prev]);
        });
      });
    }

    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationsAPI.getAll();
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      // Mock data for demo if API fails
      setNotifications([
        { 
          _id: '1', 
          type: 'message', 
          title: 'New Message from Priya', 
          message: 'Can you update the timeline for the project?', 
          createdAt: new Date().toISOString(), 
          read: false 
        },
        { 
          _id: '2', 
          type: 'payment', 
          title: 'Payment Received', 
          message: '₹12,000 has been credited to your escrow for "SaaS Dashboard".', 
          createdAt: new Date(Date.now() - 3600000).toISOString(), 
          read: false 
        },
        { 
          _id: '3', 
          type: 'job', 
          title: 'Proposal Accepted', 
          message: 'Your proposal for "Cloud Infrastructure Re-design" was accepted!', 
          createdAt: new Date(Date.now() - 86400000).toISOString(), 
          read: true 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare size={18} className="text-blue-500" />;
      case 'payment': return <DollarSign size={18} className="text-emerald-500" />;
      case 'job':     return <Briefcase size={18} className="text-purple-500" />;
      default:        return <Bell size={18} className="text-gray-500" />;
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-20">
      {/* Header Area */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10-lg-600">
               <Bell size={20} />
            </div>
            <h1 className="text-xl font-bold text-[#111827]">Notifications</h1>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={markAllRead}
               className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest"
             >
               Mark all as read
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto pt-10">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-8 bg-white p-1 rounded-xl border border-gray-100 w-fit">
           <button 
             onClick={() => setFilter('all')}
             className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'all' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
           >
             All Activity
           </button>
           <button 
             onClick={() => setFilter('unread')}
             className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'unread' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
           >
             Unread
             {notifications.filter(n => !n.read).length > 0 && (
               <span className="ml-2 bg-blue-500 text-white px-1.5 py-0.5 rounded-full text-[10px]">
                 {notifications.filter(n => !n.read).length}
               </span>
             )}
           </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="h-24 bg-white rounded-lg border border-gray-100 animate-pulse" />)
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-[32px] border border-gray-100 p-20 text-center space-y-4">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                  <Bell size={32} className="text-gray-300" />
               </div>
               <h3 className="text-xl font-bold text-gray-900">No notifications yet</h3>
               <p className="text-gray-400 max-w-xs mx-auto text-sm">We'll let you know when something important happens in your work clusters.</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={notif._id}
                className={`group bg-white p-6 rounded-2xl border transition-all hover:shadow-md cursor-pointer ${notif.read ? 'border-gray-50' : 'border-blue-100 shadow-sm bg-blue-50/10'}`}
              >
                <div className="flex gap-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${notif.read ? 'bg-gray-50' : 'bg-white shadow-sm'}`}>
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                       <h4 className={`font-bold text-sm truncate ${notif.read ? 'text-gray-900' : 'text-blue-900'}`}>
                         {notif.title}
                       </h4>
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap ml-4">
                         {new Date(notif.createdAt).toLocaleDateString()}
                       </span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                       {notif.message}
                    </p>
                    <div className="flex items-center gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                         View Details <ArrowRight size={12} />
                       </button>
                    </div>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Support Section */}
        <div className="mt-16 p-8 bg-blue-600 rounded-[32px] text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
           <div className="relative z-10 space-y-2 text-center md:text-left">
              <h3 className="text-xl font-bold">Need assistance?</h3>
              <p className="text-blue-100 text-sm">Our support commanders are ready to help you with any issues.</p>
           </div>
           <button 
             onClick={() => window.location.href = '/help'}
             className="relative z-10 py-3 bg-white text-blue-600 rounded-lg font-bold text-sm shadow-sm hover:bg-blue-50 transition-all active:scale-95"
           >
             Contact Support
           </button>
        </div>
      </div>
    </div>
  );
}
