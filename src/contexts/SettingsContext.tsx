import React, { createContext, useContext, useEffect, useState } from "react";
import { Model, Settings } from "@/types";
import { geminiModels, getModelById, allModels } from "@/lib/models";
import { useTheme } from "@/contexts/ThemeContext";
import { mainFontOptions, codeFontOptions } from "@/lib/fonts";

// Get the free API key from environment variables
const FREE_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_FREE_API_KEY || "";
const FREE_MESSAGE_LIMIT = parseInt(
  import.meta.env.VITE_FREE_MESSAGE_LIMIT || "10",
  10
);

interface SettingsContextType {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  saveGeminiKey: (key: string) => void;
  saveOpenRouterKey: (key: string) => void;
  setUsername: (username: string) => void;
  incrementFreeMessageCount: () => void;
  incrementFreeMessagesUsed: () => void;
  hasValidKey: (provider: string) => boolean;
  getActiveApiKey: (provider: string) => string | null;
  toggleThinking: () => void;
  toggleWebSearch: () => void;
  toggleImageGeneration: () => void;
  setDefaultModel: (model: Model) => void;
}

export const SettingsContext = createContext<SettingsContextType>({
  settings: {
    defaultModel: geminiModels[0],
    geminiApiKey: "",
    openRouterApiKey: "",
    username: "",
    theme: "dark-green",
    freeMessagesUsed: 0,
    enableThinking: true,
    enableWebSearch: true,
    enableImageGeneration: true,
    mainFont: "'Plus Jakarta Sans', sans-serif",
    codeFont: "'Source Code Pro', monospace",
  },
  setSettings: () => {},
  saveGeminiKey: () => {},
  saveOpenRouterKey: () => {},
  setUsername: () => {},
  incrementFreeMessageCount: () => {},
  incrementFreeMessagesUsed: () => {},
  hasValidKey: () => false,
  getActiveApiKey: () => null,
  toggleThinking: () => {},
  toggleWebSearch: () => {},
  toggleImageGeneration: () => {},
  setDefaultModel: () => {},
});

interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const { setTheme } = useTheme();
  const [settings, setSettings] = useState<Settings>(() => {
    // Attempt to load settings from local storage
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);

        // Restore complete model object from ID
        if (parsedSettings.defaultModel && parsedSettings.defaultModel.id) {
          const modelId = parsedSettings.defaultModel.id;
          const completeModel = allModels.find((m) => m.id === modelId);
          if (completeModel) {
            parsedSettings.defaultModel = completeModel;
          } else {
            // Fallback to first model if saved model no longer exists
            parsedSettings.defaultModel = geminiModels[0];
          }
        } else {
          // Use default if no model found
          parsedSettings.defaultModel = geminiModels[0];
        }

        // Apply the saved theme
        if (parsedSettings.theme) {
          setTheme(parsedSettings.theme);
        }

        // Apply the saved fonts
        if (parsedSettings.mainFont) {
          document.documentElement.style.setProperty(
            "--font-sans",
            parsedSettings.mainFont
          );
          loadGoogleFont(parsedSettings.mainFont);
        }
        if (parsedSettings.codeFont) {
          document.documentElement.style.setProperty(
            "--font-mono",
            parsedSettings.codeFont
          );
          loadGoogleFont(parsedSettings.codeFont);
        }

        return parsedSettings;
      } catch (e) {
        console.error("Error parsing settings:", e);
      }
    }

    // Default settings
    return {
      defaultModel: geminiModels[0],
      geminiApiKey: "",
      openRouterApiKey: "",
      username: "",
      theme: "dark-green",
      freeMessagesUsed: 0,
      enableThinking: true,
      enableWebSearch: true,
      enableImageGeneration: true,
      mainFont: "'Plus Jakarta Sans', sans-serif",
      codeFont: "'Source Code Pro', monospace",
    };
  });

  // Function to load Google Fonts
  const loadGoogleFont = (fontValue: string) => {
    // Find the font in our options
    const mainFont = mainFontOptions.find((f) => f.value === fontValue);
    const codeFont = codeFontOptions.find((f) => f.value === fontValue);

    if (mainFont || codeFont) {
      const fontUrl = mainFont?.url || codeFont?.url;
      if (fontUrl) {
        // Check if this font link already exists
        const existingLink = document.querySelector(`link[href="${fontUrl}"]`);
        if (!existingLink) {
          const linkEl = document.createElement("link");
          linkEl.rel = "stylesheet";
          linkEl.href = fontUrl;
          document.head.appendChild(linkEl);
        }
      }
    }
  };

  // Save settings to local storage whenever they change
  useEffect(() => {
    // Create a safe copy for localStorage to prevent circular references
    const safeSettings = {
      ...settings,
      // Only store essential model data (id, name, provider, modelId)
      defaultModel: {
        id: settings.defaultModel.id,
        name: settings.defaultModel.name,
        provider: settings.defaultModel.provider,
        modelId: settings.defaultModel.modelId,
      },
    };

    localStorage.setItem("settings", JSON.stringify(safeSettings));

    // Apply font settings when they change
    document.documentElement.style.setProperty(
      "--font-sans",
      settings.mainFont
    );
    document.documentElement.style.setProperty(
      "--font-mono",
      settings.codeFont
    );
    // Load the fonts
    loadGoogleFont(settings.mainFont);
    loadGoogleFont(settings.codeFont);
  }, [settings]);

  // Function to ensure we have a full model object with all properties
  const getFullModelObject = (model: Model): Model => {
    // First try to find the model by its ID in allModels
    if (model && model.id) {
      const completeModel = allModels.find((m) => m.id === model.id);
      if (completeModel) {
        return completeModel;
      }
    }

    // If not found (maybe a custom model), return the original
    return model;
  };

  // Set default model
  const setDefaultModel = (model: Model) => {
    // Get the full model object to ensure all properties are included
    const fullModel = getFullModelObject(model);

    setSettings((prev) => {
      // Only update if the model ID is different
      if (prev.defaultModel.id === fullModel.id) {
        return prev; // No change needed
      }

      return {
        ...prev,
        defaultModel: fullModel,
      };
    });

    // Log to verify the model is being set correctly
    console.log("Default model updated:", fullModel.id, fullModel.name);
  };

  // Save Gemini API key
  const saveGeminiKey = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      geminiApiKey: key,
    }));
  };

  // Save OpenRouter API key
  const saveOpenRouterKey = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      openRouterApiKey: key,
    }));
  };

  // Set username
  const setUsername = (username: string) => {
    setSettings((prev) => ({
      ...prev,
      username,
    }));
  };

  // Increment free messages used
  const incrementFreeMessagesUsed = () => {
    setSettings((prev) => ({
      ...prev,
      freeMessagesUsed: prev.freeMessagesUsed + 1,
    }));
  };

  // Alias for incrementFreeMessagesUsed for backward compatibility
  const incrementFreeMessageCount = incrementFreeMessagesUsed;

  // Toggle thinking capability
  const toggleThinking = () => {
    setSettings((prev) => ({
      ...prev,
      enableThinking: !prev.enableThinking,
    }));
  };

  // Toggle web search
  const toggleWebSearch = () => {
    setSettings((prev) => ({
      ...prev,
      enableWebSearch: !prev.enableWebSearch,
    }));
  };

  // Toggle image generation
  const toggleImageGeneration = () => {
    setSettings((prev) => ({
      ...prev,
      enableImageGeneration: !prev.enableImageGeneration,
    }));
  };

  // Check if the user has a valid API key for a given provider
  const hasValidKey = (provider: string) => {
    if (provider === "gemini") {
      return (
        !!settings.geminiApiKey ||
        (FREE_GEMINI_API_KEY && settings.freeMessagesUsed < FREE_MESSAGE_LIMIT)
      );
    } else if (provider === "openrouter") {
      return !!settings.openRouterApiKey;
    }
    return false;
  };

  // Get active API key for a given provider
  const getActiveApiKey = (provider: string): string | null => {
    if (provider === "gemini") {
      // Use the user's API key if available, otherwise use the free API key
      // but only if they haven't exceeded the free message limit
      if (settings.geminiApiKey) {
        return settings.geminiApiKey;
      } else if (
        FREE_GEMINI_API_KEY &&
        settings.freeMessagesUsed < FREE_MESSAGE_LIMIT
      ) {
        return FREE_GEMINI_API_KEY;
      }
      return null;
    } else if (provider === "openrouter") {
      return settings.openRouterApiKey || null;
    }
    return null;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
        saveGeminiKey,
        saveOpenRouterKey,
        setUsername,
        incrementFreeMessagesUsed,
        incrementFreeMessageCount,
        hasValidKey,
        getActiveApiKey,
        toggleThinking,
        toggleWebSearch,
        toggleImageGeneration,
        setDefaultModel,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
