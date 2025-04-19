
import React from "react";
import { SidebarChatItem } from "./SidebarChatItem";
import { useChat } from "@/contexts/ChatContext";
import { Chat } from "@/types";

interface SidebarSearchResultsProps {
  searchQuery: string;
  filteredChats: Chat[];
  currentChatId?: string;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
}

export const SidebarSearchResults = ({ 
  searchQuery, 
  filteredChats,
  currentChatId,
  onSelectChat,
  onDeleteChat
}: SidebarSearchResultsProps) => {
  const { renameChat, addChatToFolder, pinChat, unpinChat } = useChat();
  const folders = Array.from(new Set(filteredChats.filter(chat => chat.folder).map(chat => chat.folder))) as string[];
  
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium px-2 py-1">Search Results</h3>
      <div className="space-y-1 mt-2">
        {filteredChats.length > 0 ? 
          filteredChats.map((chat) => (
            <SidebarChatItem 
              key={chat.id} 
              chat={chat} 
              isActive={currentChatId === chat.id}
              onSelect={() => onSelectChat(chat.id)}
              onDelete={() => onDeleteChat(chat.id)}
              onRename={(newTitle) => renameChat(chat.id, newTitle)}
              onAddToFolder={(folder) => addChatToFolder(chat.id, folder)}
              onPin={chat.isPinned ? () => unpinChat(chat.id) : () => pinChat(chat.id)}
              folders={folders}
              inFolder={!!chat.folder}
            />
          )) : (
            <p className="text-xs text-muted-foreground px-4 py-2">No chats found</p>
          )
        }
      </div>
    </div>
  );
};
