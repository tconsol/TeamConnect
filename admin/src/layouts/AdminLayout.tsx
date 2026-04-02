import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ThemeToggle from '@/components/ui/ThemeToggle';
import logo from '@/assets/tconsollogo.png';
import {
  HiOutlineHome,
  HiOutlineDocument,
  HiOutlineCog6Tooth,
  HiOutlineCpuChip,
  HiOutlineBriefcase,
  HiOutlineUsers,
  HiOutlineEnvelope,
  HiOutlineSquares2X2,
  HiArrowRightOnRectangle,
  HiOutlineUserCircle,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineQuestionMarkCircle,
} from 'react-icons/hi2';

const navItems = [
  { path: '/', label: 'Dashboard', icon: HiOutlineHome },
  { path: '/cms', label: 'CMS', icon: HiOutlineDocument },
  { path: '/services', label: 'Services', icon: HiOutlineCog6Tooth },
  { path: '/skills', label: 'Skills', icon: HiOutlineCpuChip },
  { path: '/portfolio', label: 'Portfolio', icon: HiOutlineSquares2X2 },
  { path: '/careers', label: 'Careers', icon: HiOutlineBriefcase },
  { path: '/applications', label: 'Applications', icon: HiOutlineBriefcase },
  { path: '/users', label: 'Users', icon: HiOutlineUsers },
  { path: '/leads', label: 'Leads', icon: HiOutlineEnvelope },
  { path: '/testimonials', label: 'Testimonials', icon: HiOutlineQuestionMarkCircle },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen" style={{ background: 'var(--tc-bg-body)' }}>
      {/* ── Mobile sidebar overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)} style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`flex flex-col flex-shrink-0 transition-all duration-300 ${
          mobileOpen ? 'fixed inset-y-0 left-0 z-50 w-64' : 'hidden'
        } md:relative md:flex ${collapsed ? 'md:w-[68px]' : 'md:w-64'}`}
        style={{
          background: 'var(--tc-bg-sidebar)',
          borderRight: '1px solid var(--tc-border-sidebar)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Brand */}
        <div
          className={`flex items-center ${collapsed ? 'justify-center px-2' : 'px-4'} py-4`}
          style={{ borderBottom: '1px solid var(--tc-border-topbar)' }}
        >
          <img src={logo} alt="TCON" className={`object-contain transition-all duration-300 ${collapsed ? 'h-8' : 'h-9'}`} />
          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-white md:hidden"
          >
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {!collapsed && (
            <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-indigo-400/40">
              Navigation
            </p>
          )}
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center ${collapsed ? 'justify-center' : ''} gap-3 ${collapsed ? 'px-2' : 'px-3'} py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-500 dark:text-indigo-200/50 hover:text-slate-800 dark:hover:text-indigo-100 hover:bg-indigo-500/[0.08]'
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(59,130,246,0.1) 100%)',
                      borderLeft: collapsed ? 'none' : '2px solid #6366F1',
                      paddingLeft: collapsed ? undefined : '10px',
                    }
                  : {}
              }
            >
              <item.icon className="flex-shrink-0" style={{ width: '18px', height: '18px' }} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-2 py-3 space-y-1" style={{ borderTop: '1px solid var(--tc-border-sidebar)' }}>
          {/* Profile link */}
          <NavLink
            to="/profile"
            title={collapsed ? 'Profile' : undefined}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? 'justify-center' : ''} gap-3 ${collapsed ? 'px-2' : 'px-3'} py-2.5 rounded-lg text-sm w-full transition-all duration-200 ${
                isActive
                  ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-500/[0.1]'
                  : 'text-slate-500 dark:text-indigo-200/50 hover:text-slate-800 dark:hover:text-indigo-100 hover:bg-indigo-500/[0.08]'
              }`
            }
          >
            <HiOutlineUserCircle className="flex-shrink-0" style={{ width: '18px', height: '18px' }} />
            {!collapsed && <span>Profile</span>}
          </NavLink>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title={collapsed ? 'Sign Out' : undefined}
            className={`flex items-center ${collapsed ? 'justify-center' : ''} gap-3 ${collapsed ? 'px-2' : 'px-3'} py-2.5 rounded-lg text-sm w-full transition-all duration-200 text-rose-400/60 hover:text-rose-400 hover:bg-rose-400/[0.08]`}
          >
            <HiArrowRightOnRectangle className="flex-shrink-0" style={{ width: '18px', height: '18px' }} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 flex-shrink-0"
          style={{
            background: 'var(--tc-bg-topbar)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--tc-border-topbar)',
          }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 rounded-lg transition-colors md:hidden"
              style={{ color: 'var(--tc-icon-btn)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--tc-icon-btn-hover)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--tc-icon-btn-hover-bg)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--tc-icon-btn)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              title="Open menu"
            >
              <HiOutlineBars3 className="w-5 h-5" />
            </button>
            {/* Collapse toggle (desktop only) */}
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="p-1.5 rounded-lg transition-colors hidden md:flex"
              style={{ color: 'var(--tc-icon-btn)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--tc-icon-btn-hover)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--tc-icon-btn-hover-bg)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--tc-icon-btn)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <HiOutlineChevronRight className="w-4 h-4" />
              ) : (
                <HiOutlineChevronLeft className="w-4 h-4" />
              )}
            </button>
            <span className="text-xs font-medium text-indigo-600/80 dark:text-indigo-400/60 hidden sm:inline">TCON Solutions</span>
            <span className="text-slate-400/60 dark:text-indigo-400/30 text-xs hidden sm:inline">›</span>
            <span className="text-xs font-medium text-slate-600 dark:text-white/60 hidden sm:inline">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-300" style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(59,130,246,0.1))' }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-slate-800 dark:text-white/80 leading-tight">{user?.name}</p>
                <p className="text-[10px] text-slate-500/70 dark:text-indigo-300/40 leading-tight">{user?.email}</p>
              </div>
            </div>
            <div
              className="px-3 py-1 rounded-full text-[11px] font-semibold text-emerald-300"
              style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}
            >
              ● Live
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
