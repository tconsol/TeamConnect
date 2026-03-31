import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HiOutlinePencil, HiOutlinePlus, HiOutlineTrash, HiOutlineXMark } from 'react-icons/hi2';
import {
  SiAngular,
  SiDocker,
  SiFlutter,
  SiGo,
  SiJavascript,
  SiKotlin,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRuby,
  SiSwift,
  SiTailwindcss,
  SiTypescript,
  SiVuedotjs,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { createSkill, deleteSkill, getSkills, updateSkill } from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import { Dropdown } from '@/components/ui/Dropdown';

type SkillForm = {
  name: string;
  iconKey: string;
  color: string;
  proficiency: number;
  order: number;
  isActive: boolean;
};

type IconOption = {
  value: string;
  label: string;
  icon: IconType;
};

const ICON_OPTIONS: IconOption[] = [
  { value: 'SiReact', label: 'React', icon: SiReact },
  { value: 'SiNextdotjs', label: 'Next.js', icon: SiNextdotjs },
  { value: 'SiTypescript', label: 'TypeScript', icon: SiTypescript },
  { value: 'SiTailwindcss', label: 'Tailwind CSS', icon: SiTailwindcss },
  { value: 'SiVuedotjs', label: 'Vue.js', icon: SiVuedotjs },
  { value: 'SiAngular', label: 'Angular', icon: SiAngular },
  { value: 'SiNodedotjs', label: 'Node.js', icon: SiNodedotjs },
  { value: 'SiJavascript', label: 'JavaScript', icon: SiJavascript },
  { value: 'FaJava', label: 'Java', icon: FaJava },
  { value: 'SiJava', label: 'Java (Legacy)', icon: FaJava },
  { value: 'SiPython', label: 'Python', icon: SiPython },
  { value: 'SiGo', label: 'Go', icon: SiGo },
  { value: 'SiPhp', label: 'PHP', icon: SiPhp },
  { value: 'SiRuby', label: 'Ruby', icon: SiRuby },
  { value: 'SiFlutter', label: 'Flutter', icon: SiFlutter },
  { value: 'SiSwift', label: 'Swift', icon: SiSwift },
  { value: 'SiKotlin', label: 'Kotlin', icon: SiKotlin },
  { value: 'SiMongodb', label: 'MongoDB', icon: SiMongodb },
  { value: 'SiPostgresql', label: 'PostgreSQL', icon: SiPostgresql },
  { value: 'SiDocker', label: 'Docker', icon: SiDocker },
];

const ICON_MAP = ICON_OPTIONS.reduce<Record<string, IconType>>((acc, item) => {
  acc[item.value] = item.icon;
  return acc;
}, {});

const defaultForm: SkillForm = {
  name: '',
  iconKey: 'SiReact',
  color: '#8B5CF6',
  proficiency: 90,
  order: 0,
  isActive: true,
};

export default function Skills() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SkillForm>(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string>('');

  const { data: skills, isLoading } = useQuery({
    queryKey: ['admin-skills'],
    queryFn: getSkills,
  });

  const SelectedIcon = useMemo(() => ICON_MAP[form.iconKey] || SiReact, [form.iconKey]);

  const saveMutation = useMutation({
    mutationFn: (payload: FormData) => (editingId ? updateSkill(editingId, payload) : createSkill(payload)),
    onSuccess: () => {
      toast.success(editingId ? 'Skill updated' : 'Skill created');
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      closeModal();
    },
    onError: () => {
      toast.error('Failed to save skill');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      toast.success('Skill deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
    },
    onError: () => {
      toast.error('Failed to delete skill');
    },
  });

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(defaultForm);
    setImageFile(null);
    setExistingImage('');
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultForm);
    setImageFile(null);
    setExistingImage('');
    setShowModal(true);
  };

  const openEdit = (item: any) => {
    setEditingId(item._id);
    setForm({
      name: item.name || '',
      iconKey: item.iconKey || 'SiReact',
      color: item.color || '#8B5CF6',
      proficiency: Number(item.proficiency || 0),
      order: Number(item.order || 0),
      isActive: item.isActive !== false,
    });
    setExistingImage(item.image || '');
    setImageFile(null);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append('name', form.name);
    payload.append('iconKey', form.iconKey);
    payload.append('color', form.color);
    payload.append('proficiency', String(form.proficiency));
    payload.append('order', String(form.order));
    payload.append('isActive', String(form.isActive));

    if (imageFile) {
      payload.append('image', imageFile);
    }

    saveMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Skills</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage technologies shown in the client "Technologies We Master" section.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-accent-indigo text-white rounded-lg hover:bg-accent-indigo/90 transition-colors"
        >
          <HiOutlinePlus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      <div className="bg-bg-card border border-white/[0.06] rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Skill</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Icon</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Proficiency</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium hidden lg:table-cell">Order</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium hidden lg:table-cell">Status</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index} className="border-b border-white/[0.04]">
                  <td className="px-4 py-3"><div className="h-4 bg-white/[0.06] rounded w-24 animate-pulse" /></td>
                  <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 bg-white/[0.06] rounded w-16 animate-pulse" /></td>
                  <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 bg-white/[0.06] rounded w-20 animate-pulse" /></td>
                  <td className="px-4 py-3 hidden lg:table-cell"><div className="h-4 bg-white/[0.06] rounded w-12 animate-pulse" /></td>
                  <td className="px-4 py-3 hidden lg:table-cell"><div className="h-4 bg-white/[0.06] rounded w-16 animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-white/[0.06] rounded w-16 ml-auto animate-pulse" /></td>
                </tr>
              ))
            ) : (
              (skills || []).map((item: any) => {
                const Icon = ICON_MAP[item.iconKey] || SiReact;
                return (
                  <tr key={item._id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Icon className="w-4 h-4" style={{ color: item.color || '#8B5CF6' }} />
                        <span className="text-xs">{item.iconKey}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300 hidden md:table-cell">{item.proficiency}%</td>
                    <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{item.order}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={item.isActive ? 'text-emerald-400' : 'text-gray-500'}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-1.5 text-gray-400 hover:text-white transition-colors"
                        >
                          <HiOutlinePencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this skill?')) {
                              deleteMutation.mutate(item._id);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {!isLoading && (!skills || skills.length === 0) && (
          <div className="p-8 text-center text-gray-500">No skills found. Add your first skill.</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-xl rounded-2xl" style={{ background: '#0d1025', border: '1px solid rgba(99,102,241,0.2)' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
              <div>
                <h2 className="text-base font-semibold text-white">{editingId ? 'Edit Skill' : 'New Skill'}</h2>
                <p className="text-xs" style={{ color: 'rgba(148,163,184,0.55)', marginTop: 2 }}>
                  Configure icon, color, proficiency, and optional uploaded image.
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
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>Skill Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>Icon</label>
                    <Dropdown
                      value={form.iconKey}
                      onChange={(v) => setForm({ ...form, iconKey: v })}
                      options={ICON_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                    />
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                      <SelectedIcon className="w-4 h-4" style={{ color: form.color }} />
                      {form.iconKey}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={form.color}
                        onChange={(e) => setForm({ ...form, color: e.target.value })}
                        className="w-12 h-10 rounded-lg bg-transparent border border-white/10"
                      />
                      <input
                        value={form.color}
                        onChange={(e) => setForm({ ...form, color: e.target.value })}
                        className="flex-1 px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>Proficiency %</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={form.proficiency}
                      onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>Order</label>
                    <input
                      type="number"
                      min={0}
                      value={form.order}
                      onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>Status</label>
                    <Dropdown
                      value={form.isActive ? 'true' : 'false'}
                      onChange={(v) => setForm({ ...form, isActive: v === 'true' })}
                      options={[{ value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }]}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>Image Upload (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-500/10 file:text-indigo-400 file:cursor-pointer"
                  />
                  {existingImage && !imageFile && (
                    <a href={existingImage} target="_blank" rel="noreferrer" className="inline-block mt-2 text-xs text-indigo-300 hover:text-indigo-200 transition-colors">
                      View current uploaded image
                    </a>
                  )}
                  {imageFile && (
                    <p className="mt-2 text-xs text-emerald-300">Selected: {imageFile.name}</p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(99,102,241,0.12)' }}>
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg text-sm transition-colors" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(148,163,184,0.8)' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saveMutation.isPending} className="px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-all" style={{ background: 'linear-gradient(135deg,#6366F1,#3B82F6)' }}>
                  {saveMutation.isPending ? 'Saving…' : editingId ? 'Update Skill' : 'Create Skill'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
