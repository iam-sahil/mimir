
import React from "react";
import { Moon, Sun, Github, Star, Palette, Terminal, Coffee, Leaf, Code, PanelRight, Brush, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Theme } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";

export const ThemeSelector = () => {
  const { currentTheme, setTheme, themes } = useTheme();

  // Helper to get the theme icon
  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case "light-pink":
        return <Sun className="h-4 w-4 text-pink-500" />;
      case "light-green":
        return <Sun className="h-4 w-4 text-green-500" />;
      case "dark-pink":
        return <Moon className="h-4 w-4 text-pink-400" />;
      case "dark-green":
        return <Moon className="h-4 w-4 text-green-400" />;
      case "github-light":
        return <Github className="h-4 w-4" />;
      case "github-dark":
        return <Github className="h-4 w-4 text-gray-400" />;
      case "catppuccin":
        return <Coffee className="h-4 w-4 text-purple-400" />;
      case "tokyo-night":
        return <Star className="h-4 w-4 text-purple-400" />;
      case "nord":
        return <PanelRight className="h-4 w-4 text-blue-400" />;
      case "gruvbox":
        return <Leaf className="h-4 w-4 text-yellow-500" />;
      case "one-dark":
        return <Code className="h-4 w-4 text-blue-400" />;
      case "dracula":
        return <Zap className="h-4 w-4 text-purple-400" />;
      default:
        return <Palette className="h-4 w-4" />;
    }
  };

  // Organize themes by light and dark
  const lightThemes = Object.entries(themes).filter(([_, config]) => config.theme === 'light');
  const darkThemes = Object.entries(themes).filter(([_, config]) => config.theme === 'dark');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          {getThemeIcon(currentTheme)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-[70vh] overflow-y-auto">
        {lightThemes.map(([key, config]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setTheme(key as Theme)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              {getThemeIcon(key)}
              <span>{config.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        {darkThemes.map(([key, config]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setTheme(key as Theme)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              {getThemeIcon(key)}
              <span>{config.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
