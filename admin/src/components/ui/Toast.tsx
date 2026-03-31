import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineInformationCircle,
  HiOutlineXMark,
} from 'react-icons/hi2';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DURATION = 3000;

const config: Record<ToastType, { Icon: React.ElementType; iconClass: string; barClass: string; borderColor: string }> = {
  success: {
    Icon: HiOutlineCheckCircle,
    iconClass: 'text-emerald-400',
    barClass: 'bg-emerald-400',
    borderColor: 'rgba(52,211,153,0.35)',
  },
  error: {
    Icon: HiOutlineXCircle,
    iconClass: 'text-rose-400',
    barClass: 'bg-rose-400',
    borderColor: 'rgba(251,113,133,0.35)',
  },
  info: {
    Icon: HiOutlineInformationCircle,
    iconClass: 'text-blue-400',
    barClass: 'bg-blue-400',
    borderColor: 'rgba(96,165,250,0.35)',
  },
};

function ToastCard({ item, onClose }: { item: ToastItem; onClose: (id: string) => void }) {
  const { Icon, iconClass, barClass, borderColor } = config[item.type];
  const [entered, setEntered] = React.useState(false);
  const [leaving, setLeaving] = React.useState(false);

  const dismiss = useCallback(() => {
    setLeaving(true);
    setTimeout(() => onClose(item.id), 320);
  }, [item.id, onClose]);

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    const timer = setTimeout(dismiss, DURATION);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [dismiss]);

  const visible = entered && !leaving;

  return (
    <div
      role="alert"
      style={{
        background: 'rgba(10,12,28,0.97)',
        border: `1px solid ${borderColor}`,
        borderRadius: 14,
        width: 320,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(calc(100% + 24px)) scale(0.96)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.28s ease',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 14px 16px' }}>
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconClass}`} />
        <p style={{ flex: 1, fontSize: 13.5, lineHeight: 1.5, color: 'rgba(255,255,255,0.88)', margin: 0 }}>
          {item.message}
        </p>
        <button
          onClick={dismiss}
          style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 2, marginTop: 2 }}
          className="text-white/30 hover:text-white/70 transition-colors"
        >
          <HiOutlineXMark className="w-4 h-4" />
        </button>
      </div>
      {/* Progress bar */}
      <div
        className={barClass}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 3,
          width: '100%',
          transformOrigin: 'left',
          animation: `toast-shrink ${DURATION}ms linear forwards`,
        }}
      />
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((type: ToastType, message: string) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-4), { id, type, message }]);
  }, []);

  const value: ToastContextValue = {
    success: (msg) => add('success', msg),
    error: (msg) => add('error', msg),
    info: (msg) => add('info', msg),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          pointerEvents: 'none',
        }}
      >
        {toasts.map((item) => (
          <div key={item.id} style={{ pointerEvents: 'auto' }}>
            <ToastCard item={item} onClose={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
