/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: { primary: '#0F1117', secondary: '#1A1B23', card: '#21222D' },
        accent: { indigo: '#6366F1', blue: '#3B82F6' },
        border: { subtle: 'rgba(255,255,255,0.08)' },
      },
    },
  },
  plugins: [],
};
