'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle2, XCircle, Search, 
  ChevronRight, MessageSquare, DollarSign,
  Clock, User, ShieldCheck, Zap, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { proposalsAPI, contractsAPI } from '@/services/api';
import { Card, Button, Skeleton } from '@/components/ui';
import { useRouter } from 'next/navigation';

export default function ProposalsDashboard() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(storedUser);
        const data = await proposalsAPI.getMy();
        setProposals(data);
      } catch (err) {
        console.error('Failed to fetch proposals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, []);

  const handleCreateContract = async (proposal: any) => {
    try {
      await contractsAPI.create({
        jobId: proposal.jobId._id,
        proposalId: proposal._id,
        freelancerId: proposal.freelancerId._id,
        amount: proposal.bidAmount
      });
      router.push('/dashboard/contracts');
    } catch (err) {
      console.error('Hiring failed:', err);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await proposalsAPI.updateStatus(id, status);
      setProposals(prev => prev.map(p => p._id === id ? { ...p, status } : p));
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-[#111827]">Proposals & Applications</h1>
            <p className="text-base text-[#6b7280]">Track submitted bids and incoming job applications.</p>
          </div>
        </header>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
          </div>
        ) : proposals.length === 0 ? (
          <Card className="py-24 flex flex-col items-center text-center space-y-4">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                <FileText size={32} />
             </div>
             <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900">No proposals found</h3>
                <p className="text-gray-500">You haven&apos;t submitted or received any job proposals yet.</p>
             </div>
             <Button onClick={() => router.push('/marketplace')}>Explore Jobs</Button>
          </Card>
        ) : (
          <div className="space-y-6">
             {proposals.map((proposal, index) => (
                <ProposalItem 
                  key={proposal._id} 
                  proposal={proposal} 
                  isClient={user?.role === 'client'}
                  onHire={() => handleCreateContract(proposal)}
                  onUpdateStatus={(s: string) => handleStatusUpdate(proposal._id, s)}
                  index={index}
                />
             ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProposalItem({ proposal, isClient, onHire, onUpdateStatus }: any) {
  const router = useRouter();
  
  return (
    <div className="group">
      <Card className="overflow-hidden border-gray-100 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md">
         <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-8 space-y-5">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        proposal.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        proposal.status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        'bg-blue-50 text-blue-600 border-blue-100'
                     }`}>
                        {proposal.status}
                     </span>
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {new Date(proposal.createdAt).toLocaleDateString()}
                     </span>
                  </div>
               </div>

               <div className="space-y-3">
                  <h3 
                    onClick={() => router.push(`/marketplace`)}
                    className="text-xl font-bold text-[#111827] leading-tight cursor-pointer hover:text-blue-600 transition-colors"
                  >
                     {proposal.jobId?.title || 'System Mandate'}
                  </h3>
                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-3">
                        <User size={14} className="text-gray-400" />
                        <span className="text-xs font-bold text-[#4b5563]">
                           {isClient ? proposal.freelancerId?.name : proposal.jobId?.clientId?.name || 'Enterprise'}
                        </span>
                     </div>
                     <div className="flex items-center gap-3">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-xs font-bold text-[#4b5563]">{proposal.deliveryDays} Days</span>
                     </div>
                  </div>
               </div>

               <p className="text-sm text-[#6b7280] font-medium leading-relaxed line-clamp-2">
                  {proposal.coverLetter}
               </p>
            </div>

            <div className="md:w-64 bg-gray-50/50 border-t md:border-t-0 md:border-l border-gray-100 p-8 flex flex-col justify-between gap-6">
               <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Bid Valuation</p>
                  <h4 className="text-2xl font-bold text-[#2563eb]">₹{proposal.bidAmount?.toLocaleString()}</h4>
               </div>

               <div className="space-y-3">
                  {isClient && proposal.status === 'pending' && (
                     <div className="flex flex-col gap-3">
                        <Button onClick={onHire} className="w-full h-10 text-xs rounded-xl shadow-sm shadow-blue-500/10">
                           Hire Professional
                        </Button>
                        <div className="flex gap-3">
                           <Button variant="outline" onClick={() => onUpdateStatus('rejected')} className="flex-1 h-10 text-xs rounded-xl border-gray-100 text-gray-600 hover:bg-gray-50">Decline</Button>
                           <Button variant="outline" className="w-10 h-10-lg-600"><MessageSquare size={16} /></Button>
                        </div>
                     </div>
                  )}
                  {(!isClient || proposal.status !== 'pending') && (
                     <Button 
                       variant="outline" 
                       onClick={() => router.push(`/marketplace`)}
                       className="w-full h-11 text-xs rounded-xl group/btn border-gray-100 hover:border-blue-200"
                     >
                        View Details <ChevronRight size={14} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                     </Button>
                  )}
               </div>
            </div>
         </div>
      </Card>
    </div>
  );
}
