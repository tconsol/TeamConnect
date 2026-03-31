import { useState, useRef, useEffect, useCallback } from 'react';
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
  compact?: boolean;
  badgeClassName?: string;
}

export function Dropdown({ value, onChange, options, placeholder = 'Select...', className = '', compact = false, badgeClassName = '' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const selected = options.find((o) => o.value === value);

  const updateMenuPosition = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const menuHeight = options.length * 34 + 8;
    const openUp = spaceBelow < menuHeight && rect.top > menuHeight;
    setMenuStyle({
      position: 'fixed',
      top: openUp ? rect.top - menuHeight : rect.bottom + 4,
      right: window.innerWidth - rect.right,
      minWidth: Math.max(rect.width, 140),
      zIndex: 9999,
    });
  }, [options.length]);

  useEffect(() => {
    if (open) updateMenuPosition();
  }, [open, updateMenuPosition]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (compact) {
    const menu = open ? createPortal(
      <div
        className="py-1 rounded-xl overflow-hidden shadow-2xl"
        style={{
          ...menuStyle,
          background: 'rgba(10,12,28,0.98)',
          border: '1px solid rgba(99,102,241,0.2)',
          backdropFilter: 'blur(16px)',
          animation: 'dropdown-in 0.15s ease',
        }}
      >
        {options.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); onChange(opt.value); setOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors"
              style={{
                color: isSelected ? '#a5b4fc' : 'rgba(255,255,255,0.7)',
                background: isSelected ? 'rgba(99,102,241,0.1)' : 'transparent',
              }}
              onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.06)'; }}
              onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <span>{opt.label}</span>
              {isSelected && <HiOutlineCheck className="w-3 h-3 text-indigo-400 flex-shrink-0" />}
            </button>
          );
        })}
      </div>,
      document.body
    ) : null;

    return (
      <div ref={ref} className={`relative inline-block ${className}`}>
        <button
          ref={btnRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${badgeClassName}`}
        >
          <span>{selected ? selected.label : placeholder}</span>
          <HiChevronDown
            className="w-3 h-3 transition-transform duration-200 flex-shrink-0"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>
        {menu}
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all focus:outline-none"
        style={{
          background: 'rgba(255,255,255,0.04)',
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

      {open && (
        <div
          className="absolute z-50 w-full mt-1.5 py-1.5 rounded-xl overflow-hidden shadow-2xl"
          style={{
            background: 'rgba(10,12,28,0.98)',
            border: '1px solid rgba(99,102,241,0.2)',
            backdropFilter: 'blur(16px)',
            animation: 'dropdown-in 0.15s ease',
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm transition-colors"
                style={{
                  color: isSelected ? '#a5b4fc' : 'rgba(255,255,255,0.7)',
                  background: isSelected ? 'rgba(99,102,241,0.1)' : 'transparent',
                }}
                onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.06)'; }}
                onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <span>{opt.label}</span>
                {isSelected && <HiOutlineCheck className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
