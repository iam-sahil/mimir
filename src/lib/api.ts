import { Message, Model, ChatCompletionMessage } from "@/types";
import { callGemini, generateImage } from "@/pages/services/gemini";
import { callOpenRouter } from "@/pages/services/openrouter";
import { getSettings } from "@/lib/settings";
import { hasReachedDailyLimit, getFallbackModel } from "@/lib/models";
import { toast } from "@/components/ui/use-toast";

// Get the free API key from environment variables
const FREE_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_FREE_API_KEY || "";
const FREE_MESSAGE_LIMIT = parseInt(import.meta.env.VITE_FREE_MESSAGE_LIMIT || "10", 10);

export async function sendChatRequest(
  model: Model,
  messages: Message[]
): Promise<ChatCompletionMessage> {
  // Get API key and settings
  const settings = getSettings();
  let apiKey;
  
  if (model.provider === "gemini") {
    // Use user's API key if available, otherwise use the free API key
    apiKey = settings.geminiApiKey;
    
    // If no user key and we have a free key and are under the limit, use the free key
    if (!apiKey && FREE_GEMINI_API_KEY && settings.freeMessagesUsed < FREE_MESSAGE_LIMIT) {
      apiKey = FREE_GEMINI_API_KEY;
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
    return sendChatRequest(fallbackModel, messages);
  }

  try {
    if (model.provider === "gemini") {
      return await callGemini(
        apiKey,
        model.id, 
        messages, 
        {
          withThinking: settings.enableThinking && model.supportsThinking,
          enableWebSearch: settings.enableWebSearch && model.supportsWebSearch,
          enableImageGeneration: settings.enableImageGeneration && model.supportsImageGeneration
        }
      );
    } else if (model.provider === "openrouter") {
      const response = await callOpenRouter(apiKey, model.modelId, messages);
      // Convert string response to ChatCompletionMessage
      return {
        role: "assistant",
        content: response,
        id: `openrouter-${Date.now()}`,
        finishReason: "stop"
      };
    } else {
      throw new Error(`Unsupported model provider: ${model.provider}`);
    }
  } catch (error) {
    console.error("Error in chat request:", error);
    throw error;
  }
}

export async function generateImageRequest(
  model: Model,
  prompt: string
): Promise<string> {
  // Get API key and settings
  const settings = getSettings();
  let apiKey;
  
  if (model.provider === "gemini") {
    // Use user's API key if available, otherwise use the free API key
    apiKey = settings.geminiApiKey;
    
    // If no user key and we have a free key and are under the limit, use the free key
    if (!apiKey && FREE_GEMINI_API_KEY && settings.freeMessagesUsed < FREE_MESSAGE_LIMIT) {
      apiKey = FREE_GEMINI_API_KEY;
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
    return await generateImage(apiKey, model, prompt);
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}
