// 1. FIXED: 'import' must be lowercase
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

type ThemeProviderContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // 2. FIXED: Initialize state LAZILY to prevent "Flash of White"
  const [theme, setTheme] = useState<Theme>(() => {
    // Server-side rendering safety check
    if (typeof window === "undefined") return "light";

    // A. Check Local Storage first
    const savedTheme = localStorage.getItem("theme"); // Changed key to 'theme' for clarity
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    // B. Fallback to System Preference (OS Settings)
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }

    // C. Default
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove old class and add new one
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    
    // Save to local storage as simple string
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
