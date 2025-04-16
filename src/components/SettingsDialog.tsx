
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/contexts/SettingsContext";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const { settings, saveOpenAIKey, saveGeminiKey } = useSettings();
  
  const [openaiKey, setOpenaiKey] = useState(settings.openaiApiKey || "");
  const [geminiKey, setGeminiKey] = useState(settings.geminiApiKey || "");

  const handleSave = () => {
    if (openaiKey !== settings.openaiApiKey) {
      saveOpenAIKey(openaiKey);
    }
    
    if (geminiKey !== settings.geminiApiKey) {
      saveGeminiKey(geminiKey);
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your API keys and preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="openai-api-key">OpenAI API Key</Label>
            <Input
              id="openai-api-key"
              type="password"
              placeholder="Enter your OpenAI API key"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gemini-api-key">Gemini API Key</Label>
            <Input
              id="gemini-api-key"
              type="password"
              placeholder="Enter your Gemini API key"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
