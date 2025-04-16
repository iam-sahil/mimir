
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, Brain, Menu } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { SidebarChatItem } from "./SidebarChatItem";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { chats, createNewChat, currentChat, deleteChat, renameChat, selectChat } = useChat();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Handle click outside of sidebar on mobile
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (isMobile && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle chat deletion
  const handleDeleteChat = (chatId: string) => {
    deleteChat(chatId);
  };

  // Handle chat renaming
  const handleRenameChat = (chatId: string, newTitle: string) => {
    renameChat(chatId, newTitle);
  };

  // Handle chat selection
  const handleSelectChat = (chatId: string) => {
    selectChat(chatId);
    if (isMobile) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={handleOverlayClick}
        ></div>
      )}
      
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[300px] bg-sidebar border-r border-border flex flex-col transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2 text-xl font-semibold text-sidebar-foreground">
            <Brain className="h-6 w-6" />
            <h1>Mimir</h1>
          </div>
          <div className="flex items-center gap-2">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        <div className="p-4">
          <Button 
            className="w-full justify-start" 
            onClick={() => {
              createNewChat();
              if (isMobile) onClose();
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {chats.map((chat) => (
              <SidebarChatItem 
                key={chat.id} 
                chat={chat} 
                isActive={currentChat?.id === chat.id}
                onSelect={() => handleSelectChat(chat.id)}
                onDelete={() => handleDeleteChat(chat.id)}
                onRename={(newTitle) => handleRenameChat(chat.id, newTitle)}
              />
            ))}
          </div>
        </div>

        <div className="p-4 border-t mt-auto">
          <div className="flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Mimir © 2025</span>
          </div>
        </div>
      </aside>
    </>
  );
};
