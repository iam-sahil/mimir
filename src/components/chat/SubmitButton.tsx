import React from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  isLoading: boolean;
  disabled: boolean;
}

export const SubmitButton = React.forwardRef<
  HTMLButtonElement,
  SubmitButtonProps
>(({ isLoading, disabled }, ref) => {
  return (
    <Button
      ref={ref}
      type="submit"
      size="sm"
      className={cn(
        "ml-2 rounded-md transition-all duration-300",
        disabled
          ? "bg-secondary/50 text-secondary-foreground/70"
          : "bg-primary text-primary-foreground",
        isLoading && "opacity-70"
      )}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Send className="h-4 w-4" />
      )}
    </Button>
  );
});

SubmitButton.displayName = "SubmitButton";
