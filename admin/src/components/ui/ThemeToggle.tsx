import { useRef } from 'react';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi2';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    toggle(rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-1.5 rounded-lg transition-colors text-slate-500 hover:text-slate-700 hover:bg-slate-200/60 dark:text-amber-300/70 dark:hover:text-amber-200 dark:hover:bg-indigo-500/[0.08]"
      style={{ lineHeight: 0 }}
    >
      {theme === 'dark' ? (
        <HiOutlineSun className="w-[18px] h-[18px]" />
      ) : (
        <HiOutlineMoon className="w-[18px] h-[18px]" />
      )}
    </button>
  );
}
