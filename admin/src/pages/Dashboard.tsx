import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/services/api';
import {
  HiOutlineCog6Tooth,
  HiOutlineSquares2X2,
  HiOutlineBriefcase,
  HiOutlineUsers,
  HiOutlineEnvelope,
} from 'react-icons/hi2';

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-bg-card rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-white/[0.06] rounded w-20 mb-3" />
              <div className="h-8 bg-white/[0.06] rounded w-12" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Services', value: data?.counts?.services || 0, icon: HiOutlineCog6Tooth, color: 'text-blue-400' },
    { label: 'Portfolio', value: data?.counts?.portfolios || 0, icon: HiOutlineSquares2X2, color: 'text-purple-400' },
    { label: 'Active Jobs', value: data?.counts?.activeJobs || 0, icon: HiOutlineBriefcase, color: 'text-green-400' },
    { label: 'Applications', value: data?.counts?.applications || 0, icon: HiOutlineUsers, color: 'text-amber-400' },
    { label: 'Leads', value: data?.counts?.leads || 0, icon: HiOutlineEnvelope, color: 'text-rose-400' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-bg-card border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-3xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Leads by Status */}
      {data?.leadsByStatus && (
        <div className="bg-bg-card border border-white/[0.06] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Leads by Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {data.leadsByStatus.map((item: any) => (
              <div key={item._id} className="text-center">
                <div className="text-2xl font-bold">{item.count}</div>
                <div className="text-xs text-gray-500 uppercase mt-1">{item._id}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {data?.recentActivity && (
        <div className="bg-bg-card border border-white/[0.06] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {data.recentActivity.slice(0, 10).map((log: any) => (
              <div key={log._id} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-indigo/10 flex items-center justify-center text-xs font-medium text-accent-indigo">
                    {log.user?.name?.[0] || 'S'}
                  </div>
                  <div>
                    <span className="text-sm">{log.user?.name || 'System'}</span>
                    <span className="text-gray-500 text-sm"> {log.action} </span>
                    <span className="text-sm text-accent-indigo">{log.resource}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
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
