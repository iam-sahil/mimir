
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSettings } from "@/contexts/SettingsContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Sparkles, Wand2, Code, GraduationCap } from "lucide-react";

const categories = [
  { id: "general", label: "General" },
  { id: "creative", label: "Creative" },
  { id: "learning", label: "Learning" },
  { id: "coding", label: "Coding" },
];

const allSamplePrompts = {
  general: [
    "What are the key differences between classical and quantum computing?",
    "Explain how machine learning algorithms work for someone new to tech",
    "What are the most effective strategies for time management?",
    "How do electric vehicles compare to traditional combustion engines?",
    "What are the main challenges in sustainable urban development?",
    "Explain the concept of blockchain in simple terms",
    "What are the latest breakthroughs in renewable energy?",
    "How does artificial intelligence impact healthcare?",
    "What are the fundamentals of personal finance management?"
  ],
  creative: [
    "Write a short story about a robot discovering emotions",
    "Create a 7-day itinerary for a trip to Tokyo, Japan",
    "Generate ideas for a science fiction novel set 500 years in the future",
    "Design a magical system for a fantasy world",
    "Write a poem about the changing seasons",
    "Create a backstory for a superhero with unusual powers",
    "Develop a concept for an eco-friendly smart city",
    "Write a dialogue between two historical figures",
    "Design a unique restaurant concept with a specific theme"
  ],
  learning: [
    "Explain the theory of relativity in simple terms",
    "What are the most important events of World War II?",
    "How does photosynthesis work in plants?",
    "Explain the process of human evolution",
    "How does the human immune system work?",
    "What are the fundamental principles of psychology?",
    "Explain the water cycle and its importance",
    "How do black holes form and function?",
    "What are the major periods in art history?"
  ],
  coding: [
    "What are the best practices for React performance optimization?",
    "Explain how async/await works in JavaScript",
    "What is the difference between REST and GraphQL APIs?",
    "How do you implement authentication in a web application?",
    "Explain the principles of clean code architecture",
    "What are design patterns and when should they be used?",
    "How does garbage collection work in modern programming languages?",
    "Explain the concept of microservices architecture",
    "What are the SOLID principles in object-oriented programming?"
  ],
};

function getRandomPrompts(array: string[], count: number): string[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

interface EmptyStateProps {
  onPromptClick: (prompt: string) => void;
}

export const EmptyState = ({ onPromptClick }: EmptyStateProps) => {
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = React.useState("general");
  const [currentPrompts, setCurrentPrompts] = React.useState<Record<string, string[]>>({});

  React.useEffect(() => {
    // Initialize random prompts for each category
    const initialPrompts: Record<string, string[]> = {};
    Object.entries(allSamplePrompts).forEach(([category, prompts]) => {
      initialPrompts[category] = getRandomPrompts(prompts, 3);
    });
    setCurrentPrompts(initialPrompts);
  }, []);

  const tabIcons = {
    general: <Sparkles className="w-4 h-4" />,
    creative: <Wand2 className="w-4 h-4" />,
    learning: <GraduationCap className="w-4 h-4" />,
    coding: <Code className="w-4 h-4" />
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto px-4 text-left animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Hey, how can I help you
          <span className="text-primary">{settings.username ? ` ${settings.username}` : ''}</span>?
        </h1>
        <p className="text-muted-foreground mb-6">
          Mimir is your AI assistant for learning, creative tasks, and problem-solving. Ask anything to begin your conversation.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-4 grid grid-cols-4">
          {categories.map(category => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="flex items-center gap-2"
            >
              {tabIcons[category.id as keyof typeof tabIcons]}
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(currentPrompts).map(([category, prompts]) => (
          <TabsContent key={category} value={category} className="w-full">
            <div className="space-y-2">
              {prompts.map((prompt, i) => (
                <Button 
                  key={i}
                  variant="ghost" 
                  className={cn(
                    "flex w-full justify-start px-4 py-4 h-auto text-left",
                    "hover:bg-secondary/40 transition-colors duration-200",
                    "rounded-lg border border-border/40"
                  )}
                  onClick={() => onPromptClick(prompt)}
                >
                  <MessageSquare className="h-4 w-4 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-sm">{prompt}</span>
                </Button>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
