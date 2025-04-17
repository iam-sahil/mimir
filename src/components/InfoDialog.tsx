
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InfoDialog = ({ open, onOpenChange }: InfoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-space-grotesk">Mimir AI Assistant</DialogTitle>
          <DialogDescription>
            Your intelligent companion for knowledge and conversation
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="keyboard">Keyboard</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[60vh]">
            <TabsContent value="about" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Welcome to Mimir</h3>
                <p className="text-sm text-muted-foreground">
                  Mimir is an advanced AI assistant designed to help you with information, creative tasks, 
                  problem-solving, and more. Named after the Norse god of wisdom, Mimir aims to provide 
                  thoughtful and useful responses to all your questions.
                </p>
                
                <h3 className="text-lg font-semibold mt-4">About the Creator</h3>
                <p className="text-sm text-muted-foreground">
                  Mimir was created by Sahil Rana, a Frontend developer with a passion for design and 
                  user experience. The goal was to create an AI assistant that combines powerful 
                  capabilities with an intuitive, beautiful interface.
                </p>
                
                <h3 className="text-lg font-semibold mt-4">Get Started</h3>
                <p className="text-sm text-muted-foreground">
                  To begin, simply type a message in the input field at the bottom of the screen. Mimir will 
                  respond with helpful information, insights, or creative content based on your request. You can 
                  ask questions, seek advice, or engage in conversation on virtually any topic.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Chat Organization</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>Create new chats for different topics or projects</li>
                  <li>Rename chats by double-clicking on their names</li>
                  <li>Pin important chats for quick access</li>
                  <li>Organize chats in folders for better management</li>
                  <li>Search through your chats to find past conversations</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-4">AI Models</h3>
                <p className="text-sm text-muted-foreground">
                  Mimir features advanced AI models that provide different capabilities:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li><strong>Gemini 2.0 Flash</strong>: Quick responses, ideal for simpler queries</li>
                  <li><strong>Gemini 2.5 Pro Experimental</strong>: More advanced understanding and reasoning for complex topics</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-4">Themes and Customization</h3>
                <p className="text-sm text-muted-foreground">
                  Personalize your experience with multiple theme options, accessible through the theme selector in the top-right corner.
                </p>
                
                <h3 className="text-lg font-semibold mt-4">User Interface</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>Collapsible sidebar for more screen space</li>
                  <li>Glass-effect design elements for a modern look</li>
                  <li>Keyboard shortcuts for increased productivity</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="keyboard" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="border rounded-md p-2">
                    <span className="font-medium">Ctrl + S</span>
                    <p className="text-muted-foreground">Toggle sidebar</p>
                  </div>
                  <div className="border rounded-md p-2">
                    <span className="font-medium">Ctrl + K</span>
                    <p className="text-muted-foreground">Focus on message input</p>
                  </div>
                  <div className="border rounded-md p-2">
                    <span className="font-medium">Ctrl + R</span>
                    <p className="text-muted-foreground">Rename current chat</p>
                  </div>
                  <div className="border rounded-md p-2">
                    <span className="font-medium">Escape</span>
                    <p className="text-muted-foreground">Cancel current action</p>
                  </div>
                  <div className="border rounded-md p-2">
                    <span className="font-medium">Enter</span>
                    <p className="text-muted-foreground">Send message (if input is focused)</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Privacy Policy</h3>
                <p className="text-sm text-muted-foreground">
                  At Mimir, we take your privacy seriously. Here's how we handle your data:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                  <li>
                    <strong>No Data Storage on Servers</strong>: We do not store your conversations on any servers. 
                    All chat history is kept locally in your browser's storage.
                  </li>
                  <li>
                    <strong>API Keys</strong>: Your API keys are encrypted and stored only in your local storage. 
                    We never transmit your keys to our servers.
                  </li>
                  <li>
                    <strong>No Tracking</strong>: We do not use cookies or tracking technologies to monitor your activity.
                  </li>
                  <li>
                    <strong>Direct API Communication</strong>: When you send messages, they are sent directly from your 
                    browser to the respective AI service (Gemini) using your API key. We act only as a middleware.
                  </li>
                  <li>
                    <strong>Local Storage Only</strong>: All settings, preferences, chat history, and folders are 
                    stored exclusively in your browser's local storage.
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  By using Mimir, you can be confident that your conversations remain private and secure. We've built 
                  this application with privacy as a core principle.
                </p>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
