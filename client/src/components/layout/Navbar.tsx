import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '@/assets/tconsollogo.png';
import {
  HiOutlineHome,
  HiOutlineInformationCircle,
  HiOutlineCog6Tooth,
  HiOutlineLightBulb,
  HiOutlineSquares2X2,
  HiOutlineBriefcase,
  HiOutlineEnvelope,
  HiArrowLongRight,
} from 'react-icons/hi2';
import Dock from '@/components/ui/Dock';
import { HamburgerMenuOverlay } from '@/components/ui/HamburgerMenuOverlay';

const navLinks = [
  { path: '/', label: 'Home', Icon: HiOutlineHome },
  { path: '/about', label: 'About', Icon: HiOutlineInformationCircle },
  { path: '/services', label: 'Services', Icon: HiOutlineCog6Tooth },
  { path: '/solutions', label: 'Solutions', Icon: HiOutlineLightBulb },
  { path: '/portfolio', label: 'Portfolio', Icon: HiOutlineSquares2X2 },
  { path: '/careers', label: 'Careers', Icon: HiOutlineBriefcase },
  { path: '/contact', label: 'Contact', Icon: HiOutlineEnvelope },
];

function isRouteActive(pathname: string, targetPath: string) {
  if (targetPath === '/') return pathname === '/';
  return pathname === targetPath || pathname.startsWith(`${targetPath}/`);
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const overlayItems = [
    ...navLinks.map((link) => ({
      label: link.label,
      isActive: isRouteActive(location.pathname, link.path),
      onClick: () => navigate(link.path),
    })),
  ];

  const dockItems = navLinks.map((link) => ({
    icon: <link.Icon className="w-5 h-5" />,
    label: link.label,
    isActive: isRouteActive(location.pathname, link.path),
    onClick: () => navigate(link.path),
  }));

  return (
    <>
      {/* ── Sticky header bar ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#030014]/85 backdrop-blur-xl border-b border-white/[0.06]'
            : 'bg-transparent'
        }`}
      >
        <nav className="container-custom flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="relative z-[1002] flex items-center group">
            <img src={logo} alt="TCON Solutions" className="h-10 w-auto object-contain group-hover:opacity-90 transition-opacity" />
          </Link>

          {/* Desktop — CTA + hamburger overlay */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/contact"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-indigo to-accent-blue text-white text-sm font-semibold hover:shadow-lg hover:shadow-accent-indigo/25 transition-all duration-300 hover:scale-[1.02]"
            >
              Start Project
              <HiArrowLongRight className="w-4 h-4" />
            </Link>
            <HamburgerMenuOverlay
              items={overlayItems}
              fontSize="xl"
              menuAlignment="left"
              overlayBackground="linear-gradient(135deg, #05050f 0%, #08081a 50%, #050510 100%)"
            />
          </div>

          {/* Mobile — hamburger overlay (top-right) */}
          <div className="lg:hidden">
            <HamburgerMenuOverlay
              items={overlayItems}
              fontSize="lg"
              menuAlignment="left"
              overlayBackground="linear-gradient(135deg, #05050f 0%, #08081a 50%, #050510 100%)"
            />
          </div>
        </nav>
      </header>

      {/* ── Mobile Dock — fixed bottom for touch screens ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[99] pointer-events-none">
        <div className="pointer-events-auto">
          <Dock
            items={dockItems}
            baseItemSize={44}
            magnification={58}
            magnificationDistance={80}
            gap={6}
          />
        </div>
      </div>
    </>
  );
}
