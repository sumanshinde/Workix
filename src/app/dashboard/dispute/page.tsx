'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertTriangle, Upload, MessageSquare, Info, Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import { disputesAPI } from '@/services/api';

export default function RaiseDisputePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const escrowId = searchParams.get('escrowId');
  const [user, setUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    reason: 'service_not_delivered',
    description: '',
    evidenceLinks: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    
    try {
      await disputesAPI.create({
        escrowId,
        raisedBy: user.id,
        reason: formData.reason,
        description: formData.description,
        evidence: formData.evidenceLinks.split(',').map(s => s.trim())
      });
      setSuccess(true);
    } catch (err) {
      console.error('Failed to raise dispute:', err);
    }
    setLoading(false);
  };

  if (!escrowId) return <div style={{ padding: '40px', textAlign: 'center' }}>Invalid Order ID</div>;

  if (success) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB' }}>
        <div className="card" style={{ maxWidth: '400px', textAlign: 'center', padding: '48px' }}>
          <div style={{ width: '64px', height: '64px', background: '#D1FAE5', color: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={32} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Dispute Filed</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Our trust & safety team will review your case within 24-48 hours. The funds have been frozen.</p>
          <button className="btn-primary" onClick={() => router.push('/dashboard')} style={{ width: '100%' }}>Return to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', padding: '60px 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', fontSize: '14px', fontWeight: 600 }}>
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <AlertTriangle size={32} color="#EF4444" />
            <h1 style={{ fontSize: '32px', fontWeight: 700 }}>Raise a Dispute</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>Problem with your order? Tell us what happened and we'll help resolve it.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '32px' }}>
          <div className="card" style={{ padding: '32px' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Reason for Dispute</label>
                <select 
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--surface-border)', outline: 'none' }}
                >
                  <option value="service_not_delivered">Service not delivered</option>
                  <option value="quality_not_as_described">Quality not as described</option>
                  <option value="freelancer_unresponsive">Freelancer is unresponsive</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Detailed Description</label>
                <textarea 
                  required
                  placeholder="Explain the issue in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={{ width: '100%', height: '150px', padding: '12px', borderRadius: '10px', border: '1px solid var(--surface-border)', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Evidence Links (Optional)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px dashed var(--surface-border)', borderRadius: '10px', background: '#F9FAFB' }}>
                  <Upload size={20} color="var(--text-muted)" />
                  <input 
                    type="text" 
                    placeholder="Paste URLs to image/docs (comma separated)"
                    value={formData.evidenceLinks}
                    onChange={(e) => setFormData({...formData, evidenceLinks: e.target.value})}
                    style={{ background: 'transparent', border: 'none', width: '100%', outline: 'none', fontSize: '14px' }}
                  />
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Google Drive, Loom, or Image hosting links are preferred.</p>
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                disabled={loading}
                style={{ width: '100%', height: '56px', justifyContent: 'center', background: '#EF4444', borderColor: '#EF4444' }}
              >
                {loading ? 'Processing...' : 'Raise Official Dispute'}
              </button>
            </form>
          </div>

          <aside>
            <div className="card" style={{ background: '#FFF7ED', borderColor: '#FFEDD5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Shield size={20} color="#F97316" />
                <h4 style={{ fontSize: '16px', fontWeight: 700 }}>Our Process</h4>
              </div>
              <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <li>Funds are frozen immediately and held by GigIndia.</li>
                <li>Both parties are asked for additional evidence if needed.</li>
                <li>Admin will resolve the case within 48 hours.</li>
                <li>Decisions are final and based on platform terms.</li>
              </ul>
            </div>

            <div style={{ marginTop: '24px', padding: '16px', background: '#EFF6FF', borderRadius: '12px', border: '1px solid #DBEAFE' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Info size={18} color="#3B82F6" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '12px', color: '#1E40AF', lineHeight: 1.5 }}>We recommend messaging the freelancer first. 80% of issues are resolved through direct communication.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
