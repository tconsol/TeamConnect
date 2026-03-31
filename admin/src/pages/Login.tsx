import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg-primary to-bg-secondary p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(99,102,241,0.1),transparent_38%),radial-gradient(circle_at_82%_14%,rgba(139,92,246,0.1),transparent_34%)]" />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-indigo to-accent-blue flex items-center justify-center font-bold text-4xl mx-auto mb-6 shadow-xl shadow-accent-indigo/30">
            T
          </div>
          <h1 className="text-4xl font-black text-white">Admin Portal</h1>
          <p className="text-gray-400 text-sm mt-3">Manage TCON Solutions with ease</p>
        </div>

        <div className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl rounded-3xl p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.12] text-white placeholder:text-gray-600 focus:outline-none focus:border-accent-indigo/50 focus:bg-white/[0.06] transition-all"
                placeholder="admin@tconsolutions.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 pr-12 rounded-xl bg-white/[0.04] border border-white/[0.12] text-white placeholder:text-gray-600 focus:outline-none focus:border-accent-indigo/50 focus:bg-white/[0.06] transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <HiOutlineEyeSlash className="w-5 h-5" />
                  ) : (
                    <HiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-indigo to-accent-blue text-white font-bold hover:shadow-2xl hover:shadow-accent-indigo/30 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-xs mt-8">
          © 2024 TCON Solutions. All rights reserved.
        </p>
      </div>
    </div>
  );
}
