import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJobs, createJob, updateJob, deleteJob } from '@/services/api';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineXMark } from 'react-icons/hi2';

interface JobForm {
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string;
  responsibilities: string;
  salaryMin: string;
  salaryMax: string;
  isActive: boolean;
}

const emptyForm: JobForm = { title: '', department: '', location: '', type: 'full-time', experience: '', description: '', requirements: '', responsibilities: '', salaryMin: '', salaryMax: '', isActive: true };

export default function Careers() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<JobForm>(emptyForm);

  const { data, isLoading } = useQuery({ queryKey: ['admin-jobs'], queryFn: getJobs });

  const saveMutation = useMutation({
    mutationFn: (body: any) => editingId ? updateJob(editingId, body) : createJob(body),
    onSuccess: () => {
      toast.success(editingId ? 'Job updated' : 'Job created');
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      closeModal();
    },
    onError: () => toast.error('Failed to save job'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      toast.success('Job deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
    },
    onError: () => toast.error('Failed to delete'),
  });

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const openEdit = (job: any) => {
    setEditingId(job._id);
    setForm({
      title: job.title || '',
      department: job.department || '',
      location: job.location || '',
      type: job.type || 'full-time',
      experience: job.experience || '',
      description: job.description || '',
      requirements: (job.requirements || []).join('\n'),
      responsibilities: (job.responsibilities || []).join('\n'),
      salaryMin: job.salaryRange?.min?.toString() || '',
      salaryMax: job.salaryRange?.max?.toString() || '',
      isActive: job.isActive !== false,
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body: any = {
      title: form.title,
      department: form.department,
      location: form.location,
      type: form.type,
      experience: form.experience,
      description: form.description,
      requirements: JSON.stringify(form.requirements.split('\n').map((s) => s.trim()).filter(Boolean)),
      responsibilities: JSON.stringify(form.responsibilities.split('\n').map((s) => s.trim()).filter(Boolean)),
      isActive: form.isActive,
    };
    if (form.salaryMin || form.salaryMax) {
      body.salaryRange = JSON.stringify({ min: Number(form.salaryMin) || 0, max: Number(form.salaryMax) || 0 });
    }
    saveMutation.mutate(body);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Careers / Jobs</h1>
        <button
          onClick={() => { setForm(emptyForm); setEditingId(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-accent-indigo text-white rounded-lg hover:bg-accent-indigo/90 transition-colors"
        >
          <HiOutlinePlus className="w-4 h-4" /> Add Job
        </button>
      </div>

      <div className="bg-bg-card border border-white/[0.06] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Title</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Department</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium hidden lg:table-cell">Type</th>
              <th className="text-center px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Status</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b border-white/[0.04]">
                  <td className="px-4 py-3"><div className="h-4 bg-white/[0.06] rounded w-32 animate-pulse" /></td>
                  <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 bg-white/[0.06] rounded w-24 animate-pulse" /></td>
                  <td className="px-4 py-3 hidden lg:table-cell"><div className="h-4 bg-white/[0.06] rounded w-20 animate-pulse" /></td>
                  <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 bg-white/[0.06] rounded w-12 mx-auto animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-white/[0.06] rounded w-16 ml-auto animate-pulse" /></td>
                </tr>
              ))
            ) : (data || []).map((job: any) => (
              <tr key={job._id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-medium">{job.title}</td>
                <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{job.department}</td>
                <td className="px-4 py-3 text-gray-400 capitalize hidden lg:table-cell">{job.type}</td>
                <td className="px-4 py-3 text-center hidden md:table-cell">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${job.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                    {job.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(job)} className="p-1.5 text-gray-400 hover:text-white transition-colors">
                      <HiOutlinePencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteMutation.mutate(job._id)} className="p-1.5 text-gray-400 hover:text-red-400 transition-colors">
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoading && (!data || data.length === 0) && (
          <div className="p-8 text-center text-gray-500">No jobs found</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-card border border-white/[0.08] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 m-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">{editingId ? 'Edit Job' : 'New Job'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white"><HiOutlineXMark className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Department</label>
                  <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Location</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo">
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Experience</label>
                  <input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Requirements (one per line)</label>
                <textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} rows={3} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Responsibilities (one per line)</label>
                <textarea value={form.responsibilities} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} rows={3} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Min Salary</label>
                  <input type="number" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Max Salary</label>
                  <input type="number" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-accent-indigo" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-white/20 bg-white/[0.04] text-accent-indigo focus:ring-accent-indigo" />
                <span className="text-sm text-gray-400">Active</span>
              </label>
              <button type="submit" disabled={saveMutation.isPending} className="w-full py-2.5 bg-accent-indigo text-white rounded-lg hover:bg-accent-indigo/90 disabled:opacity-50 transition-colors">
                {saveMutation.isPending ? 'Saving...' : editingId ? 'Update Job' : 'Create Job'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
