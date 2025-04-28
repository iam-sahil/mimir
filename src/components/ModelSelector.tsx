import { useEffect, useState, useRef, CSSProperties } from "react";
import {
  Check,
  Sparkles,
  ChevronDown,
  X,
  Search,
  Brain,
  ImageIcon,
  Info,
  Server,
  Eye,
  Lightbulb,
  Layers,
  Image,
} from "lucide-react";
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
import { useTheme } from "@/contexts/ThemeContext";
import { Model } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

// Import SVG icons from the ModelIcons file
import { Gemini, DeepSeek, Meta, Claude, GPT } from "./icons/ModelIcons";

interface ModelSelectorProps {
  selectedModel: Model;
  onChange: (model: Model) => void;
  tooltip?: boolean;
  className?: string;
}

const ModelSelector = ({
  selectedModel,
  onChange,
  tooltip = true,
  className,
}: ModelSelectorProps) => {
  const { settings, setDefaultModel, hasValidKey } = useSettings();
  const { themes, currentTheme } = useTheme();
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

    onChange(model);
    setOpen(false); // Close the dropdown after selection
  };

  // Helper function to get the appropriate icon component based on model provider and ID
  const getModelIcon = (model: Model) => {
    const { provider, modelId } = model;

    if (provider === "gemini") {
      return <Gemini className="w-6 h-6" />;
    }

    if (modelId.includes("deepseek")) {
      return <DeepSeek className="w-6 h-6" />;
    }

    if (modelId.includes("llama") || modelId.includes("meta")) {
      return <Meta className="w-6 h-6" />;
    }

    if (modelId.includes("claude")) {
      return <Claude className="w-6 h-6" />;
    }

    if (modelId.includes("gpt")) {
      return <GPT className="w-6 h-6" />;
    }

    if (modelId.includes("rogue-rose")) {
      return <Brain className="w-6 h-6 text-purple-400" />;
    }

    // Default icon for unknown models
    return <Server className="w-6 h-6" />;
  };

  const primaryColor =
    themes[currentTheme]?.colors?.primary || "hsl(var(--primary))";

  // Define the trigger button separately
  const triggerButton = (
    <Button
      variant="ghost"
      className={cn(
        "flex items-center gap-2 h-9 px-3 text-sm rounded-md bg-background/5 hover:bg-background/10",
        className
      )}
    >
      <span className="truncate">{selectedModel.name}</span>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </Button>
  );

  // Capability tooltips
  const CapabilityBadge = ({
    active,
    icon,
    label,
    variant = "default",
  }: {
    active: boolean;
    icon: React.ReactNode;
    label: string;
    variant?: "default" | "outline" | "secondary";
  }) => {
    if (!active) return null;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant={variant}
              className="h-5 w-5 p-0 flex items-center justify-center"
            >
              {icon}
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs z-[2000]">
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const ModelCard = ({ model }: { model: Model }) => {
    const isSelected = selectedModel?.id === model.id;

    // Style for line clamping to 2 lines
    const nameStyle: CSSProperties = {
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      textOverflow: "ellipsis",
    };

    return (
      <DropdownMenuItem
        key={model.id}
        onClick={() => handleSelect(model)}
        className={cn(
          "p-4 relative flex flex-col items-center justify-center rounded-md text-sm font-medium transition-colors focus:text-foreground data-[highlighted]:bg-accent/25 data-[highlighted]:text-foreground cursor-pointer border border-border/20",
          isSelected && "border-primary/50"
        )}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute top-1.5 right-1.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 p-0.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Show model info in toast instead of navigation
                    toast.info(
                      <div className="space-y-1">
                        <p className="font-semibold">{model.name}</p>
                        <p className="text-xs">
                          {model.description || "No description available"}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          <span>Provider: {model.provider}</span>
                          <br />
                          <span>Model ID: {model.modelId}</span>
                        </div>
                      </div>,
                      {
                        duration: 5000,
                      }
                    );
                  }}
                >
                  <Info className="h-3 w-3" />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs">
              <p>Model information</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex flex-col items-center justify-center h-full gap-2">
          <div className="mb-1">{getModelIcon(model)}</div>
          <div className="text-center w-full px-1">
            <div className="text-sm font-medium mx-auto" style={nameStyle}>
              {model.name}
            </div>
            <div className="flex gap-1.5 mt-3 justify-center">
              <CapabilityBadge
                active={model.canUseImage}
                icon={<Eye className="h-4 w-4" />}
                label="Vision capabilities"
                variant="secondary"
              />
              <CapabilityBadge
                active={model.supportsThinking}
                icon={<Lightbulb className="h-4 w-4" />}
                label="Thinking capabilities"
                variant="secondary"
              />
              <CapabilityBadge
                active={model.supportsWebSearch}
                icon={<Search className="h-4 w-4" />}
                label="Web search capabilities"
                variant="secondary"
              />
              <CapabilityBadge
                active={model.supportsImageGeneration}
                icon={<Image className="h-4 w-4" />}
                label="Image generation"
                variant="secondary"
              />
            </div>
          </div>
        </div>

        {isSelected && (
          <div className="absolute top-1.5 left-1.5">
            <Check className="h-3 w-3 text-primary" />
          </div>
        )}
      </DropdownMenuItem>
    );
  };

  return (
    <div className="relative">
      {tooltip ? (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[600px] max-h-[80vh] overflow-y-auto p-0 z-[1001] bg-background/60 backdrop-filter backdrop-blur-lg border border-white/20 shadow-xl rounded-xl"
            align="start"
            sideOffset={5}
          >
            <div className="py-3 px-4 bg-background/80 backdrop-blur-xl sticky top-0 z-10 border-b border-white/10 rounded-t-xl">
              <h3 className="font-medium">Select a model</h3>
            </div>

            <div className="p-3.5">
              {/* Gemini Models */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground px-1">
                  Gemini Models
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {geminiModels.map((model) => (
                    <ModelCard key={model.id} model={model} />
                  ))}
                </div>
              </div>

              {/* OpenRouter Models */}
              {openRouterModels.length > 0 && (
                <div className="space-y-2 mt-5">
                  <h4 className="text-sm font-medium text-muted-foreground px-1">
                    OpenRouter Models
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {openRouterModels.map((model) => (
                      <ModelCard key={model.id} model={model} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[600px] max-h-[80vh] overflow-y-auto p-0 z-[1001] bg-background/60 backdrop-filter backdrop-blur-lg border border-white/20 shadow-xl rounded-xl"
            align="start"
            sideOffset={5}
          >
            <div className="py-3 px-4 bg-background/80 backdrop-blur-xl sticky top-0 z-10 border-b border-white/10 rounded-t-xl">
              <h3 className="font-medium">Select a model</h3>
            </div>

            <div className="p-3.5">
              {/* Gemini Models */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground px-1">
                  Gemini Models
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {geminiModels.map((model) => (
                    <ModelCard key={model.id} model={model} />
                  ))}
                </div>
              </div>

              {/* OpenRouter Models */}
              {openRouterModels.length > 0 && (
                <div className="space-y-2 mt-5">
                  <h4 className="text-sm font-medium text-muted-foreground px-1">
                    OpenRouter Models
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {openRouterModels.map((model) => (
                      <ModelCard key={model.id} model={model} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export { ModelSelector };
export default ModelSelector;
