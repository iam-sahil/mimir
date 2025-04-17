
import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatProvider } from "@/contexts/ChatContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { BackgroundGradient } from "@/components/BackgroundGradient";
import { cn } from "@/lib/utils";
import { Menu, Plus, Search, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "@/contexts/ChatContext";
import { InfoDialog } from "@/components/InfoDialog";
import { useHotkeys } from "@/hooks/useHotkeys";

const CollapsedSidebarButtons = ({ onToggleSidebar, onNewChat, onOpenSearch, onInfoClick }: { 
  onToggleSidebar: () => void;
  onNewChat: () => void;
  onOpenSearch: () => void;
  onInfoClick: () => void;
}) => {
  return (
    <div className="fixed left-4 top-4 z-40 flex flex-col space-y-2">
      <Button variant="secondary" size="icon" className="rounded-full shadow-md glass-effect" onClick={onToggleSidebar}>
        <Menu className="h-5 w-5" />
      </Button>
      <Button variant="secondary" size="icon" className="rounded-full shadow-md glass-effect" onClick={onNewChat}>
        <Plus className="h-5 w-5" />
      </Button>
      <Button variant="secondary" size="icon" className="rounded-full shadow-md glass-effect" onClick={onOpenSearch}>
        <Search className="h-5 w-5" />
      </Button>
    </div>
  );
};

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const { createNewChat } = useChat();

  // Register keyboard shortcuts
  useHotkeys([
    { 
      keys: ["Control", "s"], 
      callback: () => setIsSidebarOpen(prev => !prev),
      description: "Toggle sidebar" 
    },
    { 
      keys: ["Control", "k"], 
      callback: () => {
        // Focus message input
        const messageInput = document.querySelector('textarea[placeholder="Message Mimir..."]');
        if (messageInput) {
          (messageInput as HTMLTextAreaElement).focus();
        }
      },
      description: "Focus message input" 
    },
    { 
      keys: ["Control", "r"], 
      callback: () => {
        // Rename current chat
        // This is handled in ChatContainer
      },
      description: "Rename current chat" 
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
    <SettingsProvider>
      <ThemeProvider>
        <ChatProvider>
          <div className="flex h-screen bg-background text-foreground font-space-grotesk">
            <BackgroundGradient />
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
            
            <main className={cn(
              "flex-1 transition-all duration-300 w-full relative",
              isMobile ? "" : (isSidebarOpen ? "lg:ml-[300px]" : "lg:ml-0")
            )}>
              {!isSidebarOpen && (
                <CollapsedSidebarButtons 
                  onToggleSidebar={toggleSidebar}
                  onNewChat={createNewChat}
                  onOpenSearch={() => {
                    // Implement search functionality
                    toggleSidebar();
                  }}
                  onInfoClick={() => setIsInfoOpen(true)}
                />
              )}
              <ChatContainer 
                onSidebarToggle={toggleSidebar}
                onInfoClick={() => setIsInfoOpen(true)}
              />
            </main>
            
            <InfoDialog open={isInfoOpen} onOpenChange={setIsInfoOpen} />
          </div>
        </ChatProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
};

export default Index;
