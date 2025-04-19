
import React, { useState } from "react";
import { Folder, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { useChat } from "@/contexts/ChatContext";
import { SidebarChatItem } from "./SidebarChatItem";

interface SidebarFoldersProps {
  currentChatId?: string;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  folders: string[];
  closeSidebar?: () => void;
}

export const SidebarFolders = ({ 
  currentChatId, 
  onSelectChat, 
  onDeleteChat,
  folders,
  closeSidebar 
}: SidebarFoldersProps) => {
  const { chats, renameChat, addChatToFolder, pinChat, unpinChat } = useChat();
  const [isFoldersExpanded, setIsFoldersExpanded] = useState(true);
  
  return (
    <div className="mb-2">
      <div 
        className="flex items-center px-2 py-1.5 text-sm font-medium cursor-pointer"
        onClick={() => setIsFoldersExpanded(!isFoldersExpanded)}
      >
        <Folder className="h-4 w-4 mr-2 text-accent-primary" />
        <span>Folders</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto h-5 w-5 p-0"
          onClick={(e) => {
            e.stopPropagation();
            setIsFoldersExpanded(!isFoldersExpanded);
          }}
        >
          {isFoldersExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      {isFoldersExpanded && (
        <>
          {folders.length === 0 && (
            <p className="text-xs text-muted-foreground px-4 py-2">No folders yet</p>
          )}
          {folders.map((folderName) => (
            <div key={folderName} className="ml-2 mt-1">
              <div className="flex items-center px-2 py-1 text-sm font-medium">
                <Folder className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span className="truncate">{folderName}</span>
              </div>
              <div className="space-y-1 ml-4">
                {chats
                  .filter(chat => chat.folder === folderName)
                  .sort((a, b) => b.updatedAt - a.updatedAt)
                  .map(chat => (
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
                      onPin={() => pinChat(chat.id)}
                      folders={folders}
                      inFolder={true}
                    />
                  ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
