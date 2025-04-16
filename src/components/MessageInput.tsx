
import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Model } from "@/types";
import { ModelSelector } from "./ModelSelector";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  selectedModel: Model;
  onModelChange: (model: Model) => void;
  availableModels: Model[];
}

export const MessageInput = ({
  onSendMessage,
  isLoading = false,
  placeholder = "Message Mimir...",
  selectedModel,
  onModelChange,
  availableModels
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
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto bg-background/5 rounded-lg mb-4"
    >
      <div className="flex flex-col">
        <Textarea
          ref={textareaRef}
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            "resize-none min-h-[60px] max-h-[200px] px-4 py-3 bg-transparent border-none focus:ring-0 text-foreground",
            isLoading && "opacity-70"
          )}
          disabled={isLoading}
        />
        <div className="flex items-center justify-between px-4 py-2 border-t border-border/30">
          <ModelSelector
            selectedModel={selectedModel}
            onChange={onModelChange}
            models={availableModels}
          />
          <Button
            type="submit"
            size="sm"
            className="rounded-md"
            disabled={!message.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};
