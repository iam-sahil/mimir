
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
        "flex w-full py-6 px-4 relative",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "absolute top-8",
        isUser ? "right-6" : "left-6"
      )}>
        {isUser ? (
          <div className="bg-background text-foreground/80 w-6 h-6 rounded-full flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
        ) : (
          <div className="bg-background text-primary w-6 h-6 rounded-full flex items-center justify-center brain-icon">
            <Brain className="h-4 w-4" />
          </div>
        )}
      </div>
      
      <div 
        className={cn(
          "flex max-w-2xl rounded-lg p-4",
          isUser 
            ? "bg-primary/10 text-foreground ml-auto mr-8" 
            : "bg-secondary/15 text-foreground mr-auto ml-8"
        )}
      >
        <div className="w-full overflow-hidden">
          {isUser ? (
            <p className="prose dark:prose-invert max-w-none text-sm font-helvetica">{message.content}</p>
          ) : (
            <div className="prose dark:prose-invert max-w-none text-sm font-helvetica">
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
                  ul: ({ node, ...props }) => (
                    <ul className="my-4 ml-6 list-disc" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="my-4 ml-6 list-decimal" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="my-1" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="my-3 leading-relaxed" {...props} />
                  ),
                  h1: ({ node, ...props }) => (
                    <h1 className="text-2xl font-semibold my-4 font-space-grotesk" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-xl font-semibold my-3 font-space-grotesk" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-lg font-semibold my-2 font-space-grotesk" {...props} />
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
