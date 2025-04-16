
import { createContext, useContext, useEffect, useState } from "react";
import { Settings, Theme, Model } from "@/types";
import { defaultModel } from "@/lib/models";

interface SettingsContextType {
  settings: Settings;
  saveGeminiKey: (key: string) => void;
  setDefaultModel: (model: Model) => void;
  setTheme: (theme: Theme) => void;
  setUsername: (username: string) => void;
  hasValidKey: (provider: "gemini") => boolean;
}

const defaultSettings: Settings = {
  geminiApiKey: "",
  defaultModel: defaultModel,
  theme: "dark",
  username: "",
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

  const setDefaultModel = (model: Model) => {
    setSettings((prev) => ({ ...prev, defaultModel: model }));
  };

  const setTheme = (theme: Theme) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const setUsername = (username: string) => {
    setSettings((prev) => ({ ...prev, username }));
  };

  const hasValidKey = (provider: "gemini") => {
    return !!settings.geminiApiKey;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        saveGeminiKey,
        setDefaultModel,
        setTheme,
        setUsername,
        hasValidKey,
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
