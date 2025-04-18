
import React, { useState } from "react";
import { Message, Model } from "@/types";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import 'highlight.js/styles/github-dark.css';
import { cn } from "@/lib/utils";
import { Brain, User, Copy, RefreshCw, Edit, Check, Terminal } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface ChatMessageProps {
  message: Message;
  onRegenerateResponse?: () => void;
  onEditMessage?: (content: string) => void;
  model?: Model;
}

export const ChatMessage = ({
  message,
  onRegenerateResponse,
  onEditMessage,
  model
}: ChatMessageProps) => {
  const isUser = message.role === "user";
  const [isCopied, setIsCopied] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  // Function to copy content to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast("Copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  // Function to handle editing the message
  const handleEdit = () => {
    if (onEditMessage) {
      onEditMessage(message.content);
    }
  };
  
  // Helper function to determine language from code fence
  const getLanguageFromClassName = (className: string | undefined) => {
    if (!className) return "";
    const match = className.match(/language-(\w+)/);
    return match ? match[1] : "";
  };

  return (
    <div
      className={cn(
        "flex w-full py-6 px-4 relative",
        isUser ? "justify-end" : "justify-start"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
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
          <div className="bg-background text-primary w-6 h-6 rounded-full flex items-center justify-center">
            <Brain className="h-4 w-4" />
          </div>
        )}
      </div>
      
      <div 
        className={cn(
          "flex flex-col max-w-2xl rounded-lg p-4 relative",
          isUser 
            ? "bg-primary/10 text-foreground ml-auto mr-8" 
            : "bg-secondary/15 text-foreground mr-auto ml-8"
        )}
      >
        {/* Action bar for user messages */}
        {isUser && isHovering && (
          <div className="absolute -top-8 right-0 flex gap-1 bg-background/80 backdrop-blur-sm rounded-md p-1 shadow-md">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => copyToClipboard(message.content)}
              title="Copy prompt"
            >
              {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
            {onRegenerateResponse && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={onRegenerateResponse}
                title="Regenerate response"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            )}
            {onEditMessage && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={handleEdit}
                title="Edit message"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
        
        {/* Action bar for assistant messages */}
        {!isUser && isHovering && (
          <div className="absolute -top-8 right-0 flex gap-1 bg-background/80 backdrop-blur-sm rounded-md p-1 shadow-md">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => copyToClipboard(message.content)}
              title="Copy response"
            >
              {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
            {message.model && (
              <span className="text-xs flex items-center px-2 text-muted-foreground">
                Generated with {message.model.name}
              </span>
            )}
          </div>
        )}
        
        <div className="w-full overflow-hidden">
          {isUser ? (
            <p className="prose dark:prose-invert max-w-none text-sm font-helvetica">{message.content}</p>
          ) : (
            <div className="prose dark:prose-invert max-w-none text-sm font-helvetica">
              <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                components={{
                  pre: ({ node, className, children, ...props }) => {
                    // Find the code element and its language if any
                    const codeChild = React.Children.toArray(children).find(
                      child => React.isValidElement(child) && child.type === 'code'
                    ) as React.ReactElement;
                    
                    const language = codeChild && codeChild.props ? 
                      getLanguageFromClassName(codeChild.props.className) : "";
                    
                    return (
                      <div className="relative group">
                        {language && (
                          <div className="absolute top-0 left-0 bg-muted-foreground/20 px-2 py-0.5 text-xs rounded-tr-none rounded-bl-none rounded-md">
                            {language}
                          </div>
                        )}
                        <div className="absolute top-0 right-0 hidden group-hover:flex">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 py-1 text-xs bg-muted/80"
                            onClick={() => {
                              const codeText = codeChild?.props?.children?.[0] || "";
                              copyToClipboard(codeText);
                            }}
                          >
                            {isCopied ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                        <pre
                          className={cn(
                            "bg-muted rounded-md p-4 pt-8 overflow-x-auto my-4",
                            className
                          )}
                          {...props}
                        >
                          {children}
                        </pre>
                      </div>
                    );
                  },
                  code: ({ node, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    return !match ? (
                      <code className={cn("bg-muted rounded px-1 py-0.5 font-mono", className)} {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className={cn(className, "font-mono")} {...props}>
                        {children}
                      </code>
                    );
                  },
                  ul: ({ node, ...props }) => <ul className="my-4 ml-6 list-disc" {...props} />,
                  ol: ({ node, ...props }) => <ol className="my-4 ml-6 list-decimal" {...props} />,
                  li: ({ node, ...props }) => <li className="my-1" {...props} />,
                  p: ({ node, ...props }) => <p className="my-3 leading-relaxed" {...props} />,
                  h1: ({ node, ...props }) => (
                    <h1 className="text-2xl font-semibold my-4 font-space-grotesk" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-xl font-semibold my-3 font-space-grotesk" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-lg font-semibold my-2 font-space-grotesk" {...props} />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="font-mono italic" {...props} />
                  )
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
