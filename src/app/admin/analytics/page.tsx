'use client';

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  TrendingUp, Users, DollarSign, Briefcase, 
  ArrowUpRight, Globe, Zap, MousePointer2 
} from 'lucide-react';
import { Card, Button } from '@/components/ui';

const revenueData = [
  { month: 'Jan', revenue: 45000, users: 1200 },
  { month: 'Feb', revenue: 52000, users: 1400 },
  { month: 'Mar', revenue: 48000, users: 1350 },
  { month: 'Apr', revenue: 61000, users: 1800 },
  { month: 'May', revenue: 75000, users: 2400 },
  { month: 'Jun', revenue: 82000, users: 2800 },
];

const categoryData = [
  { name: 'Engineering', value: 45 },
  { name: 'Design', value: 25 },
  { name: 'Marketing', value: 15 },
  { name: 'Writing', value: 15 },
];

const COLORS = ['#2563EB', '#8B5CF6', '#EC4899', '#F59E0B'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F172A] border border-slate-800 p-4 rounded-lg shadow-sm">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">{label} Report</p>
        <p className="text-white font-bold text-xl">₹{payload[0].value.toLocaleString()}</p>
        <div className="flex items-center gap-3 text-emerald-500 text-[10px] font-bold mt-1">
          <ArrowUpRight size={12} /> +12% vs last cycle
        </div>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  return (
     <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Platform Analytics</h1>
          <p className="text-gray-500 font-medium">Monitoring growth, revenue, and network health.</p>
        </div>
        <div className="flex gap-4">
           <Button variant="secondary" size="md">Export Data</Button>
           <Button variant="primary" size="md">View Reports</Button>
        </div>
      </div>

      {/* High-Level Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Platform LTV', value: '₹14,500', trend: '+8.4%', icon: <Zap size={20} /> },
           { label: 'CAC (Average)', value: '₹840', trend: '-12.5%', icon: <MousePointer2 size={20} /> },
           { label: 'Retention Rate', value: '78.2%', trend: '+4.2%', icon: <Users size={20} /> },
           { label: 'Market Depth', value: 'High', trend: 'Stable', icon: <Globe size={20} /> },
         ].map((stat, i) => (
           <Card key={i} className="group hover:border-blue-600/50 transition-all">
              <div className="flex justify-between items-start mb-6">
                 <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:scale-110 transition-transform">{stat.icon}</div>
                 <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>{stat.trend}</span>
              </div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</h3>
           </Card>
         ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Growth Curve */}
        <Card className="p-8 space-y-10">
           <div className="flex items-center justify-between">
              <div>
                 <h3 className="text-sm font-bold text-gray-900">Growth Velocity</h3>
                 <p className="text-gray-500 text-xs font-medium">User acquisition vs Net Revenue</p>
              </div>
              <div className="flex gap-3">
                 <div className="flex items-center gap-3 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Revenue</span>
                 </div>
                 <div className="flex items-center gap-3 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Users</span>
                 </div>
              </div>
           </div>
           <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} axisLine={false} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={4} dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#FFFFFF' }} activeDot={{ r: 6 }} />
                 </LineChart>
              </ResponsiveContainer>
           </div>
        </Card>

        {/* Categories Pie */}
        <Card className="p-8 flex flex-col">
           <div className="mb-10">
              <h3 className="text-sm font-bold text-gray-900">Category Concentration</h3>
              <p className="text-gray-500 text-xs font-medium">Job volume by primary industry</p>
           </div>
           <div className="flex-1 flex flex-col md:flex-row items-center justify-around gap-10">
              <div className="w-64 h-64">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={categoryData}
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={8}
                          dataKey="value"
                       >
                          {categoryData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                       </Pie>
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="w-full md:w-64 space-y-6">
                 {categoryData.map((item, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-gray-400">{item.name}</span>
                          <span className="text-gray-900">{item.value}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${item.value}%`, backgroundColor: COLORS[i] }} />
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </Card>
      </div>

      {/* Performance */}
      <Card className="p-10 space-y-12">
         <div className="text-center space-y-3">
            <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest">Network Health</h3>
            <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
               <span>Global Node Status</span>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-emerald-500">Node Cluster: US-EAST-1</span>
            </div>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: 'Avg Latency', value: '42ms' },
              { label: 'Packet Integrity', value: '99.9%' },
              { label: 'Concurrency', value: '4.2k/s' },
              { label: 'Error Rate', value: '0.04%' },
            ].map((node, i) => (
              <div key={i} className="space-y-1">
                 <p className="text-3xl font-bold text-gray-900 tracking-tight">{node.value}</p>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{node.label}</p>
              </div>
            ))}
         </div>
      </Card>
    </div>
  );
}
