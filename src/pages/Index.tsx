
import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatContainer } from "@/components/ChatContainer";
import { useChat } from "@/contexts/ChatContext";
import { BackgroundGradient } from "@/components/BackgroundGradient";
import { cn } from "@/lib/utils";
import { PanelRight, Plus, Search, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoDialog } from "@/components/InfoDialog";
import { SearchModal } from "@/components/SearchModal";
import { useHotkeys } from "@/hooks/useHotkeys";

const CollapsedSidebarButtons = ({ onToggleSidebar, onNewChat, onOpenSearch, onInfoClick }: { 
  onToggleSidebar: () => void;
  onNewChat: () => void;
  onOpenSearch: () => void;
  onInfoClick: () => void;
}) => {
  return (
    <div className="fixed left-4 top-4 z-40 flex flex-row space-x-2">
      <div className="glass-effect rounded-lg p-1.5 shadow-sm">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggleSidebar}>
          <PanelRight className="h-5 w-5" />
        </Button>
      </div>
      <div className="glass-effect rounded-lg p-1.5 shadow-sm">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNewChat}>
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      <div className="glass-effect rounded-lg p-1.5 shadow-sm">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onOpenSearch}>
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { createNewChat } = useChat();

  // Register keyboard shortcuts
  useHotkeys([
    { 
      keys: ["Control", "b"], 
      callback: () => setIsSidebarOpen(prev => !prev),
      description: "Toggle sidebar" 
    },
    { 
      keys: ["Control", "k"], 
      callback: () => {
        // Focus message input or open search modal
        if (!isSidebarOpen || isMobile) {
          setIsSearchModalOpen(true);
        } else {
          // Focus message input
          const messageInput = document.querySelector('textarea[placeholder="Message Mimir..."]');
          if (messageInput) {
            (messageInput as HTMLTextAreaElement).focus();
          }
        }
      },
      description: "Focus message input or open search" 
    },
    { 
      keys: ["Control", "Shift", "o"], 
      callback: () => createNewChat(),
      description: "Create new chat" 
    },
    {
      keys: ["Control", "Shift", "a"],
      callback: () => {
        // This will be handled by the MessageInput component
      },
      description: "Attach files"
    }
  ]);

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-background text-foreground font-space-grotesk">
      <BackgroundGradient />
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      
      <main className={cn(
        "flex-1 transition-all duration-300 w-full relative",
        isSidebarOpen ? "lg:ml-[300px]" : "lg:ml-0"
      )}>
        {!isSidebarOpen && (
          <CollapsedSidebarButtons 
            onToggleSidebar={toggleSidebar}
            onNewChat={createNewChat}
            onOpenSearch={() => {
              setIsSearchModalOpen(true);
            }}
            onInfoClick={() => setIsInfoOpen(true)}
          />
        )}
        <ChatContainer 
          onSidebarToggle={toggleSidebar}
          onInfoClick={() => setIsInfoOpen(true)}
          sidebarOpen={isSidebarOpen}
        />
      </main>
      
      <InfoDialog open={isInfoOpen} onOpenChange={setIsInfoOpen} />
      <SearchModal open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen} />
    </div>
  );
};

export default Index;
