
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface GradientBlob {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  speed: { x: number; y: number };
}

export const BackgroundGradient = () => {
  const [blobs, setBlobs] = useState<GradientBlob[]>([]);
  const { currentTheme } = useTheme();
  const animationRef = useRef<number>();
  
  // Generate colors based on current theme
  const getThemeColors = () => {
    switch (currentTheme) {
      case "catppuccin":
        return ["#f38ba8", "#cba6f7", "#a6e3a1", "#89b4fa", "#fab387"];
      case "tokyo-night":
        return ["#bb9af7", "#7aa2f7", "#7dcfff", "#9ece6a", "#f7768e"];
      case "nord":
        return ["#81a1c1", "#88c0d0", "#a3be8c", "#bf616a", "#d08770"];
      case "dark-mono":
        return ["#ffffff", "#e0e0e0", "#bdbdbd", "#9e9e9e", "#757575"];
      case "gruvbox":
        return ["#fabd2f", "#b8bb26", "#83a598", "#d3869b", "#fb4934"];
      case "light-pink":
        return ["#ff4081", "#f48fb1", "#ff69b4", "#ff8c00", "#4682b4"];
      case "dark-green":
      default:
        return ["#4caf50", "#81c784", "#a5d6a7", "#c8e6c9", "#e8f5e9"];
      case "one-dark":
        return ["#61afef", "#98c379", "#c678dd", "#e5c07b", "#e06c75"];
      case "dracula":
        return ["#bd93f9", "#50fa7b", "#ff79c6", "#8be9fd", "#ffb86c"];
      case "github-light":
        return ["#0366d6", "#22863a", "#cb2431", "#6f42c1", "#005cc5"];
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
        speed: { 
          x: (Math.random() - 0.5) * 0.01, // Extremely slow movement
          y: (Math.random() - 0.5) * 0.01  
        }
      });
    }
    
    setBlobs(newBlobs);
  }, [currentTheme]);
  
  // Animation loop for slow movement
  useEffect(() => {
    const animate = () => {
      setBlobs(prevBlobs => prevBlobs.map(blob => {
        let newX = blob.x + blob.speed.x;
        let newY = blob.y + blob.speed.y;
        
        // Bounce when reaching edges
        if (newX <= 0 || newX >= 100) blob.speed.x *= -1;
        if (newY <= 0 || newY >= 100) blob.speed.y *= -1;
        
        // Ensure blobs stay within bounds
        newX = Math.max(0, Math.min(100, newX));
        newY = Math.max(0, Math.min(100, newY));
        
        return {
          ...blob,
          x: newX,
          y: newY
        };
      }));
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {blobs.map((blob) => (
        <div
          key={blob.id}
          className="absolute rounded-full blur-[100px]"
          style={{
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            width: `${blob.size}px`,
            height: `${blob.size}px`,
            backgroundColor: blob.color,
            opacity: blob.opacity,
            transition: "left 8s ease-in-out, top 8s ease-in-out",
          }}
        />
      ))}
    </div>
  );
};
