import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  typingText: string;
}

export const TypingIndicator = ({ typingText }: TypingIndicatorProps) => {
  return (
    <div className="w-full py-6 px-4 justify-start relative">
      <div className="flex max-w-2xl rounded-lg p-4 bg-secondary/5 text-foreground mr-auto ml-8">
        <div className="w-full overflow-hidden">
          <div className="prose dark:prose-invert max-w-none text-sm">
            <ReactMarkdown
              rehypePlugins={[rehypeHighlight]}
              components={{
                pre: ({ node, ...props }) => (
                  <pre
                    className="bg-muted rounded-md p-4 overflow-x-auto my-4 font-mono"
                    style={{ fontFamily: "var(--font-mono)" }}
                    {...props}
                  />
                ),
                code: ({ node, className, ...props }) => (
                  <code
                    className={
                      className
                        ? `${className} bg-muted rounded px-1 py-0.5 font-mono`
                        : "bg-muted rounded px-1 py-0.5 font-mono"
                    }
                    style={{ fontFamily: "var(--font-mono)" }}
                    {...props}
                  />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="my-4 ml-6 list-disc" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="my-4 ml-6 list-decimal" {...props} />
                ),
                li: ({ node, ...props }) => <li className="my-1" {...props} />,
                p: ({ node, ...props }) => (
                  <p className="my-3 leading-relaxed" {...props} />
                ),
                em: ({ node, ...props }) => (
                  <em className="italic" {...props} />
                ),
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
  );
};
