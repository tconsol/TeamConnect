import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ImageRevealItem {
  key: number;
  url: string;
  label: string;
  tag?: string;
}

interface ImageRevealProps {
  className?: string;
  imageWidth?: number | string;
  imageHeight?: number | string;
  visualData?: ImageRevealItem[];
}

const defaultData: ImageRevealItem[] = [
  { key: 1, url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&q=80', label: 'Web Applications', tag: 'Development' },
  { key: 2, url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=500&q=80', label: 'Mobile Experiences', tag: 'Mobile' },
  { key: 3, url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80', label: 'Cloud Infrastructure', tag: 'Cloud' },
  { key: 4, url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=80', label: 'UI/UX Design', tag: 'Design' },
  { key: 5, url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=500&q=80', label: 'AI & Machine Learning', tag: 'AI' },
];

export default function ImageReveal({
  className = '',
  imageWidth = 320,
  imageHeight = 420,
  visualData = defaultData,
}: ImageRevealProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const activeItem = visualData.find((d) => d.key === hovered);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* Floating image */}
      <AnimatePresence>
        {hovered !== null && activeItem && (
          <motion.div
            className="absolute pointer-events-none z-30 overflow-hidden rounded-2xl hidden lg:block"
            style={{
              width: imageWidth,
              height: imageHeight,
              left: mousePos.x + 24,
              top: mousePos.y - Number(imageHeight) / 2,
            }}
            initial={{ opacity: 0, scale: 0.88, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={activeItem.url}
              alt={activeItem.label}
              className="w-full h-full object-cover"
              style={{ borderRadius: '16px' }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(3,0,20,0.6) 0%, transparent 50%)',
                borderRadius: '16px',
              }}
            />
            {activeItem.tag && (
              <div className="absolute bottom-4 left-4">
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.15em]"
                  style={{
                    background: 'rgba(139,92,246,0.2)',
                    border: '1px solid rgba(139,92,246,0.4)',
                    color: '#c4b5fd',
                  }}
                >
                  {activeItem.tag}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* List items */}
      <div className="flex flex-col divide-y divide-white/[0.06]" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {visualData.map((item, i) => (
          <motion.div
            key={item.key}
            className="group relative flex items-center justify-between py-6 px-4 md:px-8 cursor-default overflow-hidden"
            style={{ borderBottom: i < visualData.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
            onMouseEnter={() => setHovered(item.key)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Hover background */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: hovered === item.key ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ background: 'linear-gradient(90deg, rgba(139,92,246,0.06) 0%, transparent 100%)' }}
            />

            <div className="relative z-10 flex items-center gap-6">
              {/* Index */}
              <span
                className="text-xs font-mono tabular-nums shrink-0 w-8"
                style={{ color: 'rgba(139,92,246,0.6)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Label */}
              <motion.h3
                className="font-bold text-white"
                style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', lineHeight: 1.2 }}
                animate={{ x: hovered === item.key ? 8 : 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {item.label}
              </motion.h3>
            </div>

            <div className="relative z-10 flex items-center gap-4">
              {item.tag && (
                <motion.span
                  className="hidden md:inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'rgba(148,163,184,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}
                  animate={{ opacity: hovered === item.key ? 1 : 0.5 }}
                >
                  {item.tag}
                </motion.span>
              )}

              <motion.div
                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: 'rgba(139,92,246,0)',
                  border: '1px solid rgba(139,92,246,0)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                }}
                animate={{
                  background: hovered === item.key ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0)',
                  borderColor: hovered === item.key ? 'rgba(139,92,246,0.4)' : 'rgba(139,92,246,0)',
                  boxShadow: hovered === item.key
                    ? '0 4px 24px rgba(139,92,246,0.3)'
                    : '0 4px 16px rgba(0,0,0,0.4)',
                  x: hovered === item.key ? 4 : 0,
                }}
                transition={{ duration: 0.25 }}
              >
                <svg
                  className="w-5 h-5 text-violet-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  style={{ transform: 'rotate(-30deg)' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 20L20 4m0 0h-12m12 0v12" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
