import { useState, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowLongRight, HiOutlineXMark } from 'react-icons/hi2';

export interface OverlayMenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  isActive?: boolean;
}

interface HamburgerMenuOverlayProps {
  items: OverlayMenuItem[];
  overlayBackground?: string;
  buttonColor?: string;
  textColor?: string;
  fontSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  menuAlignment?: 'left' | 'center' | 'right';
  animationDuration?: number;
  staggerDelay?: number;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
  buttonClassName?: string;
}

const fontSizes: Record<string, string> = {
  sm: 'text-2xl md:text-3xl',
  md: 'text-3xl md:text-4xl',
  lg: 'text-4xl md:text-5xl',
  xl: 'text-5xl md:text-6xl',
  '2xl': 'text-5xl md:text-7xl',
};

export function HamburgerMenuOverlay({
  items,
  textColor = '#ffffff',
  fontSize = 'lg',
  animationDuration = 0.7,
  staggerDelay = 0.07,
  onOpen,
  onClose,
  className = '',
  buttonClassName = '',
}: HamburgerMenuOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  const open = () => {
    setIsOpen(true);
    document.body.classList.add('menu-open');
    onOpen?.();
  };
  const close = () => {
    setIsOpen(false);
    document.body.classList.remove('menu-open');
    onClose?.();
  };
  const toggle = () => (isOpen ? close() : open());

  // Clean up on unmount
  useEffect(() => {
    return () => { document.body.classList.remove('menu-open'); };
  }, []);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) close(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  const handleItemClick = (item: OverlayMenuItem) => {
    item.onClick?.();
    close();
  };

  const overlay = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 flex overflow-hidden ${className}`}
          style={{ zIndex: 99998 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: '#030014' }}
            initial={{ clipPath: 'circle(0% at calc(100% - 52px) 52px)' }}
            animate={{ clipPath: 'circle(200% at calc(100% - 52px) 52px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 52px) 52px)' }}
            transition={{ duration: animationDuration, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
            backgroundImage: 'radial-gradient(rgba(139,92,246,0.8) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />

          {/* Close Button - Top Right */}
          <motion.button
            onClick={close}
            className="absolute top-8 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:bg-white/[0.1]"
            style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.2 }}
            aria-label="Close menu"
          >
            <HiOutlineXMark className="w-6 h-6 text-white" />
          </motion.button>

          {/* Gradient blobs */}
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)' }} />
          <div className="absolute -top-24 right-0 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)' }} />

          {/* Content layout */}
          <div className="relative flex flex-col lg:flex-row w-full h-full" style={{ zIndex: 1 }}>

            {/* Left: Nav links */}
            <nav className="flex flex-col justify-center flex-1 px-10 sm:px-16 lg:px-24 py-20">
              <motion.p
                className="text-xs font-semibold uppercase tracking-[0.3em] mb-12 text-white"
                style={{ opacity: 0.4 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.4, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
              >
                Navigation
              </motion.p>

              <div className="flex flex-col gap-1">
                {items.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40, skewY: 4 }}
                    animate={{ opacity: 1, y: 0, skewY: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.2 + i * staggerDelay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    onHoverStart={() => setHovered(i)}
                    onHoverEnd={() => setHovered(null)}
                  >
                    <button
                      onClick={() => handleItemClick(item)}
                      className={`group relative flex items-center gap-5 py-2 px-3 cursor-pointer w-full text-left rounded-xl border transition-colors ${
                        item.isActive
                          ? 'bg-accent-violet/15 border-accent-violet/35'
                          : 'bg-transparent border-transparent hover:bg-white/[0.03] hover:border-white/[0.08]'
                      }`}
                      style={{
                        color:
                          hovered !== null && hovered !== i && !item.isActive
                            ? 'rgba(255,255,255,0.25)'
                            : item.isActive
                              ? '#c4b5fd'
                              : textColor,
                        transition: 'color 0.3s',
                      }}
                    >
                      {item.isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 rounded-r bg-accent-violet" />
                      )}

                      {/* Index number */}
                      <span
                        className="text-xs font-mono tabular-nums shrink-0 transition-opacity duration-300"
                        style={{
                          color: item.isActive ? '#c4b5fd' : 'rgba(139,92,246,0.7)',
                          opacity: hovered === i || item.isActive ? 1 : 0.5,
                        }}
                      >
                        0{i + 1}
                      </span>

                      {/* Label - no overflow-hidden so text never clips */}
                      <span className={`font-bold tracking-tight ${fontSizes[fontSize]}`} style={{ lineHeight: 1.1 }}>
                        <motion.span
                          className="inline-block"
                          animate={{ x: hovered === i ? 12 : 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {item.label}
                        </motion.span>
                      </span>

                      {/* Arrow */}
                      <motion.span
                        className="ml-auto flex items-center"
                        style={{ color: 'rgba(139,92,246,0.9)' }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                          opacity: hovered === i || item.isActive ? 1 : 0,
                          x: hovered === i || item.isActive ? 0 : -10,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <HiArrowLongRight className="w-6 h-6" />
                      </motion.span>
                    </button>

                    <div className="w-full h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  </motion.div>
                ))}
              </div>
            </nav>

            {/* Right panel - large screens */}
            <motion.div
              className="hidden lg:flex flex-col justify-between w-72 xl:w-80 border-l py-20 px-10"
              style={{ borderColor: 'rgba(139,92,246,0.12)' }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] mb-6 opacity-40 text-white">Quick Info</p>
                <div className="space-y-5">
                  {[
                    { label: 'Projects', value: '150+' },
                    { label: 'Clients', value: '50+' },
                    { label: 'Years', value: '5+' },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="text-3xl font-extrabold" style={{ background: 'linear-gradient(135deg,#8B5CF6,#3B82F6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                        {stat.value}
                      </div>
                      <div className="text-xs text-white/40 uppercase tracking-widest mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] mb-4 opacity-40 text-white">Contact</p>
                <a href="mailto:hello@tconsolutions.com" className="text-sm text-white/60 hover:text-white transition-colors">
                  hello@tconsolutions.com
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Hamburger button - stays in the navbar */}
      <button
        onClick={toggle}
        className={`relative w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-xl transition-all duration-300 ${buttonClassName}`}
        style={{
          zIndex: 99999,
          background: isOpen ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        <motion.span
          className="block rounded-full bg-white origin-center"
          style={{ width: 20, height: '1.5px' }}
          animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 7 : 0 }}
          transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
        />
        <motion.span
          className="block rounded-full origin-right"
          style={{ width: 14, height: '1.5px', background: 'rgba(139,92,246,0.9)' }}
          animate={{ scaleX: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className="block rounded-full bg-white origin-center"
          style={{ width: 20, height: '1.5px' }}
          animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -7 : 0 }}
          transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
        />
      </button>

      {/* Portal: renders overlay outside navbar stacking context */}
      {createPortal(overlay, document.body)}
    </>
  );
}



