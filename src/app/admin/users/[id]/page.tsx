'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Activity, ShieldAlert,
  Clock, LogIn, FileText, Share2, CreditCard,
  MessageSquare, UserX, ShieldCheck
} from 'lucide-react';
import { adminAPI } from '@/services/api';

export default function UserTimelinePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [logs, setLogs] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchTimeline();
  }, [id]);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const res: any = await adminAPI.getUserActivities(id);
      if (res) {
        setUser(res.user);
        setLogs(res.logs);
      }
    } catch (err) {
      console.error('Failed to fetch user timeline', err);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    const props = { size: 16, className: "text-gray-500" };
    switch (action) {
      case 'login': return <LogIn {...props} className="text-emerald-500" />;
      case 'signup': return <Activity {...props} className="text-blue-500" />;
      case 'job_post': return <FileText {...props} className="text-purple-500" />;
      case 'message_sent': return <MessageSquare {...props} className="text-sky-500" />;
      case 'payment': return <CreditCard {...props} className="text-amber-500" />;
      case 'referral': return <Share2 {...props} className="text-rose-500" />;
      case 'fraud_alert': return <ShieldAlert {...props} className="text-red-600" />;
      default: return <Activity {...props} />;
    }
  };

  const formatActionName = (action: string) => {
    return action.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? '' : d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  };

  if (loading) return <div className="p-10 text-gray-400 font-medium">Loading intelligence profile...</div>;
  if (!user) return <div className="p-10 text-gray-400 font-medium border border-gray-100 rounded-xl m-8">User profile not found in intelligence database.</div>;

  return (
    <div className="p-8 lg:p-12 space-y-8 max-w-5xl mx-auto">
      <button 
        onClick={() => router.back()}
        className="text-sm font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Directory
      </button>

      {/* Intelligence Card */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 lg:p-8 relative overflow-hidden">
        {user.isFlagged && (
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
        )}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-xl font-bold text-gray-400 uppercase">
               {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {user.name} 
                {user.isVerified ? <ShieldCheck size={20} className="text-emerald-500" /> : null}
              </h1>
              <p className="text-gray-500 font-medium">{user.email}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-widest">{user.role}</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest">ID: {user._id.slice(-6)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 md:text-right">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-sm ${user.isFlagged ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
              {user.isFlagged ? <UserX size={16} /> : <ShieldCheck size={16} />}
              {user.isFlagged ? 'Flagged Account' : 'Account Safe'}
            </div>
            <p className="text-sm font-bold text-gray-900">
               Risk Index Score: <span className={user.riskScore > 0 ? 'text-red-600' : 'text-emerald-600'}>{user.riskScore}/100</span>
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
           <h3 className="text-sm font-bold text-gray-900">Comprehensive Activity Timeline</h3>
        </div>
        
        {logs.length === 0 ? (
           <div className="p-10 text-center text-gray-400 font-medium">No activity recorded for this user.</div>
        ) : (
          <div className="p-6">
             <div className="relative border-l border-gray-100 ml-4 space-y-8">
               {logs.map((log, idx) => (
                 <div key={log._id || idx} className="relative pl-8 group">
                    <span className="absolute -left-4 top-1 w-8 h-8 rounded-full border-4 border-white bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                       {getActionIcon(log.action)}
                    </span>
                    <div className="space-y-1">
                       <div className="flex items-center justify-between">
                          <h4 className="font-bold text-gray-900 text-sm">{formatActionName(log.action)}</h4>
                          <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                            <Clock size={12} /> {formatTime(log.createdAt || new Date().toISOString())}
                          </span>
                       </div>
                       {log.details && (
                         <div className={`text-sm font-medium mt-1 p-3 rounded-lg border leading-relaxed ${log.action === 'fraud_alert' ? 'bg-red-50/50 border-red-100 text-red-800 font-mono text-xs' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
                            {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                         </div>
                       )}
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
