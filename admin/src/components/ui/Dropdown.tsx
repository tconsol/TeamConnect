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
  compact?: boolean;
  badgeClassName?: string;
}

interface MenuPosition {
  top: number;
  left: number;
  width: number;
}

function DropdownMenu({
  options,
  value,
  position,
  onChange,
  onClose,
  itemHeight = 40,
}: {
  options: DropdownOption[];
  value: string;
  position: MenuPosition;
  onChange: (v: string) => void;
  onClose: () => void;
  itemHeight?: number;
}) {
  const maxH = 240;
  const estimatedH = Math.min(options.length * itemHeight + 8, maxH);
  const vh = window.innerHeight;
  const spaceBelow = vh - position.top;
  const openUp = spaceBelow < estimatedH + 8 && position.top > estimatedH + 8;
  const top = openUp ? position.top - estimatedH - 8 : position.top + 8;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top,
        left: position.left,
        width: position.width,
        zIndex: 99999,
        background: '#0f1123',
        border: '1px solid rgba(99,102,241,0.35)',
        borderRadius: '10px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        overflow: 'hidden auto',
        maxHeight: maxH,
        scrollbarWidth: 'none' as any,
      }}
    >
      {options.map((opt) => {
        const isSel = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onChange(opt.value);
              onClose();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '10px 14px',
              background: isSel ? 'rgba(99,102,241,0.15)' : 'transparent',
              color: isSel ? '#a5b4fc' : 'rgba(255,255,255,0.75)',
              border: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              cursor: 'pointer',
              fontSize: 14,
              fontFamily: 'inherit',
              textAlign: 'left',
              transition: 'background 0.12s',
            }}
            onMouseEnter={(e) => {
              if (!isSel) (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.08)';
            }}
            onMouseLeave={(e) => {
              if (!isSel) (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            <span>{opt.label}</span>
            {isSel && <HiOutlineCheck style={{ width: 14, height: 14, color: '#818cf8', flexShrink: 0 }} />}
          </button>
        );
      })}
    </div>,
    document.body
  );
}

export function Dropdown({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = '',
  compact = false,
  badgeClassName = '',
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<MenuPosition | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        // Small delay to let onMouseDown in menu fire first
        setTimeout(() => setOpen(false), 50);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const toggle = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setMenuPos({ top: rect.bottom, left: rect.left, width: rect.width });
    setOpen((o) => !o);
  };

  if (compact) {
    return (
      <div ref={wrapRef} className={`relative inline-block ${className}`}>
        <button
          ref={btnRef}
          type="button"
          onClick={toggle}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${badgeClassName}`}
        >
          <span>{selected ? selected.label : placeholder}</span>
          <HiChevronDown
            style={{ width: 12, height: 12, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
          />
        </button>
        {open && menuPos && (
          <DropdownMenu
            options={options}
            value={value}
            position={menuPos}
            onChange={onChange}
            onClose={() => setOpen(false)}
            itemHeight={34}
          />
        )}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '9px 12px',
          background: 'rgba(255,255,255,0.04)',
          border: open ? '1px solid rgba(99,102,241,0.55)' : '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8,
          color: selected ? '#fff' : 'rgba(156,163,175,1)',
          cursor: 'pointer',
          fontSize: 14,
          fontFamily: 'inherit',
          transition: 'border-color 0.15s',
          outline: 'none',
        }}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <HiChevronDown
          style={{
            width: 16,
            height: 16,
            color: '#9ca3af',
            flexShrink: 0,
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {open && menuPos && (
        <DropdownMenu
          options={options}
          value={value}
          position={menuPos}
          onChange={onChange}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

