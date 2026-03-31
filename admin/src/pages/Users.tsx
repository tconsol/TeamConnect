import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/Toast';
import { DeleteDrawer } from '@/components/ui/DeleteDrawer';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineXMark, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { getUsers, createUser, updateUser, deleteUser } from '@/services/api';

// Types
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  isActive: boolean;
  createdAt: string;
  createdBy?: string;
}

export default function Users() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [deleteDrawerOpen, setDeleteDrawerOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: '', role: user.role });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setForm({ name: '', email: '', password: '', role: 'admin' });
    setShowPassword(false);
  };

  // Get users from API
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getUsers,
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success('Admin user created successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setShowModal(false);
      setForm({ name: '', email: '', password: '', role: 'admin' });
    },
    onError: () => {
      toast.error('Failed to create admin user');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => updateUser(id, data),
    onSuccess: () => {
      toast.success('Admin user updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      closeModal();
    },
    onError: () => {
      toast.error('Failed to update admin user');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('Admin user deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setDeleteDrawerOpen(false);
      setItemToDelete(null);
    },
    onError: () => {
      toast.error('Failed to delete admin user');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error('Name and email are required');
      return;
    }
    if (!editingUser && !form.password) {
      toast.error('Password is required for new users');
      return;
    }
    if (editingUser) {
      const payload: any = { id: editingUser._id, name: form.name, email: form.email, role: form.role };
      if (form.password) payload.password = form.password;
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Users & Admins</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage admin users and their permissions</p>
        </div>
        <button
          onClick={() => { setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-accent-indigo text-white rounded-lg hover:bg-accent-indigo/90 transition-colors"
        >
          <HiOutlinePlus className="w-4 h-4" /> Create Admin
        </button>
      </div>

      {/* Table */}
      <div className="bg-bg-card border border-white/[0.06] rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead>
            <tr style={{ background: 'rgba(99,102,241,0.08)', borderBottom: '1px solid rgba(99,102,241,0.2)' }}>
              <th className="text-left px-4 py-3 text-gray-300 font-semibold">Name</th>
              <th className="text-left px-4 py-3 text-gray-300 font-semibold">Email</th>
              <th className="text-left px-4 py-3 text-gray-300 font-semibold hidden md:table-cell">Role</th>
              <th className="text-left px-4 py-3 text-gray-300 font-semibold hidden lg:table-cell">Status</th>
              <th className="text-left px-4 py-3 text-gray-300 font-semibold hidden lg:table-cell">Created</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No admin users found
                </td>
              </tr>
            ) : (
              users.map((user: User) => (
                <tr key={user._id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium text-white">{user.name}</td>
                  <td className="px-4 py-3 text-gray-400 break-all">{user.email}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${user.role === 'superadmin' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={user.isActive ? 'text-green-400' : 'text-gray-500'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(user)}
                        className="p-1.5 text-gray-400 hover:text-white transition-colors"
                      >
                        <HiOutlinePencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete({ id: user._id, name: user.name });
                          setDeleteDrawerOpen(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-lg rounded-2xl px-4" style={{ background: '#0d1025', border: '1px solid rgba(99,102,241,0.2)' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
              <div>
                <h2 className="text-base font-semibold text-white">{editingUser ? 'Edit Admin' : 'Create New Admin'}</h2>
                <p className="text-xs" style={{ color: 'rgba(148,163,184,0.55)', marginTop: 2 }}>
                  {editingUser ? 'Update admin user details' : 'Add a new admin user to manage TCON Solutions'}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <HiOutlineXMark className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit}>
              <div style={{ maxHeight: 'calc(90vh - 140px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, padding: '20px 24px 20px' }}>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    placeholder="john@tconsolutions.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>
                    Password{editingUser ? ' (leave blank to keep unchanged)' : ''}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required={!editingUser}
                      className="w-full px-3 py-2.5 pr-10 rounded-lg text-sm text-white focus:outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <HiOutlineEyeSlash className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>
                    Role
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(99,102,241,0.12)' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg text-sm transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(148,163,184,0.8)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-all"
                  style={{ background: 'linear-gradient(135deg,#6366F1,#3B82F6)' }}
                >
                  {(createMutation.isPending || updateMutation.isPending) ? 'Saving...' : editingUser ? 'Update Admin' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Drawer */}
      <DeleteDrawer
        isOpen={deleteDrawerOpen}
        title="Delete Admin User"
        description="This action cannot be undone. The admin user will be permanently removed from the system."
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
