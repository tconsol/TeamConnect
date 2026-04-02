import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialActive,
  reorderTestimonials,
} from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import { DeleteDrawer } from '@/components/ui/DeleteDrawer';
import {
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
  HiOutlineEye,
  HiOutlineXMark,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineEyeSlash,
} from 'react-icons/hi2';


export default function Testimonials() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [viewingTestimonial, setViewingTestimonial] = useState<any | null>(null);
  const [deleteDrawerOpen, setDeleteDrawerOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    quote: '',
    author: '',
    role: '',
    company: '',
    avatar: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: getTestimonials,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const form = new FormData();
      form.append('quote', formData.quote);
      form.append('author', formData.author);
      form.append('role', formData.role);
      form.append('company', formData.company);
      form.append('avatar', formData.avatar || formData.author?.charAt(0).toUpperCase() || '?');
      if (imageFile) form.append('image', imageFile);
      return createTestimonial(form);
    },
    onSuccess: () => {
      toast.success('Testimonial created');
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      setCreateModalOpen(false);
      resetForm();
    },
    onError: () => toast.error('Failed to create testimonial'),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const form = new FormData();
      form.append('quote', formData.quote);
      form.append('author', formData.author);
      form.append('role', formData.role);
      form.append('company', formData.company);
      form.append('avatar', formData.avatar || formData.author?.charAt(0).toUpperCase() || '?');
      if (imageFile) form.append('image', imageFile);
      return updateTestimonial(editingId!, form);
    },
    onSuccess: () => {
      toast.success('Testimonial updated');
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      setCreateModalOpen(false);
      setEditingId(null);
      resetForm();
    },
    onError: () => toast.error('Failed to update testimonial'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => {
      toast.success('Testimonial deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      setDeleteDrawerOpen(false);
      setItemToDelete(null);
    },
    onError: () => toast.error('Failed to delete'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleTestimonialActive(id, isActive),
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
    },
    onError: () => toast.error('Failed to update status'),
  });

  const testimonials = data || [];
  const filtered = testimonials.filter(
    (t: any) =>
      t.author.toLowerCase().includes(search.toLowerCase()) ||
      t.quote.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      quote: '',
      author: '',
      role: '',
      company: '',
      avatar: '',
    });
    setImageFile(null);
  };

  const openCreateModal = (testimonial?: any) => {
    if (testimonial) {
      setEditingId(testimonial._id);
      setFormData({
        quote: testimonial.quote,
        author: testimonial.author,
        role: testimonial.role,
        company: testimonial.company || '',
        avatar: testimonial.avatar,
      });
    } else {
      resetForm();
    }
    setCreateModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <button
          onClick={() => {
            setEditingId(null);
            openCreateModal();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <HiOutlinePlus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {/* Filters */}
      <div className="relative flex-1 min-w-[200px]">
        <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search testimonials..."
          className="w-full pl-9 pr-3 py-2 bg-bg-card border border-white/[0.08] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-indigo"
        />
      </div>

      <div className="tc-table-wrap">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(99,102,241,0.08)', borderBottom: '1px solid rgba(99,102,241,0.2)' }}>
                <th className="text-left px-4 py-3 text-gray-300 font-semibold">Author</th>
                <th className="text-left px-4 py-3 text-gray-300 font-semibold hidden md:table-cell">Quote</th>
                <th className="text-left px-4 py-3 text-gray-300 font-semibold hidden lg:table-cell">Role / Company</th>
                <th className="text-left px-4 py-3 text-gray-300 font-semibold">Status</th>
                <th className="text-right px-4 py-3 text-gray-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/[0.04]">
                    <td className="px-4 py-3"><div className="h-4 bg-white/[0.06] rounded w-24 animate-pulse" /></td>
                    <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 bg-white/[0.06] rounded w-48 animate-pulse" /></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><div className="h-4 bg-white/[0.06] rounded w-32 animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-white/[0.06] rounded w-16 animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-white/[0.06] rounded w-8 ml-auto animate-pulse" /></td>
                  </tr>
                ))
              ) : filtered.map((testimonial: any) => (
                <tr key={testimonial._id} className="border-b border-slate-100 dark:border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium dark:text-white text-slate-900">{testimonial.author}</td>
                  <td className="px-4 py-3 dark:text-slate-400 text-slate-500 hidden md:table-cell line-clamp-2 text-xs">
                    {testimonial.quote}
                  </td>
                  <td className="px-4 py-3 dark:text-slate-400 text-slate-500 hidden lg:table-cell text-xs">
                    <span>{testimonial.role}</span>
                    {testimonial.company && <span className="block text-slate-500 dark:text-slate-500">{testimonial.company}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        toggleMutation.mutate({ id: testimonial._id, isActive: !testimonial.isActive })
                      }
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        testimonial.isActive
                          ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                          : 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'
                      }`}
                    >
                      {testimonial.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewingTestimonial(testimonial)}
                        className="p-1.5 text-gray-400 hover:text-white transition-colors"
                      >
                        <HiOutlineEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openCreateModal(testimonial)}
                        className="p-1.5 text-gray-400 hover:text-white edit-btn transition-colors"
                      >
                        <HiOutlinePencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete({ id: testimonial._id, name: testimonial.author });
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
        {!isLoading && filtered.length === 0 && (
          <div className="p-8 text-center text-gray-500">No testimonials found</div>
        )}
      </div>

      {/* Testimonial Details Modal */}
      {viewingTestimonial &&
        createPortal(
          <div
            className="fixed top-0 left-0 z-50 flex items-center justify-center"
            style={{ width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
          >
            <div className="w-full max-w-lg rounded-2xl px-4 tc-modal-box">
              {/* Header */}
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: '1px solid rgba(99,102,241,0.15)' }}
              >
                <div>
                  <h2 className="text-base font-semibold text-white">Testimonial Details</h2>
                  <p className="text-xs tc-modal-sub" style={{ marginTop: 2 }}>
                    {viewingTestimonial.author}
                  </p>
                </div>
                <button
                  onClick={() => setViewingTestimonial(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white transition-colors"
                  style={{ background: 'var(--tc-modal-field-bg)', color: 'var(--tc-text-secondary)' }}
                >
                  <HiOutlineXMark className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div
                style={{
                  maxHeight: 'calc(90vh - 200px)',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  padding: '20px 24px 20px',
                }}
              >
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Quote</label>
                  <p className="dark:text-white text-slate-900 text-sm italic">"{viewingTestimonial.quote}"</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Author</label>
                    <p className="dark:text-white text-slate-900">{viewingTestimonial.author}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Role</label>
                    <p className="dark:text-white text-slate-900">{viewingTestimonial.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Company</label>
                    <p className="dark:text-white text-slate-900">{viewingTestimonial.company || '—'}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Avatar</label>
                    <p className="dark:text-white text-slate-900">{viewingTestimonial.avatar}</p>
                  </div>
                </div>

                {viewingTestimonial.image && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Image</label>
                    <img src={viewingTestimonial.image} alt={viewingTestimonial.author} className="w-full h-40 object-cover rounded-lg" />
                  </div>
                )}

                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Status</label>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      viewingTestimonial.isActive
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-gray-500/10 text-gray-400'
                    }`}
                  >
                    {viewingTestimonial.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div
                className="flex items-center justify-end gap-3 px-6 py-4"
                style={{ borderTop: '1px solid rgba(99,102,241,0.12)' }}
              >
                <button
                  type="button"
                  onClick={() => setViewingTestimonial(null)}
                  className="px-4 py-2 rounded-lg text-sm transition-colors tc-cancel-btn"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Create/Edit Modal */}
      {createModalOpen &&
        createPortal(
          <div
            className="fixed top-0 left-0 z-50 flex items-center justify-center"
            style={{ width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
          >
            <div className="w-full max-w-lg rounded-2xl px-4 tc-modal-box">
              {/* Header */}
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: '1px solid rgba(99,102,241,0.15)' }}
              >
                <div>
                  <h2 className="text-base font-semibold text-white">
                    {editingId ? 'Edit Testimonial' : 'Create New Testimonial'}
                  </h2>
                  <p className="text-xs tc-modal-sub" style={{ marginTop: 2 }}>
                    {editingId ? 'Update testimonial details' : 'Add a new testimonial'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCreateModalOpen(false);
                    setEditingId(null);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white transition-colors"
                  style={{ background: 'var(--tc-modal-field-bg)', color: 'var(--tc-text-secondary)' }}
                >
                  <HiOutlineXMark className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div
                style={{
                  maxHeight: 'calc(90vh - 200px)',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  padding: '20px 24px 20px',
                }}
              >
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>Quote *</label>
                  <textarea
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    placeholder="Enter testimonial quote"
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none resize-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>Author *</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Full name"
                      className="w-full px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>Role *</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g. CEO, Founder"
                      className="w-full px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>Company / Business Name</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Clinfora LLP"
                      className="w-full px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>Avatar (Single Char)</label>
                    <input
                      type="text"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      placeholder="e.g. S"
                      maxLength={1}
                      className="w-full px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none uppercase"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                  </div>
                </div>

                <div className="px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', color: 'rgba(148,163,184,0.7)' }}>
                  ✦ Avatar gradient color is auto-generated randomly
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-500/10 file:text-indigo-400 file:cursor-pointer hover:file:bg-indigo-500/20 transition-colors"
                  />
                  {imageFile && (
                    <p className="mt-2 text-xs text-emerald-300">✓ Selected: {imageFile.name}</p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div
                className="flex items-center justify-end gap-3 px-6 py-4"
                style={{ borderTop: '1px solid rgba(99,102,241,0.12)' }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setCreateModalOpen(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 rounded-lg text-sm transition-colors tc-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!formData.quote || !formData.author || !formData.role) {
                      toast.error('Please fill in all required fields');
                      return;
                    }
                    editingId ? updateMutation.mutate() : createMutation.mutate();
                  }}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-all"
                  style={{ background: 'linear-gradient(135deg,#6366F1,#3B82F6)' }}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? editingId
                      ? 'Updating...'
                      : 'Creating...'
                    : editingId
                      ? 'Update Testimonial'
                      : 'Create Testimonial'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Delete Drawer */}
      <DeleteDrawer
        isOpen={deleteDrawerOpen}
        title="Delete Testimonial"
        description="This action cannot be undone. The testimonial will be permanently removed."
        itemName={itemToDelete?.name}
        onConfirm={() => {
          if (itemToDelete) deleteMutation.mutate(itemToDelete.id);
        }}
        onCancel={() => {
          setDeleteDrawerOpen(false);
          setItemToDelete(null);
        }}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
