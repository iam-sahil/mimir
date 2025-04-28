import React, { useState, useRef, useEffect } from "react";
import { X, Folder, MessageSquare, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Chat } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "./ui/input";
interface SidebarChatItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
  onAddToFolder: (folder: string) => void;
  onPin: () => void;
  folders: string[];
  inFolder?: boolean;
}
export const SidebarChatItem = ({
  chat,
  isActive,
  onSelect,
  onDelete,
  onRename,
  onAddToFolder,
  onPin,
  folders,
  inFolder = false
}: SidebarChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(chat.title);
  const [newFolderName, setNewFolderName] = useState("");
  const [showFolderInput, setShowFolderInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleDoubleClick = () => {
    setIsEditing(true);
    setNewTitle(chat.title);
  };
  const handleRename = () => {
    if (newTitle.trim()) {
      onRename(newTitle);
      setIsEditing(false);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  return <div className={cn("flex items-center justify-between rounded-md px-2.5 py-2.5 text-sm transition-colors hover:bg-accent/10 hover:text-accent-foreground cursor-pointer group relative", isActive && "bg-accent/20 text-accent-foreground")}>
      <div className="flex flex-1 items-center gap-2 truncate" onClick={onSelect} onDoubleClick={handleDoubleClick}>
        <MessageSquare className="h-4 w-4 shrink-0" />
        
        {isEditing ? <Input ref={inputRef} autoFocus value={newTitle} onChange={e => setNewTitle(e.target.value)} onBlur={handleRename} onKeyDown={handleKeyDown} onClick={e => e.stopPropagation()} className="h-6 p-1 text-sm bg-background text-foreground" /> : <span className="truncate flex-1">{chat.title}</span>}
      </div>
      
      <div className="absolute right-2 flex opacity-0 group-hover:opacity-100 transition-opacity bg-accent/30 backdrop-blur rounded-md shadow-lg px-[4px] py-px">
        {!inFolder && <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                <Folder className="h-3.5 w-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="space-y-2">
                <p className="text-xs font-medium">Add to folder:</p>
                
                {folders.map(folder => <Button key={folder} variant="ghost" size="sm" className="w-full justify-start text-left text-xs h-7" onClick={() => onAddToFolder(folder)}>
                    <Folder className="h-3 w-3 mr-2" />
                    {folder}
                  </Button>)}
                
                {showFolderInput ? <div className="flex gap-1">
                    <Input value={newFolderName} onChange={e => setNewFolderName(e.target.value)} placeholder="New folder" className="h-7 text-xs" autoFocus onKeyDown={e => {
                if (e.key === "Enter" && newFolderName.trim()) {
                  onAddToFolder(newFolderName);
                  setNewFolderName("");
                  setShowFolderInput(false);
                } else if (e.key === "Escape") {
                  setShowFolderInput(false);
                }
              }} />
                  </div> : <Button variant="outline" size="sm" className="w-full text-xs h-7" onClick={() => setShowFolderInput(true)}>
                    + New Folder
                  </Button>}
              </div>
            </PopoverContent>
          </Popover>}
        
        <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={e => {
        e.stopPropagation();
        onPin();
      }}>
          <Pin className={cn("h-3.5 w-3.5", chat.isPinned && "fill-accent-primary")} />
        </Button>
        
        <Button variant="ghost" size="icon" className="h-6 w-6 p-0 hover:text-destructive" onClick={e => {
        e.stopPropagation();
        onDelete();
      }}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>;
};