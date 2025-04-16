
import React from "react";
import { Message } from "@/types";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import 'highlight.js/styles/github-dark.css';
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";
  
  return (
    <div
      className={cn(
        "flex w-full py-8 px-4",
        isUser ? "bg-accent/50" : "bg-background"
      )}
    >
      <div className="container mx-auto max-w-4xl flex gap-4">
        <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center">
          {isUser ? (
            <div className="bg-primary text-primary-foreground w-full h-full rounded-full flex items-center justify-center text-sm font-medium">
              U
            </div>
          ) : (
            <div className="bg-blue-600 text-white w-full h-full rounded-full flex items-center justify-center text-sm font-medium">
              M
            </div>
          )}
        </div>
        <div className="w-full">
          {isUser ? (
            <p className="prose dark:prose-invert max-w-none">{message.content}</p>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
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
