import React, { useRef, useEffect, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { MessageInput } from "./MessageInput";
import { EmptyState } from "./EmptyState";
import { useChat } from "@/contexts/ChatContext";
import { useSettings } from "@/contexts/SettingsContext";
import { sendChatRequest } from "@/lib/api";
import { Settings as SettingsIcon, Info, ArrowDown } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeSelector } from "./ThemeSelector";
import { SettingsDialog } from "./SettingsDialog";
import { toast } from "./ui/sonner";
import { ChatMessageSkeleton } from "./ChatMessageSkeleton";
import { ScrollArea } from "./ui/scroll-area";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import 'highlight.js/styles/github-dark.css';
import { Brain } from "lucide-react";
import { useHotkeys } from "@/hooks/useHotkeys";
import { cn } from "@/lib/utils";

interface ChatContainerProps {
  onSidebarToggle: () => void;
  onInfoClick: () => void;
  sidebarOpen: boolean;
}

export const ChatContainer = ({ 
  onSidebarToggle, 
  onInfoClick,
  sidebarOpen 
}: ChatContainerProps) => {
  const { currentChat, addMessage, setCurrentChatModel, createNewChat, renameChat } = useChat();
  const { settings, hasValidKey, getActiveApiKey, incrementFreeMessageCount } = useSettings();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [completeResponse, setCompleteResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  // Register keyboard shortcut for renaming current chat
  useHotkeys([
    { 
      keys: ["Control", "r"], 
      callback: () => {
        if (currentChat) {
          const newTitle = prompt("Rename chat:", currentChat.title);
          if (newTitle && newTitle.trim() !== "" && newTitle !== currentChat.title) {
            renameChat(currentChat.id, newTitle);
            toast({
              title: "Success",
              description: "Chat renamed successfully"
            });
          }
        } else {
          toast({
            title: "Error",
            description: "No chat selected",
            variant: "destructive"
          });
        }
      },
      description: "Rename current chat" 
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages, typingText]);

  useEffect(() => {
    if (!currentChat) {
      createNewChat();
    }
  }, [currentChat, createNewChat]);

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
        setIsTyping(false);
        addMessage(completeResponse, "assistant");
        setCompleteResponse("");
        setTypingText("");
      }
    };
    
    typeWriter();
  }, [isTyping, completeResponse, addMessage]);

  // Handle scroll to detect when to show the scroll to bottom button
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      const { scrollTop, scrollHeight, clientHeight } = target;
      const atBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollToBottom(!atBottom);
    };

    const scrollAreaElement = scrollAreaRef.current;
    if (scrollAreaElement) {
      scrollAreaElement.addEventListener('scroll', handleScroll);
      return () => {
        scrollAreaElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (message: string, attachments?: File[]) => {
    if (!currentChat) return;

    addMessage(message, "user");

    const apiKey = getActiveApiKey(currentChat.model.provider);
        
    if (!apiKey) {
      toast({
        title: "Error",
        description: `No API key available for ${currentChat.model.provider === "openrouter" ? "OpenRouter" : "Gemini"}. Please add your API key in settings.`,
        duration: 5000,
        variant: "destructive"
      });
      addMessage(
        `Sorry, I couldn't process your request. No API key found for ${currentChat.model.provider === "openrouter" ? "OpenRouter" : "Gemini"}. Please add your API key in the settings.`,
        "assistant"
      );
      return;
    }

    setIsLoading(true);
    try {
      if (currentChat.model.provider === "gemini" && !settings.geminiApiKey) {
        incrementFreeMessageCount();
        
        if (settings.freeMessagesUsed >= 10) {
          toast({
            title: "Error",
            description: "You've used all your free messages. Please add your Gemini API key in settings to continue.",
            duration: 8000,
            variant: "destructive"
          });
        }
      }
      
      const response = await sendChatRequest(
        currentChat.model,
        [...currentChat.messages, { id: "temp", role: "user", content: message, timestamp: Date.now() }],
        apiKey
      );

      setCompleteResponse(response);
      setIsTyping(true);
      
    } catch (error) {
      console.error("Error sending message:", error);
      
      let errorMessage = "Sorry, there was an error processing your request.";
      
      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          errorMessage = `Invalid ${currentChat.model.provider === "openrouter" ? "OpenRouter" : "Gemini"} API key. Please check your settings.`;
          toast({
            title: "API Error",
            description: errorMessage,
            duration: 5000,
            variant: "destructive"
          });
        } else if (error.message.includes("429")) {
          errorMessage = `You've reached the rate limit for ${currentChat.model.provider === "openrouter" ? "OpenRouter" : "Gemini"}. Please try again later.`;
          toast({
            title: "Rate Limit",
            description: "Rate limit reached",
            duration: 5000,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Connection Error",
            description: "Error connecting to AI service",
            duration: 5000,
            variant: "destructive"
          });
        }
      }
      
      addMessage(errorMessage, "assistant");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateResponse = (messageIndex: number) => {
    if (!currentChat || messageIndex < 0) return;
    
    // Find the user message that triggered this response
    const userMessageIndex = messageIndex - 1;
    
    if (userMessageIndex >= 0 && currentChat.messages[userMessageIndex]?.role === "user") {
      // Get the user message content
      const userMessage = currentChat.messages[userMessageIndex].content;
      
      // Remove the assistant response and all subsequent messages
      const newMessages = currentChat.messages.slice(0, messageIndex);
      
      // TODO: Update the chat context with the new messages array
      
      // Resend the user message to get a new response
      handleSendMessage(userMessage);
      
      toast({
        title: "Regenerating",
        description: "Regenerating response...",
      });
    }
  };

  const handleEditMessage = (content: string) => {
    // Populate the message input with the content to edit
    // This would require passing this function down to the MessageInput component
    // For now, we'll just log it
    console.log("Editing message:", content);
    // We would need to set up state to track which message is being edited
    // and then update the message input component with that content
  };

  return (
    <div className={cn(
      "flex flex-col h-screen",
      sidebarOpen ? "lg:ml-[300px]" : ""
    )}>
      <header className="h-16 flex items-center justify-between px-4 shrink-0">
        <div></div>
        <div className="flex items-center gap-2">
          <div className="glass-effect rounded-lg p-1.5 shadow-sm">
            <ThemeSelector />
          </div>
          <div className="glass-effect rounded-lg p-1.5 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSettingsOpen(true)}
              className="h-8 w-8"
            >
              <SettingsIcon className="h-5 w-5" />
            </Button>
          </div>
          <div className="glass-effect rounded-lg p-1.5 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={onInfoClick}
              className="h-8 w-8"
            >
              <Info className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <ScrollArea 
        className="flex-1 overflow-y-auto"
        ref={scrollAreaRef}
      >
        {currentChat && currentChat.messages.length > 0 ? (
          <div className="pb-32 max-w-4xl mx-auto">
            {currentChat.messages.map((message, index) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                onRegenerateResponse={() => handleRegenerateResponse(index)}
                onEditMessage={(content) => handleEditMessage(content)}
                model={message.model || currentChat.model}
              />
            ))}
            {isTyping && (
              <div className="w-full py-6 px-4 justify-start relative">
                <div className="flex max-w-2xl rounded-lg p-4 bg-secondary/15 text-foreground mr-auto ml-8">
                  <div className="w-full overflow-hidden">
                    <div className="prose dark:prose-invert max-w-none text-sm font-space-grotesk">
                      <ReactMarkdown
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          pre: ({ node, ...props }) => (
                            <pre className="bg-muted rounded-md p-4 overflow-x-auto my-4" {...props} />
                          ),
                          code: ({ node, className, ...props }) => (
                            <code className={className ? `${className} bg-muted rounded px-1 py-0.5 font-mono` : "bg-muted rounded px-1 py-0.5 font-mono"} {...props} />
                          ),
                          ul: ({ node, ...props }) => <ul className="my-4 ml-6 list-disc" {...props} />,
                          ol: ({ node, ...props }) => <ol className="my-4 ml-6 list-decimal" {...props} />,
                          li: ({ node, ...props }) => <li className="my-1" {...props} />,
                          p: ({ node, ...props }) => <p className="my-3 leading-relaxed" {...props} />,
                          em: ({ node, ...props }) => <em className="font-mono italic" {...props} />
                        }}
                      >
                        {typingText}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
                <div className="absolute top-8 left-6">
                  <div className="bg-background text-primary w-6 h-6 rounded-full flex items-center justify-center brain-icon">
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
          <div className="h-full flex items-center justify-center">
            <EmptyState onPromptClick={handleSendMessage} />
          </div>
        )}
      </ScrollArea>

      {showScrollToBottom && (
        <div className="fixed bottom-24 left-0 right-0 flex justify-center z-10 pointer-events-none">
          <Button
            onClick={scrollToBottom}
            size="sm"
            className="rounded-full px-3 py-1 bg-primary text-primary-foreground shadow-lg pointer-events-auto"
          >
            <ArrowDown className="h-4 w-4 mr-2" />
            Scroll to Bottom
          </Button>
        </div>
      )}

      <div className={cn(
        "fixed bottom-6 left-0 right-0 flex justify-center",
        sidebarOpen ? "lg:ml-[300px] transition-all duration-300" : "transition-all duration-300"
      )}>
        <div className="w-full max-w-3xl px-4">
          <div className="glass-effect backdrop-blur-md shadow-lg rounded-xl p-2">
            <MessageInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder={isLoading ? "Thinking..." : "Message Mimir..."}
              selectedModel={currentChat?.model || settings.defaultModel}
              onModelChange={setCurrentChatModel}
            />
          </div>
        </div>
      </div>

      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </div>
  );
};
