import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineHome,
  HiOutlineInformationCircle,
  HiOutlineCog6Tooth,
  HiOutlineLightBulb,
  HiOutlineSquares2X2,
  HiOutlineBriefcase,
  HiOutlineEnvelope,
  HiArrowLongRight,
  HiOutlineChevronDown,
  HiOutlineCodeBracket,
  HiOutlineDevicePhoneMobile,
  HiOutlineCpuChip,
  HiOutlineServerStack,
  HiOutlineCloud,
  HiOutlinePaintBrush,
} from 'react-icons/hi2';
import Dock from '@/components/ui/Dock';
import { HamburgerMenuOverlay } from '@/components/ui/HamburgerMenuOverlay';

const navLinks = [
  { path: '/', label: 'Home', Icon: HiOutlineHome },
  { path: '/about', label: 'About', Icon: HiOutlineInformationCircle },
  { path: '/services', label: 'Services', Icon: HiOutlineCog6Tooth, hasDropdown: true },
  { path: '/solutions', label: 'Solutions', Icon: HiOutlineLightBulb },
  { path: '/portfolio', label: 'Portfolio', Icon: HiOutlineSquares2X2 },
  { path: '/careers', label: 'Careers', Icon: HiOutlineBriefcase },
  { path: '/contact', label: 'Contact', Icon: HiOutlineEnvelope },
];

const megaMenuData = [
  {
    Icon: HiOutlineCodeBracket,
    title: 'Web Development',
    desc: 'Modern, scalable web applications built with cutting-edge frameworks.',
    badge: null,
    path: '/services',
  },
  {
    Icon: HiOutlineDevicePhoneMobile,
    title: 'Mobile Development',
    desc: 'Native and cross-platform mobile apps that users love.',
    badge: null,
    path: '/services',
  },
  {
    Icon: HiOutlineCloud,
    title: 'Cloud & DevOps',
    desc: 'Secure, scalable cloud infrastructure and CI/CD pipelines.',
    badge: null,
    path: '/services',
  },
  {
    Icon: HiOutlinePaintBrush,
    title: 'UI/UX Design',
    desc: 'Beautiful, intuitive interfaces that delight users.',
    badge: null,
    path: '/services',
  },
  {
    Icon: HiOutlineCpuChip,
    title: 'AI & Machine Learning',
    desc: 'Intelligent solutions powered by artificial intelligence.',
    badge: 'New',
    path: '/services',
  },
  {
    Icon: HiOutlineServerStack,
    title: 'Backend & API Development',
    desc: 'Robust backend systems and RESTful/GraphQL APIs.',
    badge: null,
    path: '/services',
  },
];

function isRouteActive(pathname: string, targetPath: string) {
  if (targetPath === '/') return pathname === '/';
  return pathname === targetPath || pathname.startsWith(`${targetPath}/`);
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const overlayItems = navLinks.map((link) => ({
    label: link.label,
    isActive: isRouteActive(location.pathname, link.path),
    onClick: () => navigate(link.path),
  }));

  const dockItems = navLinks.map((link) => ({
    icon: <link.Icon className="w-5 h-5" />,
    label: link.label,
    isActive: isRouteActive(location.pathname, link.path),
    onClick: () => navigate(link.path),
  }));

  return (
    <>
      {/* Sticky header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
      >
        <nav className="max-w-6xl mx-4 md:mx-auto flex items-center justify-between h-20 bg-[#030014]/85 backdrop-blur-xl border border-white/[0.08] rounded-3xl px-6 md:px-8 shadow-xl shadow-black/30">

          {/* Logo */}
          <Link to="/" className="relative z-[1002] flex items-center group">
            <picture>
              <source srcSet="/tconsollogo.webp" type="image/webp" />
              <img
                src="/tconsollogo.png"
                alt="TCON Solutions"
                width="122"
                height="40"
                fetchPriority="high"
                className="h-10 w-auto object-contain group-hover:opacity-90 transition-opacity"
              />
            </picture>
          </Link>

          {/* Desktop nav center */}
          <div className="hidden lg:flex items-center h-full gap-1">
            {navLinks.map((item) => (
              <div
                key={item.label}
                className="h-full px-4 flex items-center relative"
                onMouseEnter={() => item.hasDropdown && setHoveredMenu(item.label)}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-1 font-semibold text-sm transition-colors ${
                    isRouteActive(location.pathname, item.path)
                      ? 'text-indigo-400'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <HiOutlineChevronDown
                      className={`w-4 h-4 transition-transform ${
                        hoveredMenu === item.label ? 'rotate-180 text-indigo-400' : ''
                      }`}
                    />
                  )}
                </Link>

                {/* Active underline */}
                {isRouteActive(location.pathname, item.path) && (
                  <motion.div
                    layoutId="nav-highlight"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-t-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Mega menu dropdown */}
                {item.hasDropdown && (
                  <AnimatePresence>
                    {hoveredMenu === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute top-[80px] -left-[200px] w-[700px] bg-[#0a0a1f] border border-white/[0.08] shadow-2xl shadow-black/50 rounded-[32px] p-8 cursor-default flex overflow-hidden"
                      >
                        {/* Grid of services */}
                        <div className="w-2/3 grid grid-cols-2 gap-x-8 gap-y-6 pr-8 border-r border-white/[0.06]">
                          {megaMenuData.map((menuItem) => (
                            <Link
                              key={menuItem.title}
                              to={menuItem.path}
                              className="flex gap-4 group hover:bg-white/[0.04] p-3 -m-3 rounded-2xl transition-colors"
                            >
                              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white flex items-center justify-center shrink-0 transition-all">
                                <menuItem.Icon className="w-6 h-6" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-bold text-sm text-white">
                                    {menuItem.title}
                                  </h4>
                                  {menuItem.badge && (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                      {menuItem.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs font-medium text-zinc-500">{menuItem.desc}</p>
                              </div>
                            </Link>
                          ))}
                        </div>

                        {/* Right promo area */}
                        <div className="w-1/3 pl-8 flex flex-col justify-between">
                          <div>
                            <h3 className="font-black text-xs uppercase tracking-widest text-zinc-500 mb-4">
                              Featured
                            </h3>
                            <div className="w-full h-32 bg-white/[0.04] border border-white/[0.06] rounded-2xl mb-4 overflow-hidden relative group cursor-pointer">
                              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 group-hover:opacity-70 transition-opacity" />
                              <HiOutlineCpuChip className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-400 scale-100 group-hover:scale-125 transition-transform" />
                            </div>
                            <h4 className="font-bold text-sm text-white mb-2">
                              AI-Powered Solutions
                            </h4>
                            <p className="text-xs font-medium text-zinc-500 mb-6">
                              See how we leverage AI to transform your business workflows.
                            </p>
                          </div>
                          <Link
                            to="/solutions"
                            className="flex items-center font-bold text-indigo-400 text-xs hover:text-indigo-300 transition-colors"
                          >
                            Explore solutions <HiArrowLongRight className="w-4 h-4 ml-1" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* Right CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/contact"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-indigo to-accent-blue text-white text-sm font-semibold hover:shadow-lg hover:shadow-accent-indigo/25 transition-all duration-300 hover:scale-[1.02]"
            >
              Start Project
              <HiArrowLongRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile hamburger */}
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

      {/* Mobile Dock */}
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
