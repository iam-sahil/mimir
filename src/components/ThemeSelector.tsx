
import React from "react";
import { Moon, Sun, Check, Monitor, ChevronDown } from "lucide-react";
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
      default:
        return <Moon className="h-4 w-4" />;
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
              {!["light", "dark"].includes(key) && <Moon className="h-4 w-4" />}
              <span>{name}</span>
            </div>
            {currentTheme === key && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
