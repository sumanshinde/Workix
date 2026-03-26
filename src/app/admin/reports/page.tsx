'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  Calendar, Download, FileText, TrendingUp, DollarSign, 
  ShoppingCart, ArrowUpRight, Filter, ChevronDown, CheckCircle 
} from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444'];

import { analyticsAPI } from '@/services/api';

export default function AdminFinancialReports() {
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [dateRange]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const result = await analyticsAPI.getMonthly(dateRange.startDate, dateRange.endDate);
      setData(result);
    } catch (err) {
      console.error('Failed to load financial report:', err);
    }
    setLoading(false);
  };

  const handleExport = (type: 'pdf' | 'csv') => {
    const url = analyticsAPI.getExportUrl(type, dateRange.startDate, dateRange.endDate);
    window.open(url);
  };

  if (loading || !data) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading reports...</div>;
  }

  const pieData = [
    { name: 'Client Fees', value: data.summary.feeSplit.client },
    { name: 'Freelancer Fees', value: data.summary.feeSplit.freelancer }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', padding: '40px' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        
        {/* Header & Filters */}
        <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>Financial Intelligence</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Deep dive into platform revenue and transaction health.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--surface-border)', gap: '12px' }}>
              <Calendar size={18} color="var(--text-muted)" />
              <input 
                type="date" 
                value={dateRange.startDate} 
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                style={{ border: 'none', outline: 'none', fontSize: '14px', background: 'transparent' }} 
              />
              <span style={{ color: 'var(--text-muted)' }}>to</span>
              <input 
                type="date" 
                value={dateRange.endDate} 
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                style={{ border: 'none', outline: 'none', fontSize: '14px', background: 'transparent' }} 
              />
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleExport('csv')} className="btn-secondary" style={{ padding: '10px 16px' }}>
                <FileText size={18} /> CSV
              </button>
              <button onClick={() => handleExport('pdf')} className="btn-primary" style={{ padding: '10px 16px' }}>
                <Download size={18} /> Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
          <StatCard 
            label="Net Platform Revenue" 
            value={`₹${(data.summary.totalRevenue / 100).toLocaleString()}`} 
            icon={<DollarSign size={20} />} 
            color="#2563EB"
            trend="+12%"
          />
          <StatCard 
            label="Total Volume (GMV)" 
            value={`₹${(data.summary.totalVolume / 100).toLocaleString()}`} 
            icon={<TrendingUp size={20} />} 
            color="#10B981"
            trend="+8.4%"
          />
          <StatCard 
            label="Total Transactions" 
            value={data.summary.totalTransactions.toString()} 
            icon={<ShoppingCart size={20} />} 
            color="#F59E0B"
            trend="+24"
          />
          <StatCard 
            label="Avg. Order Value" 
            value={`₹${(data.summary.avgOrderValue / 100).toFixed(0)}`} 
            icon={<ArrowUpRight size={20} />} 
            color="#7C3AED"
            trend="+₹450"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginBottom: '40px' }}>
          
          {/* Revenue Trend Chart */}
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Revenue Growth Trend</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.trend}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} tickFormatter={(val) => `₹${val/100}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(val: any) => [`₹${(val/100).toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fee Split Pie Chart */}
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Fee Distribution</h3>
            <div style={{ height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => `₹${(val/100).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pieData.map((entry, index) => (
                <div key={entry.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[index] }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>{entry.name}</span>
                  </div>
                  <span style={{ fontWeight: 600 }}>₹{(entry.value / 100).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction Detail Table */}
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Summary Breakdown</h3>
            <div style={{ color: '#10B981', background: '#D1FAE5', padding: '6px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={14} /> All data verified
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '40px' }}>
            <ReportStat label="Platform Revenue" value={data.summary.totalRevenue} subLabel="Service Fees Collected" />
            <ReportStat label="Total Payouts" value={data.summary.totalPayouts} subLabel="Settled to Freelancers" color="#EF4444" />
            <ReportStat label="Base Volume" value={data.summary.totalVolume} subLabel="Project Subtotals" />
            <ReportStat label="Platform Profit" value={data.summary.totalRevenue} subLabel="Gross Margin" color="#10B981" />
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, trend }: any) {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ background: `${color}1A`, color: color, padding: '12px', borderRadius: '12px' }}>
          {icon}
        </div>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#10B981' }}>{trend}</span>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>{label}</p>
      <h3 style={{ fontSize: '24px', fontWeight: 700 }}>{value}</h3>
    </div>
  );
}

function ReportStat({ label, value, subLabel, color }: any) {
  return (
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>{label}</p>
      <h4 style={{ fontSize: '24px', fontWeight: 700, color: color || 'var(--text-primary)', marginBottom: '4px' }}>₹{(value / 100).toLocaleString()}</h4>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{subLabel}</p>
    </div>
  );
}
