import React, { useEffect } from "react";
import { MessageInput } from "./MessageInput";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { useChat } from "@/contexts/ChatContext";
import { SettingsDialog } from "./SettingsDialog";
import { ChatHeader } from "./chat/ChatHeader";
import { useSettings } from "@/contexts/SettingsContext";
import { useHotkeys } from "@/hooks/useHotkeys";
import { Messages } from "./chat/Messages";
import { useChatState } from "@/hooks/useChatState";
import { useScrollToBottom } from "@/hooks/useScrollToBottom";
import { ScrollToBottomButton } from "./chat/ScrollToBottomButton";
import { toast } from "sonner";

interface ChatContainerProps {
  onSidebarToggle: () => void;
  onInfoClick: () => void;
  onSettingsClick: () => void;
  sidebarOpen: boolean;
}

export const ChatContainer = ({
  onSidebarToggle,
  onInfoClick,
  onSettingsClick,
  sidebarOpen,
}: ChatContainerProps) => {
  const { currentChat, setCurrentChatModel, createNewChat, renameChat } =
    useChat();

  const { settings } = useSettings();

  const {
    isLoading,
    typingText,
    thinkingText,
    isTyping,
    editingMessageId,
    setEditingMessageId,
    handleSendMessage,
    generatedImageUrl,
    isGeneratingImage,
  } = useChatState();

  const { messagesEndRef, scrollAreaRef, showScrollToBottom, scrollToBottom } =
    useScrollToBottom();

  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  // Handle generated images
  useEffect(() => {
    if (generatedImageUrl && currentChat) {
      // Find the most recent assistant message that mentions 'Generated image'
      const imageMessage = [...currentChat.messages]
        .reverse()
        .find(
          (msg) =>
            msg.role === "assistant" &&
            msg.content.includes("Generated image for prompt:")
        );

      if (imageMessage) {
        // Store the image in localStorage keyed by message ID
        localStorage.setItem(`image-${imageMessage.id}`, generatedImageUrl);

        // Force a re-render to display the image
        const messageElements = document.querySelectorAll("[data-message-id]");
        messageElements.forEach((el) => {
          if (el.getAttribute("data-message-id") === imageMessage.id) {
            // Force a re-render of the component
            el.classList.add("image-loaded");
          }
        });
      }
    }
  }, [generatedImageUrl, currentChat]);

  useHotkeys([
    {
      keys: ["Control", "r"],
      callback: () => {
        if (currentChat) {
          const newTitle = prompt("Rename chat:", currentChat.title);
          if (
            newTitle &&
            newTitle.trim() !== "" &&
            newTitle !== currentChat.title
          ) {
            renameChat(currentChat.id, newTitle);
            toast.success("Chat renamed successfully");
          }
        } else {
          toast.error("No chat selected");
        }
      },
      description: "Rename current chat",
    },
  ]);

  const handleRegenerateResponse = (messageIndex: number) => {
    if (!currentChat || messageIndex < 0) return;
    const userMessageIndex = messageIndex - 1;
    if (
      userMessageIndex >= 0 &&
      currentChat.messages[userMessageIndex]?.role === "user"
    ) {
      const userMessage = currentChat.messages[userMessageIndex].content;
      handleSendMessage(userMessage);
      toast.success("Regenerating response");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader
        onSettingsClick={onSettingsClick}
        onInfoClick={onInfoClick}
        onSettingsOpen={setIsSettingsOpen}
      />

      <ScrollArea ref={scrollAreaRef} className="flex-1 overflow-y-auto">
        <Messages
          messages={currentChat?.messages || []}
          onRegenerateResponse={handleRegenerateResponse}
          onEditMessage={setEditingMessageId}
          currentModel={currentChat?.model!}
          thinkingText={thinkingText}
          isTyping={isTyping}
          typingText={typingText}
          isLoading={isLoading || isGeneratingImage}
          onPromptClick={handleSendMessage}
          messagesEndRef={messagesEndRef}
        />
      </ScrollArea>

      {showScrollToBottom && (
        <div className="fixed bottom-24 left-0 right-0 flex justify-center z-10 pointer-events-none">
          <ScrollToBottomButton onClick={scrollToBottom} />
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 flex justify-center mx-auto px-4">
        <div
          className={cn(
            "w-full max-w-3xl transition-all duration-500 ease-in-out transform",
            sidebarOpen
              ? "translate-x-[150px] lg:translate-x-[150px]"
              : "translate-x-0"
          )}
        >
          <MessageInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading || isGeneratingImage}
            placeholder={
              isGeneratingImage
                ? "Generating image..."
                : isLoading
                ? "Making shit happen..."
                : "How can I help you today?"
            }
            selectedModel={currentChat?.model || settings.defaultModel}
            onModelChange={setCurrentChatModel}
            editingMessage={editingMessageId}
            onClearEditingMessage={() => setEditingMessageId(null)}
          />
        </div>
      </div>

      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </div>
  );
};
