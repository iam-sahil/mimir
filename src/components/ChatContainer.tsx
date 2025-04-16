
import React, { useRef, useEffect, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { MessageInput } from "./MessageInput";
import { EmptyState } from "./EmptyState";
import { useChat } from "@/contexts/ChatContext";
import { useSettings } from "@/contexts/SettingsContext";
import { allModels } from "@/lib/models";
import { sendChatRequest } from "@/lib/api";
import { Settings, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeSelector } from "./ThemeSelector";
import { SettingsDialog } from "./SettingsDialog";
import { toast } from "@/components/ui/sonner";

interface ChatContainerProps {
  onSidebarToggle: () => void;
}

export const ChatContainer = ({ onSidebarToggle }: ChatContainerProps) => {
  const { currentChat, addMessage, setCurrentChatModel, createNewChat } = useChat();
  const { settings, hasValidKey, getActiveApiKey, incrementFreeMessageCount } = useSettings();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  // Create a new chat if none exists
  useEffect(() => {
    if (!currentChat) {
      createNewChat();
    }
  }, [currentChat, createNewChat]);

  const handleSendMessage = async (message: string) => {
    if (!currentChat) return;

    // Add user message
    addMessage(message, "user");

    // Get the API key for the selected model
    const apiKey = getActiveApiKey();
        
    // Check if API key is available
    if (!apiKey) {
      toast.error(
        "No API key available. Please add your API key in settings.",
        {
          duration: 5000,
        }
      );
      addMessage(
        "Sorry, I couldn't process your request. No API key found. Please add your API key in the settings.",
        "assistant"
      );
      return;
    }

    setIsLoading(true);
    try {
      // Increment free message count if using free key
      if (!settings.geminiApiKey) {
        incrementFreeMessageCount();
      }
      
      // Get response from API
      const response = await sendChatRequest(
        currentChat.model,
        [...currentChat.messages, { id: "temp", role: "user", content: message, timestamp: Date.now() }],
        apiKey
      );

      // Add assistant message
      addMessage(response, "assistant");
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Handle specific error cases
      let errorMessage = "Sorry, there was an error processing your request.";
      
      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          errorMessage = "Invalid Gemini API key. Please check your settings.";
          toast.error(errorMessage, { duration: 5000 });
        } else if (error.message.includes("429")) {
          errorMessage = "You've reached the rate limit for Gemini. Please try again later.";
          toast.error("Rate limit reached", { duration: 5000 });
        } else {
          toast.error("Error connecting to AI service", { duration: 5000 });
        }
      }
      
      addMessage(errorMessage, "assistant");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="h-16 border-b border-border/50 flex items-center justify-between px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <ThemeSelector />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto">
        {currentChat && currentChat.messages.length > 0 ? (
          <div className="pb-20 max-w-4xl mx-auto">
            {currentChat.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="h-full">
            <EmptyState onPromptClick={handlePromptClick} />
          </div>
        )}
      </div>

      {/* Message input */}
      <div className="border-t sticky bottom-0 bg-background py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <MessageInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            placeholder={isLoading ? "Thinking..." : "Message Mimir..."}
            selectedModel={currentChat?.model || settings.defaultModel}
            onModelChange={setCurrentChatModel}
            availableModels={allModels.filter(() => hasValidKey("gemini"))}
          />
        </div>
      </div>

      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </div>
  );
};
