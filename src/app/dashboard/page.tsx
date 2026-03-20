'use client';

import React, { useEffect, useState } from 'react';
import { 
  ChevronRight, TrendingUp, Wallet, 
  Briefcase, Clock, FileText, CheckCircle2,
  Bell, Search, Zap, ArrowUpRight, ArrowDownRight,
  Sparkles, ShieldCheck, PieChart, Target,
  Cpu, Activity
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { BRANDING } from '@/lib/config';
import Sidebar from '@/components/Sidebar';
import { Button, Card, Skeleton } from '@/components/ui';
import { dashboardAPI, analyticsAPI } from '@/services/api';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    const token = localStorage.getItem('token') || (session as any)?.backendToken;
    const rawUser = localStorage.getItem('user');
    const localUser = rawUser ? JSON.parse(rawUser) : null;
    const currentUser = session?.user || localUser;

    if (!currentUser || !token) {
      if (status === 'unauthenticated' && !localUser) {
        window.location.href = '/login';
      }
      return;
    }

    // Sync state
    if (!user) setUser(currentUser);
    if (!rawUser) localStorage.setItem('user', JSON.stringify(currentUser));
    if (!localStorage.getItem('token') && (session as any)?.backendToken) {
      localStorage.setItem('token', (session as any).backendToken);
    }

    // Prevent re-fetch if we have data
    if (data) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = (currentUser as any).role === 'client' 
          ? await dashboardAPI.client() 
          : await dashboardAPI.freelancer();
        setData(result);
      } catch (err: any) {
        console.error('[Dashboard] Fetch Error:', err);
        if (err.status === 401) {
          localStorage.clear();
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, data, session, status]);

  if (!user && !loading) return null;

  return (
    <div className="space-y-8 pb-10">
      
      {/* ── ONBOARDING / ACTIVATION ── */}
      {!loading && user?.role === 'freelancer' && (
        <Card className="p-8 border-blue-100 rounded-[32px] overflow-hidden relative">
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
               <h2 className="text-2xl font-semibold text-[#111827]">Complete your profile to get your first job</h2>
               <p className="text-sm text-gray-500 font-medium max-w-sm">Profiles with 100% completion receive <span className="text-blue-600 font-bold">5x more invitations</span>.</p>
               
               <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                     <span>Profile Sync Status</span>
                     <span className="text-blue-600">65%</span>
                  </div>
                  <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-600 w-[65%] rounded-full shadow-sm shadow-blue-500/20" />
                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
               <Button 
                 onClick={() => { analyticsAPI.track('activation_bio_click', 'profile'); router.push('/profile'); }}
                 className="bg-blue-600 text-white rounded-lg font-bold shadow-sm shadow-blue-500/20 hover:bg-blue-700 active:scale-95"
               >
                  Complete Profile
               </Button>
               <Button 
                 onClick={() => { analyticsAPI.track('activation_mission_click', 'profile'); router.push('/post-job'); }}
                 className="bg-white border border-blue-100 text-blue-600 rounded-lg font-bold hover:bg-blue-50 shadow-sm"
               >
                  Create Gig
               </Button>
            </div>
          </div>
        </Card>
      )}

      {/* 1. Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-1">
           {loading ? (
             <div className="space-y-2">
               <Skeleton width={200} height={32} />
               <Skeleton width={400} height={20} variant="text" />
             </div>
           ) : (
             <>
               <h1 className="text-3xl font-bold text-[#111827]">Welcome back, {user?.name.split(' ')[0]}</h1>
               <p className="text-base text-[#6b7280]">Here's what's happening with your projects today.</p>
             </>
           )}
        </div>

        <div className="flex items-center gap-4">
           {!loading && (
             <>
               <Button 
                 variant="outline"
                 onClick={() => router.push(user?.role === 'client' ? '/dashboard/proposals' : '/marketplace')} 
               >
                  {user?.role === 'client' ? 'View Proposals' : 'Find Jobs'}
               </Button>
               {user?.role === 'client' && (
                 <Button onClick={() => router.push('/post-job')} className="">
                    Post a Project
                 </Button>
               )}
             </>
           )}
        </div>
      </header>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <Skeleton key={i} height={160} />)
        ) : (
          <>
            <StatCard 
              label={user?.role === 'client' ? 'Active Projects' : 'Active Proposals'} 
              value={user?.role === 'client' ? data?.jobs?.length || 0 : data?.proposals?.length || 0} 
              trend="+12%" 
              color="blue" 
              icon={<Briefcase size={20} />} 
            />
            <StatCard 
              label="Total Earnings" 
              value="₹0" 
              trend="0%" 
              color="rose" 
              icon={<Wallet size={20} />} 
            />
            <StatCard 
              label="Success Score" 
              value={(data?.proposals?.length || data?.jobs?.length || 0) > 0 ? "100%" : "New"} 
              trend={(data?.proposals?.length || data?.jobs?.length || 0) > 0 ? "Elite" : "Welcome"} 
              color="emerald" 
              icon={<Zap size={20} />} 
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* 3. Projects Table */}
        <div className="xl:col-span-8 space-y-6">
            {loading ? (
              <Skeleton height={400} />
            ) : (
              <Card padding="none">
                <div className="py-4 border-b border-[#e5e7eb] flex items-center justify-between">
                    <h3 className="text-base font-semibold text-[#111827]">
                      {user?.role === 'client' ? 'Recent Job Posts' : 'Submitted Proposals'}
                    </h3>
                    <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/proposals')}>View All</Button>
                </div>
                <div className="divide-y divide-gray-50">
                    {user?.role === 'client' ? (
                      data?.jobs?.length > 0 ? data.jobs.slice(0, 5).map((job: any) => (
                        <ProjectRow key={job._id} title={job.title} client={`Status: ${job.status}`} status={job.category} progress={job.proposals?.length || 0} progressLabel="Proposals" />
                      )) : (
                        <div className="p-12 flex flex-col items-center justify-center space-y-4">
                           <div className="text-gray-500 text-sm font-medium">No active project posts yet.</div>
                           <Button onClick={() => router.push('/post-job')}>Post a Project</Button>
                        </div>
                      )
                    ) : (
                      data?.proposals?.length > 0 ? data.proposals.slice(0, 5).map((prop: any) => (
                        <ProjectRow key={prop._id} title={prop.jobId?.title} client={`Bid: ₹${prop.bidAmount}`} status={prop.status} progress={prop.deliveryDays} progressLabel="Days" />
                      )) : (
                        <div className="p-12 flex flex-col items-center justify-center space-y-4">
                           <div className="text-gray-500 text-sm font-medium">No submitted proposals yet.</div>
                           <Button onClick={() => router.push('/marketplace')}>Browse Jobs</Button>
                        </div>
                      )
                    )}
                </div>
              </Card>
            )}
        </div>

        {/* 4. Side Info */}
        <div className="xl:col-span-4 space-y-10">
            {loading ? (
              <Skeleton height={240} className="mb-10" />
            ) : (
              <Card className="mb-6">
                <h3 className="mb-6 text-base font-semibold text-[#111827]">Upcoming Deadlines</h3>
                <div className="space-y-4">
                    {data?.contracts?.length > 0 ? data.contracts.slice(0, 3).map((contract: any) => {
                      const date = new Date(contract.createdAt);
                      const day = date.getDate();
                      const month = date.toLocaleString('default', { month: 'short' });
                      return (
                        <DeadlineItem key={contract._id} date={`${day} ${month}`} title="Active Engagement" project={contract.jobId?.title || 'System Project'} />
                      );
                    }) : (
                      <div className="py-8 text-center text-[#6b7280] text-sm font-medium">No upcoming project deadlines.</div>
                    )}
                </div>
              </Card>
            )}

            <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-4 group cursor-pointer hover:bg-blue-100/50 transition-all">
               <div className="w-10 h-10-lg-600 shadow-sm">
                  <ShieldCheck size={20} />
               </div>
               <div className="flex-1">
                  <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Account Security</div>
                  <div className="text-sm font-bold text-blue-900">Verified Professional</div>
               </div>
               <ArrowUpRight size={16} className="text-blue-400 group-hover:text-blue-600 transition-colors" />
            </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, icon, color = 'blue' }: any) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  };
  
  return (
    <Card className="flex flex-col justify-between group p-6 h-full relative overflow-hidden transition-all hover:border-blue-200">
     <div className="space-y-6 relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colors[color]} shadow-sm`}>{icon}</div>
        <div className="space-y-1">
           <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</div>
           <div className="flex items-end gap-3">
              <h2 className="text-3xl font-bold text-[#111827]">{value}</h2>
              <span className="text-[10px] font-bold text-emerald-500 mb-1.5 flex items-center gap-0.5">
                 {trend} <TrendingUp size={10} />
              </span>
           </div>
        </div>
     </div>
     <div className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.03] text-blue-900 transition-transform group-hover:scale-110`}>
        {React.cloneElement(icon as React.ReactElement, { size: 96 })}
     </div>
    </Card>
  );
}

function ProjectRow({ title, client, status, progress, progressLabel = '%' }: any) {
  return (
    <div className="py-5 flex flex-col md:flex-row items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer group">
       <div className="flex-1 space-y-1">
          <h4 className="text-[15px] font-bold text-[#111827] group-hover:text-blue-600 transition-colors line-clamp-1">{title}</h4>
          <p className="text-xs font-medium text-[#6b7280]">{client}</p>
       </div>
       <div className="text-sm font-bold text-blue-600">
          {progress} {progressLabel}
       </div>
       <div className="md:w-32 flex justify-end">
          <span className={`text-[10px] font-bold px-3 py-1 rounded-md border uppercase tracking-wider ${
            status === 'Revision' || status === 'rejected' ? 'bg-rose-50 border-rose-100 text-rose-600' : 
            status === 'accepted' || status === 'completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
            'bg-blue-50 border-blue-100 text-blue-600'
          }`}>
             {status}
          </span>
       </div>
    </div>
  );
}

function DeadlineItem({ date, title, project }: any) {
  return (
    <div className="flex items-center gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
       <div className="w-12 rounded-lg border border-gray-100 bg-gray-50 flex flex-col items-center justify-center">
          <span className="text-[10px] font-semibold text-gray-500 uppercase">{date.split(' ')[1]}</span>
          <span className="text-sm font-bold text-gray-900">{date.split(' ')[0]}</span>
       </div>
       <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{title}</h4>
          <p className="text-xs text-gray-500 truncate">{project}</p>
       </div>
       <ChevronRight size={14} className="text-gray-300 transition-colors" />
    </div>
  );
}
