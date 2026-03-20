'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Check, ExternalLink, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      fetchNotifications(user.id);
    }
  }, []);

  const fetchNotifications = async (userId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/notifications/${userId}`);
      const data = await res.json();
      setNotifications(data);
      setUnreadCount(data.filter((n: any) => !n.isRead).length);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/notifications/${id}/read`, { method: 'PUT' });
    setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    setUnreadCount(unreadCount - 1);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setShow(!show)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: '8px' }}
      >
        <Bell size={22} color="var(--text-secondary)" />
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: '4px', right: '4px', background: '#EF4444', color: 'white', fontSize: '10px', fontWeight: 700, minWidth: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
            {unreadCount}
          </span>
        )}
      </button>

      {show && (
        <>
          <div onClick={() => setShow(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }}></div>
          <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '12px', width: '320px', background: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', border: '1px solid var(--surface-border)', zIndex: 50, overflow: 'hidden' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700 }}>Notifications</h4>
              <button onClick={() => setShow(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>No notifications yet.</div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n._id} 
                    onClick={() => n.link && (window.location.href = n.link)}
                    style={{ 
                      padding: '16px', 
                      background: n.isRead ? 'transparent' : '#EFF6FF', 
                      borderBottom: '1px solid var(--surface-border)',
                      cursor: n.link ? 'pointer' : 'default',
                      position: 'relative'
                    }}
                  >
                    {!n.isRead && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleMarkAsRead(n._id); }}
                        style={{ position: 'absolute', right: '12px', top: '12px', background: 'white', border: '1px solid #DBEAFE', borderRadius: '4px', padding: '2px' }}
                      >
                        <Check size={12} color="#3B82F6" />
                      </button>
                    )}
                    <h5 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '2px', color: '#1E293B' }}>{n.title}</h5>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '8px' }}>{n.message}</p>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {formatDistanceToNow(new Date(n.createdAt))} ago
                    </span>
                  </div>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <div style={{ padding: '12px', background: '#F8FAFC', textAlign: 'center', borderTop: '1px solid var(--surface-border)' }}>
                <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>View all notifications</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
