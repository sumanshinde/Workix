'use client';

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { 
  MessageSquare, User, Search, Filter, 
  Eye, CheckCircle2, ShieldAlert,
  Clock, ArrowRight
} from 'lucide-react';
import { adminAPI } from '@/services/api';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL || '';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(true);

  useEffect(() => {
    fetchMessages();

    // Setup global socket for monitoring
    const socket = io(SOCKET_URL, {
      withCredentials: true,
    });

    // In a real app we'd have a global broadcast for admin or intercept events
    socket.on('receive_msg', (msg: any) => {
      if (live) {
         setMessages(prev => [msg, ...prev].slice(0, 200)); // Keep last 200
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [live]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getMessages();
      if (res) setMessages(res);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? 'Just now' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-8 lg:p-12 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Message Monitoring</h1>
          <p className="text-gray-500 text-sm font-medium">Oversee global communications to prevent TOS violations and off-platform deals.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-white border border-gray-200 rounded-lg shadow-sm">
             <div className="relative border-r border-gray-200">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Query contents..." 
                  className="pl-9 pr-4 py-2 text-sm bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded-l-lg w-64 text-gray-900 font-medium"
                />
             </div>
             <button className="px-4 py-2 hover:bg-gray-50 text-gray-500 font-bold transition-colors flex items-center gap-2 text-sm">
                <Filter size={16} /> Filters
             </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
           <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-600" /> Chat Logs
           </h3>
           <div className={`px-3 py-1 rounded-md border text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 transition-colors ${live ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${live ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
              {live ? 'Live' : 'Paused'}
           </div>
        </div>
        
        {loading ? (
           <div className="p-10 text-center text-gray-500 font-medium">Decrypting message logs...</div>
        ) : messages.length === 0 ? (
           <div className="p-10 text-center text-gray-400 font-medium">No messages found on the platform yet.</div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left table-fixed">
               <thead>
                 <tr className="bg-white text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                   <th className="px-6 py-4 w-1/4">Sender</th>
                   <th className="px-6 py-4 w-1/2">Content</th>
                   <th className="px-6 py-4 w-1/4">Receiver</th>
                   <th className="px-6 py-4 w-24 text-right">Time</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 text-sm">
                  {messages.map((msg, idx) => (
                    <tr key={msg._id || idx} className="hover:bg-gray-50 transition-colors group">
                       <td className="px-6 py-4 truncate">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 font-bold text-xs uppercase">
                                {msg.senderId?.name ? msg.senderId.name.charAt(0) : 'S'}
                             </div>
                             <div className="truncate">
                                <p className="font-bold text-gray-900 text-sm truncate">{msg.senderId?.name || 'Unknown'}</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">{msg.senderId?.role || 'User'}</p>
                             </div>
                          </div>
                       </td>
                       
                       <td className="px-6 py-4 py-5 gap-3 relative">
                          <p className="text-gray-700 font-medium truncate pr-16 bg-transparent" title={msg.text}>
                             "{msg.text}"
                          </p>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="p-1.5 rounded bg-white border border-gray-200 text-gray-400 hover:text-emerald-500 transition-colors shadow-sm" title="Mark Safe">
                                <CheckCircle2 size={14} />
                             </button>
                             <button className="p-1.5 rounded bg-white border border-gray-200 text-gray-400 hover:text-rose-500 transition-colors shadow-sm" title="Flag Conversation">
                                <ShieldAlert size={14} />
                             </button>
                          </div>
                       </td>
                       
                       <td className="px-6 py-4 truncate">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 border border-gray-100 font-bold text-xs uppercase">
                                {msg.receiverId?.name ? msg.receiverId.name.charAt(0) : 'R'}
                             </div>
                             <div className="truncate">
                                <p className="font-bold text-gray-900 text-sm truncate">{msg.receiverId?.name || 'Unknown'}</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">{msg.receiverId?.role || 'User'}</p>
                             </div>
                          </div>
                       </td>

                       <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 text-gray-500 font-medium text-[11px]">
                             <Clock size={12} className="text-gray-400" />
                             {formatTime(msg.createdAt || new Date().toISOString())}
                          </div>
                          {!msg.read && <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />}
                       </td>
                    </tr>
                  ))}
               </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
}
