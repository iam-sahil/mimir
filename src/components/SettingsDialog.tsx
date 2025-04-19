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
import { ExternalLink, Github, Instagram, Mail, Brain, Settings } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { KEYBOARD_SHORTCUTS } from "@/hooks/useHotkeys";
import { toast } from "sonner";

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
  const [activeTab, setActiveTab] = useState("account");

  useEffect(() => {
    if (open) {
      setGeminiKey(settings.geminiApiKey || "");
      setOpenRouterKey(settings.openRouterApiKey || "");
      setUsernameState(settings.username || "");
      
      // Reset font preview
      setPreviewFont(false);
      setFontUrl("");
      setCustomFontFamily("");
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
    
    onOpenChange(false);
    toast("Settings saved successfully");
  };

  const handleFontUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontUrl(e.target.value);
    setPreviewFont(false);
  };

  const handlePreviewFont = () => {
    if (!fontUrl) return;
    
    // Extract font family name from URL
    const urlParams = new URLSearchParams(fontUrl.split('?')[1]);
    const familyParam = urlParams.get('family');
    
    if (!familyParam) {
      toast("Invalid Google Font URL");
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
    
    toast("Font preview applied");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="settings-dialog max-w-4xl w-[90vw]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your API keys, preferences, and customizations.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs 
          defaultValue="account" 
          className="mt-4" 
          value={activeTab} 
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-4 bg-background/5 p-1 rounded-lg">
            <TabsTrigger 
              value="account" 
              className="rounded-md px-3 py-1.5 data-[state=active]:bg-background"
            >
              Account
            </TabsTrigger>
            <TabsTrigger 
              value="customization" 
              className="rounded-md px-3 py-1.5 data-[state=active]:bg-background"
            >
              Customization
            </TabsTrigger>
            <TabsTrigger 
              value="shortcuts" 
              className="rounded-md px-3 py-1.5 data-[state=active]:bg-background"
            >
              Keyboard Shortcuts
            </TabsTrigger>
            <TabsTrigger 
              value="contact" 
              className="rounded-md px-3 py-1.5 data-[state=active]:bg-background"
            >
              Contact Us
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4 min-h-[300px]">
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
          
          <TabsContent value="customization" className="space-y-4 min-h-[300px]">
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
                <a 
                  href="https://fonts.google.com/" 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-primary ml-1 flex items-center gap-1 hover:underline inline-flex"
                >
                  Browse Google Fonts <ExternalLink className="h-3 w-3" />
                </a>
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
                <div className="mt-4 text-xs">
                  <h4 className="font-semibold mb-1">How to apply:</h4>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Go to <a href="https://fonts.google.com/" className="text-primary hover:underline" target="_blank" rel="noreferrer">Google Fonts</a></li>
                    <li>Select a font family</li>
                    <li>Click "Select this style" for the styles you want</li>
                    <li>Open the "Use on the web" section</li>
                    <li>Copy the &lt;link&gt; URL and paste it here</li>
                  </ol>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="shortcuts" className="space-y-4 min-h-[300px]">
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
          
          <TabsContent value="contact" className="space-y-4 min-h-[300px]">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Connect with the Developer</h3>
              <p className="text-muted-foreground">
                Have questions, feedback, or just want to say hi? Reach out through any of these channels:
              </p>
              
              <div className="flex flex-col gap-3 w-full max-w-xs">
                <a 
                  href="https://instagram.com/_sahiilrana" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 border rounded-md transition-colors hover:bg-accent/10"
                >
                  <Instagram className="h-5 w-5 text-pink-500" />
                  <span>@_sahiilrana</span>
                </a>
                
                <a 
                  href="mailto:developer.sahilrana@gmail.com" 
                  className="flex items-center gap-2 p-2 border rounded-md transition-colors hover:bg-accent/10"
                >
                  <Mail className="h-5 w-5 text-blue-500" />
                  <span>developer.sahilrana@gmail.com</span>
                </a>
                
                <a 
                  href="https://github.com/iam-sahil" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 border rounded-md transition-colors hover:bg-accent/10"
                >
                  <Github className="h-5 w-5" />
                  <span>iam-sahil</span>
                </a>
              </div>
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
