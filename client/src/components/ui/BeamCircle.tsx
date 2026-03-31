import type { ReactNode } from 'react';

export interface OrbitConfig {
  id: number;
  radiusFactor: number;
  /** Orbit period in seconds */
  speed: number;
  icon: ReactNode;
  /** Link URL - clicking the icon opens this */
  href?: string;
  iconSize?: number;
  orbitColor?: string;
  orbitThickness?: number;
}

interface BeamCircleProps {
  size?: number;
  centerIcon?: ReactNode;
  orbits?: OrbitConfig[];
}

const defaultOrbits: OrbitConfig[] = [
  {
    id: 1,
    radiusFactor: 0.26,
    speed: 8,
    href: 'https://twitter.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-sky-400">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      </svg>
    ),
    orbitColor: 'rgba(56,189,248,0.25)',
    orbitThickness: 1,
  },
  {
    id: 2,
    radiusFactor: 0.42,
    speed: 14,
    href: 'https://linkedin.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-400">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    orbitColor: 'rgba(96,165,250,0.25)',
    orbitThickness: 1.5,
  },
  {
    id: 3,
    radiusFactor: 0.58,
    speed: 20,
    href: 'https://github.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-slate-300">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    orbitColor: 'rgba(148,163,184,0.2)',
    orbitThickness: 1,
  },
  {
    id: 4,
    radiusFactor: 0.74,
    speed: 26,
    href: 'https://instagram.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-pink-400">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    orbitColor: 'rgba(244,114,182,0.2)',
    orbitThickness: 1,
  },
];

export function BeamCircle({ size = 300, centerIcon, orbits = defaultOrbits }: BeamCircleProps) {
  return (
    <div
      className="relative shrink-0 inline-flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      {/* Center glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size * 0.22,
          height: size * 0.22,
          background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
        }}
      />

      {/* Orbit rings + icons - pure CSS animation, never pauses */}
      {orbits.map((orbit) => {
        const orbitSize = orbit.radiusFactor * size * 2;
        const iconSz = orbit.iconSize ?? 34;
        const iconOffset = orbitSize / 2;

        return (
          <div
            key={orbit.id}
            className="absolute rounded-full"
            style={{
              width: orbitSize,
              height: orbitSize,
              border: `${orbit.orbitThickness ?? 1}px solid ${orbit.orbitColor ?? 'rgba(139,92,246,0.2)'}`,
              pointerEvents: 'none',
            }}
          >
            {/* Rotating ring - CSS animation, immune to hover/re-renders */}
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                animation: `orbit-cw ${orbit.speed}s linear infinite`,
              }}
            >
              {/* Counter-rotating icon wrapper */}
              <div
                style={{
                  position: 'absolute',
                  width: iconSz,
                  height: iconSz,
                  top: -(iconSz / 2),
                  left: iconOffset - iconSz / 2,
                  animation: `orbit-ccw ${orbit.speed}s linear infinite`,
                  pointerEvents: 'auto',
                }}
              >
                {/* Clickable link */}
                {orbit.href ? (
                  <a
                    href={orbit.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full h-full rounded-full transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(8px)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.2)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139,92,246,0.5)';
                      (e.currentTarget as HTMLElement).style.transform = 'scale(1.15)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)';
                      (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                    }}
                  >
                    {orbit.icon}
                  </a>
                ) : (
                  <div
                    className="flex items-center justify-center w-full h-full rounded-full"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {orbit.icon}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Center icon */}
      <div
        className="relative z-10 flex items-center justify-center rounded-full"
        style={{
          width: size * 0.2,
          height: size * 0.2,
          background: 'linear-gradient(135deg, rgba(139,92,246,0.3) 0%, rgba(59,130,246,0.2) 100%)',
          border: '1px solid rgba(139,92,246,0.4)',
          boxShadow: '0 0 24px rgba(139,92,246,0.35)',
        }}
      >
        {centerIcon ?? (
          <div style={{ animation: 'orbit-cw 20s linear infinite' }}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="text-violet-300"
              style={{ width: size * 0.1, height: size * 0.1 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
