'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle2, Clock, 
  ArrowRight, Search, Zap, 
  DollarSign, Briefcase, User,
  MessageSquare, ShieldCheck, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { contractsAPI, reviewsAPI } from '@/services/api';
import { Card, Button, Input, Skeleton } from '@/components/ui';
import { useRouter } from 'next/navigation';

export default function ContractsPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(storedUser);
        const data = await contractsAPI.getMy();
        setContracts(data);
      } catch (err) {
        console.error('Failed to fetch contracts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'disputed': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-[#111827]">Contracts & Settlements</h1>
            <p className="text-base text-[#6b7280]">Manage your active engagements and track payment settlements.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" className="h-10">Export Ledger</Button>
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-64 saas-card animate-pulse" />)}
          </div>
        ) : contracts.length === 0 ? (
          <div className="py-24 flex flex-col items-center text-center space-y-4 saas-card bg-white">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                <FileText size={32} />
             </div>
             <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900">No active contracts</h3>
                <p className="text-gray-500">You haven&apos;t entered into any formal engagements yet.</p>
             </div>
             <Button onClick={() => router.push('/marketplace')} className="mt-4">Explore Marketplace</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {contracts.map((contract) => (
              <ContractCard 
                key={contract._id} 
                contract={contract} 
                isFreelancer={user?.role === 'freelancer'} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ContractCard({ contract, isFreelancer }: { contract: any, isFreelancer: boolean }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [showSubmission, setShowSubmission] = useState(false);
  const [submissionContent, setSubmissionContent] = useState('');

  const otherParty = isFreelancer ? contract.clientId : contract.freelancerId;

  const handleSubmitWork = async () => {
    setSubmitting(true);
    try {
      await contractsAPI.submitWork({
        contractId: contract._id,
        content: submissionContent
      });
      setShowSubmission(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveWork = async (submissionId: string) => {
    try {
      await contractsAPI.approveWork({
        contractId: contract._id,
        submissionId
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="hover:border-blue-200 transition-all duration-300 overflow-hidden group border-gray-100 shadow-sm">
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
           <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
             contract.status === 'active' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
           }`}>
              {contract.status}
           </span>
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{contract._id.slice(-8)}</span>
        </div>

        <div className="space-y-4">
           <h3 className="text-xl font-bold text-gray-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors cursor-pointer">
              {contract.jobId?.title}
           </h3>
           <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                    <img src={otherParty?.avatar || `https://ui-avatars.com/api/?name=${otherParty?.name}`} alt="avatar" className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-gray-900 leading-none">{otherParty?.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">{isFreelancer ? 'Authorized Client' : 'Elite Freelancer'}</p>
                 </div>
              </div>
              <div className="h-8 w-px bg-gray-100" />
              <div className="space-y-1">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">Valuation</p>
                 <p className="text-sm font-bold text-[#2563eb]">₹{contract.amount?.toLocaleString()}</p>
              </div>
           </div>
        </div>

        <div className="pt-6 border-t border-gray-50 space-y-6">
           {contract.status === 'active' && isFreelancer && (
             <div className="space-y-4">
                {!showSubmission ? (
                  <Button onClick={() => setShowSubmission(true)} className="w-full rounded-lg">Submit Deliverables</Button>
                ) : (
                  <div className="space-y-4 p-5 bg-gray-50 rounded-lg border border-gray-100">
                     <textarea 
                        className="w-full min-h-[120px] p-4 bg-white border border-gray-100 rounded-xl outline-none focus:border-blue-500 transition-all text-sm font-medium"
                        placeholder="Detail the work performed and link artifacts..."
                        value={submissionContent}
                        onChange={e => setSubmissionContent(e.target.value)}
                     />
                     <div className="flex gap-3">
                        <Button isLoading={submitting} onClick={handleSubmitWork} className="flex-1 rounded-lg">Transmit Work</Button>
                        <Button variant="outline" onClick={() => setShowSubmission(false)} className="rounded-lg">Cancel</Button>
                     </div>
                  </div>
                )}
             </div>
           )}

           {contract.workSubmission?.length > 0 && (
             <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Submission History</h4>
                {contract.workSubmission.map((sub: any, idx: number) => (
                  <div key={idx} className="p-5 bg-gray-50 border border-gray-100 rounded-xl flex items-start justify-between gap-6">
                     <div className="space-y-2 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 leading-relaxed truncate-2-lines">{sub.content}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{new Date(sub.submittedAt).toLocaleDateString()}</p>
                     </div>
                     <div className="shrink-0">
                        {sub.status === 'pending' && !isFreelancer ? (
                          <Button size="icon" onClick={() => handleApproveWork(sub._id)} className="w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-500/20"><CheckCircle2 size={18} /></Button>
                        ) : (
                          <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${
                            sub.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {sub.status}
                          </span>
                        )}
                     </div>
                  </div>
                ))}
             </div>
           )}

           <div className="flex items-center gap-4">
              <Button variant="outline" className="flex-1 rounded-xl h-11 text-xs group/btn">
                 <MessageSquare size={16} className="mr-2 text-gray-400 group-hover/btn:text-blue-500" /> Secure Chat
              </Button>
              <Button variant="outline" className="flex-1 rounded-xl h-11 text-xs group/btn">
                 <DollarSign size={16} className="mr-2 text-gray-400 group-hover/btn:text-emerald-500" /> Escrow Status
              </Button>
           </div>
        </div>
      </div>
    </Card>
  );
}
