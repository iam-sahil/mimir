
import React from "react";
import { PanelRight, Brain } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  onClose: () => void;
}

export const SidebarHeader = ({ onClose }: SidebarHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <Brain className="h-6 w-6 text-primary" />
        <span className="text-xl font-semibold">Mimir</span>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose}
        className="h-8 w-8"
      >
        <PanelRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
