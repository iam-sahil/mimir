
import { createContext, useContext, useEffect, useState } from "react";
import { Settings, Theme, Model } from "@/types";
import { defaultModel } from "@/lib/models";

interface SettingsContextType {
  settings: Settings;
  saveOpenAIKey: (key: string) => void;
  saveGeminiKey: (key: string) => void;
  setDefaultModel: (model: Model) => void;
  setTheme: (theme: Theme) => void;
  hasValidKey: (provider: "openai" | "gemini") => boolean;
}

const defaultSettings: Settings = {
  openaiApiKey: "",
  geminiApiKey: "",
  defaultModel: defaultModel,
  theme: "dark",
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

  const saveOpenAIKey = (key: string) => {
    setSettings((prev) => ({ ...prev, openaiApiKey: key }));
  };

  const saveGeminiKey = (key: string) => {
    setSettings((prev) => ({ ...prev, geminiApiKey: key }));
  };

  const setDefaultModel = (model: Model) => {
    setSettings((prev) => ({ ...prev, defaultModel: model }));
  };

  const setTheme = (theme: Theme) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const hasValidKey = (provider: "openai" | "gemini") => {
    if (provider === "openai") {
      return !!settings.openaiApiKey;
    }
    return !!settings.geminiApiKey;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        saveOpenAIKey,
        saveGeminiKey,
        setDefaultModel,
        setTheme,
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
