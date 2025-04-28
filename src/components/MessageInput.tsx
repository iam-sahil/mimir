import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import { Model } from "@/types";
import { ModelSelector } from "./ModelSelector";
import { toast } from "sonner";
import { FileAttachment } from "./chat/FileAttachment";
import { AttachmentControls } from "./chat/AttachmentControls";
import { SubmitButton } from "./chat/SubmitButton";
import { Globe, Send, Paperclip, Search } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";

// Constants
const IMAGE_SUPPORTING_MODELS = [
  "gemini-2.0-flash",
  "gemini-2.5-flash-preview-04-17",
  "gemini-2.5-pro-preview-03-25",
];
const ALLOWED_FILE_TYPES = {
  images: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  documents: [
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

interface MessageInputProps {
  onSendMessage: (
    message: string,
    attachments?: File[],
    options?: { enableWebSearch: boolean }
  ) => void;
  isLoading?: boolean;
  placeholder?: string;
  selectedModel: Model;
  onModelChange: (model: Model) => void;
  editingMessage?: string | null;
  onClearEditingMessage?: () => void;
  disabled?: boolean;
  className?: string;
}

export const MessageInput = ({
  onSendMessage,
  isLoading = false,
  placeholder = "How can I help you today?",
  selectedModel,
  onModelChange,
  editingMessage = null,
  onClearEditingMessage,
  disabled = false,
  className,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const supportsAttachments = true; // We're enabling attachments for all models now

  useEffect(() => {
    if (editingMessage) {
      setMessage(editingMessage);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [editingMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || attachments.length > 0) && !isLoading) {
      onSendMessage(message, attachments, {
        enableWebSearch: webSearchEnabled,
      });
      setMessage("");
      setAttachments([]);
      if (onClearEditingMessage) {
        onClearEditingMessage();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleAttachFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const validFiles = newFiles.filter(
        (file) =>
          ALLOWED_FILE_TYPES.images.includes(file.type) ||
          ALLOWED_FILE_TYPES.documents.includes(file.type)
      );
      if (validFiles.length !== newFiles.length) {
        toast("Only images, PDFs, and document files are supported");
      }
      setAttachments((prev) => [...prev, ...validFiles]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const handleKeyboardShortcut = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        if (supportsAttachments && !isLoading) {
          handleAttachFiles();
        }
      }
    };
    window.addEventListener("keydown", handleKeyboardShortcut);
    return () => window.removeEventListener("keydown", handleKeyboardShortcut);
  }, [supportsAttachments, isLoading]);

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
    <div className="w-full max-w-2xl mx-auto message-input-container transform transition-all duration-500 ease-in-out">
      <div className="glass-effect backdrop-blur-lg rounded-2xl">
        <div className="glass-effect rounded-xl m-1.5">
          <form onSubmit={handleSubmit} className="rounded-xl overflow-hidden">
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 border-b border-white/5">
                {attachments.map((file, index) => (
                  <FileAttachment
                    key={index}
                    file={file}
                    onRemove={() => removeAttachment(index)}
                  />
                ))}
              </div>
            )}

            <div className="flex items-center p-2">
              <Textarea
                ref={textareaRef}
                placeholder={placeholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className={cn(
                  "resize-none min-h-[60px] max-h-[200px] px-4 py-3 bg-transparent border-none focus:ring-0 text-foreground font-plus-jakarta",
                  isLoading && "opacity-70"
                )}
                disabled={disabled}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SubmitButton
                      isLoading={isLoading}
                      disabled={!message.trim() && attachments.length === 0}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send message</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.03]">
              <div className="flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <ModelSelector
                          selectedModel={selectedModel}
                          onChange={onModelChange}
                        />
                      </div>
                    </TooltipTrigger>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Toggle
                        pressed={webSearchEnabled}
                        onPressedChange={setWebSearchEnabled}
                        aria-label="Toggle web search"
                        className={cn(
                          "h-9 px-3 rounded-md transition-colors flex items-center gap-2",
                          webSearchEnabled
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : " hover:bg-muted"
                        )}
                      >
                        <Globe className="h-4 w-4" />
                        <span className="text-xs font-medium">Search</span>
                      </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Toggle web search: {webSearchEnabled ? "Off" : "On"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <AttachmentControls
                          onAttachFiles={handleAttachFiles}
                          supportsAttachments={supportsAttachments}
                          isLoading={isLoading}
                        />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Attach files (Ctrl+Shift+A)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
          </form>
        </div>
      </div>
    </div>
  );
};
