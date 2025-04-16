
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
    name: "Gemini 2.5 Pro Preview",
    provider: "gemini",
    modelId: "gemini-2.5-pro-exp-03-25",
    description: "Advanced model with enhanced capabilities",
    canUseImage: true,
  },
  {
    id: "gemini-2.0-flash-lite",
    name: "Gemini 2.0 Flash-Lite",
    provider: "gemini",
    modelId: "gemini-2.0-flash-lite",
    description: "Lighter version with good performance",
    canUseImage: true,
  },
  {
    id: "gemma-3",
    name: "Gemma 3",
    provider: "gemini",
    modelId: "gemma-3",
    description: "Open-source model with improved capabilities",
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
];

export const allModels: Model[] = [...geminiModels];

export const defaultModel: Model = geminiModels[0];

export const getModelById = (id: string): Model => {
  return allModels.find((model) => model.id === id) || defaultModel;
};
