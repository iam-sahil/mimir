import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Edit, Check } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MessageActionsProps {
  content: string;
  onRegenerateResponse?: () => void;
  onEditMessage?: (content: string) => void;
  isUser: boolean;
  model?: { name: string };
}

export const MessageActions = ({
  content,
  onRegenerateResponse,
  onEditMessage,
  isUser,
  model
}: MessageActionsProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleEdit = () => {
    if (onEditMessage) {
      onEditMessage(content);
    }
  };

  return (
    <div className="flex items-center gap-2 glass-effect px-2 py-1 rounded-md shadow-sm -translate-y-[-8px]">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => copyToClipboard(content)}
            >
              {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy to clipboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isUser && onEditMessage && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={handleEdit}
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit message</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {isUser && onRegenerateResponse && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={onRegenerateResponse}
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Regenerate response</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {!isUser && model && (
        <span className="text-xs text-muted-foreground ml-1">
          Generated with {model.name}
        </span>
      )}
    </div>
  );
};
