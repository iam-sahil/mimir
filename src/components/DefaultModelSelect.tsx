import { useState } from "react";
import { Check, ChevronDown, Server, Brain } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { allModels, geminiModels, openRouterModels } from "@/lib/models";
import { useSettings } from "@/contexts/SettingsContext";
import { Model } from "@/types";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Import SVG icons from the ModelIcons file
import { Gemini, DeepSeek, Meta, Claude, GPT } from "./icons/ModelIcons";

interface DefaultModelSelectProps {
  className?: string;
}

const DefaultModelSelect = ({ className }: DefaultModelSelectProps) => {
  const { settings, setDefaultModel, hasValidKey } = useSettings();
  const [open, setOpen] = useState(false);

  const handleSelect = (model: Model) => {
    if (!hasValidKey(model.provider)) {
      toast.error(
        `Please add your ${
          model.provider === "gemini" ? "Gemini" : "OpenRouter"
        } API key in settings to use this model.`
      );
      return;
    }

    setDefaultModel(model);
    toast.success(`${model.name} set as default model`);
    setOpen(false);
  };

  // Helper function to get the appropriate icon component based on model provider and ID
  const getModelIcon = (model: Model) => {
    const { provider, modelId } = model;

    if (provider === "gemini") {
      return <Gemini className="w-4 h-4" />;
    }

    if (modelId.includes("deepseek")) {
      return <DeepSeek className="w-4 h-4" />;
    }

    if (modelId.includes("llama") || modelId.includes("meta")) {
      return <Meta className="w-4 h-4" />;
    }

    if (modelId.includes("claude")) {
      return <Claude className="w-4 h-4" />;
    }

    if (modelId.includes("gpt")) {
      return <GPT className="w-4 h-4" />;
    }

    if (modelId.includes("rogue-rose")) {
      return <Brain className="w-4 h-4 text-purple-400" />;
    }

    // Default icon for unknown models
    return <Server className="w-4 h-4" />;
  };

  // Define the trigger button
  const triggerButton = (
    <Button
      variant="ghost"
      className={cn(
        "flex items-center gap-2 h-9 px-3 text-sm rounded-md bg-background/5 hover:bg-background/10",
        className
      )}
    >
      <div className="mr-1">{getModelIcon(settings.defaultModel)}</div>
      <span className="truncate">{settings.defaultModel.name}</span>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </Button>
  );

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                  {triggerButton}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[300px] max-h-[60vh] overflow-y-auto p-0 z-[1001] bg-background/60 backdrop-filter backdrop-blur-lg border border-white/20 shadow-xl rounded-xl"
                  align="end"
                  sideOffset={5}
                >
                  <div className="py-3 px-4 bg-background/80 backdrop-blur-xl sticky top-0 z-10 border-b border-white/10 rounded-t-xl">
                    <h3 className="font-medium">Set Default Model</h3>
                  </div>

                  <div className="p-3.5">
                    {/* Gemini Models */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground px-1">
                        Gemini Models
                      </h4>
                      <div className="space-y-1">
                        {geminiModels.map((model) => (
                          <DropdownMenuItem
                            key={model.id}
                            onClick={() => handleSelect(model)}
                            className={cn(
                              "flex items-center py-2 px-3 rounded-md text-sm transition-colors focus:text-foreground data-[highlighted]:bg-accent/25 data-[highlighted]:text-foreground cursor-pointer",
                              model.id === settings.defaultModel.id &&
                                "bg-primary/10"
                            )}
                          >
                            <div className="flex items-center flex-1">
                              <div className="mr-2">{getModelIcon(model)}</div>
                              <span className="truncate">{model.name}</span>
                            </div>
                            {model.id === settings.defaultModel.id && (
                              <Check className="h-4 w-4 text-primary ml-2" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </div>

                    {/* OpenRouter Models */}
                    {openRouterModels.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <h4 className="text-xs font-medium text-muted-foreground px-1">
                          OpenRouter Models
                        </h4>
                        <div className="space-y-1">
                          {openRouterModels.map((model) => (
                            <DropdownMenuItem
                              key={model.id}
                              onClick={() => handleSelect(model)}
                              className={cn(
                                "flex items-center py-2 px-3 rounded-md text-sm transition-colors focus:text-foreground data-[highlighted]:bg-accent/25 data-[highlighted]:text-foreground cursor-pointer",
                                model.id === settings.defaultModel.id &&
                                  "bg-primary/10"
                              )}
                            >
                              <div className="flex items-center flex-1">
                                <div className="mr-2">
                                  {getModelIcon(model)}
                                </div>
                                <span className="truncate">{model.name}</span>
                              </div>
                              {model.id === settings.defaultModel.id && (
                                <Check className="h-4 w-4 text-primary ml-2" />
                              )}
                            </DropdownMenuItem>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs">Set default model</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default DefaultModelSelect;
