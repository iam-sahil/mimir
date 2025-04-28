
import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "@/contexts/ChatContext";
import { Search, MessageSquare, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchModal = ({ open, onOpenChange }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { chats, selectChat, createNewChat } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery("");
    }
  }, [open]);
  
  const handleSelectChat = (id: string) => {
    selectChat(id);
    onOpenChange(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (searchQuery.trim()) {
        // Implement search functionality here
        // Find and select best matching chat
        const matchingChats = chats.filter(chat => 
          chat.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        if (matchingChats.length > 0) {
          handleSelectChat(matchingChats[0].id);
        } else {
          createNewChat();
          onOpenChange(false);
        }
      } else {
        createNewChat();
        onOpenChange(false);
      }
    } else if (e.key === "Escape") {
      onOpenChange(false);
    }
  };

  // Get the 5 most recent chats
  const recentChats = [...chats]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5);
  
  // Filter chats based on search query
  const filteredChats = searchQuery 
    ? chats.filter(chat => chat.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Search or create new chat</DialogTitle>
        </DialogHeader>
        
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Search or press Enter to start new chat..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        
        <div className="mt-2">
          {searchQuery && filteredChats.length > 0 ? (
            <>
              <p className="text-xs text-muted-foreground mb-2">Search Results</p>
              <div className="space-y-1">
                {filteredChats.map(chat => (
                  <Button
                    key={chat.id}
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={() => handleSelectChat(chat.id)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span className="truncate">{chat.title}</span>
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-primary mb-2">Recent Chats</p>
              <div className="space-y-1">
                {recentChats.map(chat => (
                  <Button
                    key={chat.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left",
                    )}
                    onClick={() => handleSelectChat(chat.id)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span className="truncate">{chat.title}</span>
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="mt-4">
          <Button 
            className="w-full" 
            onClick={() => {
              createNewChat();
              onOpenChange(false);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
