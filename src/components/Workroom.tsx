'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Workroom() {
  const milestones = [
    { id: 1, title: 'UI Design & Wireframing', status: 'Completed', amount: '₹15,000', date: 'Mar 10' },
    { id: 2, title: 'Frontend Implementation', status: 'In Review', amount: '₹25,000', date: 'Mar 15' },
    { id: 3, title: 'Backend API Integration', status: 'Pending', amount: '₹20,000', date: 'Mar 25' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', height: 'calc(100vh - 120px)' }}>
      {/* Chat Section */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '18px' }}>Project Chat: E-commerce Redesign</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Freelancer: Rohan Sharma • Client: StartupX</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontSize: '12px', fontWeight: 600 }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></div>
            Active Now
          </div>
        </div>

        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Mock Messages */}
          <div style={{ alignSelf: 'flex-start', maxWidth: '70%' }}>
            <div style={{ padding: '12px 16px', background: 'var(--surface)', borderRadius: '12px 12px 12px 0', fontSize: '14px' }}>
              Hi! I've uploaded the latest Figma wireframes for the dashboard. Can you take a look?
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>10:30 AM</span>
          </div>

          <div style={{ alignSelf: 'flex-end', maxWidth: '70%' }}>
            <div style={{ padding: '12px 16px', background: 'var(--primary)', color: 'white', borderRadius: '12px 12px 0 12px', fontSize: '14px' }}>
              Checking them now. The glassmorphism effect looks premium! Let's proceed with the frontend.
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>10:35 AM</span>
          </div>
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid var(--surface-border)', display: 'flex', gap: '12px' }}>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <Paperclip size={20} />
          </button>
          <input 
            type="text" 
            placeholder="Type your message..." 
            style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--surface-border)', borderRadius: '8px', padding: '10px 16px', color: 'var(--text-primary)' }}
          />
          <button className="btn-primary" style={{ padding: '10px' }}>
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Milestone Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Milestones</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {milestones.map((m) => (
              <div key={m.id} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ color: m.status === 'Completed' ? '#10B981' : m.status === 'In Review' ? '#F59E0B' : 'var(--text-muted)' }}>
                  {m.status === 'Completed' ? <CheckCircle size={20} /> : m.status === 'In Review' ? <Clock size={20} /> : <AlertCircle size={20} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{m.title}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700 }}>{m.amount}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span>{m.status}</span>
                    <span>{m.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-primary" style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }}>
            Release Next Payment
          </button>
        </div>

        <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(99, 102, 241, 0.1))' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--accent)', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Escrow Status</h4>
          <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '4px' }}>₹40,000</div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Held securely in BharatGig Escrow</p>
        </div>
      </div>
    </div>
  );
}
