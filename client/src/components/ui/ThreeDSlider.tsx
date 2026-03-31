import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export interface SliderItemData {
  title: string;
  num: string;
  imageUrl?: string;
  subtitle?: string;
  description?: string;
  data?: Record<string, unknown>;
}

interface ThreeDSliderProps {
  items: SliderItemData[];
  speedWheel?: number;
  speedDrag?: number;
  containerStyle?: React.CSSProperties;
  onItemClick?: (item: SliderItemData, index: number) => void;
  renderCard?: (item: SliderItemData, isActive: boolean) => React.ReactNode;
}

function getCardTransform(offset: number) {
  const absOffset = Math.abs(offset);
  return {
    translateX: offset * 240,
    translateY: absOffset * 25,
    rotateY: offset * -22,
    scale: Math.max(0.55, 1 - absOffset * 0.14),
    zIndex: 20 - absOffset,
    opacity: Math.max(0.25, 1 - absOffset * 0.28),
  };
}

export default function ThreeDSlider({
  items,
  speedWheel = 0.02,
  speedDrag = -0.1,
  containerStyle,
  onItemClick,
  renderCard,
}: ThreeDSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const startX = useRef(0);
  const isDragging = useRef(false);
  const totalItems = items.length;

  const getCircularOffset = (index: number): number => {
    let offset = index - activeIndex;
    if (offset > Math.floor(totalItems / 2)) offset -= totalItems;
    if (offset < -Math.floor(totalItems / 2)) offset += totalItems;
    return offset;
  };

  const goNext = () => setActiveIndex((i) => (i + 1) % totalItems);
  const goPrev = () => setActiveIndex((i) => (i - 1 + totalItems) % totalItems);

  // Mouse wheel navigation
  useEffect(() => {
    let wheelBuffer = 0;
    const handleWheel = (e: WheelEvent) => {
      const container = document.getElementById('threed-slider-container');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const isOver =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!isOver) return;
      e.preventDefault();
      wheelBuffer += e.deltaY * speedWheel;
      if (Math.abs(wheelBuffer) >= 1) {
        const steps = Math.sign(wheelBuffer);
        setActiveIndex((i) => (i + steps + totalItems) % totalItems);
        wheelBuffer = 0;
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [speedWheel, totalItems]);

  // Touch / drag navigation
  const handleDragStart = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
  };

  const handleDragEnd = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = (e.clientX - startX.current) * speedDrag;
    if (Math.abs(diff) > 0.5) {
      const steps = Math.round(diff);
      setActiveIndex((i) => (i + steps + totalItems) % totalItems);
    }
  };

  const defaultCard = (item: SliderItemData, isActive: boolean) => (
    <div
      className="w-full h-full flex flex-col justify-end p-6 rounded-3xl overflow-hidden relative"
      style={{
        background: isActive
          ? 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.1) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        border: `1px solid ${isActive ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.07)'}`,
      }}
    >
      {/* Avatar */}
      <div className="absolute top-6 left-6">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-extrabold text-white"
          style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}
        >
          {item.title[0]}
        </div>
      </div>

      {/* Number badge */}
      <div className="absolute top-6 right-6 text-xs font-mono text-text-muted opacity-60">
        {item.num}
      </div>

      {/* Content */}
      <div>
        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{item.subtitle}</p>
        <h3 className="text-xl font-bold text-text-heading mb-2">{item.title}</h3>
        {item.description && (
          <p className="text-xs text-text-body leading-relaxed line-clamp-3 opacity-80">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div
      id="threed-slider-container"
      className="relative flex items-center justify-center select-none"
      style={{ perspective: '1400px', height: '420px', ...containerStyle }}
      onPointerDown={handleDragStart}
      onPointerUp={handleDragEnd}
    >
      {items.map((item, index) => {
        const offset = getCircularOffset(index);
        const isVisible = Math.abs(offset) <= 2;
        if (!isVisible) return null;
        const { translateX, translateY, rotateY, scale, zIndex, opacity } =
          getCardTransform(offset);
        const isActive = offset === 0;

        return (
          <motion.div
            key={index}
            className="absolute cursor-pointer"
            style={{ zIndex }}
            animate={{
              x: translateX,
              y: translateY,
              rotateY,
              scale,
              opacity,
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            onClick={() => {
              if (isActive) {
                onItemClick?.(item, index);
              } else {
                setActiveIndex(index);
              }
            }}
          >
            <div className="w-72 h-96 pointer-events-none">
              {renderCard ? renderCard(item, isActive) : defaultCard(item, isActive)}
            </div>
          </motion.div>
        );
      })}

      {/* Navigation buttons */}
      <button
        onClick={goPrev}
        className="absolute left-0 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
        style={{ transform: 'translateY(-50%)', top: '50%' }}
        aria-label="Previous"
      >
        ‹
      </button>
      <button
        onClick={goNext}
        className="absolute right-0 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
        style={{ transform: 'translateY(-50%)', top: '50%' }}
        aria-label="Next"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-0 flex gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === activeIndex ? 'bg-accent-violet scale-125' : 'bg-white/30'
            }`}
            aria-label={`Go to item ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
