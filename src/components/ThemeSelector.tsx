
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
        return <Sun className="h-5 w-5 text-[#FF4081]" />;
      case "dark-green":
        return <Moon className="h-5 w-5 text-[#4CAF50]" />;
      case "dark-mono":
        return <Moon className="h-5 w-5 text-[#FFFFFF]" />;
      case "catppuccin":
        return <Palette className="h-5 w-5 text-[#F38BA8]" />;
      case "tokyo-night":
        return <Palette className="h-5 w-5 text-[#BB9AF7]" />;
      case "nord":
        return <Palette className="h-5 w-5 text-[#81A1C1]" />;
      case "gruvbox":
        return <Palette className="h-5 w-5 text-[#FABD2F]" />;
      case "one-dark":
        return <Palette className="h-5 w-5 text-[#61AFEF]" />;
      case "dracula":
        return <Palette className="h-5 w-5 text-[#BD93F9]" />;
      case "github-light":
        return <Palette className="h-5 w-5 text-[#0366D6]" />;
      default:
        return <Sun className="h-5 w-5" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
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
