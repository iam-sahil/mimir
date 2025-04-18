
import React, { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Github, Instagram, Mail } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { KEYBOARD_SHORTCUTS } from "@/hooks/useHotkeys";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const { settings, saveGeminiKey, saveOpenRouterKey, setUsername } = useSettings();
  
  const [geminiKey, setGeminiKey] = useState(settings.geminiApiKey || "");
  const [openRouterKey, setOpenRouterKey] = useState(settings.openRouterApiKey || "");
  const [username, setUsernameState] = useState(settings.username || "");
  const [fontUrl, setFontUrl] = useState("");
  const [customFontFamily, setCustomFontFamily] = useState("");
  const [previewFont, setPreviewFont] = useState(false);
  const freeMessagesRemaining = 10 - settings.freeMessagesUsed;

  useEffect(() => {
    if (open) {
      setGeminiKey(settings.geminiApiKey || "");
      setOpenRouterKey(settings.openRouterApiKey || "");
      setUsernameState(settings.username || "");
    }
  }, [open, settings]);

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
    
    // Custom font handling would go here
    
    onOpenChange(false);
  };

  const handleFontUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontUrl(e.target.value);
  };

  const handlePreviewFont = () => {
    if (!fontUrl) return;
    
    // Extract font family name from URL
    const urlParams = new URLSearchParams(fontUrl.split('?')[1]);
    const familyParam = urlParams.get('family');
    
    if (!familyParam) {
      alert("Invalid Google Font URL. Please make sure it contains a family parameter.");
      return;
    }
    
    // Get the font family name (before the ':' if it exists)
    const fontFamily = familyParam.split(':')[0].replace(/\+/g, ' ');
    setCustomFontFamily(fontFamily);
    
    // Create a link element for the font
    const linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.href = fontUrl;
    document.head.appendChild(linkEl);
    
    setPreviewFont(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your API keys and preferences.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="account" className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="customization">Customization</TabsTrigger>
            <TabsTrigger value="shortcuts">Keyboard Shortcuts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="customization" className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="google-font">Google Fonts URL</Label>
              <div className="flex gap-2">
                <Input
                  id="google-font"
                  placeholder="https://fonts.googleapis.com/css2?family=..."
                  value={fontUrl}
                  onChange={handleFontUrlChange}
                />
                <Button onClick={handlePreviewFont} type="button">Preview</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Paste a Google Fonts URL to use a custom font for the app.
              </p>
            </div>
            
            {previewFont && customFontFamily && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Preview:</h3>
                <p 
                  style={{ fontFamily: customFontFamily }} 
                  className="text-lg"
                >
                  This text is displayed in {customFontFamily}
                </p>
                <p 
                  style={{ fontFamily: customFontFamily }} 
                  className="text-sm mt-2"
                >
                  The quick brown fox jumps over the lazy dog.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="shortcuts" className="space-y-4">
            <div className="border rounded-md">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Action</th>
                    <th className="text-right p-2">Shortcut</th>
                  </tr>
                </thead>
                <tbody>
                  {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
                    <tr key={index} className={index < KEYBOARD_SHORTCUTS.length - 1 ? "border-b" : ""}>
                      <td className="p-2 text-muted-foreground">{shortcut.description}</td>
                      <td className="p-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {shortcut.keys.map((key, keyIndex) => (
                            <React.Fragment key={keyIndex}>
                              <kbd className="bg-muted px-2 py-0.5 text-xs rounded font-mono">
                                {key}
                              </kbd>
                              {keyIndex < shortcut.keys.length - 1 && <span>+</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
