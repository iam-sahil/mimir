
import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatProvider } from "@/contexts/ChatContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { BackgroundGradient } from "@/components/BackgroundGradient";
import { cn } from "@/lib/utils";
import { Menu, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "@/contexts/ChatContext";

const CollapsedSidebarButtons = () => {
  const { createNewChat } = useChat();

  return (
    <div className="fixed left-4 top-4 z-40 flex flex-col space-y-2">
      <Button variant="secondary" size="icon" className="rounded-full shadow-md glass-effect">
        <Menu className="h-5 w-5" />
      </Button>
      <Button variant="secondary" size="icon" className="rounded-full shadow-md glass-effect" onClick={() => createNewChat()}>
        <Plus className="h-5 w-5" />
      </Button>
      <Button variant="secondary" size="icon" className="rounded-full shadow-md glass-effect">
        <Search className="h-5 w-5" />
      </Button>
    </div>
  );
};

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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
          <div className="flex h-screen bg-background text-foreground">
            <BackgroundGradient />
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
            
            <main className={cn(
              "flex-1 transition-all duration-300 w-full relative",
              isMobile ? "" : (isSidebarOpen ? "lg:ml-[300px]" : "lg:ml-0")
            )}>
              {!isSidebarOpen && <CollapsedSidebarButtons />}
              <ChatContainer onSidebarToggle={toggleSidebar} />
            </main>
          </div>
        </ChatProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
};

export default Index;
