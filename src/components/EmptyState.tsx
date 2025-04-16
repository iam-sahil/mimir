
import React from "react";
import { Button } from "./ui/button";
import { Brain, ArrowRight } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

interface SamplePrompt {
  title: string;
  prompt: string;
}

interface EmptyStateProps {
  onPromptClick: (prompt: string) => void;
}

export const EmptyState = ({ onPromptClick }: EmptyStateProps) => {
  const { settings } = useSettings();
  const displayName = settings.username ? settings.username : "user";

  const samplePrompts: SamplePrompt[] = [
    {
      title: "How does AI work?",
      prompt: "Can you explain how large language models like you work?",
    },
    {
      title: "Write a poem about the stars",
      prompt: "Write a short poem about looking at the night sky.",
    },
    {
      title: "Explain quantum computing",
      prompt: "Explain quantum computing to me like I'm 10 years old.",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto px-4">
      <div className="flex flex-col items-center text-center">
        <Brain className="h-12 w-12 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Hello there, {displayName}!</h1>
        <p className="text-muted-foreground mb-6">
          Welcome to Mimir. I'm here to assist with information, answer questions, and engage in conversations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {samplePrompts.map((item) => (
          <Button
            key={item.title}
            variant="outline"
            className="h-auto p-4 flex flex-col items-start justify-start text-left"
            onClick={() => onPromptClick(item.prompt)}
          >
            <p className="font-medium mb-2">{item.title}</p>
            <div className="flex items-center text-xs text-muted-foreground mt-auto">
              <span>Try it</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};
