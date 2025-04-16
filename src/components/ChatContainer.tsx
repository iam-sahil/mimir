
import React, { useRef, useEffect, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { MessageInput } from "./MessageInput";
import { EmptyState } from "./EmptyState";
import { useChat } from "@/contexts/ChatContext";
import { useSettings } from "@/contexts/SettingsContext";
import { ModelSelector } from "./ModelSelector";
import { allModels } from "@/lib/models";
import { sendChatRequest } from "@/lib/api";
import { Settings, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeSelector } from "./ThemeSelector";
import { SettingsDialog } from "./SettingsDialog";

interface ChatContainerProps {
  onSidebarToggle: () => void;
}

export const ChatContainer = ({ onSidebarToggle }: ChatContainerProps) => {
  const { currentChat, addMessage, setCurrentChatModel } = useChat();
  const { settings } = useSettings();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  const handleSendMessage = async (message: string) => {
    if (!currentChat) return;

    // Add user message
    addMessage(message, "user");

    // Get the API key for the selected model
    const apiKey =
      currentChat.model.provider === "openai"
        ? settings.openaiApiKey
        : settings.geminiApiKey;

    setIsLoading(true);
    try {
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
      addMessage(
        "Sorry, there was an error processing your request. Please check your API key and try again.",
        "assistant"
      );
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
      <header className="h-16 border-b flex items-center justify-between px-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="mr-2"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
          {currentChat && (
            <ModelSelector
              selectedModel={currentChat.model}
              onChange={setCurrentChatModel}
              models={allModels.filter(
                (model) =>
                  settings[
                    model.provider === "openai"
                      ? "openaiApiKey"
                      : "geminiApiKey"
                  ]
              )}
            />
          )}
        </div>
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
          <div className="pb-20">
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
      <div className="border-t sticky bottom-0 bg-background">
        <MessageInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder="Message Mimir..."
        />
      </div>

      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </div>
  );
};
