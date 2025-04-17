
import React from "react";
import { Brain } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

interface EmptyStateProps {
  onPromptClick: (prompt: string) => void;
}

export const EmptyState = ({ onPromptClick }: EmptyStateProps) => {
  const { settings } = useSettings();
  const username = settings.username || "user";
  
  const samplePrompts = [
    "How does AI work?",
    "Write a poem about the stars",
    "Explain quantum computing"
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <div className="mb-6">
        <Brain className="h-16 w-16 mx-auto text-blue-500" />
      </div>
      <h1 className="text-3xl font-semibold font-space-grotesk mb-2">Hello there, {username}!</h1>
      <p className="text-muted-foreground max-w-md mb-3 font-helvetica">
        Welcome to Mimir. I'm here to assist with information, answer questions, and engage in conversations.
      </p>
      <p className="text-primary text-xl mb-8 font-space-grotesk">Ask. Learn. Evolve.</p>
      
      <div className="grid gap-4 md:grid-cols-3 w-full max-w-3xl">
        {samplePrompts.map((prompt, index) => (
          <div 
            key={index} 
            className="border border-border/50 rounded-lg p-4 hover:bg-accent/30 cursor-pointer transition-colors mx-auto w-full"
            onClick={() => onPromptClick(prompt)}
          >
            <p className="mb-4 font-helvetica">{prompt}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              Try it <span className="ml-1">→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
