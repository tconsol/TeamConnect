/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#050505',
          secondary: '#0B0B0F',
          card: 'rgba(255,255,255,0.05)',
        },
        border: {
          subtle: 'rgba(255,255,255,0.08)',
        },
        accent: {
          indigo: '#6366F1',
          blue: '#3B82F6',
        },
        text: {
          heading: '#FFFFFF',
          sub: '#C7C9D1',
          body: '#9CA3AF',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': 'clamp(2.5rem, 6vw, 5.5rem)',
        'display': 'clamp(2rem, 4vw, 4rem)',
        'title': 'clamp(1.5rem, 3vw, 3rem)',
        'subtitle': 'clamp(1.1rem, 2vw, 1.5rem)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glow-indigo': 'radial-gradient(circle at center, rgba(99,102,241,0.15), transparent 70%)',
        'glow-blue': 'radial-gradient(circle at center, rgba(59,130,246,0.15), transparent 70%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
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
    },
  },
  plugins: [],
};
