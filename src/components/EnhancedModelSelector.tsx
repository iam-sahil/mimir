
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Info, Star, Lock, Brain, Sparkles } from "lucide-react";
import { Model } from "@/types";
import { useSettings } from "@/contexts/SettingsContext";
import { getModelsByProvider } from "@/lib/models";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

interface EnhancedModelSelectorProps {
  selectedModel: Model;
  onChange: (model: Model) => void;
}

export const EnhancedModelSelector = ({
  selectedModel,
  onChange,
}: EnhancedModelSelectorProps) => {
  const { hasValidKey, settings } = useSettings();
  const [isOpen, setIsOpen] = React.useState(false);

  const geminiModels = getModelsByProvider("gemini");
  const openRouterModels = getModelsByProvider("openrouter");

  const handleOpenChange = (open: boolean) => {
    if (open && !hasValidKey("gemini")) {
      toast.error(
        "Please add your API key in settings to use models.",
        { duration: 3000 }
      );
      return;
    }
    setIsOpen(open);
  };

  const handleSelect = (model: Model) => {
    // Check if model provider has valid key
    if (!hasValidKey(model.provider)) {
      if (model.provider === "openrouter") {
        toast.error(
          "Please add your OpenRouter API key in settings to use this model.",
          { duration: 3000 }
        );
      } else {
        toast.error(
          "Please add your API key in settings to use this model.",
          { duration: 3000 }
        );
      }
      return;
    }

    onChange(model);
    setIsOpen(false);
  };

  const getModelIcon = (model: Model) => {
    if (model.name.includes("DeepSeek")) {
      return <Brain className="h-5 w-5" />;
    } else if (model.name.includes("Llama")) {
      return <Sparkles className="h-5 w-5" />;
    } else {
      return <Star className="h-5 w-5" />;
    }
  };

  const isModelAvailable = (model: Model) => {
    if (model.provider === "gemini") {
      // If model is default and free messages are available OR user has API key
      return (
        (model.id === "gemini-2.0-flash" && settings.freeMessagesUsed < 10) || 
        hasValidKey("gemini")
      );
    } else if (model.provider === "openrouter") {
      return hasValidKey("openrouter");
    }
    return false;
  };

  // Show button as disabled if no API key is available at all
  const isButtonDisabled = !hasValidKey("gemini");

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex items-center gap-2 h-9 px-3 text-sm rounded-md bg-background/5 hover:bg-background/10",
            isButtonDisabled && "opacity-70 cursor-not-allowed"
          )}
          disabled={isButtonDisabled}
        >
          <span className="truncate">{selectedModel.name}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Select a Model</DialogTitle>
          <DialogDescription>
            Choose an AI model that best suits your needs
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Gemini Models</h3>
            <div className="grid grid-cols-2 gap-3">
              {geminiModels.map((model) => (
                <div
                  key={model.id}
                  className={cn(
                    "relative rounded-lg border p-3 cursor-pointer transition-colors hover:bg-accent",
                    model.id === selectedModel.id ? "border-primary" : "border-border",
                    !isModelAvailable(model) && "opacity-60 cursor-not-allowed"
                  )}
                  onClick={() => isModelAvailable(model) && handleSelect(model)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {getModelIcon(model)}
                    <h4 className="text-sm font-medium">{model.name}</h4>
                    {!isModelAvailable(model) && <Lock className="h-3 w-3 ml-auto" />}
                    {model.id === selectedModel.id && <Check className="h-4 w-4 ml-auto text-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{model.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">OpenRouter Models</h3>
            <div className="grid grid-cols-2 gap-3">
              {openRouterModels.map((model) => (
                <div
                  key={model.id}
                  className={cn(
                    "relative rounded-lg border p-3 cursor-pointer transition-colors hover:bg-accent",
                    model.id === selectedModel.id ? "border-primary" : "border-border",
                    !isModelAvailable(model) && "opacity-60 cursor-not-allowed"
                  )}
                  onClick={() => isModelAvailable(model) && handleSelect(model)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {getModelIcon(model)}
                    <h4 className="text-sm font-medium">{model.name}</h4>
                    {!isModelAvailable(model) && <Lock className="h-3 w-3 ml-auto" />}
                    {model.id === selectedModel.id && <Check className="h-4 w-4 ml-auto text-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{model.description}</p>
                </div>
              ))}
            </div>
            {!hasValidKey("openrouter") && (
              <div className="flex items-center justify-center gap-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                <Info className="h-3 w-3" />
                <span>OpenRouter API key required to use these models</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
