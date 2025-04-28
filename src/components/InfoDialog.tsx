import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { KEYBOARD_SHORTCUTS } from "@/hooks/useHotkeys";
import { Github, Instagram, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export const InfoDialog = ({
  open,
  onOpenChange,
  className,
}: InfoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "sm:max-w-[600px] max-h-[85vh] overflow-y-auto",
          className
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">About Mimir</DialogTitle>
          <DialogDescription>Your AI-powered chat assistant</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <section>
            <h3 className="text-lg font-semibold mb-2">Introduction</h3>
            <p className="text-muted-foreground">
              Mimir is an AI chat application that allows you to interact with
              various AI models. It supports both text and image inputs, and
              provides a seamless experience for organizing and managing your
              chat conversations.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Features</h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>
                Support for various AI models through Gemini and OpenRouter APIs
              </li>
              <li>Chat organization with folders and pinning</li>
              <li>File attachments for compatible models</li>
              <li>
                Multiple themes including Catppuccin, Tokyo Night, Nord, and
                more
              </li>
              <li>Keyboard shortcuts for improved productivity</li>
              <li>Chat search functionality</li>
              <li>Chronological organization of chats</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Using Models</h3>
            <p className="text-muted-foreground mb-2">
              Mimir supports various models with different capabilities:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>
                <span className="font-medium">Gemini Models:</span> Google's AI
                models with strong reasoning capabilities
              </li>
              <li>
                <span className="font-medium">OpenRouter Models:</span> Access
                to models like Claude, GPT-4, and more
              </li>
              <li>
                <span className="font-medium">Image Support:</span> Models like
                GPT-4V and Gemini Pro Vision can process images
              </li>
            </ul>
            <p className="mt-2 text-muted-foreground">
              To use these models, you'll need to add your API keys in the
              Settings menu.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Chat Organization</h3>
            <p className="text-muted-foreground mb-2">
              You can organize your chats in several ways:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>
                <span className="font-medium">Folders:</span> Create folders to
                group related chats
              </li>
              <li>
                <span className="font-medium">Pinning:</span> Pin important
                chats for quick access
              </li>
              <li>
                <span className="font-medium">Rename:</span> Double-click on a
                chat name to rename it
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Keyboard Shortcuts</h3>
            <div className="border rounded-md">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Action</th>
                    <th className="text-right p-2">Shortcut</th>
                  </tr>
                </thead>
                <tbody>
                  {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
                    <tr
                      key={index}
                      className={
                        index < KEYBOARD_SHORTCUTS.length - 1 ? "border-b" : ""
                      }
                    >
                      <td className="p-2 text-muted-foreground">
                        {shortcut.description}
                      </td>
                      <td className="p-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {shortcut.keys.map((key, keyIndex) => (
                            <React.Fragment key={keyIndex}>
                              <kbd className="bg-muted px-2 py-0.5 text-xs rounded font-mono">
                                {key}
                              </kbd>
                              {keyIndex < shortcut.keys.length - 1 && (
                                <span>+</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">About the Creator</h3>
            <p className="text-muted-foreground">
              Developed by Sahil Rana, a frontend developer passionate about
              design and user experience.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Privacy Policy</h3>
            <p className="text-muted-foreground">
              No data is stored on servers. API keys are hashed and stored in
              local storage only. There is no data collection or tracking. This
              is a client-side only application with no backend servers.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Contact</h3>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/_sahiilrana"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Instagram className="h-4 w-4" />
                <span>_sahiilrana</span>
              </a>
              <a
                href="mailto:developer.sahilrana@gmail.com"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                <span>developer.sahilrana@gmail.com</span>
              </a>
            </div>
          </section>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
