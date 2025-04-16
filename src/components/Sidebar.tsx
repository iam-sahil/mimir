
import React from "react";
import { PlusCircle, Sidebar as SidebarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarChatItem } from "@/components/SidebarChatItem";
import { useChat } from "@/contexts/ChatContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { chats, currentChat, createNewChat, selectChat, renameChat, deleteChat } = useChat();

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-[300px] border-r bg-background transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-[300px]"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <h2 className="text-lg font-semibold">Mimir</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-4">
          <Button
            onClick={() => createNewChat()}
            className="w-full justify-start gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            New Chat
          </Button>
        </div>
        <ScrollArea className="flex-1 px-3">
          {chats.length > 0 ? (
            <div className="space-y-1 pb-4">
              {chats.map((chat) => (
                <SidebarChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={currentChat?.id === chat.id}
                  onSelect={() => selectChat(chat.id)}
                  onDelete={() => deleteChat(chat.id)}
                  onRename={(title) => renameChat(chat.id, title)}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-20 text-muted-foreground">
              No chats yet
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
