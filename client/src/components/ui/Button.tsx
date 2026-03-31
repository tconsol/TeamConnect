import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export default function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 cursor-pointer';

  const variants = {
    primary: 'bg-gradient-to-r from-accent-indigo to-accent-blue text-white hover:shadow-lg hover:shadow-accent-indigo/25 hover:scale-[1.02]',
    secondary: 'glass text-white hover:bg-white/[0.08] border border-white/[0.08]',
    ghost: 'text-text-body hover:text-white hover:bg-white/[0.04]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-6 py-3 text-sm gap-2',
    lg: 'px-8 py-4 text-base gap-3',
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
