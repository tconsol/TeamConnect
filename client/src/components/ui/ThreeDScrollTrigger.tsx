import type { ReactNode } from 'react';

interface ThreeDScrollTriggerContainerProps {
  children: ReactNode;
  className?: string;
}

interface ThreeDScrollTriggerRowProps {
  children: ReactNode;
  baseVelocity?: number;
  direction?: 1 | -1;
  className?: string;
}

export function ThreeDScrollTriggerContainer({
  children,
  className = '',
}: ThreeDScrollTriggerContainerProps) {
  return (
    <div
      className={`relative overflow-hidden py-4 ${className}`}
      style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
    >
      {children}
    </div>
  );
}

export function ThreeDScrollTriggerRow({
  children,
  baseVelocity = 5,
  direction = 1,
  className = '',
}: ThreeDScrollTriggerRowProps) {
  const duration = Math.max(10, 50 / Math.abs(baseVelocity));

  return (
    <div className="flex overflow-hidden">
      <div
        className={`flex shrink-0 ${className}`}
        style={{
          animation: `ticker-scroll ${duration}s linear infinite`,
          animationDirection: direction < 0 ? 'reverse' : 'normal',
          willChange: 'transform',
        }}
      >
        {/* Duplicate children for seamless infinite loop */}
        {children}
        {children}
      </div>
    </div>
  );
}
