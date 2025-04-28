import React, { useState, useEffect } from "react";
import { Message, Model, ChatCompletionMessage } from "@/types";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { cn } from "@/lib/utils";
import { MessageActions } from "./chat/MessageActions";
import { CodeBlock } from "./chat/CodeBlock";
import { SearchSuggestions } from "./chat/SearchSuggestions";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ImageIcon } from "lucide-react";

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
  model,
}: ChatMessageProps) => {
  const isUser = message.role === "user";
  const [isHovering, setIsHovering] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);

  // Check if the message contains a generated image
  useEffect(() => {
    if (!isUser && message.content.includes("Generated image for prompt:")) {
      // Check local storage for cached image
      const cachedImage = localStorage.getItem(`image-${message.id}`);
      if (cachedImage) {
        setImageData(cachedImage);
      }
    }
  }, [message, isUser]);

  const getLanguageFromClassName = (className: string | undefined) => {
    if (!className) return "";
    const match = className.match(/language-(\w+)/);
    return match ? match[1] : "";
  };

  const isGeneratedImage =
    !isUser && message.content.includes("Generated image for prompt:");

  return (
    <div
      className={cn(
        "flex w-full py-6 px-4 relative",
        isUser ? "justify-end" : "justify-start"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className={cn(
          "flex flex-col rounded-lg p-4 relative",
          isUser
            ? "bg-primary/5 text-foreground ml-auto max-w-[300px]"
            : "bg-secondary/10 text-foreground max-w-2xl"
        )}
      >
        <div className="w-full overflow-hidden">
          {isUser ? (
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger className="w-full text-left">
                <p
                  className={cn(
                    "prose dark:prose-invert max-w-none text-sm font-plus-jakarta",
                    !isExpanded && "line-clamp-4"
                  )}
                >
                  {message.content}
                </p>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <p className="prose dark:prose-invert max-w-none text-sm font-plus-jakarta mt-2">
                  {message.content}
                </p>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <div className="prose dark:prose-invert max-w-none text-sm">
              <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                components={{
                  pre: ({ node, className, children, ...props }) => {
                    const codeChild = React.Children.toArray(children).find(
                      (child) =>
                        React.isValidElement(child) && child.type === "code"
                    ) as React.ReactElement;

                    const language =
                      codeChild && codeChild.props
                        ? getLanguageFromClassName(codeChild.props.className)
                        : "";

                    return (
                      <CodeBlock
                        language={language}
                        className={className}
                        {...props}
                      >
                        {children}
                      </CodeBlock>
                    );
                  },
                  code: ({ node, className, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    return !match ? (
                      <code
                        className={cn(
                          "bg-muted rounded px-1 py-0.5 font-mono",
                          className
                        )}
                        style={{ fontFamily: "var(--font-mono)" }}
                        {...props}
                      >
                        {props.children}
                      </code>
                    ) : (
                      <code
                        className={cn(className, "font-mono")}
                        style={{ fontFamily: "var(--font-mono)" }}
                        {...props}
                      >
                        {props.children}
                      </code>
                    );
                  },
                  ul: ({ node, ...props }) => (
                    <ul
                      className="my-4 ml-6 list-disc marker:text-primary"
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="my-4 ml-6 list-decimal marker:text-primary"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="my-1" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="my-3 leading-relaxed" {...props} />
                  ),
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-2xl font-semibold my-4 font-space-grotesk"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-xl font-semibold my-3 font-space-grotesk"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-lg font-semibold my-2 font-space-grotesk"
                      {...props}
                    />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="font-mono italic" {...props} />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>

              {/* Display generated image if this is an image generation message */}
              {isGeneratedImage && (
                <div className="mt-4">
                  {imageData ? (
                    <div className="overflow-hidden rounded-md border">
                      <img
                        src={imageData}
                        alt={`Generated image from prompt`}
                        className="object-cover w-full"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48 bg-slate-100 dark:bg-slate-800 rounded-md border text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="h-8 w-8" />
                        <span>Image will appear here when available</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Display image attachments from the user */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {message.attachments.map(
                (attachment, index) =>
                  attachment.type.startsWith("image/") && (
                    <div
                      key={index}
                      className="overflow-hidden rounded-md border"
                    >
                      <img
                        src={URL.createObjectURL(attachment.file)}
                        alt={`Image attachment ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )
              )}
            </div>
          )}

          {/* Display search suggestions and sources if available */}
          {!isUser && (message as any).searchSuggestions && (
            <SearchSuggestions
              renderedContent={
                (message as any).searchSuggestions.renderedContent
              }
              queries={(message as any).searchSuggestions.queries}
              sources={(message as any).sources}
            />
          )}
        </div>

        {isHovering && (
          <div className="absolute -bottom-6 left-4 transform">
            <MessageActions
              content={message.content}
              onRegenerateResponse={onRegenerateResponse}
              onEditMessage={onEditMessage}
              isUser={isUser}
              model={message.model}
            />
          </div>
        )}
      </div>
    </div>
  );
};
