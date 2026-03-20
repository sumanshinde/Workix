'use client';
import Link from 'next/link';

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { 
  Activity, Users, LogIn, FileText, AlertTriangle,
  MessageSquare, CreditCard, Share2, AlertCircle, Clock
} from 'lucide-react';
import { adminAPI } from '@/services/api';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(true);

  useEffect(() => {
    fetchLogs();

    const socket = io(SOCKET_URL, {
      withCredentials: true,
    });

    socket.on('new_activity', (activity: any) => {
      if (live) {
         setLogs(prev => [activity, ...prev].slice(0, 100)); // Keep last 100
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [live]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getActivityLogs();
      if (res) setLogs(res);
    } catch (err) {
      console.error('Failed to fetch activity logs', err);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    const props = { size: 16, className: "text-gray-500" };
    switch (action) {
      case 'login': return <LogIn {...props} className="text-emerald-500" />;
      case 'signup': return <Users {...props} className="text-blue-500" />;
      case 'job_post': return <FileText {...props} className="text-purple-500" />;
      case 'message_sent': return <MessageSquare {...props} className="text-sky-500" />;
      case 'payment': return <CreditCard {...props} className="text-amber-500" />;
      case 'referral': return <Share2 {...props} className="text-rose-500" />;
      case 'fraud_alert': return <AlertTriangle {...props} className="text-red-600" />;
      case 'api_error': return <AlertCircle {...props} className="text-orange-500" />;
      default: return <Activity {...props} />;
    }
  };

  const formatActionName = (action: string) => {
    return action.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? 'Just now' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="p-8 lg:p-12 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Platform Live Activity</h1>
          <p className="text-gray-500 text-sm font-medium">Monitor user events and system actions in real-time.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-lg border text-sm font-bold flex items-center gap-2 transition-colors ${live ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
             <div className={`w-2 h-2 rounded-full ${live ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
             {live ? 'Live Stream Active' : 'Live Stream Paused'}
          </div>
          <button 
             onClick={() => setLive(!live)}
             className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
          >
             {live ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
           <h3 className="text-sm font-bold text-gray-900">Activity Event Log</h3>
           <p className="text-xs font-semibold text-gray-500">Showing last {logs.length} events</p>
        </div>
        
        {loading ? (
           <div className="p-10 text-center text-gray-500">Loading activity logs...</div>
        ) : logs.length === 0 ? (
           <div className="p-10 flex flex-col items-center justify-center text-gray-400 gap-3">
              <AlertCircle size={32} className="text-gray-300" />
              <p className="text-sm font-medium">No activity logs recorded yet.</p>
           </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-white text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                   <th className="px-6 py-4">Action</th>
                   <th className="px-6 py-4">User</th>
                   <th className="px-6 py-4">Details</th>
                   <th className="px-6 py-4 text-right">Time</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 text-sm">
                  {logs.map((log, idx) => (
                    <tr key={log._id || idx} className="hover:bg-gray-50 transition-colors group">
                       <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                                {getActionIcon(log.action)}
                             </div>
                             <span className="font-bold text-gray-900">{formatActionName(log.action)}</span>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          {log.userId ? (
                             <div>
                                <Link href={`/admin/users/${log.userId?._id}`} className="hover:underline">
                                  <p className="font-bold text-gray-900 text-sm">{log.userId?.name || 'Unknown User'}</p>
                                </Link>
                                <p className="text-xs text-gray-500 font-medium">{log.userId?.email || 'N/A'}</p>
                             </div>
                          ) : (
                             <span className="text-gray-400 font-medium italic">Guest / System</span>
                          )}
                       </td>
                       <td className="px-6 py-4 text-gray-600 font-medium max-w-md truncate">
                          {log.details ? JSON.stringify(log.details) : '—'}
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 text-gray-500 font-medium text-xs">
                             <Clock size={14} className="text-gray-400" />
                             {formatTime(log.createdAt || new Date().toISOString())}
                          </div>
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
