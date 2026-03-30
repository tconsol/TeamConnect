import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApplications, updateApplicationStatus } from '@/services/api';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'reviewing', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected'];
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  reviewing: 'bg-blue-500/10 text-blue-400',
  shortlisted: 'bg-indigo-500/10 text-indigo-400',
  interviewed: 'bg-purple-500/10 text-purple-400',
  offered: 'bg-emerald-500/10 text-emerald-400',
  hired: 'bg-green-500/10 text-green-400',
  rejected: 'bg-red-500/10 text-red-400',
};

export default function Applications() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-applications', page.toString(), statusFilter],
    queryFn: () => getApplications({ page: page.toString(), limit: '20', status: statusFilter || '' }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateApplicationStatus(id, status),
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
    },
    onError: () => toast.error('Failed to update status'),
  });

  const applications = data?.applications || data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Applications</h1>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-bg-card border border-white/[0.08] rounded-lg text-sm text-gray-300 focus:outline-none focus:border-accent-indigo"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-bg-card border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Applicant</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium hidden lg:table-cell">Job</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Resume</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/[0.04]">
                    <td className="px-4 py-3"><div className="h-4 bg-white/[0.06] rounded w-28 animate-pulse" /></td>
                    <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 bg-white/[0.06] rounded w-32 animate-pulse" /></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><div className="h-4 bg-white/[0.06] rounded w-24 animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-white/[0.06] rounded w-20 animate-pulse" /></td>
                    <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 bg-white/[0.06] rounded w-16 animate-pulse" /></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><div className="h-4 bg-white/[0.06] rounded w-20 animate-pulse" /></td>
                  </tr>
                ))
              ) : applications.map((app: any) => (
                <tr key={app._id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium">{app.name}</td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{app.email}</td>
                  <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{app.job?.title || '—'}</td>
                  <td className="px-4 py-3">
                    <select
                      value={app.status}
                      onChange={(e) => statusMutation.mutate({ id: app._id, status: e.target.value })}
                      className={`px-2 py-1 rounded-full text-xs border-0 focus:outline-none cursor-pointer ${statusColors[app.status] || 'bg-gray-500/10 text-gray-400'}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-bg-secondary text-white">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {app.resumeUrl ? (
                      <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-accent-indigo hover:underline text-xs">View</a>
                    ) : <span className="text-gray-500 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && applications.length === 0 && (
          <div className="p-8 text-center text-gray-500">No applications found</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm bg-bg-card border border-white/[0.06] rounded-lg disabled:opacity-30 hover:bg-white/[0.04] transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm bg-bg-card border border-white/[0.06] rounded-lg disabled:opacity-30 hover:bg-white/[0.04] transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
