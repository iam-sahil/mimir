
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
    // Safety check for themes object
    if (!themes) {
      console.error("Themes object is undefined");
      return;
    }

    // Get valid theme classes
    const themeClasses = Object.values(themes)
      .map(theme => theme?.className)
      .filter(Boolean);

    // Remove all theme classes safely
    if (themeClasses.length > 0) {
      document.documentElement.classList.remove(...themeClasses);
    }
    
    // Check if the current theme exists in the themes object
    const currentTheme = settings.theme;
    const themeData = themes[currentTheme];
    
    if (themeData && themeData.className) {
      // Add current theme class
      document.documentElement.classList.add(themeData.className);
      
      // Set CSS custom property for primary RGB
      const setPrimaryRGB = () => {
        let primaryRGB;
        switch(currentTheme) {
          case "light-pink":
            primaryRGB = "255, 64, 129";
            break;
          case "dark-green":
            primaryRGB = "76, 175, 80";
            break;
          case "dark-mono":
            primaryRGB = "255, 255, 255";
            break;
          case "catppuccin":
            primaryRGB = "243, 139, 168";
            break;
          case "tokyo-night":
            primaryRGB = "187, 154, 247";
            break;
          case "nord":
            primaryRGB = "129, 161, 193";
            break;
          case "gruvbox":
            primaryRGB = "250, 189, 47";
            break;
          case "one-dark":
            primaryRGB = "97, 175, 239";
            break;
          case "dracula":
            primaryRGB = "189, 147, 249";
            break;
          case "github-light":
            primaryRGB = "3, 102, 214";
            break;
          default:
            primaryRGB = "76, 175, 80"; // Default to dark-green
        }
        
        document.documentElement.style.setProperty('--primary-rgb', primaryRGB);
      };
      
      setPrimaryRGB();
    } else {
      console.warn(`Theme '${currentTheme}' not found in themes object or missing className`);
      // Apply a default theme as fallback
      document.documentElement.classList.add("dark-green");
      document.documentElement.style.setProperty('--primary-rgb', "76, 175, 80");
    }
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
