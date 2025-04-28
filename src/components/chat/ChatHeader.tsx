import React from "react";
import { Settings, Info } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeSelector } from "../ThemeSelector";
interface ChatHeaderProps {
  onSettingsClick: () => void;
  onInfoClick: () => void;
  onSettingsOpen: (open: boolean) => void;
}
export const ChatHeader = ({
  onSettingsClick,
  onInfoClick,
  onSettingsOpen,
}: ChatHeaderProps) => {
  return (
    <header className="h-16 flex items-center justify-between shrink-0 px-2">
      <div></div>
      <div className="flex items-center gap-2">
        <div className="glass-effect rounded-lg p-1.5 shadow-md">
          <ThemeSelector />
        </div>
        <div className="glass-effect rounded-lg p-1.5 shadow-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSettingsOpen(true)}
            className="h-8 w-8"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        <div className="glass-effect rounded-lg p-1.5 shadow-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={onInfoClick}
            className="h-8 w-8"
          >
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
