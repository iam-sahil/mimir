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
  const { currentTheme, themes } = useTheme();
  const animationRef = useRef<number>();

  // Generate colors based on current theme
  const getThemeColors = () => {
    const themeConfig = themes[currentTheme];
    const primary = `hsl(var(--primary))`;
    const accent = `hsl(var(--accent))`;
    const secondary = `hsl(var(--secondary))`;
    return [primary, accent, secondary];
  };

  useEffect(() => {
    const colors = getThemeColors();
    const newBlobs: GradientBlob[] = [];

    // Create 3-5 blobs
    const blobCount = Math.floor(Math.random() * 3) + 3;

    for (let i = 0; i < blobCount; i++) {
      newBlobs.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 400 + 200, // Size between 200-600px
        color: colors[i % colors.length],
        opacity: Math.random() * 0.1 + 0.05, // Opacity between 0.05-0.15
        speed: {
          x: (Math.random() - 0.5) * 0.02, // Slower movement
          y: (Math.random() - 0.5) * 0.02,
        },
      });
    }

    setBlobs(newBlobs);
  }, [currentTheme]);

  useEffect(() => {
    const animate = () => {
      setBlobs((prevBlobs) =>
        prevBlobs.map((blob) => {
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
            y: newY,
          };
        }),
      );

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
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {blobs.map((blob) => (
        <div
          key={blob.id}
          className="absolute rounded-full blur-[120px] transition-all"
          style={{
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            width: `${blob.size}px`,
            height: `${blob.size}px`,
            backgroundColor: blob.color,
            opacity: blob.opacity,
            transition: "left 30s ease-in-out, top 30s ease-in-out",
          }}
        />
      ))}
    </div>
  );
};
