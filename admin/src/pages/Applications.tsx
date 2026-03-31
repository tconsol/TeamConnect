import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApplications, updateApplicationStatus } from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import { Dropdown } from '@/components/ui/Dropdown';

const STATUSES = ['pending', 'reviewing', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected'];
const STATUS_OPTIONS = STATUSES.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }));
const FILTER_OPTIONS = [{ value: '', label: 'All Statuses' }, ...STATUS_OPTIONS];
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
  const toast = useToast();
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

  const applications: any[] = data?.data || [];
  const totalPages: number = data?.pagination?.pages || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Applications</h1>
        <div className="flex items-center gap-2">
          <Dropdown
            value={statusFilter}
            onChange={(v) => { setStatusFilter(v); setPage(1); }}
            options={FILTER_OPTIONS}
            placeholder="All Statuses"
            className="min-w-[160px]"
          />
        </div>
      </div>

      <div className="bg-bg-card border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(99,102,241,0.08)', borderBottom: '1px solid rgba(99,102,241,0.2)' }}>
                <th className="text-left px-4 py-3 text-gray-300 font-semibold">Applicant</th>
                <th className="text-left px-4 py-3 text-gray-300 font-semibold hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-gray-300 font-semibold hidden lg:table-cell">Job</th>
                <th className="text-left px-4 py-3 text-gray-300 font-semibold">Status</th>
                <th className="text-left px-4 py-3 text-gray-300 font-semibold hidden md:table-cell">Resume</th>
                <th className="text-left px-4 py-3 text-gray-300 font-semibold hidden lg:table-cell">Date</th>
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
                  <td className="px-4 py-3 font-medium text-white">{app.name}</td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{app.email}</td>
                  <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{app.job?.title || '—'}</td>
                  <td className="px-4 py-3">
                    <Dropdown
                      value={app.status}
                      onChange={(v) => statusMutation.mutate({ id: app._id, status: v })}
                      options={STATUS_OPTIONS}
                      compact
                      badgeClassName={statusColors[app.status] || 'bg-gray-500/10 text-gray-400'}
                    />
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
