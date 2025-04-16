
import { Model, OpenAIModel, GeminiModel } from "@/types";

export const openAIModels: Model[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    modelId: "gpt-4o",
    description: "Most capable GPT-4 model, optimized for chat",
    canUseImage: true,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    modelId: "gpt-4o-mini",
    description: "Cheaper, faster version of GPT-4o",
    canUseImage: true,
  },
  {
    id: "gpt-4.5-preview",
    name: "GPT-4.5 Preview",
    provider: "openai",
    modelId: "gpt-4.5-preview",
    description: "Preview version of GPT-4.5",
    canUseImage: true,
  },
];

export const geminiModels: Model[] = [
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "gemini",
    modelId: "gemini-1.5-pro",
    description: "Most capable Gemini model for complex tasks",
    canUseImage: true,
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    provider: "gemini",
    modelId: "gemini-1.5-flash",
    description: "Faster version of Gemini 1.5",
    canUseImage: true,
  },
  {
    id: "gemini-1.0-pro",
    name: "Gemini 1.0 Pro",
    provider: "gemini",
    modelId: "gemini-1.0-pro",
    description: "Original Gemini model",
    canUseImage: false,
  },
];

export const allModels: Model[] = [...openAIModels, ...geminiModels];

export const defaultModel: Model = allModels[0];

export const getModelById = (id: string): Model => {
  return allModels.find((model) => model.id === id) || defaultModel;
};
