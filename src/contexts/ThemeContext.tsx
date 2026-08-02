import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 1. Initialize safely, falling back to light mode natively
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") return stored;
      return "light";
    } catch {
      return "light";
    }
  });

  // 2. React exactly to state changes. Single source of truth.
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      console.warn("Failed to save theme to localStorage", e);
    }
  }, [theme]);

  // 3. Functional state update prevents stale closures
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  // 4. Memoize context value to optimize performance during deep renders
  const value = useMemo(() => ({ 
    theme, 
    setTheme: setThemeState, 
    toggleTheme 
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}