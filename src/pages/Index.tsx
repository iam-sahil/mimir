
import React, { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatProvider } from "@/contexts/ChatContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { BackgroundGradient } from "@/components/BackgroundGradient";

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "lg:ml-[300px]" : ""}`}>
              <ChatContainer onSidebarToggle={toggleSidebar} />
            </main>
          </div>
        </ChatProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
};

export default Index;
