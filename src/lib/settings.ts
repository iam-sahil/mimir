
import { Settings } from "@/types";

// Get settings from local storage
export function getSettings(): Settings {
  const settingsJson = localStorage.getItem("settings");
  if (!settingsJson) {
    return {
      geminiApiKey: "",
      openRouterApiKey: "",
      defaultModel: {
        id: "gemini-2.0-flash",
        name: "Gemini 2.0 Flash",
        modelId: "gemini-2.0-flash",
        provider: "gemini",
        canUseImage: true,
      },
      theme: "light-pink",
      username: "User",
      freeMessagesUsed: 0,
    };
  }
  return JSON.parse(settingsJson);
}

// Save settings to local storage
export function saveSettings(settings: Settings): void {
  localStorage.setItem("settings", JSON.stringify(settings));
}
