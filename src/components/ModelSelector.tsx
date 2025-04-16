
import React from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Model } from "@/types";
import { useSettings } from "@/contexts/SettingsContext";

interface ModelSelectorProps {
  selectedModel: Model;
  onChange: (model: Model) => void;
  models: Model[];
}

export const ModelSelector = ({
  selectedModel,
  onChange,
  models,
}: ModelSelectorProps) => {
  const { hasValidKey } = useSettings();

  const filteredModels = models.filter((model) =>
    hasValidKey(model.provider)
  );

  const handleSelect = (model: Model) => {
    onChange(model);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 w-52">
          <span className="truncate flex-1 text-left">{selectedModel.name}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        {filteredModels.length > 0 ? (
          filteredModels.map((model) => (
            <DropdownMenuItem
              key={model.id}
              onClick={() => handleSelect(model)}
              className="flex items-center justify-between"
            >
              <span>{model.name}</span>
              {model.id === selectedModel.id && (
                <Check className="h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled className="text-muted-foreground">
            No API keys available
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
