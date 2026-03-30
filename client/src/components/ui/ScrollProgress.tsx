import { useScrollProgress } from '@/hooks/useAnimations';

export default function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px]">
      <div
        className="h-full bg-gradient-to-r from-accent-indigo to-accent-blue transition-transform duration-100"
        style={{ transform: `scaleX(${progress})`, transformOrigin: 'left' }}
      />
    </div>
  );
}
