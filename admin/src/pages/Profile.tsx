import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { changePassword } from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import { HiOutlineUser, HiOutlineEnvelope, HiOutlineShieldCheck, HiOutlineKey } from 'react-icons/hi2';

const fieldClass = "w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none";
const labelClass = "block text-xs font-medium mb-1.5 tc-profile-label";

export default function Profile() {
  const { user } = useAuth();
  const toast = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const mutation = useMutation({
    mutationFn: () => changePassword(currentPassword, newPassword),
    onSuccess: () => {
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to change password');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--tc-text-primary)' }}>Profile</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--tc-text-muted)' }}>Manage your account settings</p>
      </div>

      {/* Profile Info Card */}
      <div className="tc-profile-card">
        <div className="px-6 py-4 border-b tc-profile-card-header">
          <h2>Account Information</h2>
        </div>
        <div className="px-6 py-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-indigo-300" style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(59,130,246,0.1))' }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-lg font-semibold tc-profile-value">{user?.name}</p>
              <p className="text-sm tc-profile-subtitle">{user?.role && user.role.length > 0 ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--tc-modal-field-bg)', border: '1px solid var(--tc-modal-field-border)' }}>
              <HiOutlineUser className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-widest tc-profile-label">Name</p>
                <p className="text-sm tc-profile-value">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--tc-modal-field-bg)', border: '1px solid var(--tc-modal-field-border)' }}>
              <HiOutlineEnvelope className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-widest tc-profile-label">Email</p>
                <p className="text-sm tc-profile-value">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--tc-modal-field-bg)', border: '1px solid var(--tc-modal-field-border)' }}>
              <HiOutlineShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-widest tc-profile-label">Role</p>
                <p className="text-sm tc-profile-value capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="tc-profile-card">
        <div className="px-6 py-4 border-b tc-profile-card-header flex items-center gap-2">
          <HiOutlineKey className="w-4 h-4 text-indigo-400" />
          <h2>Change Password</h2>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          <div>
            <label className={labelClass}>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className={fieldClass}
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className={labelClass}>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className={fieldClass}
              placeholder="Enter new password (min 8 characters)"
            />
          </div>
          <div>
            <label className={labelClass}>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={fieldClass}
              placeholder="Confirm new password"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-all"
              style={{ background: 'linear-gradient(135deg,#6366F1,#3B82F6)' }}
            >
              {mutation.isPending ? 'Updating…' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
