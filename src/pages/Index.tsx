import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatContainer } from "@/components/ChatContainer";
import { useChat } from "@/contexts/ChatContext";
import { BackgroundGradient } from "@/components/BackgroundGradient";
import { cn } from "@/lib/utils";
import {
  MessageSquarePlus,
  Search,
  Info,
  Settings,
  PanelRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoDialog } from "@/components/InfoDialog";
import { SearchModal } from "@/components/SearchModal";
import { useHotkeys } from "@/hooks/useHotkeys";
import { useTheme } from "@/contexts/ThemeContext";
import { Theme } from "@/types";
import { BackgroundBlobs } from "@/components/BackgroundBlobs";
const CollapsedSidebarButtons = ({
  onToggleSidebar,
  onNewChat,
  onOpenSearch,
  onSettingsClick,
}: {
  onToggleSidebar: () => void;
  onNewChat: () => void;
  onOpenSearch: () => void;
  onSettingsClick: () => void;
}) => {
  return (
    <div className="fixed left-2 top-2 z-40 flex flex-row space-x-2">
      <div className="glass-effect rounded-lg p-1.5 shadow-md transition-transform duration-300 ease-in-out transform">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onToggleSidebar}
        >
          <PanelRight className="h-5 w-5" />
        </Button>
      </div>
      <div className="glass-effect rounded-lg p-1.5 shadow-md transition-transform duration-300 ease-in-out transform">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onNewChat}
        >
          <MessageSquarePlus className="h-5 w-5" />
        </Button>
      </div>
      <div className="glass-effect rounded-lg p-1.5 shadow-md transition-transform duration-300 ease-in-out transform">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onOpenSearch}
        >
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { createNewChat } = useChat();
  const { themes, setTheme, currentTheme } = useTheme();

  // Register keyboard shortcuts
  useHotkeys([
    {
      keys: ["Control", "b"],
      callback: () => setIsSidebarOpen((prev) => !prev),
      description: "Toggle sidebar",
    },
    {
      keys: ["Control", "k"],
      callback: () => {
        if (!isSidebarOpen || isMobile) {
          setIsSearchModalOpen(true);
        } else {
          const messageInput = document.querySelector(
            'textarea[placeholder="How can I help you today?"]'
          );
          if (messageInput) {
            (messageInput as HTMLTextAreaElement).focus();
          }
        }
      },
      description: "Focus message input or open search",
    },
    {
      keys: ["Control", "Shift", "o"],
      callback: () => createNewChat(),
      description: "Create new chat",
    },
    {
      keys: ["Control", "Shift", "/"],
      callback: () => {
        const themeKeys = Object.keys(themes);
        const currentIndex = themeKeys.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themeKeys.length;
        setTheme(themeKeys[nextIndex] as Theme);
      },
      description: "Cycle through themes",
    },
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
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  return (
    <div className="flex h-screen bg-background text-foreground font-space-grotesk overflow-hidden text-[14px]">
      <BackgroundBlobs />
      {/* Sidebar with proper layering */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-20 transition-all duration-500 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      </div>

      {/* Main Content Area */}
      <main
        className={cn(
          "flex-1 transition-all duration-500 ease-in-out relative w-full h-full",
          isSidebarOpen ? "lg:pl-[300px]" : "lg:pl-0"
        )}
      >
        {/* Overlay for mobile when sidebar is open */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-10"
            onClick={toggleSidebar}
          />
        )}

        {/* Collapsed sidebar buttons */}
        {!isSidebarOpen && (
          <CollapsedSidebarButtons
            onToggleSidebar={toggleSidebar}
            onNewChat={createNewChat}
            onOpenSearch={() => setIsSearchModalOpen(true)}
            onSettingsClick={() => setIsSettingsOpen(true)}
          />
        )}

        {/* Chat container */}
        <div className={cn("w-full h-full relative")}>
          <ChatContainer
            onSidebarToggle={toggleSidebar}
            onInfoClick={() => setIsInfoOpen(true)}
            onSettingsClick={() => setIsSettingsOpen(true)}
            sidebarOpen={isSidebarOpen}
          />
        </div>
      </main>

      <InfoDialog open={isInfoOpen} onOpenChange={setIsInfoOpen} />
      <SearchModal
        open={isSearchModalOpen}
        onOpenChange={setIsSearchModalOpen}
      />
    </div>
  );
};
export default Index;
