import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLeads, updateLeadStatus, deleteLead } from '@/services/api';
import toast from 'react-hot-toast';
import { HiOutlineTrash, HiOutlineMagnifyingGlass } from 'react-icons/hi2';

const STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
const statusColors: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-400',
  contacted: 'bg-cyan-500/10 text-cyan-400',
  qualified: 'bg-indigo-500/10 text-indigo-400',
  proposal: 'bg-purple-500/10 text-purple-400',
  negotiation: 'bg-amber-500/10 text-amber-400',
  won: 'bg-green-500/10 text-green-400',
  lost: 'bg-red-500/10 text-red-400',
};

export default function Leads() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-leads', page.toString(), search, statusFilter],
    queryFn: () => getLeads({ page: page.toString(), limit: '20', search: search || '', status: statusFilter || '' }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateLeadStatus(id, status),
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
    },
    onError: () => toast.error('Failed to update status'),
  });

  const removeMutation = useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      toast.success('Lead deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
    },
    onError: () => toast.error('Failed to delete'),
  });

  const leads = data?.leads || data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Leads</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search leads..."
            className="w-full pl-9 pr-3 py-2 bg-bg-card border border-white/[0.08] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-indigo"
          />
        </div>
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

      <div className="bg-bg-card border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Name</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium hidden lg:table-cell">Service</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium hidden lg:table-cell">Budget</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/[0.04]">
                    <td className="px-4 py-3"><div className="h-4 bg-white/[0.06] rounded w-24 animate-pulse" /></td>
                    <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 bg-white/[0.06] rounded w-32 animate-pulse" /></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><div className="h-4 bg-white/[0.06] rounded w-20 animate-pulse" /></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><div className="h-4 bg-white/[0.06] rounded w-16 animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-white/[0.06] rounded w-20 animate-pulse" /></td>
                    <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 bg-white/[0.06] rounded w-20 animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-white/[0.06] rounded w-8 ml-auto animate-pulse" /></td>
                  </tr>
                ))
              ) : leads.map((lead: any) => (
                <tr key={lead._id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium">{lead.name}</td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{lead.email}</td>
                  <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{lead.service || '—'}</td>
                  <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{lead.budget || '—'}</td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) => statusMutation.mutate({ id: lead._id, status: e.target.value })}
                      className={`px-2 py-1 rounded-full text-xs border-0 focus:outline-none cursor-pointer ${statusColors[lead.status] || 'bg-gray-500/10 text-gray-400'}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-bg-secondary text-white">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => removeMutation.mutate(lead._id)} className="p-1.5 text-gray-400 hover:text-red-400 transition-colors">
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && leads.length === 0 && (
          <div className="p-8 text-center text-gray-500">No leads found</div>
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
