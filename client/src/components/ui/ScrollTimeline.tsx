import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

export interface TimelineEvent {
  id?: string;
  year: string;
  title: string;
  subtitle?: string;
  description: string;
  icon?: React.ReactNode;
  color?: string;
}

interface ScrollTimelineProps {
  events: TimelineEvent[];
  title?: string;
  subtitle?: string;
}

function CardContent({ event, index }: { event: TimelineEvent; index: number }) {
  return (
    <div
      className="rounded-2xl p-6 cursor-default"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)';
        e.currentTarget.style.boxShadow = '0 8px 32px -8px rgba(139,92,246,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(139,92,246,0.8)' }}>
        {event.year}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
      {event.subtitle && (
        <p className="text-xs font-medium mb-2" style={{ color: 'rgba(139,92,246,0.7)' }}>{event.subtitle}</p>
      )}
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.75)' }}>
        {event.description}
      </p>
    </div>
  );
}

/* ── Mobile / Tablet card — line on left ── */
function TimelineCardMobile({ event, index }: { event: TimelineEvent; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <div ref={ref} className="relative grid grid-cols-[44px_1fr] md:grid-cols-[60px_1fr] gap-4 md:gap-8 items-start w-full">
      <div className="relative flex justify-center">
        <motion.div
          className="mt-4 z-10 flex items-center justify-center rounded-full font-bold text-xs text-white shadow-lg"
          style={{
            width: '2.25rem', height: '2.25rem',
            background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
            boxShadow: '0 0 14px rgba(139,92,246,0.45)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {event.icon ?? <span className="font-mono">{String(index + 1).padStart(2, '0')}</span>}
        </motion.div>
      </div>

      <motion.div
        className="flex-1"
        initial={{ opacity: 0, x: 40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
      >
        <CardContent event={event} index={index} />
      </motion.div>
    </div>
  );
}

/* ── Desktop card — alternating left / right ── */
function TimelineCardDesktop({ event, index }: { event: TimelineEvent; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative grid grid-cols-[1fr_60px_1fr] gap-8 items-start w-full">
      {/* Left cell */}
      {isLeft ? (
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        >
          <CardContent event={event} index={index} />
        </motion.div>
      ) : (
        <div />
      )}

      {/* Center dot */}
      <div className="relative flex justify-center">
        <motion.div
          className="mt-4 z-10 flex items-center justify-center rounded-full font-bold text-xs text-white shadow-lg"
          style={{
            width: '2.25rem', height: '2.25rem',
            background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
            boxShadow: '0 0 14px rgba(139,92,246,0.45)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {event.icon ?? <span className="font-mono">{String(index + 1).padStart(2, '0')}</span>}
        </motion.div>
      </div>

      {/* Right cell */}
      {!isLeft ? (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        >
          <CardContent event={event} index={index} />
        </motion.div>
      ) : (
        <div />
      )}
    </div>
  );
}

export default function ScrollTimeline({ events, title, subtitle }: ScrollTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 20%'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={containerRef} className="relative">
      {(title || subtitle) && (
        <div className="text-center mb-16">
          {title && <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>}
          {subtitle && <p className="text-text-muted">{subtitle}</p>}
        </div>
      )}

      {/* ── Mobile / Tablet layout — line on left ── */}
      <div className="relative lg:hidden">
        <div className="absolute left-[22px] md:left-[30px] top-8 bottom-8 w-px" style={{ background: 'rgba(139,92,246,0.12)' }} />
        <div className="absolute left-[22px] md:left-[30px] top-8 w-px overflow-hidden" style={{ height: 'calc(100% - 64px)' }}>
          <motion.div className="w-full" style={{ height: lineHeight, background: 'linear-gradient(to bottom, #8B5CF6, #3B82F6, #06B6D4)', boxShadow: '0 0 8px 1px rgba(139,92,246,0.4)' }} />
        </div>
        <div className="flex flex-col gap-12">
          {events.map((event, i) => (
            <TimelineCardMobile key={event.id || i} event={event} index={i} />
          ))}
        </div>
      </div>

      {/* ── Desktop layout — line centered, cards alternate ── */}
      <div className="relative hidden lg:block">
        <div className="absolute left-1/2 -translate-x-1/2 top-8 bottom-8 w-px" style={{ background: 'rgba(139,92,246,0.12)' }} />
        <div className="absolute left-1/2 -translate-x-1/2 top-8 w-px overflow-hidden" style={{ height: 'calc(100% - 64px)' }}>
          <motion.div className="w-full" style={{ height: lineHeight, background: 'linear-gradient(to bottom, #8B5CF6, #3B82F6, #06B6D4)', boxShadow: '0 0 8px 1px rgba(139,92,246,0.4)' }} />
        </div>
        <div className="flex flex-col gap-12">
          {events.map((event, i) => (
            <TimelineCardDesktop key={event.id || i} event={event} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
