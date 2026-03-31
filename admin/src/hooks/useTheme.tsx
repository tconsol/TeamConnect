import { createContext, useContext, useCallback, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggle: (x: number, y: number) => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'dark', toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem('admin-theme') as Theme) || 'dark';
    } catch {
      return 'dark';
    }
  });

  const toggle = useCallback(
    (x: number, y: number) => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('admin-theme', next);

      const applyTheme = () => {
        if (next === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        setTheme(next);
      };

      // Fallback for browsers without View Transition API
      if (!('startViewTransition' in document)) {
        applyTheme();
        return;
      }

      const transition = (document as any).startViewTransition(applyTheme);

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0% at ${x}px ${y}px)`,
              `circle(150% at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 450,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      });
    },
    [theme]
  );

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
