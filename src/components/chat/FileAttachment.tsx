
import React from "react";
import { Button } from "@/components/ui/button";
import { FileImage, FileText, File, X } from "lucide-react";

interface FileAttachmentProps {
  file: File;
  onRemove: () => void;
}

const getFileIcon = (file: File) => {
  if (file.type.startsWith('image/')) {
    return <FileImage className="h-4 w-4" />;
  } else if (file.type === 'application/pdf') {
    return <FileText className="h-4 w-4" />;
  } else {
    return <File className="h-4 w-4" />;
  }
};

export const FileAttachment = ({ file, onRemove }: FileAttachmentProps) => {
  return (
    <div className="relative rounded-md border border-white/10 bg-background/30 p-2 flex items-center gap-2">
      {file.type.startsWith('image/') ? (
        <div className="w-10 h-10 relative">
          <img 
            src={URL.createObjectURL(file)} 
            alt={file.name}
            className="w-full h-full object-cover rounded"
          />
        </div>
      ) : (
        <div className="w-10 h-10 flex items-center justify-center bg-secondary/30 rounded">
          {getFileIcon(file)}
          <span className="text-xs ml-1">.{file.name.split('.').pop()}</span>
        </div>
      )}
      <span className="text-xs truncate max-w-[100px]">{file.name}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-5 w-5 absolute top-1 right-1 p-0.5 bg-background/50 rounded-full"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
