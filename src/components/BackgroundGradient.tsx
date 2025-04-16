
import React, { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface GradientBlob {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
}

export const BackgroundGradient = () => {
  const [blobs, setBlobs] = useState<GradientBlob[]>([]);
  const { currentTheme } = useTheme();
  
  // Generate colors based on current theme
  const getThemeColors = () => {
    switch (currentTheme) {
      case "catppuccin":
        return ["#f38ba8", "#cba6f7", "#a6e3a1", "#89b4fa", "#fab387"];
      case "tokyo-night":
        return ["#bb9af7", "#7aa2f7", "#7dcfff", "#9ece6a", "#f7768e"];
      case "nord":
        return ["#81a1c1", "#88c0d0", "#a3be8c", "#bf616a", "#d08770"];
      case "monodark":
        return ["#61afef", "#98c379", "#c678dd", "#e5c07b", "#e06c75"];
      case "gruvbox":
        return ["#fabd2f", "#b8bb26", "#83a598", "#d3869b", "#fb4934"];
      case "light":
        return ["#ff69b4", "#ff8c00", "#4682b4", "#32cd32", "#9370db"];
      case "dark":
      default:
        return ["#ff6bcb", "#5555ff", "#44ccff", "#44ffcc", "#ffcc44"];
    }
  };

  useEffect(() => {
    // Generate random blobs
    const colors = getThemeColors();
    const newBlobs: GradientBlob[] = [];
    
    // Create 5-7 blobs
    const blobCount = Math.floor(Math.random() * 3) + 5;
    
    for (let i = 0; i < blobCount; i++) {
      newBlobs.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 300 + 200, // Size between 200-500px
        color: colors[i % colors.length],
        opacity: Math.random() * 0.03 + 0.02, // Very low opacity: 0.02-0.05
      });
    }
    
    setBlobs(newBlobs);
  }, [currentTheme]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {blobs.map((blob) => (
        <div
          key={blob.id}
          className="absolute rounded-full blur-3xl"
          style={{
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            width: `${blob.size}px`,
            height: `${blob.size}px`,
            backgroundColor: blob.color,
            opacity: blob.opacity,
          }}
        />
      ))}
    </div>
  );
};
