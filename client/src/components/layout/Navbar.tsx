import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/services', label: 'Services' },
  { path: '/solutions', label: 'Solutions' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/careers', label: 'Careers' },
  { path: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        '.mobile-nav-link',
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [isOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-custom flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/" className="relative z-50 flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-indigo to-accent-blue flex items-center justify-center font-bold text-lg group-hover:shadow-lg group-hover:shadow-accent-indigo/25 transition-shadow">
            T
          </div>
          <span className="text-xl font-bold tracking-tight">
            TCON <span className="text-text-muted font-normal">Solutions</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                location.pathname === link.path
                  ? 'text-white bg-white/[0.08]'
                  : 'text-text-body hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          to="/contact"
          className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-indigo to-accent-blue text-white text-sm font-semibold hover:shadow-lg hover:shadow-accent-indigo/25 transition-all duration-300 hover:scale-[1.02]"
        >
          Start Project
        </Link>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-50 lg:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-[#050505]/98 backdrop-blur-2xl lg:hidden transition-all duration-500 ${
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-nav-link text-3xl font-semibold transition-colors ${
                  location.pathname === link.path
                    ? 'gradient-text'
                    : 'text-text-body hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="mobile-nav-link mt-4 px-8 py-3 rounded-xl bg-gradient-to-r from-accent-indigo to-accent-blue text-white font-semibold"
            >
              Start Project
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
