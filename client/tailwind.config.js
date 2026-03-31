/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#030014',
          secondary: '#0A0A1B',
          card: 'rgba(255,255,255,0.03)',
        },
        border: {
          subtle: 'rgba(255,255,255,0.06)',
        },
        accent: {
          violet: '#8B5CF6',
          indigo: '#6366F1',
          blue: '#3B82F6',
          cyan: '#06B6D4',
        },
        text: {
          heading: '#F8FAFC',
          sub: '#CBD5E1',
          body: '#94A3B8',
          muted: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': 'clamp(2.75rem, 7vw, 5.5rem)',
        'display': 'clamp(2rem, 4.5vw, 4rem)',
        'title': 'clamp(1.5rem, 3vw, 3rem)',
        'subtitle': 'clamp(1.05rem, 1.8vw, 1.35rem)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glow-violet': 'radial-gradient(circle at center, rgba(139,92,246,0.15), transparent 70%)',
        'glow-indigo': 'radial-gradient(circle at center, rgba(99,102,241,0.15), transparent 70%)',
        'glow-blue': 'radial-gradient(circle at center, rgba(59,130,246,0.15), transparent 70%)',
        'mesh': 'radial-gradient(at 40% 20%, rgba(139,92,246,0.1) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(59,130,246,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(99,102,241,0.05) 0px, transparent 50%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
        'spin-slow': 'spin 20s linear infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(139, 92, 246, 0.15)',
        'glow-md': '0 0 40px rgba(139, 92, 246, 0.2)',
        'glow-lg': '0 0 60px rgba(139, 92, 246, 0.25)',
      },
    },
  },
  plugins: [],
};
