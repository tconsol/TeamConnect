import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  HiOutlineHome,
  HiOutlineDocument,
  HiOutlineCog6Tooth,
  HiOutlineBriefcase,
  HiOutlineUsers,
  HiOutlineEnvelope,
  HiOutlineSquares2X2,
  HiArrowRightOnRectangle,
} from 'react-icons/hi2';

const navItems = [
  { path: '/', label: 'Dashboard', icon: HiOutlineHome },
  { path: '/cms', label: 'CMS', icon: HiOutlineDocument },
  { path: '/services', label: 'Services', icon: HiOutlineCog6Tooth },
  { path: '/portfolio', label: 'Portfolio', icon: HiOutlineSquares2X2 },
  { path: '/careers', label: 'Careers', icon: HiOutlineBriefcase },
  { path: '/applications', label: 'Applications', icon: HiOutlineUsers },
  { path: '/leads', label: 'Leads', icon: HiOutlineEnvelope },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-bg-primary">
      {/* Sidebar */}
      <aside className="w-64 bg-bg-secondary border-r border-white/[0.06] flex flex-col">
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-indigo to-accent-blue flex items-center justify-center font-bold text-sm">
              T
            </div>
            <div>
              <span className="text-sm font-bold">TCON Admin</span>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-accent-indigo/10 text-accent-indigo'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/[0.06]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all w-full"
          >
            <HiArrowRightOnRectangle className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
