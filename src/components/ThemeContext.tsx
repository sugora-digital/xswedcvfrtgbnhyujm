import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme } from '../types';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem('sugora-theme') as Theme;
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch (e) {
      // Ignore localStorage errors
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('sugora-theme', newTheme);
    } catch (e) {
      // Ignore localStorage errors
    }
  };

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = () => {
      let active: 'light' | 'dark' = 'dark';
      
      if (theme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        active = systemDark ? 'dark' : 'light';
      } else {
        active = theme;
      }
      
      setResolvedTheme(active);
      
      if (active === 'dark') {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };

    applyTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
