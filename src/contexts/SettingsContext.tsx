
import { createContext, useContext, useEffect, useState } from "react";
import { Settings, Theme, Model } from "@/types";
import { defaultModel } from "@/lib/models";
import { toast } from "@/components/ui/sonner";

// Free API key for first 10 messages
const FREE_API_KEY = "AIzaSyDektoljoG7mk0yug7fLS0kJ7EfF69bs7g";
const MAX_FREE_MESSAGES = 10;

interface SettingsContextType {
  settings: Settings;
  saveGeminiKey: (key: string) => void;
  saveOpenRouterKey: (key: string) => void;
  setDefaultModel: (model: Model) => void;
  setTheme: (theme: Theme) => void;
  setUsername: (username: string) => void;
  hasValidKey: (provider: "gemini" | "openrouter") => boolean;
  getActiveApiKey: (provider: "gemini" | "openrouter") => string;
  incrementFreeMessageCount: () => void;
}

const defaultSettings: Settings = {
  geminiApiKey: "",
  openRouterApiKey: "",
  defaultModel: defaultModel,
  theme: "dark-green", // Updated default theme to one in our Theme type
  username: "",
  freeMessagesUsed: 0,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem("mimir-settings");
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("mimir-settings", JSON.stringify(settings));
  }, [settings]);

  const saveGeminiKey = (key: string) => {
    setSettings((prev) => ({ ...prev, geminiApiKey: key }));
  };

  const saveOpenRouterKey = (key: string) => {
    setSettings((prev) => ({ ...prev, openRouterApiKey: key }));
  };

  const setDefaultModel = (model: Model) => {
    setSettings((prev) => ({ ...prev, defaultModel: model }));
  };

  const setTheme = (theme: Theme) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const setUsername = (username: string) => {
    setSettings((prev) => ({ ...prev, username }));
  };

  const hasValidKey = (provider: "gemini" | "openrouter") => {
    if (provider === "gemini") {
      return settings.freeMessagesUsed < MAX_FREE_MESSAGES || !!settings.geminiApiKey;
    }
    return !!settings.openRouterApiKey;
  };

  const getActiveApiKey = (provider: "gemini" | "openrouter") => {
    if (provider === "gemini") {
      if (settings.geminiApiKey) {
        return settings.geminiApiKey;
      }
      
      if (settings.freeMessagesUsed < MAX_FREE_MESSAGES) {
        return FREE_API_KEY;
      }
      
      return "";
    } else if (provider === "openrouter") {
      return settings.openRouterApiKey || "";
    }
    
    return "";
  };

  const incrementFreeMessageCount = () => {
    if (!settings.geminiApiKey) {
      const newCount = settings.freeMessagesUsed + 1;
      setSettings(prev => ({ ...prev, freeMessagesUsed: newCount }));
      
      if (newCount === MAX_FREE_MESSAGES) {
        toast.warning(
          "You've used all your free messages. Please enter your API key in settings to continue.",
          {
            duration: 6000,
          }
        );
      } else if (newCount === MAX_FREE_MESSAGES - 2) {
        toast.info(
          `You have ${MAX_FREE_MESSAGES - newCount} free messages left. Add your API key in settings to continue after that.`,
          {
            duration: 5000,
          }
        );
      }
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        saveGeminiKey,
        saveOpenRouterKey,
        setDefaultModel,
        setTheme,
        setUsername,
        hasValidKey,
        getActiveApiKey,
        incrementFreeMessageCount,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
