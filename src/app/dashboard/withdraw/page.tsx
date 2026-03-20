'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IndianRupee, Landmark, Send, Info, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function WithdrawPage() {
  const [user, setUser] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [payoutRequests, setPayoutRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      fetchPayoutStats(u.id);
    }
  }, []);

  const fetchPayoutStats = async (userId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/payouts/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setPayoutRequests(data);
      }
    } catch (e) {
      console.error('Failed to load payouts:', e);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/payouts/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, amount: Number(amount) }),
      });
      if (res.ok) {
        setAmount('');
        fetchPayoutStats(user.id);
      }
    } catch (e) {
      console.error('Failed to submit payout:', e);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex-1 w-full bg-[#F9FAFB] py-12">
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px' }}>
          
          <main>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>Withdraw Earnings</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Transfer your cleared funds to your bank account or UPI.</p>
            </div>

            <div className="card" style={{ padding: '40px', marginBottom: '32px' }}>
              <form onSubmit={handleWithdraw}>
                <div style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Amount to Withdraw (₹)</label>
                  <div style={{ position: 'relative' }}>
                    <IndianRupee size={24} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-primary)' }} />
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      style={{ 
                        width: '100%', 
                        padding: '20px 20px 20px 52px', 
                        fontSize: '32px', 
                        fontWeight: 700,
                        border: '1px solid var(--surface-border)',
                        borderRadius: '16px',
                        outline: 'none',
                        background: '#F9FAFB'
                      }}
                      required
                    />
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '12px' }}>Available Balance: <strong>₹45,280.00</strong></p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                  <div style={{ padding: '20px', border: '2px solid var(--primary)', borderRadius: '16px', background: 'white', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#DBEAFE', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Landmark size={24} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: 600 }}>HDFC Bank •••• 4291</h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Verified Method</p>
                    </div>
                    <CheckCircle size={20} color="#10B981" style={{ marginLeft: 'auto' }} />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={loading}
                  style={{ width: '100%', height: '60px', justifyContent: 'center', fontSize: '18px' }}
                >
                  <Send size={20} /> {loading ? 'Processing...' : 'Request Payout'}
                </button>
              </form>
            </div>

            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Transaction History</h2>
              <div className="card" style={{ padding: 0 }}>
                {payoutRequests.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No withdrawal history yet.</div>
                ) : (
                  <div>
                    {payoutRequests.map((req: any) => (
                      <div key={req._id} style={{ padding: '20px 24px', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <div style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '10px', 
                            background: req.status === 'processed' ? '#D1FAE5' : '#FEF3C7',
                            color: req.status === 'processed' ? '#10B981' : '#F59E0B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {req.status === 'processed' ? <CheckCircle size={20} /> : <Clock size={20} />}
                          </div>
                          <div>
                            <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Withdrawal Request</h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(req.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '16px', fontWeight: 700 }}>- ₹{req.amount / 100}</div>
                          <span style={{ 
                            fontSize: '11px', 
                            fontWeight: 700, 
                            textTransform: 'uppercase',
                            color: req.status === 'processed' ? '#10B981' : '#F59E0B'
                          }}>{req.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>

          <aside>
            <div className="card" style={{ background: '#EEF2FF', borderColor: '#C7D2FE' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Info size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Payout Information</h3>
              </div>
              <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5 }}>
                <li>Payouts are processed within 24-48 hours.</li>
                <li>Minimum withdrawal amount is ₹1,000.</li>
                <li>Standard processing fees of 2% apply.</li>
                <li>Ensure your bank details are correct before requesting.</li>
              </ul>
            </div>

            <div style={{ marginTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', background: '#FEE2E2', padding: '12px', borderRadius: '12px', fontSize: '12px' }}>
                <AlertCircle size={16} />
                Need help? Contact support if your payout is delayed more than 3 days.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
