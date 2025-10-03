import { Model } from "@/types";

export const geminiModels: Model[] = [
  {
    id: "gemini-2-5-pro",
    name: "Gemini 2.5 Pro",
    provider: "gemini",
    modelId: "gemini-2.5-pro",
    description:
      "Advanced model with enhanced thinking and reasoning, multimodal understanding, advanced coding, and more",
    canUseImage: true,
    supportsThinking: true,
    supportsWebSearch: true,
    supportsImageGeneration: true,
    rateLimits: {
      requestsPerMinute: 5,
      requestsPerDay: 25,
      tokensPerMinute: 250000,
      tokensPerDay: 1000000,
    },
    usageTracking: {
      requestsToday: 0,
      tokensToday: 0,
    },
    fallbackModelId: "gemini-flash-latest",
  },
  {
    id: "gemini-flash-latest",
    name: "Gemini 2.5 Flash",
    provider: "gemini",
    modelId: "gemini-flash-latest",
    description:
      "Cost-efficient model with adaptive thinking and multimodal understanding",
    canUseImage: true,
    supportsThinking: true,
    supportsWebSearch: true,
    supportsImageGeneration: true,
    rateLimits: {
      requestsPerMinute: 10,
      requestsPerDay: 500,
      tokensPerMinute: 250000,
      tokensPerDay: 1000000,
    },
    usageTracking: {
      requestsToday: 0,
      tokensToday: 0,
    },
    fallbackModelId: "gemini-2-0-flash",
  },
  {
    id: "gemini-2-0-flash",
    name: "Gemini 2.0 Flash",
    provider: "gemini",
    modelId: "gemini-2.0-flash",
    description: "Fast and efficient model with multimodal capabilities",
    canUseImage: true,
    supportsThinking: true,
    supportsWebSearch: true,
    supportsImageGeneration: false,
    rateLimits: {
      requestsPerMinute: 15,
      requestsPerDay: 1500,
      tokensPerMinute: 1000000,
      tokensPerDay: 10000000,
    },
    usageTracking: {
      requestsToday: 0,
      tokensToday: 0,
    },
  },
];

export const openRouterModels: Model[] = [
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    provider: "openrouter",
    modelId: "deepseek/deepseek-r1:free",
    description: "Advanced reasoning model with strong performance",
    canUseImage: false,
  },
  {
    id: "deepseek-r1-distill-qwen-14b",
    name: "DeepSeek R1 Qwen",
    provider: "openrouter",
    modelId: "deepseek/deepseek-r1-distill-qwen-14b:free",
    description: "Distilled knowledge model with Qwen architecture",
    canUseImage: false,
  },
  {
    id: "deepseek-r1-distill-llama-70b",
    name: "DeepSeek R1 Llama",
    provider: "openrouter",
    modelId: "deepseek/deepseek-r1-distill-llama-70b:free",
    description: "Distilled knowledge model with Llama architecture",
    canUseImage: false,
  },
  {
    id: "meta-llama-4-maverick",
    name: "Llama 4 Maverick",
    provider: "openrouter",
    modelId: "meta-llama/llama-4-maverick:free",
    description: "Latest generation Llama model with advanced capabilities",
    canUseImage: false,
  },
  {
    id: "meta-llama-4-scout",
    name: "Llama 4 Scout",
    provider: "openrouter",
    modelId: "meta-llama/llama-4-scout:free",
    description:
      "Smaller, more efficient version of Llama 4 with excellent reasoning",
    canUseImage: false,
  },
  {
    id: "sophosympatheia-rogue-rose",
    name: "Rogue Rose",
    provider: "openrouter",
    modelId: "sophosympatheia/rogue-rose-103b-v0.2:free",
    description: "Large 103B parameter model with strong creative abilities",
    canUseImage: false,
  },
];

export const allModels: Model[] = [...geminiModels, ...openRouterModels];

export const defaultModel: Model = geminiModels[0];

export const getModelById = (id: string): Model => {
  return allModels.find((model) => model.id === id) || defaultModel;
};

export const getModelsByProvider = (
  provider: "gemini" | "openrouter",
): Model[] => {
  return allModels.filter((model) => model.provider === provider);
};

// Helper function to track usage for a model
export const trackModelUsage = (modelId: string, tokensUsed: number): Model => {
  const model = getModelById(modelId);

  if (!model || !model.usageTracking) return model;

  // Reset usage tracking if it's a new day
  const today = new Date().toDateString();
  if (model.usageTracking.lastResetDate !== today) {
    model.usageTracking.requestsToday = 0;
    model.usageTracking.tokensToday = 0;
    model.usageTracking.lastResetDate = today;
  }

  // Update usage
  model.usageTracking.requestsToday += 1;
  model.usageTracking.tokensToday += tokensUsed;

  return model;
};

// Check if a model has reached its daily limit
export const hasReachedDailyLimit = (modelId: string): boolean => {
  const model = getModelById(modelId);

  if (!model || !model.rateLimits || !model.usageTracking) return false;

  return (
    model.usageTracking.requestsToday >= model.rateLimits.requestsPerDay ||
    model.usageTracking.tokensToday >= model.rateLimits.tokensPerDay
  );
};

// Get the fallback model when rate limits are reached
export const getFallbackModel = (modelId: string): Model => {
  const model = getModelById(modelId);

  if (!model || !model.fallbackModelId) return defaultModel;

  const fallbackModel = getModelById(model.fallbackModelId);

  // If the fallback model has also reached its limits, try to get its fallback model
  if (
    fallbackModel &&
    hasReachedDailyLimit(fallbackModel.id) &&
    fallbackModel.fallbackModelId
  ) {
    return getFallbackModel(fallbackModel.id);
  }

  return fallbackModel || defaultModel;
};

// Function to get a model best suited for a specific prompt
export const getModelForPrompt = (prompt: string): Model => {
  // Check if the prompt is requesting image generation
  const isImagePrompt = isImageGenerationPrompt(prompt);

  if (isImagePrompt) {
    // Find a model that supports image generation
    const imageModel = allModels.find((model) => model.supportsImageGeneration);
    if (imageModel) return imageModel;
  }

  // Otherwise return the default model
  return defaultModel;
};

// Helper to check if prompt is requesting image generation
export const shouldUseImageGenerationModel = (prompt: string): boolean => {
  return isImageGenerationPrompt(prompt);
};

// Check if the prompt is related to image generation
function isImageGenerationPrompt(prompt: string): boolean {
  const lowercasePrompt = prompt.toLowerCase();
  const imageKeywords = [
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
    "generate art",
  ];

  return imageKeywords.some((keyword) => lowercasePrompt.includes(keyword));
}
