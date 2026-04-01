import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ScrollRevealProps {
  children: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  align?: 'left' | 'center' | 'right';
  variant?: 'default' | 'muted' | 'accent' | 'primary';
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  staggerDelay?: number;
  duration?: number;
  containerClassName?: string;
  textClassName?: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div';
}

const sizeClasses: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-base md:text-lg',
  lg: 'text-xl md:text-2xl',
  xl: 'text-2xl md:text-4xl font-bold',
  '2xl': 'text-3xl md:text-5xl font-extrabold',
};

const variantClasses: Record<string, string> = {
  default: 'text-text-heading',
  muted: 'text-text-muted',
  accent: 'gradient-text',
  primary: 'text-accent-indigo',
};

export function ScrollReveal({
  children,
  size = 'lg',
  align = 'left',
  variant = 'default',
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  staggerDelay = 0.05,
  duration = 0.8,
  containerClassName = '',
  textClassName = '',
  as: Tag = 'p',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const text = typeof children === 'string' ? children : '';
  const words = text.split(' ').filter(Boolean);

  const alignClass =
    align === 'center'
      ? 'text-center'
      : align === 'right'
      ? 'text-right'
      : 'text-left';

  return (
    <div ref={ref} className={`overflow-hidden ${alignClass} ${containerClassName}`}>
      <Tag className={`leading-relaxed ${sizeClasses[size]} ${textClassName}`}>
        {words.map((word, i) => (
          <motion.span
            key={i}
            className={`inline-block mr-[0.28em] ${variantClasses[variant]}`}
            initial={{
              opacity: baseOpacity,
              rotateX: baseRotation,
              filter: enableBlur ? `blur(${blurStrength}px)` : 'none',
              y: 8,
            }}
            animate={
              isInView
                ? {
                    opacity: 1,
                    rotateX: 0,
                    filter: 'blur(0px)',
                    y: 0,
                  }
                : {
                    opacity: baseOpacity,
                    rotateX: baseRotation,
                    filter: enableBlur ? `blur(${blurStrength}px)` : 'none',
                    y: 8,
                  }
            }
            transition={{
              duration,
              delay: i * staggerDelay,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        ))}
      </Tag>
    </div>
  );
}
