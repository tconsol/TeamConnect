import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { changePassword } from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import { HiOutlineUser, HiOutlineEnvelope, HiOutlineShieldCheck, HiOutlineKey } from 'react-icons/hi2';

const fieldClass = "w-full px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none";
const fieldStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };
const labelClass = "block text-xs font-medium mb-1.5";
const labelStyle = { color: 'rgba(148,163,184,0.7)' };

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
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(148,163,184,0.5)' }}>Manage your account settings</p>
      </div>

      {/* Profile Info Card */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(10,12,28,0.98)', border: '1px solid rgba(99,102,241,0.18)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(99,102,241,0.15)', background: 'linear-gradient(135deg,rgba(99,102,241,0.12) 0%,rgba(10,12,28,0) 100%)' }}>
          <h2 className="text-base font-semibold text-white">Account Information</h2>
        </div>
        <div className="px-6 py-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-indigo-300" style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(59,130,246,0.1))' }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{user?.name}</p>
              <p className="text-sm" style={{ color: 'rgba(148,163,184,0.6)' }}>{user?.role?.charAt(0).toUpperCase()}{user?.role?.slice(1)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <HiOutlineUser className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.45)' }}>Name</p>
                <p className="text-sm text-white">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <HiOutlineEnvelope className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.45)' }}>Email</p>
                <p className="text-sm text-white">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <HiOutlineShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.45)' }}>Role</p>
                <p className="text-sm text-white capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(10,12,28,0.98)', border: '1px solid rgba(99,102,241,0.18)' }}>
        <div className="px-6 py-4 border-b flex items-center gap-2" style={{ borderColor: 'rgba(99,102,241,0.15)', background: 'linear-gradient(135deg,rgba(99,102,241,0.12) 0%,rgba(10,12,28,0) 100%)' }}>
          <HiOutlineKey className="w-4 h-4 text-indigo-400" />
          <h2 className="text-base font-semibold text-white">Change Password</h2>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          <div>
            <label className={labelClass} style={labelStyle}>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className={fieldClass}
              style={fieldStyle}
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className={fieldClass}
              style={fieldStyle}
              placeholder="Enter new password (min 8 characters)"
            />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={fieldClass}
              style={fieldStyle}
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
