
import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Model } from "@/types";
import { EnhancedModelSelectorV2 } from "./EnhancedModelSelectorV2";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  selectedModel: Model;
  onModelChange: (model: Model) => void;
}

export const MessageInput = ({
  onSendMessage,
  isLoading = false,
  placeholder = "Message Mimir...",
  selectedModel,
  onModelChange,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [message]);

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="relative overflow-hidden rounded-xl shadow-lg glass-effect border border-white/10"
      >
        <Textarea
          ref={textareaRef}
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            "resize-none min-h-[60px] max-h-[200px] px-4 py-3 bg-transparent border-none focus:ring-0 text-foreground font-helvetica",
            isLoading && "opacity-70"
          )}
          disabled={isLoading}
        />
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/5">
          <EnhancedModelSelectorV2
            selectedModel={selectedModel}
            onChange={onModelChange}
          />
          <Button
            type="submit"
            size="sm"
            className={cn(
              "rounded-md transition-all duration-300",
              !message.trim() ? "bg-secondary/50 text-secondary-foreground/70" : "bg-primary text-primary-foreground animate-pulse",
              isLoading && "opacity-70"
            )}
            disabled={!message.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
