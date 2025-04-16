
import { createContext, useContext, useEffect } from "react";
import { Theme } from "@/types";
import { themes } from "@/lib/themes";
import { useSettings } from "./SettingsContext";

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Record<Theme, { name: string; className: string }>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings, setTheme } = useSettings();

  // Apply theme class to the document element
  useEffect(() => {
    // Remove all theme classes
    document.documentElement.classList.remove(...Object.values(themes).map(theme => theme.className));
    // Add current theme class
    document.documentElement.classList.add(themes[settings.theme].className);
  }, [settings.theme]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme: settings.theme,
        setTheme,
        themes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
