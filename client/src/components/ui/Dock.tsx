import { useRef, useEffect, useState, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface DockItem {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface DockItemProps extends DockItem {
  itemIndex: number;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  baseItemSize: number;
  magnification: number;
  magnificationDistance: number;
  gap: number;
}

function DockItemElement({
  icon,
  label,
  onClick,
  isActive,
  itemIndex,
  mouseX,
  baseItemSize,
  magnification,
  magnificationDistance,
  gap,
}: DockItemProps) {
  const itemCenter = itemIndex * (baseItemSize + gap) + baseItemSize / 2;

  const rawSize = useTransform(mouseX, (mx: number) => {
    if (mx < 0) return baseItemSize;
    const dist = Math.abs(mx - itemCenter);
    if (dist >= magnificationDistance) return baseItemSize;
    return (
      baseItemSize +
      (magnification - baseItemSize) * Math.max(0, 1 - dist / magnificationDistance)
    );
  });

  const size = useSpring(rawSize, { mass: 0.1, stiffness: 220, damping: 18 });

  return (
    <div className="relative flex flex-col items-center group">
      <span
        className={`absolute text-xs px-2.5 py-1 rounded-lg whitespace-nowrap transition-all duration-200 pointer-events-none border ${
          isActive
            ? 'opacity-100 translate-y-0 -top-[42px] bg-accent-violet/25 text-white border-accent-violet/50'
            : 'opacity-0 translate-y-1 -top-8 group-hover:opacity-100 group-hover:translate-y-0 bg-black/90 text-white border-white/10'
        }`}
      >
        {label}
      </span>
      <motion.button
        style={{ width: size, height: size }}
        onClick={onClick}
        className={`flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
          isActive
            ? 'bg-accent-violet/35 border border-accent-violet/60 text-white shadow-[0_0_24px_rgba(139,92,246,0.35)]'
            : 'bg-white/10 border border-white/15 text-white/80 hover:bg-white/20 hover:text-white'
        }`}
        aria-label={label}
      >
        {icon}
      </motion.button>
      {isActive && (
        <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-accent-violet shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
      )}
    </div>
  );
}

interface DockProps {
  items: DockItem[];
  position?: 'bottom' | 'top';
  magnification?: number;
  baseItemSize?: number;
  magnificationDistance?: number;
  gap?: number;
  className?: string;
}

export default function Dock({
  items,
  position = 'bottom',
  magnification = 62,
  baseItemSize = 46,
  magnificationDistance = 100,
  gap = 8,
  className = '',
}: DockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-1000);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive sizes for mobile
  const adjustedItemSize = isMobile ? Math.max(36, baseItemSize - 10) : baseItemSize;
  const adjustedMag = isMobile ? Math.max(48, magnification - 14) : magnification;
  const adjustedGap = isMobile ? 4 : gap;

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) mouseX.set(e.clientX - rect.left);
  };

  const handleMouseLeave = () => mouseX.set(-1000);

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-[100] px-2 ${
        position === 'bottom' ? 'bottom-3 md:bottom-5' : 'top-3 md:top-5'
      } ${className}`}
    >
      <div
        ref={containerRef}
        className="flex items-end px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-black/70 backdrop-blur-xl border border-white/[0.12] shadow-xl"
        style={{ gap: adjustedGap }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {items.map((item, i) => (
          <DockItemElement
            key={i}
            {...item}
            itemIndex={i}
            mouseX={mouseX}
            baseItemSize={adjustedItemSize}
            magnification={adjustedMag}
            magnificationDistance={magnificationDistance}
            gap={adjustedGap}
          />
        ))}
      </div>
    </div>
  );
}
