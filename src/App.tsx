import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { SettingsProvider } from "./contexts/SettingsContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ChatProvider } from "./contexts/ChatContext";
import { BackgroundBlobs } from "./components/BackgroundBlobs";

const queryClient = new QueryClient();

const App: React.FC = () => {
  // Apply default font on app load
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--font-sans",
      "'Plus Jakarta Sans', sans-serif"
    );
    document.documentElement.style.setProperty(
      "--font-mono",
      "'Source Code Pro', monospace"
    );
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <ThemeProvider>
          <BackgroundBlobs />
          <TooltipProvider>
            <ChatProvider>
              <div className="relative min-h-screen w-full">
                <Routes>
                  <Route path="/" element={<Index />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
                <Sonner />
              </div>
            </ChatProvider>
          </TooltipProvider>
        </ThemeProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
};

export default App;
