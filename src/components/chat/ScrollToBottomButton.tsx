
import React from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "../ui/button";

interface ScrollToBottomButtonProps {
  onClick: () => void;
}

export const ScrollToBottomButton = ({ onClick }: ScrollToBottomButtonProps) => {
  return (
    <Button
      onClick={onClick}
      size="sm"
      className="rounded-full px-3 py-1 bg-primary text-primary-foreground shadow-lg pointer-events-auto"
    >
      <ArrowDown className="h-4 w-4 mr-2" />
      Scroll to Bottom
    </Button>
  );
};
