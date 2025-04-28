import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, ChevronDown, ChevronUp, Folder, Pin, PanelLeft, X, Brain, MessageSquarePlus } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { SidebarChatItem } from "./SidebarChatItem";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { format, isToday, isYesterday, isAfter, subDays } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { chats, createNewChat, currentChat, deleteChat, renameChat, selectChat, addChatToFolder, pinChat, unpinChat } = useChat();
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [isFoldersExpanded, setIsFoldersExpanded] = useState(true);
  const [isPinnedExpanded, setIsPinnedExpanded] = useState(true);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { currentTheme } = useTheme();
  
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

  const pinnedChats = chats.filter(chat => chat.isPinned);
  const folderedChats = chats.filter(chat => chat.folder && !chat.isPinned);
  
  const now = new Date();
  const yesterdayDate = subDays(now, 1);
  
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
          "fixed top-0 left-0 z-50 h-full w-[285px] flex flex-col transition-all duration-500 ease-in-out overflow-hidden",
          "bg-sidebar shadow-[4px_0_24px_rgba(0,0,0,0.12)]",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="relative flex flex-col items-center justify-center p-4 border-b border-border/10">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-4 top-1/2 -translate-y-1/2 h-8 w-8" 
            onClick={onClose}
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2 text-xl font-space-grotesk font-semibold text-sidebar-foreground">
            <Brain className="h-6 w-6 text-primary" />
            <h1 className="text-primary">Mimir</h1>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <Button 
            className="w-full justify-center font-plus-jakarta text-sidebar-foreground shadow-md skeuomorphic-button"
            onClick={() => {
              createNewChat();
              if (isMobile) onClose();
            }}
          >
            <MessageSquarePlus className="mr-2 h-4 w-4" /> New Chat
          </Button>
          
          <div 
            className="relative border-b border-sidebar-border/30 focus-within:border-primary"
            onClick={handleSearchFocus}
          >
            <Search className="absolute left-0 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your chats..."
              className="pl-7 border-none focus-visible:ring-0 bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              ref={searchInputRef}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-8 rounded-l-none"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 overflow-x-hidden">
          <div className="mb-2">
            <div 
              className="flex items-center px-2 py-1.5 text-sm font-medium text-sidebar-foreground cursor-pointer"
              onClick={() => setIsPinnedExpanded(!isPinnedExpanded)}
            >
              <Pin className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sidebar-foreground">Pinned Chats</span>
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
                    isActive={currentChat?.id === chat.id}
                    onSelect={() => selectChat(chat.id)}
                    onDelete={() => handleDeleteChat(chat.id)}
                    onRename={(newTitle) => renameChat(chat.id, newTitle)}
                    onAddToFolder={(folder) => addChatToFolder(chat.id, folder)}
                    onPin={() => unpinChat(chat.id)}
                    folders={folders}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mb-2">
            <div 
              className="flex items-center px-2 py-1.5 text-sm font-medium text-sidebar-foreground cursor-pointer"
              onClick={() => setIsFoldersExpanded(!isFoldersExpanded)}
            >
              <Folder className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sidebar-foreground">Folders</span>
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
                  <Collapsible key={folderName}>
                    <div className="ml-2 mt-1">
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center px-2 py-1 text-sm font-medium hover:bg-accent/10 rounded-md">
                          <Folder className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          <span className="truncate text-sidebar-foreground">{folderName}</span>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="space-y-1 ml-4">
                          {chats
                            .filter(chat => chat.folder === folderName)
                            .sort((a, b) => b.updatedAt - a.updatedAt)
                            .map(chat => (
                              <SidebarChatItem 
                                key={chat.id} 
                                chat={chat} 
                                isActive={currentChat?.id === chat.id}
                                onSelect={() => selectChat(chat.id)}
                                onDelete={() => handleDeleteChat(chat.id)}
                                onRename={(newTitle) => renameChat(chat.id, newTitle)}
                                onAddToFolder={(folder) => addChatToFolder(chat.id, folder)}
                                onPin={() => pinChat(chat.id)}
                                folders={folders}
                                inFolder={true}
                              />
                            ))}
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </>
            )}
          </div>

          {todayChats.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center px-2 py-1.5 text-sm font-medium text-sidebar-foreground">
                <span className="text-primary">Today</span>
              </div>
              
              <div className="space-y-1 mt-1">
                {todayChats
                  .sort((a, b) => b.updatedAt - a.updatedAt)
                  .map((chat) => (
                    <SidebarChatItem 
                      key={chat.id} 
                      chat={chat} 
                      isActive={currentChat?.id === chat.id}
                      onSelect={() => selectChat(chat.id)}
                      onDelete={() => handleDeleteChat(chat.id)}
                      onRename={(newTitle) => renameChat(chat.id, newTitle)}
                      onAddToFolder={(folder) => addChatToFolder(chat.id, folder)}
                      onPin={() => pinChat(chat.id)}
                      folders={folders}
                    />
                  ))}
              </div>
            </div>
          )}

          {yesterdayChats.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center px-2 py-1.5 text-sm font-medium text-sidebar-foreground">
                <span className="text-primary">Yesterday</span>
              </div>
              
              <div className="space-y-1 mt-1">
                {yesterdayChats
                  .sort((a, b) => b.updatedAt - a.updatedAt)
                  .map((chat) => (
                    <SidebarChatItem 
                      key={chat.id} 
                      chat={chat} 
                      isActive={currentChat?.id === chat.id}
                      onSelect={() => selectChat(chat.id)}
                      onDelete={() => handleDeleteChat(chat.id)}
                      onRename={(newTitle) => renameChat(chat.id, newTitle)}
                      onAddToFolder={(folder) => addChatToFolder(chat.id, folder)}
                      onPin={() => pinChat(chat.id)}
                      folders={folders}
                    />
                  ))}
              </div>
            </div>
          )}

          {olderChats.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center px-2 py-1.5 text-sm font-medium text-sidebar-foreground">
                <span className="text-primary">Older</span>
              </div>
              
              <div className="space-y-1 mt-1">
                {olderChats
                  .sort((a, b) => b.updatedAt - a.updatedAt)
                  .map((chat) => (
                    <SidebarChatItem 
                      key={chat.id} 
                      chat={chat} 
                      isActive={currentChat?.id === chat.id}
                      onSelect={() => selectChat(chat.id)}
                      onDelete={() => handleDeleteChat(chat.id)}
                      onRename={(newTitle) => renameChat(chat.id, newTitle)}
                      onAddToFolder={(folder) => addChatToFolder(chat.id, folder)}
                      onPin={() => pinChat(chat.id)}
                      folders={folders}
                    />
                  ))}
              </div>
            </div>
          )}

          {searchQuery && (
            <div className="mt-4">
              <h3 className="text-sm font-medium px-2 py-1 text-sidebar-foreground">Search Results</h3>
              <div className="space-y-1 mt-2">
                {filteredChats.length > 0 ? 
                  filteredChats.map((chat) => (
                    <SidebarChatItem 
                      key={chat.id} 
                      chat={chat} 
                      isActive={currentChat?.id === chat.id}
                      onSelect={() => {
                        selectChat(chat.id);
                        setSearchQuery("");
                      }}
                      onDelete={() => handleDeleteChat(chat.id)}
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
          )}
        </div>

        <div className="p-4 mt-auto">
          <div className="flex items-center justify-center">
            <span className="text-sm text-muted-foreground font-plus-jakarta">Ask Mimir, Know More.</span>
          </div>
        </div>
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

      <Dialog open={isFolderDialogOpen} onOpenChange={setIsFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            className="mt-4"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsFolderDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (newFolderName.trim()) {
                  toast("Folder created");
                  setIsFolderDialogOpen(false);
                  setNewFolderName("");
                }
              }}
            >
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
