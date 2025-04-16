
import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const MessageInput = ({
  onSendMessage,
  isLoading = false,
  placeholder = "Message Mimir...",
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
      className="w-full max-w-4xl mx-auto border-t bg-background"
    >
      <div className="flex items-end gap-2 p-4 relative">
        <Textarea
          ref={textareaRef}
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            "resize-none min-h-[60px] max-h-[200px] pr-16 overflow-y-auto",
            isLoading && "opacity-50"
          )}
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute bottom-7 right-7"
          disabled={!message.trim() || isLoading}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};
