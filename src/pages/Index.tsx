
import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatProvider } from "@/contexts/ChatContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { BackgroundGradient } from "@/components/BackgroundGradient";
import { cn } from "@/lib/utils";

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
              "flex-1 transition-none",
              isMobile ? "w-full" : "ml-0"
            )}>
              <ChatContainer onSidebarToggle={toggleSidebar} />
            </main>
          </div>
        </ChatProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
};

export default Index;
