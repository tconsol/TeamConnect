import { Link } from 'react-router-dom';
import { HiArrowUp } from 'react-icons/hi2';

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

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/[0.06] bg-bg-secondary">
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-accent-indigo/50 to-transparent" />

      <div className="container-custom py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-indigo to-accent-blue flex items-center justify-center font-bold text-lg">
                T
              </div>
              <span className="text-xl font-bold tracking-tight">
                TCON <span className="text-text-muted font-normal">Solutions</span>
              </span>
            </Link>
            <p className="text-text-body max-w-sm mb-6 leading-relaxed">
              We build premium digital experiences that drive growth and
              transform businesses. Let's create something extraordinary together.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-lg glass flex items-center justify-center text-text-muted hover:text-white hover:bg-white/[0.08] transition-all"
                  aria-label={social}
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-text-heading uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-text-body hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-16 pt-8 border-t border-white/[0.06]">
          <p className="text-text-muted text-sm">
            &copy; {new Date().getFullYear()} TCON Solutions. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="mt-4 sm:mt-0 w-10 h-10 rounded-lg glass flex items-center justify-center text-text-muted hover:text-white hover:bg-white/[0.08] transition-all"
            aria-label="Back to top"
          >
            <HiArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
