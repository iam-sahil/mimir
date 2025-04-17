
import React, { useState } from "react";
import { Brain } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  onPromptClick: (prompt: string) => void;
}

export const EmptyState = ({ onPromptClick }: EmptyStateProps) => {
  const { settings } = useSettings();
  const username = settings.username || "user";
  const [activeTab, setActiveTab] = useState<string>("general");

  const tabPrompts: Record<string, string[]> = {
    general: [
      "How does AI work?",
      "Explain quantum computing in simple terms",
      "Write a poem about the stars",
      "Tell me about the history of the internet",
      "What are the basics of machine learning?"
    ],
    writing: [
      "Write a short story about time travel",
      "Create a product description for a new smartphone",
      "Help me draft a professional email to a client",
      "Write a persuasive introduction for my essay",
      "Create a creative marketing slogan for a coffee shop"
    ],
    coding: [
      "Explain React hooks to a beginner",
      "Show me how to implement a binary search in Python",
      "What's the difference between REST and GraphQL?",
      "Write a simple CSS animation example",
      "Debug this JavaScript function for me"
    ],
    research: [
      "Summarize recent advances in renewable energy",
      "What are the ethical implications of AI?",
      "Compare and contrast democracy vs republic",
      "Explain the basics of blockchain technology",
      "What are the main theories about dark matter?"
    ]
  };

  const tabs = [
    { id: "general", label: "General" },
    { id: "writing", label: "Writing" },
    { id: "coding", label: "Coding" },
    { id: "research", label: "Research" }
  ];
  
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto px-4 py-12">
      <div className="mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Brain className="h-8 w-8 text-primary" />
        </div>
      </div>
      
      <h1 className="text-4xl font-semibold font-space-grotesk mb-4 text-center">
        Hello, <span className="text-primary">{username}</span>!
      </h1>
      
      <p className="text-muted-foreground text-center max-w-lg mb-8 font-helvetica text-lg">
        I'm Mimir, your AI assistant. How can I help you today?
      </p>
      
      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="outline"
            className={cn(
              "rounded-full px-6 py-2 text-sm font-medium transition-all",
              activeTab === tab.id 
                ? "bg-primary text-primary-foreground border-primary" 
                : "hover:bg-primary/10"
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      
      {/* Sample Prompts Grid */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 w-full max-w-3xl">
        {tabPrompts[activeTab].map((prompt, index) => (
          <div 
            key={index} 
            className="border border-border/50 rounded-lg p-4 hover:bg-accent/10 cursor-pointer transition-all glass-effect"
            onClick={() => onPromptClick(prompt)}
          >
            <p className="font-helvetica">{prompt}</p>
            <div className="flex items-center text-xs text-muted-foreground mt-3">
              Try it <span className="ml-1">→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
