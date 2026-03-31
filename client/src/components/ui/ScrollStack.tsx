import { useRef, useEffect, useState } from 'react';

export interface ScrollStackCard {
  title?: string;
  subtitle?: string;
  badge?: string;
  backgroundImage?: string;
  content?: React.ReactNode;
}

interface ScrollStackProps {
  cards: ScrollStackCard[];
  className?: string;
  backgroundColor?: string;
  cardHeight?: string;
  cardMaxHeight?: string;
  cardBorderRadius?: string;
  animationDuration?: string;
  sectionHeightMultiplier?: number;
}

export default function ScrollStack({
  cards,
  className = '',
  backgroundColor = '#030014',
  cardHeight = '60vh',
  cardMaxHeight = '580px',
  cardBorderRadius = '20px',
  animationDuration = '0.5s',
  sectionHeightMultiplier = 3,
}: ScrollStackProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      // Calculate progress from when section enters to when it exits
      const startScrolling = viewportHeight;
      const endScrolling = -(sectionHeight);
      
      const scrollProgress = (startScrolling - sectionTop) / (startScrolling - endScrolling);
      const clampedProgress = Math.max(0, Math.min(scrollProgress, 1));
      
      const newIndex = Math.min(
        Math.floor(clampedProgress * cards.length),
        cards.length - 1
      );
      setActiveIndex(newIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [cards.length]);

  const gradients = [
    { bg: 'linear-gradient(135deg, rgba(91,33,182,0.82) 0%, rgba(49,46,129,0.72) 100%)', border: 'rgba(139,92,246,0.7)', glow: 'rgba(139,92,246,0.45)' },
    { bg: 'linear-gradient(135deg, rgba(30,64,175,0.82) 0%, rgba(13,148,136,0.72) 100%)', border: 'rgba(59,130,246,0.72)', glow: 'rgba(56,189,248,0.4)' },
    { bg: 'linear-gradient(135deg, rgba(190,24,93,0.82) 0%, rgba(219,39,119,0.7) 100%)', border: 'rgba(236,72,153,0.72)', glow: 'rgba(236,72,153,0.4)' },
    { bg: 'linear-gradient(135deg, rgba(180,83,9,0.85) 0%, rgba(217,119,6,0.72) 100%)', border: 'rgba(245,158,11,0.72)', glow: 'rgba(251,191,36,0.4)' },
    { bg: 'linear-gradient(135deg, rgba(14,116,144,0.84) 0%, rgba(8,145,178,0.7) 100%)', border: 'rgba(34,211,238,0.72)', glow: 'rgba(34,211,238,0.4)' },
  ];

  return (
    <div
      ref={sectionRef}
      className={`relative ${className}`}
      style={{ height: `${sectionHeightMultiplier * 100}vh`, backgroundColor }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 flex items-center justify-center overflow-hidden"
        style={{ height: '100vh' }}
      >
        <div className="relative w-full px-6 md:px-0 md:max-w-3xl lg:max-w-4xl mx-auto" style={{ height: cardHeight, maxHeight: cardMaxHeight }}>
          {cards.map((card, i) => {
            const isActive = i === activeIndex;
            const isFuture = i > activeIndex;
            const isPast = i < activeIndex;
            
            // Keep only one readable card at a time while preserving stacked depth.
            const scale = isActive ? 1 : isPast ? Math.max(0.9, 0.98 - (activeIndex - i) * 0.02) : 1;
            const yFromBottom = isFuture ? 110 : isPast ? -(activeIndex - i) * 16 : 0;
            const opacity = isFuture ? 0 : isPast ? 0.97 : 1;
            const zIndex = isFuture ? 0 : cards.length - Math.abs(i - activeIndex);

            return (
              <div
                key={i}
                className="absolute inset-0 flex flex-col overflow-hidden"
                style={{
                  borderRadius: cardBorderRadius,
                  transform: `scale(${scale}) translateY(${yFromBottom}px)`,
                  opacity,
                  zIndex,
                  transition: `transform ${animationDuration} cubic-bezier(0.4,0,0.2,1), opacity ${animationDuration} ease`,
                  background: card.backgroundImage
                    ? `url(${card.backgroundImage}) center/cover`
                    : '#07071a',
                }}
              >
                {/* BG gradient when no image */}
                {!card.backgroundImage && (
                  <>
                    {/* Colored gradient background */}
                    <div
                      className="absolute inset-0"
                      style={{ background: gradients[i % gradients.length].bg, borderRadius: cardBorderRadius }}
                    />
                    
                    {/* Aura glow effect */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${gradients[i % gradients.length].glow} 0%, transparent 72%)`,
                        borderRadius: cardBorderRadius,
                      }}
                    />
                  </>
                )}

                {/* Border with gradient color */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ border: `2px solid ${gradients[i % gradients.length].border}`, borderRadius: cardBorderRadius }}
                />

                {/* Content */}
                <div
                  className="relative z-10 flex flex-col justify-between h-full p-8 md:p-12"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transition: `opacity ${animationDuration} ease`,
                  }}
                >
                  <div>
                    {card.badge && (
                      <div className="inline-flex items-center gap-2 mb-6">
                        <span
                          className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em]"
                          style={{
                            background: 'rgba(139,92,246,0.15)',
                            border: '1px solid rgba(139,92,246,0.3)',
                            color: '#a78bfa',
                          }}
                        >
                          {card.badge}
                        </span>
                      </div>
                    )}

                    {card.title && (
                      <h3
                        className="font-bold text-white leading-tight mb-4"
                        style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
                      >
                        {card.title}
                      </h3>
                    )}

                    {card.subtitle && (
                      <p
                        className="leading-relaxed max-w-xl"
                        style={{ color: 'rgba(148,163,184,0.8)', fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)' }}
                      >
                        {card.subtitle}
                      </p>
                    )}
                  </div>

                  {card.content && (
                    <div className="mt-6">{card.content}</div>
                  )}

                  {/* Step indicator */}
                  <div className="flex items-center gap-3 mt-6">
                    {cards.map((_, idx) => (
                      <div
                        key={idx}
                        className="rounded-full transition-all duration-300"
                        style={{
                          width: idx === i ? '24px' : '6px',
                          height: '6px',
                          background: idx === i ? 'rgba(139,92,246,0.9)' : 'rgba(255,255,255,0.2)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
