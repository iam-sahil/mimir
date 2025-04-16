
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
    id: "gemini-1.5-flash-8b",
    name: "Gemini 1.5 Flash-8B",
    provider: "gemini",
    modelId: "gemini-1.5-flash-8b",
    description: "Efficient model with good performance",
    canUseImage: true,
  },
  {
    id: "gemini-2.0-flash-experimental",
    name: "Gemini 2.0 Flash Experimental",
    provider: "gemini",
    modelId: "gemini-2.0-flash-experimental",
    description: "Experimental version with image generation capabilities",
    canUseImage: true,
  },
];

export const allModels: Model[] = [...geminiModels];

export const defaultModel: Model = geminiModels[0];

export const getModelById = (id: string): Model => {
  return allModels.find((model) => model.id === id) || defaultModel;
};
