
import React from "react";
import { Brain } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const ChatMessageSkeleton = () => {
  return (
    <div className="flex w-full py-6 px-4 justify-start">
      <div className="absolute left-6 mt-1">
        <div className="bg-background text-primary w-6 h-6 rounded-full flex items-center justify-center">
          <Brain className="h-4 w-4" />
        </div>
      </div>
      
      <div className="flex max-w-2xl rounded-lg p-4 bg-secondary/15 text-foreground mr-auto ml-8">
        <div className="w-full overflow-hidden space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
};
