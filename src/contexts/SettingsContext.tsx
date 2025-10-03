import React, { createContext, useContext, useEffect, useState } from "react";
import { Model, Settings } from "@/types";
import { geminiModels, getModelById, allModels } from "@/lib/models";
import { useTheme } from "@/contexts/ThemeContext";
import { mainFontOptions, codeFontOptions } from "@/lib/fonts";

// Get the free API keys from environment variables (supports multiple keys)
const FREE_GEMINI_API_KEYS = [
  import.meta.env.VITE_GEMINI_FREE_API_KEY,
  import.meta.env.VITE_GEMINI_FREE_API_KEY_2,
  import.meta.env.VITE_GEMINI_FREE_API_KEY_3,
  import.meta.env.VITE_GEMINI_FREE_API_KEY_4,
  import.meta.env.VITE_GEMINI_FREE_API_KEY_5,
].filter(Boolean) as string[];

const FREE_MESSAGE_LIMIT = parseInt(
  import.meta.env.VITE_FREE_MESSAGE_LIMIT || "10",
  10,
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
  rotateToNextGeminiKey: () => void;
  getCurrentGeminiKeyIndex: () => number;
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
    currentGeminiKeyIndex: 0,
    geminiApiKeys: [],
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
  rotateToNextGeminiKey: () => {},
  getCurrentGeminiKeyIndex: () => 0,
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
            parsedSettings.mainFont,
          );
          loadGoogleFont(parsedSettings.mainFont);
        }
        if (parsedSettings.codeFont) {
          document.documentElement.style.setProperty(
            "--font-mono",
            parsedSettings.codeFont,
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
      currentGeminiKeyIndex: 0,
      geminiApiKeys: [],
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
      settings.mainFont,
    );
    document.documentElement.style.setProperty(
      "--font-mono",
      settings.codeFont,
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

  // Save Gemini API key (supports comma-separated keys for multiple keys)
  const saveGeminiKey = (key: string) => {
    // Split by comma and trim to support multiple keys
    const keys = key
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    setSettings((prev) => ({
      ...prev,
      geminiApiKey: keys[0] || key, // First key as primary
      geminiApiKeys: keys.length > 1 ? keys : [], // Store all keys if multiple
      currentGeminiKeyIndex: 0, // Reset to first key
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

  // Rotate to next Gemini API key (for handling rate limits)
  const rotateToNextGeminiKey = () => {
    const allKeys = [
      settings.geminiApiKey,
      ...(settings.geminiApiKeys || []),
      ...FREE_GEMINI_API_KEYS,
    ].filter(Boolean);

    if (allKeys.length <= 1) {
      // No keys to rotate to
      return;
    }

    const currentIndex = settings.currentGeminiKeyIndex || 0;
    const nextIndex = (currentIndex + 1) % allKeys.length;

    setSettings((prev) => ({
      ...prev,
      currentGeminiKeyIndex: nextIndex,
    }));
  };

  // Get current Gemini key index
  const getCurrentGeminiKeyIndex = () => {
    return settings.currentGeminiKeyIndex || 0;
  };

  // Check if the user has a valid API key for a given provider
  const hasValidKey = (provider: string) => {
    if (provider === "gemini") {
      const hasUserKey =
        !!settings.geminiApiKey ||
        (settings.geminiApiKeys && settings.geminiApiKeys.length > 0);
      const hasFreeKey =
        FREE_GEMINI_API_KEYS.length > 0 &&
        settings.freeMessagesUsed < FREE_MESSAGE_LIMIT;
      return hasUserKey || hasFreeKey;
    } else if (provider === "openrouter") {
      return !!settings.openRouterApiKey;
    }
    return false;
  };

  // Get active API key for a given provider (with rotation support)
  const getActiveApiKey = (provider: string): string | null => {
    if (provider === "gemini") {
      // Collect all available keys
      const allKeys = [
        settings.geminiApiKey,
        ...(settings.geminiApiKeys || []),
        ...FREE_GEMINI_API_KEYS,
      ].filter(Boolean);

      if (allKeys.length === 0) {
        return null;
      }

      // Use the current key index to select the key
      const currentIndex = settings.currentGeminiKeyIndex || 0;
      const selectedKey = allKeys[currentIndex % allKeys.length];

      // Only use free keys if under the limit
      if (FREE_GEMINI_API_KEYS.includes(selectedKey)) {
        if (settings.freeMessagesUsed < FREE_MESSAGE_LIMIT) {
          return selectedKey;
        }
        // If free key is exhausted, try next user key
        if (settings.geminiApiKey) {
          return settings.geminiApiKey;
        }
        return null;
      }

      return selectedKey;
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
        rotateToNextGeminiKey,
        getCurrentGeminiKeyIndex,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
