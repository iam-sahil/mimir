
import React, { useState } from "react";
import { Pin, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { useChat } from "@/contexts/ChatContext";
import { SidebarChatItem } from "./SidebarChatItem";
import { cn } from "@/lib/utils";

interface SidebarPinnedChatsProps {
  currentChatId?: string;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  closeSidebar?: () => void;
}

export const SidebarPinnedChats = ({ 
  currentChatId, 
  onSelectChat, 
  onDeleteChat,
  closeSidebar 
}: SidebarPinnedChatsProps) => {
  const { chats, renameChat, addChatToFolder, pinChat, unpinChat } = useChat();
  const [isPinnedExpanded, setIsPinnedExpanded] = useState(true);
  
  const pinnedChats = chats.filter(chat => chat.isPinned);
  const folders = Array.from(new Set(chats.filter(chat => chat.folder).map(chat => chat.folder))) as string[];
  
  return (
    <div className="mb-2">
      <div 
        className="flex items-center px-2 py-1.5 text-sm font-medium cursor-pointer"
        onClick={() => setIsPinnedExpanded(!isPinnedExpanded)}
      >
        <Pin className="h-4 w-4 mr-2 text-accent-primary" />
        <span>Pinned Chats</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto h-5 w-5 p-0"
          onClick={(e) => {
            e.stopPropagation();
            setIsPinnedExpanded(!isPinnedExpanded);
          }}
        >
          {isPinnedExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      {isPinnedExpanded && (
        <div className="space-y-1 mt-1">
          {pinnedChats.length === 0 && (
            <p className="text-xs text-muted-foreground px-4 py-2">No pinned chats</p>
          )}
          {pinnedChats.map((chat) => (
            <SidebarChatItem 
              key={chat.id} 
              chat={chat} 
              isActive={currentChatId === chat.id}
              onSelect={() => {
                onSelectChat(chat.id);
                if (closeSidebar) closeSidebar();
              }}
              onDelete={() => onDeleteChat(chat.id)}
              onRename={(newTitle) => renameChat(chat.id, newTitle)}
              onAddToFolder={(folder) => addChatToFolder(chat.id, folder)}
              onPin={() => unpinChat(chat.id)}
              folders={folders}
            />
          ))}
        </div>
      )}
    </div>
  );
};
