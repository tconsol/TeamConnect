import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getServices, createService, updateService, deleteService } from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineXMark } from 'react-icons/hi2';

interface ServiceForm {
  title: string;
  shortDescription: string;
  description: string;
  features: string;
  technologies: string;
  icon: string;
}

const emptyForm: ServiceForm = { title: '', shortDescription: '', description: '', features: '', technologies: '', icon: '' };

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export default function Services() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [image, setImage] = useState<File | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ['admin-services'], queryFn: getServices });

  const saveMutation = useMutation({
    mutationFn: (formData: FormData) =>
      editingId ? updateService(editingId, formData) : createService(formData),
    onSuccess: () => {
      toast.success(editingId ? 'Service updated' : 'Service created');
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      closeModal();
    },
    onError: () => toast.error('Failed to save service'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      toast.success('Service deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    },
    onError: () => toast.error('Failed to delete'),
  });

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
    setImage(null);
  };

  const openEdit = (service: any) => {
    setEditingId(service._id);
    setForm({
      title: service.title || '',
      shortDescription: service.shortDescription || '',
      description: service.description || '',
      features: (service.features || []).map((f: any) => typeof f === 'object' ? f.title : String(f)).join(', '),
      technologies: (service.technologies || []).join(', '),
      icon: service.icon || '',
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('shortDescription', form.shortDescription);
    fd.append('description', form.description);
    const featureTitles = form.features.split(',').map((s) => s.trim()).filter(Boolean);
    fd.append('features', JSON.stringify(featureTitles.map((t) => ({ title: t, description: '' }))));
    fd.append('technologies', JSON.stringify(form.technologies.split(',').map((s) => s.trim()).filter(Boolean)));
    fd.append('icon', form.icon);
    if (image) fd.append('image', image);
    saveMutation.mutate(fd);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Services</h1>
        <button
          onClick={() => { setForm(emptyForm); setEditingId(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-accent-indigo text-white rounded-lg hover:bg-accent-indigo/90 transition-colors"
        >
          <HiOutlinePlus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* Table */}
      <div className="bg-bg-card border border-white/[0.06] rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Title</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Technologies</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium hidden lg:table-cell">Slug</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b border-white/[0.04]">
                  <td className="px-4 py-3"><div className="h-4 bg-white/[0.06] rounded w-32 animate-pulse" /></td>
                  <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 bg-white/[0.06] rounded w-40 animate-pulse" /></td>
                  <td className="px-4 py-3 hidden lg:table-cell"><div className="h-4 bg-white/[0.06] rounded w-24 animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-white/[0.06] rounded w-16 ml-auto animate-pulse" /></td>
                </tr>
              ))
            ) : (data || []).map((service: any) => (
              <tr key={service._id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-medium">{service.title}</td>
                <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{(service.technologies || []).join(', ')}</td>
                <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{service.slug || toSlug(service.title || '')}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(service)} className="p-1.5 text-gray-400 hover:text-white transition-colors">
                      <HiOutlinePencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => { if (window.confirm('Are you sure you want to delete this service?')) deleteMutation.mutate(service._id); }} className="p-1.5 text-gray-400 hover:text-red-400 transition-colors">
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoading && (!data || data.length === 0) && (
          <div className="p-8 text-center text-gray-500">No services found</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-lg rounded-2xl" style={{ background: '#0d1025', border: '1px solid rgba(99,102,241,0.2)' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
              <div>
                <h2 className="text-base font-semibold text-white">{editingId ? 'Edit Service' : 'New Service'}</h2>
                <p className="text-xs" style={{ color: 'rgba(148,163,184,0.55)', marginTop: 2 }}>
                  {editingId ? 'Update service details' : 'Fill in the service information'}
                </p>
              </div>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <HiOutlineXMark className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit}>
              <div style={{ maxHeight: 'calc(90vh - 140px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, padding: '20px 24px 20px' }}>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>Title</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>Short Description</label>
                  <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} required maxLength={500} placeholder="One-line summary" className="w-full px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className="w-full px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none resize-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>Icon (class name)</label>
                  <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>Features (comma separated)</label>
                  <input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="w-full px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>Technologies (comma separated)</label>
                  <input value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} className="w-full px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="w-full text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-500/10 file:text-indigo-400 file:cursor-pointer" />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(99,102,241,0.12)' }}>
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg text-sm transition-colors" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(148,163,184,0.8)' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saveMutation.isPending} className="px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-all" style={{ background: 'linear-gradient(135deg,#6366F1,#3B82F6)' }}>
                  {saveMutation.isPending ? 'Saving…' : editingId ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
