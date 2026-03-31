import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark } from 'react-icons/hi2';

function DefaultCard({ item, isActive, onOpen }: { item: SliderItemData; isActive: boolean; onOpen: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const imgSrc = item.image || item.imageUrl;
  const showBio = isHovered || isActive;

  return (
    <div
      className="w-full h-full rounded-3xl overflow-hidden relative cursor-pointer active:scale-95 transition-transform"
      style={{ border: `1px solid ${isActive ? 'rgba(139,92,246,0.45)' : 'rgba(255,255,255,0.07)'}` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={isActive ? onOpen : undefined}
    >
      {/* Full-card image */}
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center text-7xl font-extrabold"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(59,130,246,0.15))', color: 'rgba(255,255,255,0.12)' }}
        >
          {item.title[0]}
        </div>
      )}

      {/* Dark scrim so text is always readable */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,7,20,0.5) 60%, rgba(5,7,20,0.1) 100%)' }} />

      {/* Top badges */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-10">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold text-white shadow-lg flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}
        >
          {item.title[0]}
        </div>
        <span className="text-xs font-mono text-white/30">{item.num}</span>
      </div>

      {/* Bottom glassy content */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 px-5 pt-4 pb-5 rounded-b-3xl"
        style={{
          background: 'rgba(93, 97, 117, 0.15)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
        }}
      >
        <p className="text-xs text-indigo-400 uppercase tracking-wider font-semibold mb-1">{item.subtitle}</p>
        <h3 className="text-lg font-bold text-white leading-tight">{item.title}</h3>

        {/* Bio - shown on hover or when active */}
        <div
          className="overflow-hidden transition-all duration-400"
          style={{ maxHeight: showBio ? '100px' : '0px', opacity: showBio ? 1 : 0, transitionDuration: '350ms' }}
        >
          {item.description && (
            <p className="text-xs text-gray-300 leading-relaxed pt-2 line-clamp-3">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailModal({ item, onClose }: { item: SliderItemData | null; onClose: () => void }) {
  if (!item) return null;

  const imgSrc = item.image || item.imageUrl;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
          style={{ background: 'rgba(0, 0, 0, 0.15)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Wrapper to position close button outside the overflow-hidden card */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            {/* Close button — pinned to top-right corner of the card */}
            <button
              onClick={onClose}
              className="absolute -top-4 -right-4 z-30 w-10 h-10 flex items-center justify-center rounded-full transition-all"
              style={{ background: 'rgba(139,92,246,0.9)', boxShadow: '0 0 16px rgba(139,92,246,0.5)' }}
            >
              <HiXMark className="w-5 h-5 text-white" />
            </button>

            {/* Card */}
            <motion.div
              className="relative rounded-2xl overflow-hidden w-[420px] max-w-[92vw]"
              style={{
                height: '82vh',
                maxHeight: '680px',
                border: '1px solid rgba(139,92,246,0.35)',
              }}
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            >
              {/* Full background image */}
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center text-9xl font-extrabold"
                  style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.2))', color: 'rgba(255,255,255,0.15)' }}
                >
                  {item.title[0]}
                </div>
              )}

              {/* Gradient scrim — lighter at top, heavier at bottom */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(5,7,20,0.92) 38%, rgba(5,7,20,0.05) 100%)' }}
              />

              {/* Glossy content panel at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 z-10 px-6 pt-5 pb-7"
                style={{
                  background: 'rgba(163, 163, 173, 0.07)',
                  backdropFilter: 'blur(5px)',
                  WebkitBackdropFilter: 'blur(5px)',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <p className="text-xs text-indigo-400 uppercase tracking-widest font-semibold mb-1">{item.subtitle}</p>
                <h2 className="text-2xl font-bold text-white mb-3 leading-tight">{item.title}</h2>
                {item.description && (
                  <p className="text-sm text-gray-300 leading-relaxed">{item.description}</p>
                )}
                
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export interface SliderItemData {
  title: string;
  num: string;
  imageUrl?: string;
  image?: string;
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
  const [selectedItem, setSelectedItem] = useState<SliderItemData | null>(null);
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
    <DefaultCard item={item} isActive={isActive} onOpen={() => setSelectedItem(item)} />
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
            <div className="w-72 h-96" style={{ pointerEvents: isActive ? 'auto' : 'none' }}>
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

      {/* Detail Modal */}
      <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
