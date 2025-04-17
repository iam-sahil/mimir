
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Brain, Search, ChevronDown, ChevronUp, Folder, Pin, ChevronRight } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { SidebarChatItem } from "./SidebarChatItem";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "./ui/sonner";

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

  const pinnedChats = chats.filter(chat => chat.isPinned);
  const folderedChats = chats.filter(chat => chat.folder && !chat.isPinned);
  const unfolderedChats = chats.filter(chat => !chat.folder && !chat.isPinned);
  
  // Get unique folder names
  const folders = Array.from(new Set(chats.filter(chat => chat.folder).map(chat => chat.folder))) as string[];
  
  // Filter chats based on search query
  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          "fixed top-0 left-0 z-50 h-full w-[300px] bg-sidebar border-r border-border flex flex-col transition-transform duration-300 overflow-hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2 text-xl font-space-grotesk font-semibold text-sidebar-foreground">
            <Brain className="h-6 w-6" />
            <h1>Mimir</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={onClose}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-3">
          <Button 
            className="w-full justify-center font-space-grotesk glass-effect transition-all hover:shadow-lg"
            onClick={() => {
              createNewChat();
              if (isMobile) onClose();
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> New Chat
          </Button>
          
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 overflow-x-hidden">
          {/* Pinned chats section */}
          <div className="mb-2">
            <div 
              className="flex items-center px-2 py-1.5 text-sm font-medium text-sidebar-foreground cursor-pointer"
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
                    isActive={currentChat?.id === chat.id}
                    onSelect={() => selectChat(chat.id)}
                    onDelete={() => deleteChat(chat.id)}
                    onRename={(newTitle) => renameChat(chat.id, newTitle)}
                    onAddToFolder={(folder) => addChatToFolder(chat.id, folder)}
                    onPin={() => unpinChat(chat.id)}
                    folders={folders}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Folders section */}
          <div className="mb-2">
            <div 
              className="flex items-center px-2 py-1.5 text-sm font-medium text-sidebar-foreground cursor-pointer"
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
                        .map(chat => (
                          <SidebarChatItem 
                            key={chat.id} 
                            chat={chat} 
                            isActive={currentChat?.id === chat.id}
                            onSelect={() => selectChat(chat.id)}
                            onDelete={() => deleteChat(chat.id)}
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

          {/* Other chats */}
          <div className="space-y-1 mt-3">
            {searchQuery
              ? filteredChats
                .filter(chat => !chat.isPinned && !chat.folder)
                .map((chat) => (
                  <SidebarChatItem 
                    key={chat.id} 
                    chat={chat} 
                    isActive={currentChat?.id === chat.id}
                    onSelect={() => selectChat(chat.id)}
                    onDelete={() => deleteChat(chat.id)}
                    onRename={(newTitle) => renameChat(chat.id, newTitle)}
                    onAddToFolder={(folder) => addChatToFolder(chat.id, folder)}
                    onPin={() => pinChat(chat.id)}
                    folders={folders}
                  />
                ))
              : unfolderedChats.map((chat) => (
                  <SidebarChatItem 
                    key={chat.id} 
                    chat={chat} 
                    isActive={currentChat?.id === chat.id}
                    onSelect={() => selectChat(chat.id)}
                    onDelete={() => deleteChat(chat.id)}
                    onRename={(newTitle) => renameChat(chat.id, newTitle)}
                    onAddToFolder={(folder) => addChatToFolder(chat.id, folder)}
                    onPin={() => pinChat(chat.id)}
                    folders={folders}
                  />
                ))
            }
          </div>
        </div>

        <div className="p-4 border-t mt-auto">
          <div className="flex items-center justify-center">
            <span className="text-sm text-muted-foreground font-space-grotesk">Ask. Learn. Evolve.</span>
          </div>
        </div>
      </aside>

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
                  // Add logic to create folder
                  toast.success(`Folder "${newFolderName}" created`);
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
