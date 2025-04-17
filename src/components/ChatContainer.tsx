
import React, { useRef, useEffect, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { MessageInput } from "./MessageInput";
import { EmptyState } from "./EmptyState";
import { useChat } from "@/contexts/ChatContext";
import { useSettings } from "@/contexts/SettingsContext";
import { allModels } from "@/lib/models";
import { sendChatRequest } from "@/lib/api";
import { Settings, Menu, Brain } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeSelector } from "./ThemeSelector";
import { SettingsDialog } from "./SettingsDialog";
import { toast } from "@/components/ui/sonner";
import { ChatMessageSkeleton } from "./ChatMessageSkeleton";

interface ChatContainerProps {
  onSidebarToggle: () => void;
}

export const ChatContainer = ({ onSidebarToggle }: ChatContainerProps) => {
  const { currentChat, addMessage, setCurrentChatModel, createNewChat } = useChat();
  const { settings, hasValidKey, getActiveApiKey, incrementFreeMessageCount } = useSettings();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [completeResponse, setCompleteResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages, typingText]);

  // Create a new chat if none exists
  useEffect(() => {
    if (!currentChat) {
      createNewChat();
    }
  }, [currentChat, createNewChat]);

  // Typewriter effect
  useEffect(() => {
    if (!isTyping || !completeResponse) return;

    let i = 0;
    const speed = 10; // typing speed in ms
    
    const typeWriter = () => {
      if (i < completeResponse.length) {
        setTypingText(completeResponse.substring(0, i + 1));
        i++;
        setTimeout(typeWriter, speed);
      } else {
        // Typing finished
        setIsTyping(false);
        // Add the completed message
        addMessage(completeResponse, "assistant");
        setCompleteResponse("");
        setTypingText("");
      }
    };
    
    typeWriter();
  }, [isTyping, completeResponse, addMessage]);

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
        
        // Check if they've used up their free messages
        if (settings.freeMessagesUsed >= 10) {
          toast.error(
            "You've used all your free messages. Please add your Gemini API key in settings to continue.",
            {
              duration: 8000,
            }
          );
        }
      }
      
      // Get response from API
      const response = await sendChatRequest(
        currentChat.model,
        [...currentChat.messages, { id: "temp", role: "user", content: message, timestamp: Date.now() }],
        apiKey
      );

      // Start typewriter effect
      setCompleteResponse(response);
      setIsTyping(true);
      
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
          className="lg:flex"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <p className="text-sm font-space-grotesk hidden md:block">Ask. Learn. Evolve.</p>
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
            {isTyping && (
              <div className="w-full py-6 px-4 justify-start">
                <div className="flex max-w-2xl rounded-lg p-4 bg-secondary/15 text-foreground mr-auto ml-8">
                  <div className="w-full overflow-hidden">
                    <div className="prose dark:prose-invert max-w-none text-sm font-helvetica">
                      <ReactMarkdown
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          pre: ({ node, ...props }) => (
                            <pre className="bg-muted rounded-md p-4 overflow-x-auto my-4" {...props} />
                          ),
                          code: ({ node, className, ...props }) => (
                            <code className={className ? `${className} bg-muted rounded px-1 py-0.5` : "bg-muted rounded px-1 py-0.5"} {...props} />
                          ),
                          ul: ({ node, ...props }) => <ul className="my-4 ml-6 list-disc" {...props} />,
                          ol: ({ node, ...props }) => <ol className="my-4 ml-6 list-decimal" {...props} />,
                          li: ({ node, ...props }) => <li className="my-1" {...props} />,
                          p: ({ node, ...props }) => <p className="my-3 leading-relaxed" {...props} />,
                        }}
                      >
                        {typingText}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
                <div className="absolute left-6 mt-1">
                  <div className="bg-background text-primary w-6 h-6 rounded-full flex items-center justify-center">
                    <Brain className="h-4 w-4" />
                  </div>
                </div>
              </div>
            )}
            {isLoading && !isTyping && (
              <ChatMessageSkeleton />
            )}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="h-full">
            <EmptyState onPromptClick={handlePromptClick} />
          </div>
        )}
      </div>

      {/* Message input */}
      <div className="sticky bottom-0 bg-background py-4 px-4">
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
