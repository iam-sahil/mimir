import { Message, Model } from "@/types";
import { callGemini } from "./gemini";
import { getModelById } from "@/lib/models";

export interface ChatOptions {
  enableThinking?: boolean;
  enableWebSearch?: boolean;
  enableImageGeneration?: boolean;
}

export async function sendChatRequest(
  modelId: string,
  messages: Message[],
  options: ChatOptions = {}
) {
  try {
    const model = getModelById(modelId);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    // Check if this is an image generation request
    const isImageGenerationRequest = 
      isRequestingImageGeneration(messages) && 
      model.supportsImageGeneration;
    
    // If we're asking for image generation but the selected model doesn't support it,
    // use a model that does support image generation
    let effectiveModelId = modelId;
    if (isImageGenerationRequest && !model.supportsImageGeneration) {
      // Find a model that supports image generation
      const imageModel = getImageGenerationModel();
      if (imageModel) {
        effectiveModelId = imageModel.id;
        console.log(`Switching to ${imageModel.name} for image generation`);
      }
    }
    
    // Default options
    const { 
      enableThinking = true, 
      enableWebSearch = false,
      enableImageGeneration = isImageGenerationRequest
    } = options;
    
    // Handle different model providers
    if (model.provider === "gemini") {
      const response = await callGemini(
        apiKey,
        effectiveModelId, 
        messages, 
        {
          temperature: 0.7,
          withThinking: enableThinking && model.supportsThinking,
          enableWebSearch: enableWebSearch && model.supportsWebSearch,
          enableImageGeneration: enableImageGeneration && model.supportsImageGeneration
        }
      );
      return response;
    }
    
    // Handle other providers like OpenRouter here if needed
    throw new Error(`Provider ${model.provider} not supported`);
  } catch (error) {
    console.error("Error in chat request:", error);
    throw error;
  }
}

// Helper function to determine if the user is requesting image generation
function isRequestingImageGeneration(messages: Message[]): boolean {
  if (messages.length === 0) return false;
  
  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role !== "user") return false;
  
  const content = lastMessage.content.toLowerCase();
  const imageGenerationTriggers = [
    "generate an image",
    "create an image",
    "draw",
    "make an image",
    "create a picture",
    "generate a picture",
    "create an illustration",
    "generate an illustration",
    "show me an image",
    "visualize",
    "create art",
    "generate art"
  ];
  
  return imageGenerationTriggers.some(trigger => content.includes(trigger));
}

// Helper function to find a model that supports image generation
function getImageGenerationModel(): Model | null {
  // Search for models with image generation capability
  const models = require("@/lib/models").allModels;
  return models.find((m: Model) => m.supportsImageGeneration) || null;
} 