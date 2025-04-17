
import React from "react";
import { Moon, Sun, Check, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Theme } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";

export const ThemeSelector = () => {
  const { currentTheme, setTheme, themes } = useTheme();

  // Helper to get the theme icon
  const getThemeIcon = (theme: Theme) => {
    switch (theme) {
      case "light-pink":
        return <Sun className="h-4 w-4 text-[#FF4081]" />;
      case "dark-green":
        return <Moon className="h-4 w-4 text-[#4CAF50]" />;
      case "dark-mono":
        return <Moon className="h-4 w-4 text-[#FFFFFF]" />;
      case "catppuccin":
        return <Palette className="h-4 w-4 text-[#F38BA8]" />;
      case "tokyo-night":
        return <Palette className="h-4 w-4 text-[#BB9AF7]" />;
      case "nord":
        return <Palette className="h-4 w-4 text-[#81A1C1]" />;
      case "gruvbox":
        return <Palette className="h-4 w-4 text-[#FABD2F]" />;
      case "one-dark":
        return <Palette className="h-4 w-4 text-[#61AFEF]" />;
      case "dracula":
        return <Palette className="h-4 w-4 text-[#BD93F9]" />;
      case "github-light":
        return <Palette className="h-4 w-4 text-[#0366D6]" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  // Helper to get theme accent color
  const getThemeAccentClass = (theme: Theme) => {
    switch (theme) {
      case "light-pink":
        return "text-[#FF4081]";
      case "dark-green":
        return "text-[#4CAF50]";
      case "dark-mono":
        return "text-[#FFFFFF]";
      case "catppuccin":
        return "text-[#F38BA8]";
      case "tokyo-night":
        return "text-[#BB9AF7]";
      case "nord":
        return "text-[#81A1C1]";
      case "gruvbox":
        return "text-[#FABD2F]";
      case "one-dark":
        return "text-[#61AFEF]";
      case "dracula":
        return "text-[#BD93F9]";
      case "github-light":
        return "text-[#0366D6]";
      default:
        return "";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {getThemeIcon(currentTheme)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-[70vh] overflow-y-auto">
        {Object.entries(themes).map(([key, { name }]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setTheme(key as Theme)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              {getThemeIcon(key as Theme)}
              <span>{name}</span>
            </div>
            {currentTheme === key && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
