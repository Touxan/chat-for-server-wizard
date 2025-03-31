
import { useState, useEffect } from "react";

type Theme = "light" | "dark";

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Try to get theme from localStorage
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) return savedTheme;
    
    // Otherwise check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return "dark";
    }
    
    // Default to dark for terminal feel
    return "dark";
  });

  useEffect(() => {
    // Update localStorage
    localStorage.setItem("theme", theme);
    
    // Update document class
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Log theme change in terminal style
    console.log(`%c[THEME] %cSwitched to ${theme} mode`, 
      'color: #33d17a; font-weight: bold;', 
      'color: inherit;');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  return { theme, toggleTheme };
};
