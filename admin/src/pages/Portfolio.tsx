import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPortfolios, createPortfolio, updatePortfolio, deletePortfolio } from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import { DeleteDrawer } from '@/components/ui/DeleteDrawer';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineXMark } from 'react-icons/hi2';

interface PortfolioForm {
  title: string;
  shortDescription: string;
  category: string;
  client: string;
  description: string;
  challenges: string;
  solution: string;
  results: string;
  technologies: string;
  liveUrl: string;
  isFeatured: boolean;
}

const emptyForm: PortfolioForm = { title: '', shortDescription: '', category: '', client: '', description: '', challenges: '', solution: '', results: '', technologies: '', liveUrl: '', isFeatured: false };

export default function Portfolio() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PortfolioForm>(emptyForm);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(null);
  const [deleteDrawerOpen, setDeleteDrawerOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);

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
      setDeleteDrawerOpen(false);
      setItemToDelete(null);
    },
    onError: () => toast.error('Failed to delete'),
  });

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
    setThumbnail(null);
    setThumbnailPreview(null);
    setExistingThumbnail(null);
  };

  const openEdit = (item: any) => {
    setEditingId(item._id);
    setForm({
      title: item.title || '',
      shortDescription: item.shortDescription || '',
      category: item.category || '',
      client: item.client || '',
      description: item.description || '',
      challenges: (item.challenges || []).join(', '),
      solution: (item.solution || []).join(', '),
      results: (item.results || []).join(', '),
      technologies: (item.technologies || []).join(', '),
      liveUrl: item.liveUrl || '',
      isFeatured: item.isFeatured || false,
    });
    setExistingThumbnail(item.thumbnail || null);
    setShowModal(true);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setThumbnailPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('shortDescription', form.shortDescription);
    fd.append('category', form.category);
    fd.append('client', form.client);
    fd.append('description', form.description);
    fd.append('challenges', JSON.stringify(form.challenges.split(',').map((s) => s.trim()).filter(Boolean)));
    fd.append('solution', JSON.stringify(form.solution.split(',').map((s) => s.trim()).filter(Boolean)));
    fd.append('results', JSON.stringify(form.results.split(',').map((s) => s.trim()).filter(Boolean)));
    fd.append('technologies', JSON.stringify(form.technologies.split(',').map((s) => s.trim()).filter(Boolean)));
    fd.append('liveUrl', form.liveUrl);
    fd.append('isFeatured', String(form.isFeatured));
    if (thumbnail) fd.append('thumbnail', thumbnail);
    saveMutation.mutate(fd);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <button
          onClick={() => { setForm(emptyForm); setEditingId(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-accent-indigo text-white rounded-lg hover:bg-accent-indigo/90 transition-colors"
        >
          <HiOutlinePlus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <div className="bg-bg-card border border-white/[0.06] rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead>
            <tr style={{ background: 'rgba(99,102,241,0.08)', borderBottom: '1px solid rgba(99,102,241,0.2)' }}>
              <th className="text-left px-4 py-3 text-gray-300 font-semibold">Thumbnail</th>
              <th className="text-left px-4 py-3 text-gray-300 font-semibold">Title</th>
              <th className="text-left px-4 py-3 text-gray-300 font-semibold hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 text-gray-300 font-semibold hidden lg:table-cell">Client</th>
              <th className="text-center px-4 py-3 text-gray-300 font-semibold hidden md:table-cell">Featured</th>
              <th className="text-right px-4 py-3 text-gray-300 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b border-white/[0.04]">
                  <td className="px-4 py-3"><div className="h-12 w-12 bg-white/[0.06] rounded animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-white/[0.06] rounded w-32 animate-pulse" /></td>
                  <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 bg-white/[0.06] rounded w-20 animate-pulse" /></td>
                  <td className="px-4 py-3 hidden lg:table-cell"><div className="h-4 bg-white/[0.06] rounded w-24 animate-pulse" /></td>
                  <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 bg-white/[0.06] rounded w-8 mx-auto animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-white/[0.06] rounded w-16 ml-auto animate-pulse" /></td>
                </tr>
              ))
            ) : (data || []).map((item: any) => (
              <tr key={item._id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.title} className="h-12 w-12 object-cover rounded" />
                  ) : (
                    <div className="h-12 w-12 bg-white/[0.06] rounded flex items-center justify-center text-xs text-gray-500">No image</div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-white">{item.title}</td>
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
                    <button 
                      onClick={() => {
                        setItemToDelete({ id: item._id, title: item.title });
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
        {!isLoading && (!data || data.length === 0) && (
          <div className="p-8 text-center text-gray-500">No projects found</div>
        )}
      </div>

      {/* Modal */}
      {showModal && createPortal(
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center" style={{ width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-lg rounded-2xl px-4" style={{ background: '#0d1025', border: '1px solid rgba(99,102,241,0.2)' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
              <div>
                <h2 className="text-base font-semibold text-white">{editingId ? 'Edit Project' : 'New Project'}</h2>
                <p className="text-xs" style={{ color: 'rgba(148,163,184,0.55)', marginTop: 2 }}>{editingId ? 'Update project details' : 'Add a new portfolio project'}</p>
              </div>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <HiOutlineXMark className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit}>
              <div style={{ maxHeight: 'calc(90vh - 140px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, padding: '20px 24px 20px' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <label className="block text-sm text-gray-400 mb-1">Short Description</label>
                  <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} required maxLength={500} placeholder="One-line summary for cards and listings" className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo" />
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
                  <label className="block text-sm text-gray-400 mb-1">Challenge <span className="text-xs text-gray-500">(comma-separated)</span></label>
                  <textarea value={form.challenges} onChange={(e) => setForm({ ...form, challenges: e.target.value })} rows={2} placeholder="e.g. Tight deadline, Legacy codebase, Scalability" className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo resize-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Solution <span className="text-xs text-gray-500">(comma-separated)</span></label>
                  <textarea value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} rows={2} placeholder="e.g. Agile sprints, Microservices, CI/CD pipeline" className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo resize-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Results <span className="text-xs text-gray-500">(comma-separated)</span></label>
                  <textarea value={form.results} onChange={(e) => setForm({ ...form, results: e.target.value })} rows={2} placeholder="e.g. 40% faster load time, 99.9% uptime, 2x more users" className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo resize-none" />
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
                  <label className="block text-sm text-gray-400 mb-2">Thumbnail</label>
                  <div className="space-y-3">
                    {(thumbnailPreview || existingThumbnail) && (
                      <div className="relative w-full">
                        <img 
                          src={(thumbnailPreview || existingThumbnail) as string} 
                          alt="Thumbnail preview" 
                          className="w-full h-40 object-cover rounded-lg border border-white/[0.08]" 
                        />
                        {saveMutation.isPending && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <div className="text-white text-sm">Uploading...</div>
                          </div>
                        )}
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleThumbnailChange} 
                      className="w-full text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-accent-indigo/10 file:text-accent-indigo file:cursor-pointer" 
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="rounded border-white/20 bg-white/[0.04] text-accent-indigo focus:ring-accent-indigo" />
                  <span className="text-sm text-gray-400">Featured Project</span>
                </label>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(99,102,241,0.12)' }}>
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg text-sm transition-colors" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(148,163,184,0.8)' }}>Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-all" style={{ background: 'linear-gradient(135deg,#6366F1,#3B82F6)' }}>
                  {saveMutation.isPending ? 'Saving…' : editingId ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>

          </div>
        </div>,
        document.body
      )}

      {/* Delete Drawer */}
      <DeleteDrawer
        isOpen={deleteDrawerOpen}
        title="Delete Project"
        description="This action cannot be undone. The project and its thumbnail will be permanently removed from the portfolio."
        itemName={itemToDelete?.title}
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
