
import React from "react";
import { useChat } from "@/contexts/ChatContext";
import { SidebarChatItem } from "./SidebarChatItem";
import { isToday, isYesterday, subDays } from "date-fns";

interface SidebarTimeGroupsProps {
  currentChatId?: string;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  closeSidebar?: () => void;
}

export const SidebarTimeGroups = ({ 
  currentChatId, 
  onSelectChat, 
  onDeleteChat,
  closeSidebar 
}: SidebarTimeGroupsProps) => {
  const { chats, renameChat, addChatToFolder, pinChat, unpinChat } = useChat();
  const folders = Array.from(new Set(chats.filter(chat => chat.folder).map(chat => chat.folder))) as string[];
  
  const now = new Date();
  
  const todayChats = chats.filter(chat => 
    isToday(new Date(chat.updatedAt)) && !chat.isPinned && !chat.folder
  );
  
  const yesterdayChats = chats.filter(chat => 
    isYesterday(new Date(chat.updatedAt)) && !chat.isPinned && !chat.folder
  );
  
  const olderChats = chats.filter(chat => 
    !isToday(new Date(chat.updatedAt)) && 
    !isYesterday(new Date(chat.updatedAt)) && 
    !chat.isPinned && 
    !chat.folder
  );
  
  return (
    <>
      {/* Today Section */}
      {todayChats.length > 0 && (
        <div className="mb-2">
          <div className="flex items-center px-2 py-1.5 text-sm font-medium">
            <span className="text-primary">Today</span>
          </div>
          
          <div className="space-y-1 mt-1">
            {todayChats
              .sort((a, b) => b.updatedAt - a.updatedAt)
              .map((chat) => (
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
                />
              ))}
          </div>
        </div>
      )}

      {/* Yesterday Section */}
      {yesterdayChats.length > 0 && (
        <div className="mb-2">
          <div className="flex items-center px-2 py-1.5 text-sm font-medium">
            <span className="text-primary">Yesterday</span>
          </div>
          
          <div className="space-y-1 mt-1">
            {yesterdayChats
              .sort((a, b) => b.updatedAt - a.updatedAt)
              .map((chat) => (
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
                />
              ))}
          </div>
        </div>
      )}

      {/* Older Section */}
      {olderChats.length > 0 && (
        <div className="mb-2">
          <div className="flex items-center px-2 py-1.5 text-sm font-medium">
            <span className="text-primary">Older</span>
          </div>
          
          <div className="space-y-1 mt-1">
            {olderChats
              .sort((a, b) => b.updatedAt - a.updatedAt)
              .map((chat) => (
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
                />
              ))}
          </div>
        </div>
      )}
    </>
  );
};
