import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getServices, createService, updateService, deleteService } from '@/services/api';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineXMark } from 'react-icons/hi2';

interface ServiceForm {
  title: string;
  description: string;
  features: string;
  technologies: string;
  icon: string;
}

const emptyForm: ServiceForm = { title: '', description: '', features: '', technologies: '', icon: '' };

export default function Services() {
  const queryClient = useQueryClient();
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
      description: service.description || '',
      features: (service.features || []).join(', '),
      technologies: (service.technologies || []).join(', '),
      icon: service.icon || '',
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('features', JSON.stringify(form.features.split(',').map((s) => s.trim()).filter(Boolean)));
    fd.append('technologies', JSON.stringify(form.technologies.split(',').map((s) => s.trim()).filter(Boolean)));
    fd.append('icon', form.icon);
    if (image) fd.append('image', image);
    saveMutation.mutate(fd);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Services</h1>
        <button
          onClick={() => { setForm(emptyForm); setEditingId(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-accent-indigo text-white rounded-lg hover:bg-accent-indigo/90 transition-colors"
        >
          <HiOutlinePlus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* Table */}
      <div className="bg-bg-card border border-white/[0.06] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
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
                <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{service.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(service)} className="p-1.5 text-gray-400 hover:text-white transition-colors">
                      <HiOutlinePencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteMutation.mutate(service._id)} className="p-1.5 text-gray-400 hover:text-red-400 transition-colors">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-card border border-white/[0.08] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 m-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">{editingId ? 'Edit Service' : 'New Service'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white"><HiOutlineXMark className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Icon (class name)</label>
                <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Features (comma separated)</label>
                <input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Technologies (comma separated)</label>
                <input value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="w-full text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-accent-indigo/10 file:text-accent-indigo file:cursor-pointer" />
              </div>
              <button type="submit" disabled={saveMutation.isPending} className="w-full py-2.5 bg-accent-indigo text-white rounded-lg hover:bg-accent-indigo/90 disabled:opacity-50 transition-colors">
                {saveMutation.isPending ? 'Saving...' : editingId ? 'Update Service' : 'Create Service'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
