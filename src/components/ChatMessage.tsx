
import React from "react";
import { Message } from "@/types";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import 'highlight.js/styles/github-dark.css';
import { cn } from "@/lib/utils";
import { Brain, User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";
  
  return (
    <div
      className={cn(
        "flex w-full py-6 px-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div 
        className={cn(
          "flex max-w-3xl gap-3 rounded-lg p-4",
          isUser ? "bg-primary/10 text-foreground" : "bg-secondary/15 text-foreground"
        )}
      >
        <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center">
          {isUser ? (
            <div className="bg-background text-foreground/80 w-8 h-8 rounded-full flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
          ) : (
            <div className="bg-background text-blue-500 w-8 h-8 rounded-full flex items-center justify-center">
              <Brain className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="w-full overflow-hidden">
          {isUser ? (
            <p className="prose dark:prose-invert max-w-none text-sm">{message.content}</p>
          ) : (
            <div className="prose dark:prose-invert max-w-none text-sm">
              <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                components={{
                  pre: ({ node, ...props }) => (
                    <pre
                      className="bg-muted rounded-md p-4 overflow-x-auto my-4"
                      {...props}
                    />
                  ),
                  code: ({ node, className, ...props }) => (
                    <code 
                      className={className ? `${className} bg-muted rounded px-1 py-0.5` : "bg-muted rounded px-1 py-0.5"}
                      {...props} 
                    />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
