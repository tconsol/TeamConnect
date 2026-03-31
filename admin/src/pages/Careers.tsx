import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJobs, createJob, updateJob, deleteJob } from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import { Dropdown } from '@/components/ui/Dropdown';
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
  techStackFrontend: string;
  techStackBackend: string;
  techStackDatabases: string;
  techStackFrameworks: string;
  techStackDevTools: string;
}

const emptyForm: JobForm = {
  title: '', department: '', location: '', type: 'full-time', experience: '',
  description: '', requirements: '', responsibilities: '', salaryMin: '', salaryMax: '', isActive: true,
  techStackFrontend: '', techStackBackend: '', techStackDatabases: '', techStackFrameworks: '', techStackDevTools: '',
};

const JOB_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'remote', label: 'Remote' },
];

const fieldClass = "w-full px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none resize-none";
const fieldStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };
const labelClass = "block text-xs font-medium mb-1.5";
const labelStyle = { color: 'rgba(148,163,184,0.7)' };

export default function Careers() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<JobForm>(emptyForm);

  const { data, isLoading } = useQuery({ queryKey: ['admin-jobs'], queryFn: getJobs });

  const saveMutation = useMutation({
    mutationFn: (body: any) => editingId ? updateJob(editingId, body) : createJob(body),
    onSuccess: () => {
      toast.success(editingId ? 'Job updated successfully' : 'Job created successfully');
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
      techStackFrontend: (job.techStack?.frontend || []).join('\n'),
      techStackBackend: (job.techStack?.backend || []).join('\n'),
      techStackDatabases: (job.techStack?.databases || []).join('\n'),
      techStackFrameworks: (job.techStack?.frameworks || []).join('\n'),
      techStackDevTools: (job.techStack?.devTools || []).join('\n'),
    });
    setShowModal(true);
  };

  const splitLines = (s: string) => s.split('\n').map((l) => l.trim()).filter(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body: any = {
      title: form.title,
      department: form.department,
      location: form.location,
      type: form.type,
      experience: form.experience,
      description: form.description,
      requirements: JSON.stringify(splitLines(form.requirements)),
      responsibilities: JSON.stringify(splitLines(form.responsibilities)),
      isActive: form.isActive,
      techStack: JSON.stringify({
        frontend: splitLines(form.techStackFrontend),
        backend: splitLines(form.techStackBackend),
        databases: splitLines(form.techStackDatabases),
        frameworks: splitLines(form.techStackFrameworks),
        devTools: splitLines(form.techStackDevTools),
      }),
    };
    if (form.salaryMin || form.salaryMax) {
      const min = Number(form.salaryMin) || 0;
      const max = Number(form.salaryMax) || 0;
      if (min < 0 || max < 0) { toast.error('Salary values must be non-negative'); return; }
      if (min > max && max > 0) { toast.error('Minimum salary cannot exceed maximum'); return; }
      body.salaryRange = JSON.stringify({ min, max, currency: 'INR', period: 'annum' });
    }
    saveMutation.mutate(body);
  };

  const set = (key: keyof JobForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Careers / Jobs</h1>
        <button
          onClick={() => { setForm(emptyForm); setEditingId(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-accent-indigo text-white rounded-lg hover:bg-accent-indigo/90 transition-colors"
        >
          <HiOutlinePlus className="w-4 h-4" /> Add Job
        </button>
      </div>

      <div className="bg-bg-card border border-white/[0.06] rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
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
      {showModal && createPortal(
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center" style={{ width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-2xl rounded-2xl px-4" style={{ background: '#0d1025', border: '1px solid rgba(99,102,241,0.2)' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
              <div>
                <h2 className="text-base font-semibold text-white">{editingId ? 'Edit Job' : 'New Job'}</h2>
                <p className="text-xs" style={{ color: 'rgba(148,163,184,0.55)', marginTop: 2 }}>
                  {editingId ? 'Update job listing details' : 'Fill in the job listing information'}
                </p>
              </div>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <HiOutlineXMark className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit}>
              <div style={{ maxHeight: 'calc(90vh - 140px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 24px 20px' }}>

                {/* Basic info */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(99,102,241,0.8)' }}>Basic Info</p>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className={labelClass} style={labelStyle}>Title *</label>
                      <input value={form.title} onChange={set('title')} required className={fieldClass} style={fieldStyle} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass} style={labelStyle}>Department *</label>
                        <input value={form.department} onChange={set('department')} required className={fieldClass} style={fieldStyle} />
                      </div>
                      <div>
                        <label className={labelClass} style={labelStyle}>Location *</label>
                        <input value={form.location} onChange={set('location')} required className={fieldClass} style={fieldStyle} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass} style={labelStyle}>Job Type</label>
                        <Dropdown value={form.type} onChange={(v) => setForm({ ...form, type: v })} options={JOB_TYPES} />
                      </div>
                      <div>
                        <label className={labelClass} style={labelStyle}>Experience</label>
                        <input value={form.experience} onChange={set('experience')} className={fieldClass} style={fieldStyle} placeholder="e.g. 3-5 years" />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>Description *</label>
                      <textarea value={form.description} onChange={set('description')} required rows={3} className={fieldClass} style={fieldStyle} />
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(99,102,241,0.1)' }} />

                {/* Requirements & Responsibilities */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(99,102,241,0.8)' }}>Role Details</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass} style={labelStyle}>Requirements <span className="text-white/30 font-normal">(one per line)</span></label>
                      <textarea value={form.requirements} onChange={set('requirements')} rows={4} className={fieldClass} style={fieldStyle} />
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>Responsibilities <span className="text-white/30 font-normal">(one per line)</span></label>
                      <textarea value={form.responsibilities} onChange={set('responsibilities')} rows={4} className={fieldClass} style={fieldStyle} />
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(99,102,241,0.1)' }} />

                {/* Tech Stack */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(99,102,241,0.8)' }}>Tech Stack</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass} style={labelStyle}>Frontend <span className="text-white/30 font-normal">(one per line)</span></label>
                      <textarea value={form.techStackFrontend} onChange={set('techStackFrontend')} rows={3} placeholder="React&#10;TypeScript&#10;Tailwind CSS" className={fieldClass} style={fieldStyle} />
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>Backend <span className="text-white/30 font-normal">(one per line)</span></label>
                      <textarea value={form.techStackBackend} onChange={set('techStackBackend')} rows={3} placeholder="Node.js&#10;Express&#10;Python" className={fieldClass} style={fieldStyle} />
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>Databases <span className="text-white/30 font-normal">(one per line)</span></label>
                      <textarea value={form.techStackDatabases} onChange={set('techStackDatabases')} rows={3} placeholder="MongoDB&#10;PostgreSQL&#10;Redis" className={fieldClass} style={fieldStyle} />
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>Frameworks <span className="text-white/30 font-normal">(one per line)</span></label>
                      <textarea value={form.techStackFrameworks} onChange={set('techStackFrameworks')} rows={3} placeholder="Next.js&#10;NestJS&#10;FastAPI" className={fieldClass} style={fieldStyle} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass} style={labelStyle}>Dev Tools <span className="text-white/30 font-normal">(one per line)</span></label>
                      <textarea value={form.techStackDevTools} onChange={set('techStackDevTools')} rows={3} placeholder="Docker&#10;Kubernetes&#10;GitHub Actions" className={fieldClass} style={fieldStyle} />
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(99,102,241,0.1)' }} />

                {/* Salary & Status */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(99,102,241,0.8)' }}>Compensation</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass} style={labelStyle}>Min Salary (INR / annum)</label>
                      <input type="number" value={form.salaryMin} onChange={set('salaryMin')} className={fieldClass} style={fieldStyle} />
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>Max Salary (INR / annum)</label>
                      <input type="number" value={form.salaryMax} onChange={set('salaryMax')} className={fieldClass} style={fieldStyle} />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer mt-3">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-white/20 text-accent-indigo focus:ring-accent-indigo" />
                    <span className="text-sm" style={{ color: 'rgba(148,163,184,0.7)' }}>Active listing</span>
                  </label>
                </div>

              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(99,102,241,0.12)' }}>
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg text-sm transition-colors" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(148,163,184,0.8)' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saveMutation.isPending} className="px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-all" style={{ background: 'linear-gradient(135deg,#6366F1,#3B82F6)' }}>
                  {saveMutation.isPending ? 'Saving…' : editingId ? 'Update Job' : 'Create Job'}
                </button>
              </div>
            </form>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
