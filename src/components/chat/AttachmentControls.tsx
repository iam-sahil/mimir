
import React from "react";
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AttachmentControlsProps {
  onAttachFiles: () => void;
  supportsAttachments: boolean;
  isLoading: boolean;
}

export const AttachmentControls = ({
  onAttachFiles,
  supportsAttachments,
  isLoading
}: AttachmentControlsProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={`h-8 w-8 rounded-full ${!supportsAttachments && "opacity-50 cursor-not-allowed"}`}
            disabled={!supportsAttachments || isLoading}
            onClick={onAttachFiles}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {supportsAttachments 
            ? "Attach files (Ctrl+Shift+A)" 
            : "This model doesn't support attachments"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
