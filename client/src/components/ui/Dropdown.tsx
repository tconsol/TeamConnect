import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HiChevronDown, HiOutlineCheck } from 'react-icons/hi2';

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
  name?: string;
}

export function Dropdown({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = '',
  name,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const selected = options.find((o) => o.value === value);

  const updateMenuPosition = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const menuHeight = options.length * 40 + 8;
    const openUp = spaceBelow < menuHeight && rect.top > menuHeight;
    setMenuStyle({
      position: 'fixed',
      top: openUp ? rect.top - menuHeight - 4 : rect.bottom + 4,
      left: rect.left,
      minWidth: rect.width,
      zIndex: 9999,
    });
  };

  useEffect(() => {
    if (open) updateMenuPosition();
  }, [open, options.length]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const menu = open
    ? createPortal(
        <div
          className="py-1.5 rounded-xl overflow-hidden shadow-2xl border"
          style={{
            ...menuStyle,
            background: 'rgba(15,16,35,0.95)',
            borderColor: 'rgba(99,102,241,0.2)',
            backdropFilter: 'blur(16px)',
            animation: 'dropdownIn 0.15s ease-out',
          }}
        >
          <style>{`
            @keyframes dropdownIn {
              from {
                opacity: 0;
                transform: translateY(-8px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(opt.value);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors"
                style={{
                  color: isSelected ? '#a5b4fc' : 'rgba(255,255,255,0.8)',
                  background: isSelected ? 'rgba(99,102,241,0.15)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.08)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <span>{opt.label}</span>
                {isSelected && <HiOutlineCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>,
        document.body
      )
    : null;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all focus:outline-none"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: open ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.08)',
          color: selected ? '#fff' : 'rgba(156,163,175,1)',
        }}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <HiChevronDown
          className="w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      {menu}
    </div>
  );
}
