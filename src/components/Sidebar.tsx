
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronUp, Folder, Pin, PanelRight, Brain } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { SidebarChatItem } from "./SidebarChatItem";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { toast } from "sonner";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarPinnedChats } from "./SidebarPinnedChats";
import { SidebarFolders } from "./SidebarFolders";
import { SidebarTimeGroups } from "./SidebarTimeGroups";
import { SidebarSearchResults } from "./SidebarSearchResults";
import { SidebarFooter } from "./SidebarFooter";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { chats, createNewChat, currentChat, deleteChat, selectChat } = useChat();
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleSearchFocus = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (isMobile && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const folders = Array.from(new Set(chats.filter(chat => chat.folder).map(chat => chat.folder))) as string[];
  
  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteChat = (chatId: string) => {
    setChatToDelete(chatId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (chatToDelete) {
      deleteChat(chatToDelete);
      toast("Chat deleted successfully");
      setIsDeleteDialogOpen(false);
      setChatToDelete(null);
    }
  };

  return (
    <>
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={handleOverlayClick}
        ></div>
      )}
      
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[300px] flex flex-col transition-transform duration-300 ease-in-out overflow-hidden sidebar-transition",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <SidebarHeader onClose={onClose} />

        {/* New Chat and Search */}
        <div className="p-4 space-y-4">
          <Button 
            className="w-full justify-center new-chat-button text-background font-medium"
            onClick={() => {
              createNewChat();
              if (isMobile) onClose();
            }}
          >
            <span className="mr-2 text-lg">+</span> New Chat
          </Button>
          
          <div className="flex items-center space-x-2 py-2" onClick={handleSearchFocus}>
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-sm"
              ref={searchInputRef}
            />
          </div>
        </div>

        {/* Main sidebar content */}
        <div className="flex-1 overflow-y-auto px-2 overflow-x-hidden">
          {/* Pinned chats section */}
          <SidebarPinnedChats 
            currentChatId={currentChat?.id}
            onSelectChat={selectChat}
            onDeleteChat={handleDeleteChat}
            closeSidebar={isMobile ? onClose : undefined}
          />

          {/* Folders section */}
          <SidebarFolders
            currentChatId={currentChat?.id}
            onSelectChat={selectChat}
            onDeleteChat={handleDeleteChat}
            folders={folders}
            closeSidebar={isMobile ? onClose : undefined}
          />

          {/* Time-based chat groups */}
          <SidebarTimeGroups 
            currentChatId={currentChat?.id}
            onSelectChat={selectChat}
            onDeleteChat={handleDeleteChat}
            closeSidebar={isMobile ? onClose : undefined}
          />

          {/* Search results */}
          {searchQuery && (
            <SidebarSearchResults
              searchQuery={searchQuery}
              filteredChats={filteredChats}
              currentChatId={currentChat?.id}
              onSelectChat={(id) => {
                selectChat(id);
                setSearchQuery("");
                if (isMobile) onClose();
              }}
              onDeleteChat={handleDeleteChat}
            />
          )}
        </div>

        {/* Sidebar footer */}
        <SidebarFooter />
      </aside>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chat? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
