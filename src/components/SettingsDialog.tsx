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
import {
  ExternalLink,
  Github,
  Instagram,
  Mail,
  Brain,
  Settings,
  User,
  Palette,
  Keyboard,
  Contact,
  Sun,
  Moon,
  Coffee,
  Star,
  PanelRight,
  Leaf,
  Code,
  Zap,
  Info,
  Search,
  ImageIcon,
  Sparkles,
  Check,
  Copy,
} from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { KEYBOARD_SHORTCUTS } from "@/hooks/useHotkeys";
import { toast } from "sonner";
import { Theme, Model } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { mainFontOptions, codeFontOptions } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { geminiModels, openRouterModels, allModels } from "@/lib/models";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export const SettingsDialog = ({
  open,
  onOpenChange,
  className,
}: SettingsDialogProps) => {
  const {
    settings,
    saveGeminiKey,
    saveOpenRouterKey,
    setUsername,
    toggleThinking,
    toggleWebSearch,
    toggleImageGeneration,
    setDefaultModel,
    setSettings,
  } = useSettings();
  const { currentTheme, setTheme, themes } = useTheme();

  const [geminiKey, setGeminiKey] = useState(settings.geminiApiKey || "");
  const [openRouterKey, setOpenRouterKey] = useState(
    settings.openRouterApiKey || ""
  );
  const [username, setUsernameState] = useState(settings.username || "");
  const [mainFont, setMainFont] = useState(
    settings.mainFont || "'Plus Jakarta Sans', sans-serif"
  );
  const [codeFont, setCodeFont] = useState(
    settings.codeFont || "'Source Code Pro', monospace"
  );
  const freeMessagesRemaining = 10 - settings.freeMessagesUsed;
  const [activeTab, setActiveTab] = useState("account");

  useEffect(() => {
    if (open) {
      setGeminiKey(settings.geminiApiKey || "");
      setOpenRouterKey(settings.openRouterApiKey || "");
      setUsernameState(settings.username || "");
      setMainFont(settings.mainFont || "'Plus Jakarta Sans', sans-serif");
      setCodeFont(settings.codeFont || "'Source Code Pro', monospace");
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

    // Save font settings
    setSettings((prev) => ({
      ...prev,
      mainFont,
      codeFont,
    }));

    onOpenChange(false);
    toast("Settings saved successfully");
  };

  const handleThemeChange = (value: string) => {
    setTheme(value as Theme);
  };

  const handleMainFontChange = (font: string) => {
    setMainFont(font);
    document.documentElement.style.setProperty("--font-sans", font);
    // Load the font immediately
    const fontOption = mainFontOptions.find((f) => f.value === font);
    if (fontOption?.url) {
      const existingLink = document.querySelector(
        `link[href="${fontOption.url}"]`
      );
      if (!existingLink) {
        const linkEl = document.createElement("link");
        linkEl.rel = "stylesheet";
        linkEl.href = fontOption.url;
        document.head.appendChild(linkEl);
      }
    }
  };

  const handleCodeFontChange = (font: string) => {
    setCodeFont(font);
    document.documentElement.style.setProperty("--font-mono", font);
    // Load the font immediately
    const fontOption = codeFontOptions.find((f) => f.value === font);
    if (fontOption?.url) {
      const existingLink = document.querySelector(
        `link[href="${fontOption.url}"]`
      );
      if (!existingLink) {
        const linkEl = document.createElement("link");
        linkEl.rel = "stylesheet";
        linkEl.href = fontOption.url;
        document.head.appendChild(linkEl);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "sm:max-w-[600px] max-h-[85vh] overflow-y-auto",
          className
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
          <DialogDescription>Customize your Mimir experience</DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="account"
          className="mt-4"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-5 mb-4 w-full">
            <TabsTrigger
              value="account"
              className="w-full px-1 py-1.5 flex items-center justify-center gap-2"
              onClick={() => setActiveTab("account")}
            >
              <User className="h-4 w-4" />
              <span>Account</span>
            </TabsTrigger>
            <TabsTrigger
              value="models"
              className="w-full px-1 py-1.5 flex items-center justify-center gap-2"
              onClick={() => setActiveTab("models")}
            >
              <Brain className="h-4 w-4" />
              <span>Models</span>
            </TabsTrigger>
            <TabsTrigger
              value="customization"
              className="w-full px-1 py-1.5 flex items-center justify-center gap-2"
              onClick={() => setActiveTab("customization")}
            >
              <Palette className="h-4 w-4" />
              <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger
              value="shortcuts"
              className="w-full px-1 py-1.5 flex items-center justify-center gap-2"
              onClick={() => setActiveTab("shortcuts")}
            >
              <Keyboard className="h-4 w-4" />
              <span>Shortcuts</span>
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="w-full px-1 py-1.5 flex items-center justify-center gap-2"
              onClick={() => setActiveTab("contact")}
            >
              <Contact className="h-4 w-4" />
              <span>Contact</span>
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
              <p className="text-xs text-muted-foreground mt-1">
                Your name will be displayed when you share conversations.
              </p>
            </div>

            <div className="grid gap-2 mt-4">
              <Label htmlFor="gemini-api-key">Gemini API Key</Label>
              <Input
                id="gemini-api-key"
                type="password"
                placeholder="Enter your Gemini API key"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>
                  Free messages remaining:{" "}
                  {freeMessagesRemaining < 0 ? 0 : freeMessagesRemaining}
                </span>
                <a
                  href="https://ai.google.dev/tutorials/web_quickstart"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <span>Get a Gemini API key</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="grid gap-2 mt-4">
              <Label htmlFor="openrouter-api-key">OpenRouter API Key</Label>
              <Input
                id="openrouter-api-key"
                type="password"
                placeholder="Enter your OpenRouter API key"
                value={openRouterKey}
                onChange={(e) => setOpenRouterKey(e.target.value)}
              />
              <div className="flex justify-end text-xs text-muted-foreground mt-1">
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <span>Get an OpenRouter API key</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="models" className="space-y-4 min-h-[300px]">
            <div className="grid gap-6">
              {/* Feature Toggles Section */}
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">Feature Toggles</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-primary" />
                        <Label
                          htmlFor="thinking-toggle"
                          className="font-medium"
                        >
                          Thinking
                        </Label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enable thinking process in AI responses
                      </p>
                    </div>
                    <Switch
                      id="thinking-toggle"
                      checked={settings.enableThinking}
                      onCheckedChange={toggleThinking}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-primary" />
                        <Label
                          htmlFor="web-search-toggle"
                          className="font-medium"
                        >
                          Web Search
                        </Label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Allow AI to search the web for information
                      </p>
                    </div>
                    <Switch
                      id="web-search-toggle"
                      checked={settings.enableWebSearch}
                      onCheckedChange={toggleWebSearch}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-primary" />
                        <Label
                          htmlFor="image-gen-toggle"
                          className="font-medium"
                        >
                          Image Generation
                        </Label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enable AI to generate images from text descriptions
                      </p>
                    </div>
                    <Switch
                      id="image-gen-toggle"
                      checked={settings.enableImageGeneration}
                      onCheckedChange={toggleImageGeneration}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Available Models</h3>
              </div>

              {/* Gemini Models Section */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Gemini Models
                </h4>
                <div className="space-y-4">
                  {geminiModels.map((model) => (
                    <div
                      key={model.id}
                      className="p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{model.name}</h4>
                        {model.supportsThinking &&
                        model.supportsWebSearch &&
                        model.supportsImageGeneration ? (
                          <Badge className="bg-green-500/10 text-green-500">
                            All features
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-500/10 text-yellow-500">
                            Limited features
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {model.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {model.supportsThinking && (
                          <Badge className="flex items-center gap-1 bg-secondary text-secondary-foreground">
                            <Brain className="h-3 w-3" /> Thinking
                          </Badge>
                        )}
                        {model.supportsWebSearch && (
                          <Badge className="flex items-center gap-1 bg-secondary text-secondary-foreground">
                            <Search className="h-3 w-3" /> Web Search
                          </Badge>
                        )}
                        {model.supportsImageGeneration && (
                          <Badge className="flex items-center gap-1 bg-secondary text-secondary-foreground">
                            <ImageIcon className="h-3 w-3" /> Image Generation
                          </Badge>
                        )}
                        {model.canUseImage && (
                          <Badge className="flex items-center gap-1 bg-secondary text-secondary-foreground">
                            <Sparkles className="h-3 w-3" /> Image Understanding
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        {model.id === settings.defaultModel.id ? (
                          <div className="flex items-center gap-1 text-sm text-primary">
                            <Check className="h-4 w-4" /> Default model
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-0 text-sm text-primary"
                            onClick={() => {
                              setDefaultModel(model);
                              toast.success(
                                `${model.name} set as default model`
                              );
                            }}
                          >
                            Set as default
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 text-xs"
                          onClick={() => {
                            navigator.clipboard.writeText(model.modelId);
                            toast.success("Model ID copied to clipboard");
                          }}
                        >
                          <Copy className="h-3 w-3" />
                          <span>Copy ID</span>
                        </Button>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground flex items-center">
                        <span className="font-mono">ID: {model.modelId}</span>
                      </div>
                      {model.rateLimits && (
                        <div className="mt-3 border-t pt-3">
                          <p className="text-xs font-medium mb-1">
                            Rate Limits:
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <div>
                              <span>Requests: </span>
                              <span className="font-mono">
                                {model.rateLimits.requestsPerMinute}/min
                              </span>
                            </div>
                            <div>
                              <span>Daily: </span>
                              <span className="font-mono">
                                {model.rateLimits.requestsPerDay} requests
                              </span>
                            </div>
                          </div>
                          {model.usageTracking && (
                            <div className="mt-2">
                              <p className="text-xs font-medium mb-1">
                                Usage Today:
                              </p>
                              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                <div>
                                  <span>Requests: </span>
                                  <span className="font-mono">
                                    {model.usageTracking.requestsToday}
                                  </span>
                                </div>
                                <div>
                                  <span>Tokens: </span>
                                  <span className="font-mono">
                                    {model.usageTracking.tokensToday.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* OpenRouter Models Section */}
              {openRouterModels.length > 0 && (
                <div className="space-y-2 mt-6">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    OpenRouter Models
                  </h4>
                  <div className="p-4 rounded-lg border bg-card/50 mb-4">
                    <p className="text-sm">
                      OpenRouter provides access to various powerful AI models
                      through a single API. To use these models, you need to add
                      your OpenRouter API key in the Account tab.
                    </p>
                    <a
                      href="https://openrouter.ai/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline text-sm mt-2"
                    >
                      <span>Get an OpenRouter API key</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="space-y-4">
                    {openRouterModels.map((model) => (
                      <div
                        key={model.id}
                        className="p-4 rounded-lg border bg-card"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{model.name}</h4>
                          <Badge className="bg-blue-500/10 text-blue-500">
                            OpenRouter
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {model.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {model.canUseImage && (
                            <Badge className="flex items-center gap-1 bg-secondary text-secondary-foreground">
                              <Sparkles className="h-3 w-3" /> Image
                              Understanding
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          {model.id === settings.defaultModel.id ? (
                            <div className="flex items-center gap-1 text-sm text-primary">
                              <Check className="h-4 w-4" /> Default model
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="px-0 text-sm text-primary"
                              onClick={() => {
                                setDefaultModel(model);
                                toast.success(
                                  `${model.name} set as default model`
                                );
                              }}
                            >
                              Set as default
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 text-xs"
                            onClick={() => {
                              navigator.clipboard.writeText(model.modelId);
                              toast.success("Model ID copied to clipboard");
                            }}
                          >
                            <Copy className="h-3 w-3" />
                            <span>Copy ID</span>
                          </Button>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground flex items-center">
                          <span className="font-mono">ID: {model.modelId}</span>
                        </div>
                        {model.rateLimits && (
                          <div className="mt-3 border-t pt-3">
                            <p className="text-xs font-medium mb-1">
                              Rate Limits:
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                              <div>
                                <span>Requests: </span>
                                <span className="font-mono">
                                  {model.rateLimits.requestsPerMinute}/min
                                </span>
                              </div>
                              <div>
                                <span>Daily: </span>
                                <span className="font-mono">
                                  {model.rateLimits.requestsPerDay} requests
                                </span>
                              </div>
                            </div>
                            {model.usageTracking && (
                              <div className="mt-2">
                                <p className="text-xs font-medium mb-1">
                                  Usage Today:
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                  <div>
                                    <span>Requests: </span>
                                    <span className="font-mono">
                                      {model.usageTracking.requestsToday}
                                    </span>
                                  </div>
                                  <div>
                                    <span>Tokens: </span>
                                    <span className="font-mono">
                                      {model.usageTracking.tokensToday.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent
            value="customization"
            className="space-y-4 min-h-[300px]"
          >
            <div className="grid gap-2">
              <Label htmlFor="theme-select">Theme</Label>
              <Select value={currentTheme} onValueChange={handleThemeChange}>
                <SelectTrigger id="theme-select" className="w-full">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <div className="font-medium text-xs text-muted-foreground mb-1 px-2">
                    Light Themes
                  </div>
                  {Object.entries(themes)
                    .filter(([_, config]) => config.theme === "light")
                    .map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          {key === "light-pink" && (
                            <Sun className="h-4 w-4 text-pink-500" />
                          )}
                          {key === "light-green" && (
                            <Sun className="h-4 w-4 text-green-500" />
                          )}
                          {key === "github-light" && (
                            <Github className="h-4 w-4" />
                          )}
                          <span>{config.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  <div className="font-medium text-xs text-muted-foreground mt-2 mb-1 px-2">
                    Dark Themes
                  </div>
                  {Object.entries(themes)
                    .filter(([_, config]) => config.theme === "dark")
                    .map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          {key === "dark-pink" && (
                            <Moon className="h-4 w-4 text-pink-400" />
                          )}
                          {key === "dark-green" && (
                            <Moon className="h-4 w-4 text-green-400" />
                          )}
                          {key === "github-dark" && (
                            <Github className="h-4 w-4 text-gray-400" />
                          )}
                          {key === "catppuccin" && (
                            <Coffee className="h-4 w-4 text-purple-400" />
                          )}
                          {key === "tokyo-night" && (
                            <Star className="h-4 w-4 text-purple-400" />
                          )}
                          {key === "nord" && (
                            <PanelRight className="h-4 w-4 text-blue-400" />
                          )}
                          {key === "gruvbox" && (
                            <Leaf className="h-4 w-4 text-yellow-500" />
                          )}
                          {key === "one-dark" && (
                            <Code className="h-4 w-4 text-blue-400" />
                          )}
                          {key === "dracula" && (
                            <Zap className="h-4 w-4 text-purple-400" />
                          )}
                          <span>{config.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Choose a theme for your chat interface.
              </p>
            </div>

            <div className="grid gap-2 mt-4">
              <Label htmlFor="main-font">Main Font</Label>
              <Select value={mainFont} onValueChange={handleMainFontChange}>
                <SelectTrigger id="main-font" className="w-full">
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent>
                  {mainFontOptions.map((font) => (
                    <SelectItem key={font.name} value={font.value}>
                      <span style={{ fontFamily: font.value }}>
                        {font.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Choose the main font for the interface.
              </p>
            </div>

            <div className="grid gap-2 mt-4">
              <Label htmlFor="code-font">Code Font</Label>
              <Select value={codeFont} onValueChange={handleCodeFontChange}>
                <SelectTrigger id="code-font" className="w-full">
                  <SelectValue placeholder="Select a code font" />
                </SelectTrigger>
                <SelectContent>
                  {codeFontOptions.map((font) => (
                    <SelectItem key={font.name} value={font.value}>
                      <span style={{ fontFamily: font.value }}>
                        {font.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Choose the font for code blocks and snippets.
              </p>
            </div>

            <div className="border rounded-lg p-4 mt-4">
              <h3 className="font-medium mb-2">Font Preview:</h3>
              <p style={{ fontFamily: mainFont }} className="text-lg">
                This text is displayed in the main font
              </p>
              <div className="mt-4">
                <h4 className="font-medium mb-1">Code Preview:</h4>
                <pre
                  className="bg-secondary/30 p-3 rounded"
                  style={{ fontFamily: codeFont }}
                >
                  {`const greeting = () => {\n  console.log("Hello, world!");\n};\n\ngreeting();`}
                </pre>
              </div>
            </div>
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
                    <tr
                      key={index}
                      className={
                        index < KEYBOARD_SHORTCUTS.length - 1 ? "border-b" : ""
                      }
                    >
                      <td className="p-2 text-muted-foreground">
                        {shortcut.description}
                      </td>
                      <td className="p-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {shortcut.keys.map((key, keyIndex) => (
                            <React.Fragment key={keyIndex}>
                              <kbd className="bg-muted px-2 py-0.5 text-xs rounded font-mono">
                                {key}
                              </kbd>
                              {keyIndex < shortcut.keys.length - 1 && (
                                <span>+</span>
                              )}
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
              <h3 className="text-lg font-semibold">
                Connect with the Developer
              </h3>
              <p className="text-muted-foreground">
                Have questions, feedback, or just want to say hi? Reach out
                through any of these channels:
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
