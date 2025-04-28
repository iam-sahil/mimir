import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  language?: string;
}

export const CodeBlock = ({
  children,
  className,
  language,
}: CodeBlockProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { currentTheme } = useTheme();
  const isDark =
    currentTheme.includes("dark") ||
    currentTheme === "catppuccin" ||
    currentTheme === "tokyo-night" ||
    currentTheme === "dracula" ||
    currentTheme === "one-dark" ||
    currentTheme === "gruvbox" ||
    currentTheme === "nord";

  useEffect(() => {
    const styleSheet = document.getElementById("hljs-theme");
    if (!styleSheet) {
      const link = document.createElement("link");
      link.id = "hljs-theme";
      link.rel = "stylesheet";
      link.href = isDark
        ? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css"
        : "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css";
      document.head.appendChild(link);
    } else {
      (styleSheet as HTMLLinkElement).href = isDark
        ? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css"
        : "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css";
    }

    // Add custom styles to override highlight.js background
    const customStyles = document.createElement("style");
    customStyles.textContent = `
      .hljs {
        background: transparent !important;
        font-family: var(--font-mono) !important;
      }
      .hljs-tag .hljs-string,
      .hljs-string {
        color: inherit !important;
      }
      pre, code, pre *, code * {
        font-family: var(--font-mono) !important;
      }
    `;
    document.head.appendChild(customStyles);

    return () => {
      if (customStyles.parentNode) {
        customStyles.parentNode.removeChild(customStyles);
      }
    };
  }, [isDark]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Helper function to extract text content from React nodes
  const getTextContent = (node: React.ReactNode): string => {
    if (typeof node === "string") return node;
    if (typeof node === "number") return node.toString();
    if (!node) return "";
    if (Array.isArray(node)) return node.map(getTextContent).join("");
    if (typeof node === "object" && "props" in node && node.props) {
      return getTextContent(node.props.children);
    }
    return "";
  };

  return (
    <div className="relative">
      <pre
        className={cn(
          "rounded-md p-4 pt-8 overflow-x-auto my-4 font-mono",
          isDark
            ? "bg-transparent border border-muted-foreground/10"
            : "bg-transparent border border-muted-foreground/5",
          className
        )}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <code className="font-mono" style={{ fontFamily: "var(--font-mono)" }}>
          {children}
        </code>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 px-2 py-1 text-xs bg-muted/80 hover:bg-muted"
          onClick={() => {
            const codeText = getTextContent(children);
            copyToClipboard(codeText);
          }}
        >
          {isCopied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
        {language && (
          <div className="absolute top-0 left-0 bg-muted-foreground/20 px-2 py-0.5 text-xs rounded-tr-none rounded-bl-none rounded-md">
            {language}
          </div>
        )}
      </pre>
    </div>
  );
};
