
import { Model } from "@/types";

export const geminiModels: Model[] = [
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "gemini",
    modelId: "gemini-2.0-flash",
    description: "Default model for most tasks",
    canUseImage: true,
  },
  {
    id: "gemini-2.5-pro-exp-03-25",
    name: "Gemini 2.5 Pro",
    provider: "gemini",
    modelId: "gemini-2.5-pro-exp-03-25",
    description: "Advanced model with enhanced capabilities",
    canUseImage: true,
  },
  {
    id: "gemini-2.5-flash-preview-04-17",
    name: "Gemini 2.5 Flash Preview",
    provider: "gemini",
    modelId: "gemini-2.5-flash-preview-04-17",
    description: "Fast preview model with latest improvements",
    canUseImage: true,
  },
  {
    id: "gemini-2.5-pro-experimental",
    name: "Gemini 2.5 Pro Experimental",
    provider: "gemini",
    modelId: "gemini-2.5-pro-experimental",
    description: "Experimental version of Gemini 2.5 Pro",
    canUseImage: true,
  }
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
    name: "Meta Llama 4 Maverick",
    provider: "openrouter",
    modelId: "meta-llama/llama-4-maverick:free",
    description: "Latest generation Llama model with advanced capabilities",
    canUseImage: false,
  }
];

export const allModels: Model[] = [...geminiModels, ...openRouterModels];

export const defaultModel: Model = geminiModels[0];

export const getModelById = (id: string): Model => {
  return allModels.find((model) => model.id === id) || defaultModel;
};

export const getModelsByProvider = (provider: "gemini" | "openrouter"): Model[] => {
  return allModels.filter(model => model.provider === provider);
};
