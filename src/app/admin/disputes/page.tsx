'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Check, X, Eye, 
  User, Calendar, ExternalLink, 
  MessageSquare, ShieldAlert, Filter, Search 
} from 'lucide-react';

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/disputes`);
      const data = await res.json();
      setDisputes(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleResolve = async (id: string, action: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/disputes/${id}/resolve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, adminNotes })
    });
    if (res.ok) {
      setSelectedDispute(null);
      fetchDisputes();
    }
  };

  const handleReject = async (id: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/disputes/${id}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminNotes })
    });
    if (res.ok) {
      setSelectedDispute(null);
      fetchDisputes();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', padding: '40px' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700 }}>Dispute Resolution Center</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Review evidence and resolve conflicts between users.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
             <span style={{ fontSize: '13px', fontWeight: 700, background: '#FEE2E2', color: '#EF4444', padding: '6px 12px', borderRadius: '8px' }}>
               {disputes.filter(d => d.status === 'open').length} Urgent Cases
             </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selectedDispute ? '1fr 400px' : '1fr', gap: '32px' }}>
          
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', width: '300px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" placeholder="Search disputes..." style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '10px', border: '1px solid var(--surface-border)', outline: 'none' }} />
              </div>
              <button className="btn-secondary"><Filter size={18} /> Filters</button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', background: '#F9FAFB' }}>
                  <th style={{ padding: '16px 24px' }}>Date</th>
                  <th style={{ padding: '16px 24px' }}>Participants</th>
                  <th style={{ padding: '16px 24px' }}>Reason</th>
                  <th style={{ padding: '16px 24px' }}>Status</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {disputes.map((d) => (
                  <tr key={d._id} style={{ borderBottom: '1px solid var(--surface-border)', background: selectedDispute?._id === d._id ? '#EFF6FF' : 'transparent' }}>
                    <td style={{ padding: '20px 24px', color: 'var(--text-secondary)', fontSize: '14px' }}>{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>C: {d.clientId?.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>F: {d.freelancerId?.name}</div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500, textTransform: 'capitalize' }}>{d.reason.replace(/_/g, ' ')}</span>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        padding: '4px 10px', 
                        borderRadius: '100px',
                        textTransform: 'uppercase',
                        background: d.status === 'open' ? '#FEE2E2' : d.status === 'resolved' ? '#D1FAE5' : '#F3F4F6',
                        color: d.status === 'open' ? '#EF4444' : d.status === 'resolved' ? '#065F46' : '#64748B',
                      }}>{d.status}</span>
                    </td>
                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                      <button className="btn-secondary" onClick={() => setSelectedDispute(d)} style={{ padding: '6px 12px' }}>
                        <Eye size={16} /> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedDispute && (
            <div className="card" style={{ padding: '32px', position: 'sticky', top: '40px', height: 'fit-content' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Case Review</h3>
                <button onClick={() => setSelectedDispute(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Description</label>
                <p style={{ fontSize: '14px', lineHeight: 1.6, marginTop: '8px', color: 'var(--text-primary)' }}>{selectedDispute.description}</p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Evidence Links</label>
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedDispute.evidence.map((link: string, i: number) => (
                    <a key={i} href={link} target="_blank" style={{ fontSize: '13px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                      <ExternalLink size={14} /> View Evidence Item {i + 1}
                    </a>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Admin Verdict Notes</label>
                <textarea 
                  placeholder="Explain your decision..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  style={{ width: '100%', height: '100px', marginTop: '12px', padding: '12px', borderRadius: '10px', border: '1px solid var(--surface-border)', outline: 'none' }}
                />
              </div>

              {selectedDispute.status === 'open' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button className="btn-primary" onClick={() => handleResolve(selectedDispute._id, 'release_to_freelancer')} style={{ width: '100%', background: '#10B981', borderColor: '#10B981' }}>
                    <Check size={18} /> Release to Freelancer
                  </button>
                  <button className="btn-primary" onClick={() => handleResolve(selectedDispute._id, 'refund_to_client')} style={{ width: '100%', background: '#EF4444', borderColor: '#EF4444' }}>
                    <AlertTriangle size={18} /> Refund to Client
                  </button>
                  <button className="btn-secondary" onClick={() => handleReject(selectedDispute._id)} style={{ width: '100%' }}>
                    Reject Dispute (Unfreeze)
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
