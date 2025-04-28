
import React from "react";
import { Brain } from "lucide-react";

interface ThinkingIndicatorProps {
  thinkingText: string;
}

export const ThinkingIndicator = ({ thinkingText }: ThinkingIndicatorProps) => {
  return (
    <div className="w-full py-6 px-4 justify-start relative">
      <div className="flex max-w-2xl rounded-lg p-4 bg-secondary/5 text-foreground mr-auto ml-8">
        <div className="w-full overflow-hidden">
          <div className="prose dark:prose-invert max-w-none text-sm font-space-grotesk">
            <p>{thinkingText}</p>
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
