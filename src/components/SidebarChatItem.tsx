
import React from "react";
import { MoreHorizontal, Trash, Edit, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Chat } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface SidebarChatItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
}

export const SidebarChatItem = ({
  chat,
  isActive,
  onSelect,
  onDelete,
  onRename,
}: SidebarChatItemProps) => {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState(chat.title);

  const handleRename = () => {
    if (newTitle.trim()) {
      onRename(newTitle);
      setIsRenameDialogOpen(false);
    }
  };

  const formattedDate = new Date(chat.updatedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between rounded-md px-2.5 py-2.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer group",
          isActive && "bg-accent text-accent-foreground"
        )}
      >
        <div className="flex flex-1 items-center gap-2" onClick={onSelect}>
          <MessageSquare className="h-4 w-4" />
          <span className="truncate flex-1">{chat.title}</span>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setIsRenameDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              <span>Rename</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="flex items-center gap-2 text-destructive focus:text-destructive"
            >
              <Trash className="h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename chat</DialogTitle>
            <DialogDescription>
              Enter a new name for this chat
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Chat title"
            className="mt-4"
            autoFocus
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
