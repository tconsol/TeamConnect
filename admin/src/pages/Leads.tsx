import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLeads, updateLeadStatus, deleteLead } from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import { DeleteDrawer } from '@/components/ui/DeleteDrawer';
import { Dropdown } from '@/components/ui/Dropdown';
import { HiOutlineTrash, HiOutlineMagnifyingGlass, HiOutlineEye, HiOutlineXMark } from 'react-icons/hi2';

const STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
const STATUS_OPTIONS = STATUSES.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }));
const FILTER_OPTIONS = [{ value: '', label: 'All Statuses' }, ...STATUS_OPTIONS];
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
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewingLead, setViewingLead] = useState<any | null>(null);
  const [deleteDrawerOpen, setDeleteDrawerOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);

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
      setDeleteDrawerOpen(false);
      setItemToDelete(null);
    },
    onError: () => toast.error('Failed to delete'),
  });

  const leads: any[] = data?.data || [];
  const totalPages: number = data?.pagination?.pages || 1;

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
        <Dropdown
          value={statusFilter}
          onChange={(v) => { setStatusFilter(v); setPage(1); }}
          options={FILTER_OPTIONS}
          placeholder="All Statuses"
          className="min-w-[160px]"
        />
      </div>

      <div className="tc-table-wrap">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(99,102,241,0.08)', borderBottom: '1px solid rgba(99,102,241,0.2)' }}>
                <th className="text-left px-4 py-3 text-gray-300 font-semibold">Name</th>
                <th className="text-left px-4 py-3 text-gray-300 font-semibold hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-gray-300 font-semibold hidden lg:table-cell">Service</th>
                <th className="text-left px-4 py-3 text-gray-300 font-semibold hidden lg:table-cell">Budget</th>
                <th className="text-left px-4 py-3 text-gray-300 font-semibold">Status</th>
                <th className="text-left px-4 py-3 text-gray-300 font-semibold hidden md:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-gray-300 font-semibold">Actions</th>
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
                <tr key={lead._id} className="border-b border-slate-100 dark:border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium dark:text-white text-slate-900">{lead.name}</td>
                  <td className="px-4 py-3 dark:text-slate-400 text-slate-500 hidden md:table-cell">{lead.email}</td>
                  <td className="px-4 py-3 dark:text-slate-400 text-slate-500 hidden lg:table-cell">{lead.service || '—'}</td>
                  <td className="px-4 py-3 dark:text-slate-400 text-slate-500 hidden lg:table-cell">{lead.budget || '—'}</td>
                  <td className="px-4 py-3">
                    <Dropdown
                      value={lead.status}
                      onChange={(v) => statusMutation.mutate({ id: lead._id, status: v })}
                      options={STATUS_OPTIONS}
                      compact
                      badgeClassName={statusColors[lead.status] || 'bg-gray-500/10 text-gray-400'}
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setViewingLead(lead)} 
                        className="p-1.5 text-gray-400 hover:text-white transition-colors"
                      >
                        <HiOutlineEye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setItemToDelete({ id: lead._id, name: lead.name });
                          setDeleteDrawerOpen(true);
                        }} 
                        className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
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
            className="px-3 py-1.5 text-sm analytics-card border-0 rounded-lg disabled:opacity-30 hover:bg-indigo-500/[0.06] transition-colors dark:text-slate-300 text-slate-600"
          >
            Previous
          </button>
          <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm analytics-card border-0 rounded-lg disabled:opacity-30 hover:bg-indigo-500/[0.06] transition-colors dark:text-slate-300 text-slate-600"
          >
            Next
          </button>
        </div>
      )}

      {/* Lead Details Modal */}
      {viewingLead && createPortal(
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center" style={{ width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-lg rounded-2xl px-4 tc-modal-box">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
              <div>
                <h2 className="text-base font-semibold text-white">Lead Details</h2>
                <p className="text-xs tc-modal-sub" style={{ marginTop: 2 }}>{viewingLead.name}</p>
              </div>
              <button 
                onClick={() => setViewingLead(null)} 
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white transition-colors" 
                style={{ background: 'var(--tc-modal-field-bg)', color: 'var(--tc-text-secondary)' }}
              >
                <HiOutlineXMark className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div style={{ maxHeight: 'calc(90vh - 200px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, padding: '20px 24px 20px' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Name</label>
                  <p className="dark:text-white text-slate-900">{viewingLead.name}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Email</label>
                  <p className="dark:text-white text-slate-900 break-all">{viewingLead.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Phone</label>
                  <p className="dark:text-white text-slate-900">{viewingLead.phone || '—'}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Company</label>
                  <p className="dark:text-white text-slate-900">{viewingLead.company || '—'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Service</label>
                  <p className="dark:text-white text-slate-900 capitalize">{viewingLead.service || '—'}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Budget</label>
                  <p className="dark:text-white text-slate-900">{viewingLead.budget || '—'}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Status</label>
                <Dropdown
                  value={viewingLead.status}
                  onChange={(v) => {
                    statusMutation.mutate({ id: viewingLead._id, status: v });
                    setViewingLead({ ...viewingLead, status: v });
                  }}
                  options={STATUS_OPTIONS}
                  placeholder="Update status"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Message</label>
                <p className="dark:text-white text-slate-900 text-sm leading-relaxed whitespace-pre-wrap">{viewingLead.message || '—'}</p>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Date</label>
                <p className="dark:text-white text-slate-900 text-sm">{new Date(viewingLead.createdAt).toLocaleString()}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(99,102,241,0.12)' }}>
              <button 
                type="button" 
                onClick={() => setViewingLead(null)} 
                className="px-4 py-2 rounded-lg text-sm transition-colors tc-cancel-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Drawer */}
      <DeleteDrawer
        isOpen={deleteDrawerOpen}
        title="Delete Lead"
        description="This action cannot be undone. The lead and all associated information will be permanently removed."
        itemName={itemToDelete?.name}
        onConfirm={() => {
          if (itemToDelete) removeMutation.mutate(itemToDelete.id);
        }}
        onCancel={() => {
          setDeleteDrawerOpen(false);
          setItemToDelete(null);
        }}
        isDeleting={removeMutation.isPending}
      />
    </div>
  );
}
