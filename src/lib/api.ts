import { Message, Model, ChatCompletionMessage } from "@/types";
import { callGemini, generateImage } from "@/pages/services/gemini";
import { callOpenRouter } from "@/pages/services/openrouter";
import { getSettings } from "@/lib/settings";
import { hasReachedDailyLimit, getFallbackModel } from "@/lib/models";
import { toast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner";

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

// Track which key index failed to avoid immediate retry
let lastFailedKeyIndex = -1;

export async function sendChatRequest(
  model: Model,
  messages: Message[],
  retryCount = 0,
): Promise<ChatCompletionMessage> {
  // Get API key and settings
  const settings = getSettings();
  let apiKey;

  if (model.provider === "gemini") {
    // Collect all available keys
    const allKeys = [
      settings.geminiApiKey,
      ...(settings.geminiApiKeys || []),
      ...FREE_GEMINI_API_KEYS,
    ].filter(Boolean);

    if (allKeys.length === 0) {
      throw new Error("Missing API key for gemini");
    }

    // Use the current key index to select the key
    const currentIndex = settings.currentGeminiKeyIndex || 0;
    apiKey = allKeys[currentIndex % allKeys.length];

    // Only use free keys if under the limit
    if (FREE_GEMINI_API_KEYS.includes(apiKey)) {
      if (settings.freeMessagesUsed >= FREE_MESSAGE_LIMIT) {
        // If free key is exhausted, try user key
        if (settings.geminiApiKey) {
          apiKey = settings.geminiApiKey;
        } else {
          throw new Error(
            "Free message limit reached. Please add your API key in settings.",
          );
        }
      }
    }
  } else if (model.provider === "openrouter") {
    apiKey = settings.openRouterApiKey;
  }

  if (!apiKey) {
    throw new Error(`Missing API key for ${model.provider}`);
  }

  // Check for rate limits
  if (hasReachedDailyLimit(model.id)) {
    const fallbackModel = getFallbackModel(model.id);
    toast({
      title: "Daily limit reached",
      description: `Switching to ${fallbackModel.name} as fallback model`,
      variant: "destructive",
    });
    return sendChatRequest(fallbackModel, messages, retryCount);
  }

  try {
    if (model.provider === "gemini") {
      const result = await callGemini(apiKey, model.id, messages, {
        withThinking: settings.enableThinking && model.supportsThinking,
        enableWebSearch: settings.enableWebSearch && model.supportsWebSearch,
        enableImageGeneration:
          settings.enableImageGeneration && model.supportsImageGeneration,
        onRateLimitDetected: () => {
          // Rotate to next key on rate limit
          const allKeys = [
            settings.geminiApiKey,
            ...(settings.geminiApiKeys || []),
            ...FREE_GEMINI_API_KEYS,
          ].filter(Boolean);

          if (allKeys.length > 1) {
            const currentIndex = settings.currentGeminiKeyIndex || 0;
            const nextIndex = (currentIndex + 1) % allKeys.length;

            // Update settings in localStorage directly
            const savedSettings = localStorage.getItem("settings");
            if (savedSettings) {
              const parsedSettings = JSON.parse(savedSettings);
              parsedSettings.currentGeminiKeyIndex = nextIndex;
              localStorage.setItem("settings", JSON.stringify(parsedSettings));
            }

            lastFailedKeyIndex = currentIndex;
          }
        },
      });
      return result;
    } else if (model.provider === "openrouter") {
      const response = await callOpenRouter(apiKey, model.modelId, messages);
      // Convert string response to ChatCompletionMessage
      return {
        role: "assistant",
        content: response,
        id: `openrouter-${Date.now()}`,
        finishReason: "stop",
      };
    } else {
      throw new Error(`Unsupported model provider: ${model.provider}`);
    }
  } catch (error) {
    console.error("Error in chat request:", error);

    // Check if it's a rate limit error and we have more keys to try
    if (
      error instanceof Error &&
      (error.message.includes("429") ||
        error.message.includes("RESOURCE_EXHAUSTED") ||
        error.message.includes("quota")) &&
      model.provider === "gemini" &&
      retryCount < 3
    ) {
      const allKeys = [
        settings.geminiApiKey,
        ...(settings.geminiApiKeys || []),
        ...FREE_GEMINI_API_KEYS,
      ].filter(Boolean);

      if (allKeys.length > 1) {
        sonnerToast.info(
          `Retrying with next API key (attempt ${retryCount + 1})...`,
        );

        // Wait a bit before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Retry with next key
        return sendChatRequest(model, messages, retryCount + 1);
      }
    }

    throw error;
  }
}

export async function generateImageRequest(
  model: Model,
  prompt: string,
  retryCount = 0,
): Promise<string> {
  // Get API key and settings
  const settings = getSettings();
  let apiKey;

  if (model.provider === "gemini") {
    // Collect all available keys
    const allKeys = [
      settings.geminiApiKey,
      ...(settings.geminiApiKeys || []),
      ...FREE_GEMINI_API_KEYS,
    ].filter(Boolean);

    if (allKeys.length === 0) {
      throw new Error("Missing API key for gemini");
    }

    // Use the current key index to select the key
    const currentIndex = settings.currentGeminiKeyIndex || 0;
    apiKey = allKeys[currentIndex % allKeys.length];

    // Only use free keys if under the limit
    if (FREE_GEMINI_API_KEYS.includes(apiKey)) {
      if (settings.freeMessagesUsed >= FREE_MESSAGE_LIMIT) {
        // If free key is exhausted, try user key
        if (settings.geminiApiKey) {
          apiKey = settings.geminiApiKey;
        } else {
          throw new Error(
            "Free message limit reached. Please add your API key in settings.",
          );
        }
      }
    }
  } else {
    throw new Error("Image generation is only supported with Gemini models");
  }

  if (!apiKey) {
    throw new Error(`Missing API key for ${model.provider}`);
  }

  if (!model.supportsImageGeneration) {
    throw new Error(`The ${model.name} model doesn't support image generation`);
  }

  try {
    return await generateImage(apiKey, model, prompt, () => {
      // Rotate to next key on rate limit
      const allKeys = [
        settings.geminiApiKey,
        ...(settings.geminiApiKeys || []),
        ...FREE_GEMINI_API_KEYS,
      ].filter(Boolean);

      if (allKeys.length > 1) {
        const currentIndex = settings.currentGeminiKeyIndex || 0;
        const nextIndex = (currentIndex + 1) % allKeys.length;

        // Update settings in localStorage directly
        const savedSettings = localStorage.getItem("settings");
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          parsedSettings.currentGeminiKeyIndex = nextIndex;
          localStorage.setItem("settings", JSON.stringify(parsedSettings));
        }
      }
    });
  } catch (error) {
    console.error("Error generating image:", error);

    // Check if it's a rate limit error and we have more keys to try
    if (
      error instanceof Error &&
      (error.message.includes("429") ||
        error.message.includes("RESOURCE_EXHAUSTED") ||
        error.message.includes("quota")) &&
      retryCount < 3
    ) {
      const allKeys = [
        settings.geminiApiKey,
        ...(settings.geminiApiKeys || []),
        ...FREE_GEMINI_API_KEYS,
      ].filter(Boolean);

      if (allKeys.length > 1) {
        sonnerToast.info(
          `Retrying image generation with next API key (attempt ${retryCount + 1})...`,
        );

        // Wait a bit before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Retry with next key
        return generateImageRequest(model, prompt, retryCount + 1);
      }
    }

    throw error;
  }
}
