import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mobileMedia = window.matchMedia('(max-width: 1023px)');
    const coarseMedia = window.matchMedia('(pointer: coarse)');

    const evaluateCursorMode = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setEnabled(!(isTouchDevice || mobileMedia.matches || coarseMedia.matches));
    };

    evaluateCursorMode();

    mobileMedia.addEventListener('change', evaluateCursorMode);
    coarseMedia.addEventListener('change', evaluateCursorMode);

    return () => {
      mobileMedia.removeEventListener('change', evaluateCursorMode);
      coarseMedia.removeEventListener('change', evaluateCursorMode);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      setVisible(false);
      return;
    }

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      setVisible((prev) => (prev ? prev : true));
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    // Smooth ring follow
    let raf: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.15);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.15);
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          zIndex: 999999,
          width: 8,
          height: 8,
          marginLeft: -4,
          marginTop: -4,
          borderRadius: '50%',
          background: '#fff',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          zIndex: 999998,
          width: 36,
          height: 36,
          marginLeft: -18,
          marginTop: -18,
          borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.4)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
      />
    </>
  );
}
