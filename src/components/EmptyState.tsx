
import React from "react";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  onPromptClick: (prompt: string) => void;
}

const samplePrompts = [
  "Summarize the key points of quantum computing for a high school student.",
  "Compare and contrast functional and object-oriented programming paradigms.",
  "Create a 7-day itinerary for a trip to Tokyo, Japan."
];

export const EmptyState = ({ onPromptClick }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-2xl mx-auto text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-primary brain-icon" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Welcome to Mimir</h1>
        <p className="text-muted-foreground">
          Your AI assistant for learning and exploration. Ask anything to begin your conversation.
        </p>
      </div>

      <div className="w-full grid gap-3 max-w-md mx-auto mt-4">
        {samplePrompts.map((prompt, i) => (
          <Button 
            key={i}
            variant="outline" 
            className={cn(
              "justify-start px-4 py-6 h-auto text-left border border-border/60 bg-background/40 hover:bg-accent/20 shadow-sm",
              "transition-all duration-200 hover:shadow-md hover:border-primary/30"
            )}
            onClick={() => onPromptClick(prompt)}
          >
            <div className="overflow-hidden">
              <p className="font-normal truncate text-sm">{prompt}</p>
            </div>
          </Button>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Mimir can help with information, learning, creative tasks, and more.
      </p>
    </div>
  );
};
