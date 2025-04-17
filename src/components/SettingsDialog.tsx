
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
import { ExternalLink } from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const { settings, saveGeminiKey, saveOpenRouterKey, setUsername } = useSettings();
  
  const [geminiKey, setGeminiKey] = useState(settings.geminiApiKey || "");
  const [openRouterKey, setOpenRouterKey] = useState(settings.openRouterApiKey || "");
  const [username, setUsernameState] = useState(settings.username || "");
  const freeMessagesRemaining = 10 - settings.freeMessagesUsed;

  const handleSave = () => {
    if (geminiKey !== settings.geminiApiKey) {
      saveGeminiKey(geminiKey);
    }
    
    if (openRouterKey !== settings.openRouterApiKey) {
      saveOpenRouterKey(openRouterKey);
    }
    
    if (username !== settings.username) {
      setUsername(username);
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
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsernameState(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gemini-api-key">
              Gemini API Key
              {!settings.geminiApiKey && freeMessagesRemaining > 0 && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({freeMessagesRemaining} free messages remaining)
                </span>
              )}
            </Label>
            <Input
              id="gemini-api-key"
              type="password"
              placeholder="Enter your Gemini API key"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
            />
            <div className="text-xs text-muted-foreground">
              <a 
                href="https://ai.google.dev/tutorials/setup" 
                target="_blank"
                rel="noopener noreferrer" 
                className="text-primary flex items-center gap-1 hover:underline"
              >
                Get a Gemini API key <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="openrouter-api-key">
              OpenRouter API Key
            </Label>
            <Input
              id="openrouter-api-key"
              type="password"
              placeholder="Enter your OpenRouter API key"
              value={openRouterKey}
              onChange={(e) => setOpenRouterKey(e.target.value)}
            />
            <div className="text-xs text-muted-foreground">
              <a 
                href="https://openrouter.ai/keys" 
                target="_blank"
                rel="noopener noreferrer" 
                className="text-primary flex items-center gap-1 hover:underline"
              >
                Get an OpenRouter API key <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
