import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPortfolios, createPortfolio, updatePortfolio, deletePortfolio } from '@/services/api';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineXMark } from 'react-icons/hi2';

interface PortfolioForm {
  title: string;
  category: string;
  client: string;
  description: string;
  challenge: string;
  solution: string;
  results: string;
  technologies: string;
  liveUrl: string;
  isFeatured: boolean;
}

const emptyForm: PortfolioForm = { title: '', category: '', client: '', description: '', challenge: '', solution: '', results: '', technologies: '', liveUrl: '', isFeatured: false };

export default function Portfolio() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PortfolioForm>(emptyForm);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ['admin-portfolios'], queryFn: getPortfolios });

  const saveMutation = useMutation({
    mutationFn: (formData: FormData) =>
      editingId ? updatePortfolio(editingId, formData) : createPortfolio(formData),
    onSuccess: () => {
      toast.success(editingId ? 'Project updated' : 'Project created');
      queryClient.invalidateQueries({ queryKey: ['admin-portfolios'] });
      closeModal();
    },
    onError: () => toast.error('Failed to save project'),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePortfolio,
    onSuccess: () => {
      toast.success('Project deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-portfolios'] });
    },
    onError: () => toast.error('Failed to delete'),
  });

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
    setThumbnail(null);
  };

  const openEdit = (item: any) => {
    setEditingId(item._id);
    setForm({
      title: item.title || '',
      category: item.category || '',
      client: item.client || '',
      description: item.description || '',
      challenge: item.challenge || '',
      solution: item.solution || '',
      results: item.results || '',
      technologies: (item.technologies || []).join(', '),
      liveUrl: item.liveUrl || '',
      isFeatured: item.isFeatured || false,
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('category', form.category);
    fd.append('client', form.client);
    fd.append('description', form.description);
    fd.append('challenge', form.challenge);
    fd.append('solution', form.solution);
    fd.append('results', form.results);
    fd.append('technologies', JSON.stringify(form.technologies.split(',').map((s) => s.trim()).filter(Boolean)));
    fd.append('liveUrl', form.liveUrl);
    fd.append('isFeatured', String(form.isFeatured));
    if (thumbnail) fd.append('thumbnail', thumbnail);
    saveMutation.mutate(fd);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <button
          onClick={() => { setForm(emptyForm); setEditingId(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-accent-indigo text-white rounded-lg hover:bg-accent-indigo/90 transition-colors"
        >
          <HiOutlinePlus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <div className="bg-bg-card border border-white/[0.06] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Title</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium hidden lg:table-cell">Client</th>
              <th className="text-center px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Featured</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b border-white/[0.04]">
                  <td className="px-4 py-3"><div className="h-4 bg-white/[0.06] rounded w-32 animate-pulse" /></td>
                  <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 bg-white/[0.06] rounded w-20 animate-pulse" /></td>
                  <td className="px-4 py-3 hidden lg:table-cell"><div className="h-4 bg-white/[0.06] rounded w-24 animate-pulse" /></td>
                  <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 bg-white/[0.06] rounded w-8 mx-auto animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-white/[0.06] rounded w-16 ml-auto animate-pulse" /></td>
                </tr>
              ))
            ) : (data || []).map((item: any) => (
              <tr key={item._id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-medium">{item.title}</td>
                <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{item.category}</td>
                <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{item.client}</td>
                <td className="px-4 py-3 text-center hidden md:table-cell">
                  {item.isFeatured ? <span className="text-green-400">Yes</span> : <span className="text-gray-500">No</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-white transition-colors">
                      <HiOutlinePencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteMutation.mutate(item._id)} className="p-1.5 text-gray-400 hover:text-red-400 transition-colors">
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoading && (!data || data.length === 0) && (
          <div className="p-8 text-center text-gray-500">No projects found</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-card border border-white/[0.08] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 m-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">{editingId ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white"><HiOutlineXMark className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Title</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Client</label>
                <input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Challenge</label>
                <textarea value={form.challenge} onChange={(e) => setForm({ ...form, challenge: e.target.value })} rows={2} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Solution</label>
                <textarea value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} rows={2} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Results</label>
                <textarea value={form.results} onChange={(e) => setForm({ ...form, results: e.target.value })} rows={2} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Technologies (comma separated)</label>
                <input value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Live URL</label>
                <input value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Thumbnail</label>
                <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} className="w-full text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-accent-indigo/10 file:text-accent-indigo file:cursor-pointer" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="rounded border-white/20 bg-white/[0.04] text-accent-indigo focus:ring-accent-indigo" />
                <span className="text-sm text-gray-400">Featured Project</span>
              </label>
              <button type="submit" disabled={saveMutation.isPending} className="w-full py-2.5 bg-accent-indigo text-white rounded-lg hover:bg-accent-indigo/90 disabled:opacity-50 transition-colors">
                {saveMutation.isPending ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
