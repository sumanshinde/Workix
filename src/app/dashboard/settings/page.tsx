'use client';

import React, { useState, useEffect } from 'react';
import { User, Lock, Bell, CreditCard, Shield, Globe, Smartphone, HelpCircle, Save, IndianRupee, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BRANDING } from '@/lib/config';

const TABS = ['Profile', 'Security', 'Notifications', 'Billing'];

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Profile');
  const [user, setUser] = useState<any>(null);
  
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [bio, setBio] = useState('');
  
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setName(u.name || '');
      setEmail(u.email || '');
      setCompany(BRANDING.companyName);
      setBio('Senior Full-Stack Developer focused on building scalable, performant, and beautiful applications.');
    }
  }, []);

  if (!user) return <div className="p-8">Loading settings...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <button 
        onClick={() => router.push('/dashboard')}
        style={{ 
          display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', 
          color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
          marginBottom: '24px', padding: '0'
        }}
      >
        <ChevronLeft size={18} /> Back to Dashboard
      </button>

      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: '8px' }}>Account Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Manage your profile, security preferences, and billing information.</p>
      </div>

      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        
        {/* Settings Sidebar / Tabs */}
        <aside style={{ width: '240px', flexShrink: 0, position: 'sticky', top: '100px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <TabItem icon={<User size={18} />} label="Profile" active={activeTab === 'Profile'} onClick={() => setActiveTab('Profile')} />
            <TabItem icon={<Lock size={18} />} label="Security" active={activeTab === 'Security'} onClick={() => setActiveTab('Security')} />
            <TabItem icon={<Bell size={18} />} label="Notifications" active={activeTab === 'Notifications'} onClick={() => setActiveTab('Notifications')} />
            <TabItem icon={<CreditCard size={18} />} label="Billing" active={activeTab === 'Billing'} onClick={() => setActiveTab('Billing')} />
          </div>

          <div style={{ marginTop: '40px', padding: '24px', background: '#EEF2FF', borderRadius: '16px', border: '1px solid #E0E7FF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: 'var(--primary)' }}>
              <Shield size={24} />
              <h4 style={{ fontWeight: 700, fontSize: '14px' }}>Data Privacy</h4>
            </div>
            <p style={{ fontSize: '13px', color: '#4F46E5', lineHeight: 1.6 }}>Your data is encrypted and securely stored. We never share your personal details with third parties.</p>
          </div>
        </aside>

        {/* Content Area */}
        <main style={{ flex: 1, minWidth: 0 }}>
          
          {activeTab === 'Profile' && (
            <div className="card" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--surface-border)' }}>Public Profile</h2>
              
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '40px' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--primary)', position: 'relative', overflow: 'hidden' }}>
                    <Image src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" alt="Avatar" fill className="object-cover" />
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '14px', height: 'auto' }}>Change Avatar</button>
                    <button style={{ background: 'transparent', border: '1px solid var(--surface-border)', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)' }}>Remove</button>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <FormGroup label="Full Name">
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input" />
                </FormGroup>
                <FormGroup label="Email Address">
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" />
                </FormGroup>
                <FormGroup label="Tagline / Role">
                  <input type="text" value="Senior Architect" className="form-input" />
                </FormGroup>
                <FormGroup label="Company">
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="form-input" />
                </FormGroup>
              </div>

              <FormGroup label="Bio">
                <textarea 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                  className="form-input" 
                  rows={4}
                  style={{ resize: 'none' }}
                />
              </FormGroup>

              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-primary" style={{ gap: '8px', padding: '12px 24px', height: 'auto' }}>
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="card" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--surface-border)' }}>Security & Authentication</h2>
              
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Change Password</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
                  <FormGroup label="Current Password">
                    <input type="password" placeholder="••••••••" className="form-input" />
                  </FormGroup>
                  <FormGroup label="New Password">
                    <input type="password" placeholder="••••••••" className="form-input" />
                  </FormGroup>
                  <FormGroup label="Confirm New Password">
                    <input type="password" placeholder="••••••••" className="form-input" />
                  </FormGroup>
                  <button className="btn-primary" style={{ marginTop: '8px', alignSelf: 'flex-start', height: 'auto', padding: '10px 20px' }}>Update Password</button>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Two-Factor Authentication</h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Add an extra layer of security to your account.</p>
                  </div>
                  <button style={{ background: '#10B981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Enable 2FA</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="card" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--surface-border)' }}>Notification Preferences</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <ToggleItem title="New Job Matches" description="Get notified when a job matches your skills." defaultChecked={true} />
                <ToggleItem title="Messages" description="Receive emails when clients send you a message." defaultChecked={true} />
                <ToggleItem title="Application Updates" description="Updates on your active proposals and interviews." defaultChecked={true} />
                <ToggleItem title="Marketing Emails" description="Updates on new features, tips, and promotions." defaultChecked={false} />
              </div>
              
              <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-primary" style={{ padding: '12px 24px', height: 'auto' }}>Save Preferences</button>
              </div>
            </div>
          )}

          {activeTab === 'Billing' && (
            <div className="card" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--surface-border)' }}>Billing & Payments</h2>
              
              <div style={{ padding: '24px', background: '#F9FAFB', border: '1px solid var(--surface-border)', borderRadius: '16px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                   <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Active Plan</p>
                   <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>Pro Member <span style={{ fontSize: '12px', background: '#DBEAFE', color: 'var(--primary)', padding: '2px 8px', borderRadius: '100px', fontWeight: 700 }}>₹999/mo</span></h3>
                </div>
                <button style={{ border: '1px solid var(--surface-border)', background: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Manage Subscription</button>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Payment Methods</h3>
              <div style={{ border: '1px solid var(--surface-border)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '32px', background: '#1E3A8A', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 800 }}>VISA</div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '14px' }}>Visa ending in 4242</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Expires 12/26</p>
                    </div>
                 </div>
                 <span style={{ fontSize: '12px', fontWeight: 700, color: '#10B981', background: '#D1FAE5', padding: '4px 8px', borderRadius: '4px' }}>Primary</span>
              </div>
              <button style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '14px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>+ Add Payment Method</button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// Subcomponents
function TabItem({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      style={{ 
        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', width: '100%',
        borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: active ? 700 : 500,
        background: active ? 'var(--primary)' : 'transparent',
        color: active ? 'white' : 'var(--text-primary)',
        transition: 'all 0.2s ease',
        textAlign: 'left'
      }}
      onMouseEnter={(e) => { if(!active) e.currentTarget.style.background = '#F3F4F6'; }}
      onMouseLeave={(e) => { if(!active) e.currentTarget.style.background = 'transparent'; }}
    >
      {icon} {label}
    </button>
  )
}

function FormGroup({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</label>
      {React.cloneElement(children as React.ReactElement, {
         style: { ...((children as React.ReactElement).props.style || {}), width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--surface-border)', background: '#F9FAFB', outline: 'none', fontSize: '14px' },
         onFocus: (e: any) => e.target.style.borderColor = 'var(--primary)',
         onBlur: (e: any) => e.target.style.borderColor = 'var(--surface-border)'
      })}
    </div>
  )
}

function ToggleItem({ title, description, defaultChecked }: { title: string, description: string, defaultChecked: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{title}</h4>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{description}</p>
      </div>
      <div 
        onClick={() => setChecked(!checked)}
        style={{ 
          width: '44px', height: '24px', background: checked ? 'var(--primary)' : '#E5E7EB', borderRadius: '100px',
          position: 'relative', cursor: 'pointer', transition: '0.2s'
        }}
      >
        <div style={{ 
          width: '20px', height: '20px', background: 'white', borderRadius: '50%',
          position: 'absolute', top: '2px', left: checked ? '22px' : '2px', transition: '0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }} />
      </div>
    </div>
  )
}
