
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
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "catppuccin":
        return <Palette className="h-4 w-4 text-[#f38ba8]" />;
      case "tokyo-night":
        return <Palette className="h-4 w-4 text-[#bb9af7]" />;
      case "nord":
        return <Palette className="h-4 w-4 text-[#81a1c1]" />;
      case "monodark":
        return <Palette className="h-4 w-4 text-[#61afef]" />;
      case "gruvbox":
        return <Palette className="h-4 w-4 text-[#fabd2f]" />;
      default:
        return <Moon className="h-4 w-4" />;
    }
  };

  // Helper to get theme accent color
  const getThemeAccentClass = (theme: Theme) => {
    switch (theme) {
      case "catppuccin":
        return "text-[#f38ba8]";
      case "tokyo-night":
        return "text-[#bb9af7]";
      case "nord":
        return "text-[#81a1c1]";
      case "monodark":
        return "text-[#61afef]";
      case "gruvbox":
        return "text-[#fabd2f]";
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
      <DropdownMenuContent align="end">
        {Object.entries(themes).map(([key, { name }]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setTheme(key as Theme)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              {key === "light" && <Sun className="h-4 w-4" />}
              {key === "dark" && <Moon className="h-4 w-4" />}
              {!["light", "dark"].includes(key) && 
                <Palette className={`h-4 w-4 ${getThemeAccentClass(key as Theme)}`} />
              }
              <span>{name}</span>
            </div>
            {currentTheme === key && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
