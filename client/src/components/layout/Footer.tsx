import { Link } from 'react-router-dom';
import { HiArrowUp } from 'react-icons/hi2';
import { BeamCircle, type OrbitConfig } from '@/components/ui/BeamCircle';
import logo from '@/assets/tconsollogo.png';

const footerLinks = {
  Company: [
    { label: 'About', path: '/about' },
    { label: 'Careers', path: '/careers' },
    { label: 'Contact', path: '/contact' },
  ],
  Services: [
    { label: 'Web Development', path: '/services' },
    { label: 'Mobile Apps', path: '/services' },
    { label: 'Cloud Solutions', path: '/services' },
    { label: 'UI/UX Design', path: '/services' },
  ],
  Resources: [
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Solutions', path: '/solutions' },
  ],
};

const footerOrbits: OrbitConfig[] = [
  {
    id: 1,
    radiusFactor: 0.28,
    speed: 9,
    href: 'https://twitter.com/tconsolutions',
    orbitColor: 'rgba(56,189,248,0.38)',
    orbitThickness: 1,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-sky-400">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: 2,
    radiusFactor: 0.44,
    speed: 15,
    href: 'https://linkedin.com/company/tconsolutions',
    orbitColor: 'rgba(96,165,250,0.38)',
    orbitThickness: 1,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-blue-400">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    id: 3,
    radiusFactor: 0.6,
    speed: 22,
    href: 'https://github.com/tconsolutions',
    orbitColor: 'rgba(148,163,184,0.3)',
    orbitThickness: 1,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-slate-300">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    id: 4,
    radiusFactor: 0.76,
    speed: 29,
    href: 'https://www.instagram.com/tcon.solutions',
    orbitColor: 'rgba(244,114,182,0.34)',
    orbitThickness: 1,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-pink-400">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#020010] overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-violet/40 to-transparent" />

      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)' }} />

      <div className="container-custom relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

            {/* Brand column */}
            <div className="lg:col-span-4">
              <Link to="/" className="inline-flex items-center mb-5 group">
                <img src={logo} alt="TCON Solutions" className="h-10 w-auto object-contain group-hover:opacity-90 transition-opacity" />
              </Link>
              <p className="text-sm text-white/40 max-w-xs leading-relaxed mb-8">
                We build premium digital experiences that drive growth and
                transform businesses. Let's create something extraordinary together.
              </p>

              {/* BeamCircle social orbit */}
              <div className="mt-10 lg:mt-12 flex items-center justify-center w-full lg:pr-8">
                <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
                  <div className="absolute inset-0 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.28) 0%, rgba(59,130,246,0.14) 45%, transparent 80%)' }} />
                  <BeamCircle size={150} orbits={footerOrbits} />
                </div>
              </div>
            </div>

            {/* Link columns */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-12 lg:pl-16">
                {Object.entries(footerLinks).map(([category, links]) => (
                  <div key={category}>
                    <h4 className="text-xs font-semibold text-white/60 uppercase tracking-[0.2em] mb-5">
                      {category}
                    </h4>
                    <ul className="space-y-3">
                      {links.map((link) => (
                        <li key={link.label}>
                          <Link
                            to={link.path}
                            className="text-sm text-white/35 hover:text-white transition-colors duration-200"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-6 border-t border-white/[0.06]">
          <p className="text-xs text-white/25">
            &copy; {new Date().getFullYear()} TCON Solutions. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-3 sm:mt-0">
            <span className="text-xs text-white/20">Built with passion</span>
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}
              aria-label="Back to top"
            >
              <HiArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
