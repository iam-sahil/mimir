
import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Send, Loader2, Paperclip, X, FileText, FileImage, File } from "lucide-react";
import { cn } from "@/lib/utils";
import { Model } from "@/types";
import { EnhancedModelSelectorV2 } from "./EnhancedModelSelectorV2";
import { toast } from "@/components/ui/sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MessageInputProps {
  onSendMessage: (message: string, attachments?: File[]) => void;
  isLoading?: boolean;
  placeholder?: string;
  selectedModel: Model;
  onModelChange: (model: Model) => void;
}

// Models that support image attachments - updated list
const IMAGE_SUPPORTING_MODELS = [
  "gemini-pro-vision", 
  "gpt-4o", 
  "gpt-4o-mini", 
  "claude-3-opus-20240229", 
  "claude-3-sonnet-20240229",
  "claude-3-haiku-20240307"
];

// Allowed file types
const ALLOWED_FILE_TYPES = {
  images: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  documents: ["application/pdf", "text/plain", "application/msword", 
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
};

// Helper function to get file icon based on type
const getFileIcon = (file: File) => {
  if (file.type.startsWith('image/')) {
    return <FileImage className="h-4 w-4" />;
  } else if (file.type === 'application/pdf') {
    return <FileText className="h-4 w-4" />;
  } else {
    return <File className="h-4 w-4" />;
  }
};

export const MessageInput = ({
  onSendMessage,
  isLoading = false,
  placeholder = "Message Mimir...",
  selectedModel,
  onModelChange,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const supportsAttachments = IMAGE_SUPPORTING_MODELS.includes(selectedModel.modelId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || attachments.length > 0) && !isLoading) {
      onSendMessage(message, attachments);
      setMessage("");
      setAttachments([]);
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
      
      // Filter for allowed file types
      const validFiles = newFiles.filter(file => 
        ALLOWED_FILE_TYPES.images.includes(file.type) || 
        ALLOWED_FILE_TYPES.documents.includes(file.type)
      );
      
      if (validFiles.length !== newFiles.length) {
        toast({
          description: "Only images, PDFs, and document files are supported",
        });
      }
      
      setAttachments(prev => [...prev, ...validFiles]);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Handle Ctrl+Shift+A keyboard shortcut for file attachment
  useEffect(() => {
    const handleKeyboardShortcut = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (supportsAttachments && !isLoading) {
          handleAttachFiles();
        }
      }
    };

    window.addEventListener('keydown', handleKeyboardShortcut);
    return () => window.removeEventListener('keydown', handleKeyboardShortcut);
  }, [supportsAttachments, isLoading]);

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
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 border-b border-white/5">
            {attachments.map((file, index) => (
              <div 
                key={index}
                className="relative rounded-md border border-white/10 bg-background/30 p-2 flex items-center gap-2"
              >
                {file.type.startsWith('image/') ? (
                  <div className="w-10 h-10 relative">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={file.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-secondary/30 rounded">
                    {getFileIcon(file)}
                    <span className="text-xs ml-1">.{file.name.split('.').pop()}</span>
                  </div>
                )}
                <span className="text-xs truncate max-w-[100px]">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 absolute top-1 right-1 p-0.5 bg-background/50 rounded-full"
                  onClick={() => removeAttachment(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
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
              "resize-none min-h-[60px] max-h-[200px] px-4 py-3 bg-transparent border-none focus:ring-0 text-foreground font-helvetica",
              isLoading && "opacity-70"
            )}
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="sm"
            className={cn(
              "ml-2 rounded-md transition-all duration-300",
              !message.trim() && attachments.length === 0 ? "bg-secondary/50 text-secondary-foreground/70" : "bg-primary text-primary-foreground animate-pulse",
              isLoading && "opacity-70"
            )}
            disabled={(!message.trim() && attachments.length === 0) || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <EnhancedModelSelectorV2
              selectedModel={selectedModel}
              onChange={onModelChange}
            />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className={cn(
                      "h-8 w-8 rounded-full",
                      !supportsAttachments && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={!supportsAttachments || isLoading}
                    onClick={handleAttachFiles}
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
  );
};
