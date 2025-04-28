import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

export const BackgroundBlobs = () => {
  const { currentTheme } = useTheme();

  return (
    <div className="fixed inset-0 overflow-hidden z-[-1] pointer-events-none">
      {/* Main blobs */}
      <div
        className="absolute h-[80vh] w-[80vh] rounded-full blur-[120px] opacity-70 animate-blob-float-1"
        style={{
          background: `radial-gradient(circle at center, rgba(120, 50, 255, 0.8) 0%, transparent 70%)`,
          top: "10%",
          left: "10%",
          mixBlendMode: "lighten",
        }}
      />
      <div
        className="absolute h-[70vh] w-[70vh] rounded-full blur-[150px] opacity-80 animate-blob-float-2"
        style={{
          background: `radial-gradient(circle at center, rgba(255, 70, 150, 0.8) 0%, transparent 70%)`,
          bottom: "20%",
          right: "10%",
          mixBlendMode: "lighten",
        }}
      />
      <div
        className="absolute h-[65vh] w-[65vh] rounded-full blur-[140px] opacity-75 animate-blob-float-3"
        style={{
          background: `radial-gradient(circle at center, rgba(50, 190, 255, 0.8) 0%, transparent 70%)`,
          top: "50%",
          right: "25%",
          mixBlendMode: "lighten",
        }}
      />

      {/* Additional smaller blobs for more visual interest */}
      <div
        className="absolute h-[40vh] w-[40vh] rounded-full blur-[100px] opacity-65 animate-blob-float-2"
        style={{
          background: `radial-gradient(circle at center, rgba(255, 200, 70, 0.8) 0%, transparent 70%)`,
          top: "70%",
          left: "20%",
          mixBlendMode: "lighten",
        }}
      />
      <div
        className="absolute h-[35vh] w-[35vh] rounded-full blur-[90px] opacity-60 animate-blob-float-3"
        style={{
          background: `radial-gradient(circle at center, rgba(70, 255, 150, 0.8) 0%, transparent 70%)`,
          top: "30%",
          right: "40%",
          mixBlendMode: "lighten",
        }}
      />
    </div>
  );
};
