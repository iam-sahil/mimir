import React from "react";
import { Message, Model } from "@/types";
import { ChatMessage } from "@/components/ChatMessage";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { TypingIndicator } from "./TypingIndicator";
import { ChatMessageSkeleton } from "@/components/ChatMessageSkeleton";
import { EmptyState } from "@/components/EmptyState";

interface MessagesProps {
  messages: Message[];
  onRegenerateResponse: (index: number) => void;
  onEditMessage: (content: string) => void;
  currentModel: Model;
  thinkingText: string;
  isTyping: boolean;
  typingText: string;
  isLoading: boolean;
  onPromptClick: (prompt: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const Messages = ({
  messages,
  onRegenerateResponse,
  onEditMessage,
  currentModel,
  thinkingText,
  isTyping,
  typingText,
  isLoading,
  onPromptClick,
  messagesEndRef,
}: MessagesProps) => {
  if (!messages.length) {
    return (
      <div className="h-full flex items-center justify-center py-24">
        <EmptyState onPromptClick={onPromptClick} />
      </div>
    );
  }

  return (
    <div className="pb-40 pt-4 max-w-4xl mx-auto">
      {messages.map((message, index) => (
        <div key={message.id} data-message-id={message.id}>
          <ChatMessage
            message={message}
            onRegenerateResponse={() => onRegenerateResponse(index)}
            onEditMessage={onEditMessage}
            model={message.model || currentModel}
          />
        </div>
      ))}

      {thinkingText && !isTyping && (
        <ThinkingIndicator thinkingText={thinkingText} />
      )}
      {isTyping && <TypingIndicator typingText={typingText} />}
      {isLoading && !isTyping && !thinkingText && <ChatMessageSkeleton />}

      <div ref={messagesEndRef} className="h-32" />
    </div>
  );
};
