import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/services/api';
import {
  HiOutlineCog6Tooth,
  HiOutlineSquares2X2,
  HiOutlineBriefcase,
  HiOutlineUsers,
  HiOutlineEnvelope,
  HiOutlineArrowTrendingUp,
} from 'react-icons/hi2';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';

const COLORS = ['#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'rgba(13,16,37,0.95)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, padding: '8px 14px' }}>
        {label && <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: 11, marginBottom: 4 }}>{label}</p>}
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color || '#6366F1', fontSize: 13, fontWeight: 600 }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="analytics-card p-6 animate-pulse">
              <div className="h-3 rounded w-20 mb-3" style={{ background: 'rgba(99,102,241,0.08)' }} />
              <div className="h-8 rounded w-12" style={{ background: 'rgba(99,102,241,0.08)' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Services', value: data?.counts?.services || 0, icon: HiOutlineCog6Tooth, color: 'text-blue-400', bg: 'rgba(59,130,246,0.1)', trend: '+2 this month' },
    { label: 'Portfolio', value: data?.counts?.portfolios || 0, icon: HiOutlineSquares2X2, color: 'text-purple-400', bg: 'rgba(139,92,246,0.1)', trend: '+5 this month' },
    { label: 'Active Jobs', value: data?.counts?.activeJobs || 0, icon: HiOutlineBriefcase, color: 'text-green-400', bg: 'rgba(16,185,129,0.1)', trend: '+1 this month' },
    { label: 'users', value: data?.counts?.users || 0, icon: HiOutlineUsers, color: 'text-amber-400', bg: 'rgba(245,158,11,0.1)', trend: '+2 this month' },
    { label: 'Leads', value: data?.counts?.leads || 0, icon: HiOutlineEnvelope, color: 'text-rose-400', bg: 'rgba(239,68,68,0.1)', trend: '+8 this month' },
  ];

  // Prepare chart data from API
  const countsBarData = [
    { name: 'Services', value: data?.counts?.services || 0 },
    { name: 'Portfolio', value: data?.counts?.portfolios || 0 },
    { name: 'Jobs', value: data?.counts?.activeJobs || 0 },
    { name: 'Users', value: data?.counts?.users || 0 },
    { name: 'Leads', value: data?.counts?.leads || 0 },
  ];

  const leadsPieData = data?.leadsByStatus?.length
    ? data.leadsByStatus.map((item: any) => ({ name: item._id.charAt(0).toUpperCase() + item._id.slice(1), value: item.count }))
    : [
        { name: 'New', value: 0 },
        { name: 'Contacted', value: 0 },
        { name: 'Qualified', value: 0 },
        { name: 'Proposal', value: 0 },
      ];

  // Mock trend data for area chart  
  const trendData = [
    { month: 'Oct', leads: 3, users: 2 },
    { month: 'Nov', leads: 5, users: 3 },
    { month: 'Dec', leads: 4, users: 3 },
    { month: 'Jan', leads: 7, users: 4 },
    { month: 'Feb', leads: 9, users: 5 },
    { month: 'Mar', leads: data?.counts?.leads || 8, users: data?.counts?.users || 6 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(148,163,184,0.6)' }}>
            Performance overview
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
          <HiOutlineArrowTrendingUp className="w-3.5 h-3.5" />
          All systems operational
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="analytics-card p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-1/2 translate-x-1/2" style={{ background: stat.bg, filter: 'blur(20px)' }} />
            <div className="flex items-center justify-between mb-3 relative">
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(148,163,184,0.5)' }}>
                {stat.label}
              </span>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: stat.bg }}>
                <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
              </div>
            </div>
            <div className="text-3xl font-bold stat-value relative">{stat.value}</div>
            <div className="text-xs mt-1.5" style={{ color: 'rgba(52,211,153,0.8)' }}>{stat.trend} this month</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart — Overview */}
        <div className="analytics-card p-6 lg:col-span-2">
          <h2 className="text-base font-semibold text-white mb-1">Content Overview</h2>
          <p className="text-xs mb-5" style={{ color: 'rgba(148,163,184,0.5)' }}>Total items by category</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={countsBarData} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'rgba(148,163,184,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(148,163,184,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {countsBarData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart — Leads by Status */}
        <div className="analytics-card p-6">
          <h2 className="text-base font-semibold text-white mb-1">Leads by Status</h2>
          <p className="text-xs mb-2" style={{ color: 'rgba(148,163,184,0.5)' }}>Distribution breakdown</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={leadsPieData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {leadsPieData.map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 11, color: 'rgba(148,163,184,0.6)', paddingTop: 8 }}
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 — Area Chart trend */}
      <div className="analytics-card p-6">
        <h2 className="text-base font-semibold text-white mb-1">Growth Trend</h2>
        <p className="text-xs mb-5" style={{ color: 'rgba(148,163,184,0.5)' }}>Leads & Users over last 6 months</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="leads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="apps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: 'rgba(148,163,184,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(148,163,184,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="leads" stroke="#6366F1" strokeWidth={2} fill="url(#leads)" name="Leads" />
            <Area type="monotone" dataKey="users" stroke="#10B981" strokeWidth={2} fill="url(#apps)" name="Users" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      {data?.recentActivity && (
        <div className="analytics-card p-6">
          <h2 className="text-base font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-1">
            {data.recentActivity.slice(0, 10).map((log: any) => (
              <div
                key={log._id}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors"
                style={{ borderBottom: '1px solid rgba(99,102,241,0.06)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-indigo-300"
                    style={{ background: 'rgba(99,102,241,0.15)' }}
                  >
                    {log.user?.name?.[0] || 'S'}
                  </div>
                  <div>
                    <span className="text-sm text-white/80">{log.user?.name || 'System'}</span>
                    <span className="text-sm mx-1" style={{ color: 'rgba(148,163,184,0.4)' }}>{log.action}</span>
                    <span className="text-sm text-indigo-400">{log.resource}</span>
                  </div>
                </div>
                <span className="text-xs" style={{ color: 'rgba(148,163,184,0.4)' }}>
                  {new Date(log.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
