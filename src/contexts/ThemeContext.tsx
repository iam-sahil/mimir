
import React, { createContext, useContext, useEffect, useState } from "react";
import { Theme } from "@/types";
import { themes, getThemeVariables } from "@/lib/themes";

type ThemeContextType = {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  themes: typeof themes;
};

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: "dark-green",
  setTheme: () => {},
  themes: themes,
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    // Try to get the theme from localStorage, fallback to dark-green
    const savedTheme = localStorage.getItem("theme") as Theme;
    return savedTheme && themes[savedTheme] ? savedTheme : "dark-green";
  });

  // Apply theme variables to document root
  useEffect(() => {
    const themeConfig = themes[currentTheme];
    
    // Set data-theme attribute for Tailwind
    document.documentElement.setAttribute("data-theme", themeConfig.theme);
    
    // Set CSS variables on the document root
    const variables = getThemeVariables(currentTheme);
    Object.entries(variables).forEach(([variable, value]) => {
      document.documentElement.style.setProperty(variable, value);
    });

    // Save theme to localStorage
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  const setTheme = (theme: Theme) => {
    if (themes[theme]) {
      setCurrentTheme(theme);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        themes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
