import React, { useState } from "react";
import { ChevronDown, Check, Brain, AlertCircle } from "lucide-react";
import { Model } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "./ui/sonner";

interface EnhancedModelSelectorProps {
  selectedModel: Model;
  onChange: (model: Model) => void;
}

// Only keep these two Gemini models
const geminiModels: Model[] = [
  {
    id: "gemini-2-flash",
    name: "Gemini 2.0 Flash",
    provider: "gemini",
    modelId: "gemini-pro",
    description: "Fast and efficient for everyday tasks.",
    canUseImage: false,
  },
  {
    id: "gemini-2-5-pro",
    name: "Gemini 2.5 Pro Experimental",
    provider: "gemini",
    modelId: "gemini-pro",
    description: "Advanced version with better reasoning capabilities.",
    canUseImage: false,
  },
];

// OpenRouter models
const openRouterModels: Model[] = [
  {
    id: "deepseek-r1",
    name: "DeepSeek: R1",
    provider: "openrouter",
    modelId: "deepseek/deepseek-r1:free",
    description: "Powerful model with strong reasoning capabilities.",
    canUseImage: false,
  },
  {
    id: "deepseek-r1-distill-qwen-14b",
    name: "DeepSeek: R1 Distill Qwen 14B",
    provider: "openrouter",
    modelId: "deepseek/deepseek-r1-distill-qwen-14b:free",
    description: "Efficient model with good performance.",
    canUseImage: false,
  },
  {
    id: "deepseek-r1-distill-llama-70b",
    name: "DeepSeek: R1 Distill Llama 70B",
    provider: "openrouter",
    modelId: "deepseek/deepseek-r1-distill-llama-70b:free",
    description: "Distilled version of Llama 70B model.",
    canUseImage: false,
  },
  {
    id: "meta-llama-4-maverick",
    name: "Meta: Llama 4 Maverick",
    provider: "openrouter",
    modelId: "meta-llama/llama-4-maverick:free",
    description: "Latest version of Llama 4 model with enhanced capabilities.",
    canUseImage: false,
  },
];

export const EnhancedModelSelectorV2 = ({
  selectedModel,
  onChange,
}: EnhancedModelSelectorProps) => {
  const [open, setOpen] = useState(false);
  const { settings, hasValidKey } = useSettings();

  const handleSelectModel = (model: Model) => {
    // Check if the API key is available for the selected model provider
    if (!hasValidKey(model.provider)) {
      const providerName = model.provider === "openrouter" ? "OpenRouter" : "Gemini";
      toast(`Please add your ${providerName} API key in settings to use this model.`);
      return;
    }

    // Check free message limit if using the free Gemini model
    if (model.provider === "gemini" && !settings.geminiApiKey && settings.freeMessagesUsed >= 10) {
      toast("You've used all your free messages. Please add your Gemini API key in settings.");
      return;
    }

    onChange(model);
    setOpen(false);
  };

  // Check if the model selector should be enabled
  const hasFreeGeminiMessages = settings.freeMessagesUsed < 10;
  
  // Determine if the model selector should be clickable
  const isModelSelectorEnabled = 
    (hasValidKey("gemini") || hasFreeGeminiMessages) || // If Gemini is available (API key or free messages)
    hasValidKey("openrouter"); // If OpenRouter is available
  
  // Filter available models based on API keys
  const availableModels = [
    ...geminiModels,
    ...(hasValidKey("openrouter") ? openRouterModels : []),
  ];

  return (
    <Popover open={open && isModelSelectorEnabled} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-1.5 text-xs font-medium h-8 px-2 py-1",
            !isModelSelectorEnabled && "opacity-60 cursor-not-allowed"
          )}
          onClick={(e) => {
            if (!isModelSelectorEnabled) {
              e.preventDefault();
              toast("Please add your API key in settings to use different models.");
            }
          }}
        >
          <span className="truncate max-w-[150px]">{selectedModel.name}</span>
          <ChevronDown className="h-3.5 w-3.5 text-foreground/50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-2" align="start">
        <div className="space-y-1">
          {availableModels.map((model) => {
            // Check if this specific model is available based on API keys
            const isModelEnabled = 
              (model.provider === "gemini" && (hasValidKey("gemini") || hasFreeGeminiMessages)) ||
              (model.provider === "openrouter" && hasValidKey("openrouter"));

            return (
              <div
                key={model.id}
                className={cn(
                  "flex flex-col gap-2 p-3 rounded-md",
                  selectedModel.id === model.id && "bg-accent",
                  isModelEnabled ? "cursor-pointer hover:bg-accent/80" : "opacity-60 cursor-not-allowed"
                )}
                onClick={() => isModelEnabled && handleSelectModel(model)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    <div>
                      <p className="font-medium text-sm">{model.name}</p>
                      <p className="text-xs text-muted-foreground">{model.description}</p>
                    </div>
                  </div>
                  {selectedModel.id === model.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
                
                {model.provider === "gemini" && !hasValidKey("gemini") && (
                  <div className="text-xs flex items-center gap-1 text-amber-500">
                    <AlertCircle className="h-3 w-3" />
                    <span>
                      {hasFreeGeminiMessages 
                        ? `${10 - settings.freeMessagesUsed} free messages left` 
                        : "Free messages used up"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
