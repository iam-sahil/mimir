
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, ChevronDown, ChevronUp, Folder, Pin, ChevronRight, X } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { SidebarChatItem } from "./SidebarChatItem";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "./ui/sonner";
import { format, isToday, isYesterday, isAfter, subDays } from "date-fns";

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
  const [isTodayExpanded, setIsTodayExpanded] = useState(true);
  const [isYesterdayExpanded, setIsYesterdayExpanded] = useState(true);
  const [isOlderExpanded, setIsOlderExpanded] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Detect mobile viewport
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Handle focus on search input when clicked
  const handleSearchFocus = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Handle click outside of sidebar on mobile
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (isMobile && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Filter and organize chats
  const pinnedChats = chats.filter(chat => chat.isPinned);
  const folderedChats = chats.filter(chat => chat.folder && !chat.isPinned);
  
  // Get chats for today, yesterday, and older, excluding pinned and foldered chats
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
  
  // Get unique folder names
  const folders = Array.from(new Set(chats.filter(chat => chat.folder).map(chat => chat.folder))) as string[];
  
  // Filter chats based on search query
  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle chat deletion with confirmation
  const handleDeleteChat = (chatId: string) => {
    if (confirm("Are you sure you want to delete this chat? This action cannot be undone.")) {
      deleteChat(chatId);
      toast({
        description: "Chat deleted successfully"
      });
    }
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
          "fixed top-0 left-0 z-50 h-full w-[300px] bg-sidebar border-r border-border flex flex-col transition-transform duration-300 overflow-hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2 text-xl font-space-grotesk font-semibold text-sidebar-foreground">
            <img src="/lovable-uploads/54258a59-772a-46bb-a45b-18bfcb06fb40.png" alt="Mimir Logo" className="h-6 w-6" />
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
            className="w-full justify-center font-space-grotesk glass-effect transition-all hover:shadow-lg bg-primary text-primary-foreground"
            onClick={() => {
              createNewChat();
              if (isMobile) onClose();
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> New Chat
          </Button>
          
          <div 
            className="relative rounded-md border border-border focus-within:ring-1 focus-within:ring-primary"
            onClick={handleSearchFocus}
          >
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your chats..."
              className="pl-8 border-none focus-visible:ring-0 bg-transparent"
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
          {/* Pinned chats section */}
          <div className="mb-2">
            <div 
              className="flex items-center px-2 py-1.5 text-sm font-medium text-primary cursor-pointer"
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

          {/* Folders section */}
          <div className="mb-2">
            <div 
              className="flex items-center px-2 py-1.5 text-sm font-medium text-primary cursor-pointer"
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
                        .sort((a, b) => b.updatedAt - a.updatedAt) // Show most recently accessed first
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
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Today section */}
          {todayChats.length > 0 && (
            <div className="mb-2">
              <div 
                className="flex items-center px-2 py-1.5 text-sm font-medium text-primary cursor-pointer"
                onClick={() => setIsTodayExpanded(!isTodayExpanded)}
              >
                <span>Today</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-auto h-5 w-5 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTodayExpanded(!isTodayExpanded);
                  }}
                >
                  {isTodayExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
              
              {isTodayExpanded && (
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
              )}
            </div>
          )}

          {/* Yesterday section */}
          {yesterdayChats.length > 0 && (
            <div className="mb-2">
              <div 
                className="flex items-center px-2 py-1.5 text-sm font-medium text-primary cursor-pointer"
                onClick={() => setIsYesterdayExpanded(!isYesterdayExpanded)}
              >
                <span>Yesterday</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-auto h-5 w-5 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsYesterdayExpanded(!isYesterdayExpanded);
                  }}
                >
                  {isYesterdayExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
              
              {isYesterdayExpanded && (
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
              )}
            </div>
          )}

          {/* Older section */}
          {olderChats.length > 0 && (
            <div className="mb-2">
              <div 
                className="flex items-center px-2 py-1.5 text-sm font-medium text-primary cursor-pointer"
                onClick={() => setIsOlderExpanded(!isOlderExpanded)}
              >
                <span>Older</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-auto h-5 w-5 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOlderExpanded(!isOlderExpanded);
                  }}
                >
                  {isOlderExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
              
              {isOlderExpanded && (
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
              )}
            </div>
          )}

          {/* If search is active, show filtered results */}
          {searchQuery && (
            <div className="mt-4">
              <h3 className="text-sm font-medium px-2 py-1">Search Results</h3>
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
                  toast({
                    description: `Folder "${newFolderName}" created`
                  });
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
