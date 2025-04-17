
import { useEffect, useRef } from "react";

interface Hotkey {
  keys: string[];
  callback: () => void;
  description?: string;
}

export function useHotkeys(hotkeys: Hotkey[]) {
  const pressedKeys = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      pressedKeys.current[e.key] = true;
      
      // Check each hotkey
      hotkeys.forEach(hotkey => {
        const isMatch = hotkey.keys.every(key => 
          pressedKeys.current[key] || 
          pressedKeys.current[key.toLowerCase()] ||
          pressedKeys.current[key.charAt(0).toUpperCase() + key.slice(1)]
        );
        
        if (isMatch) {
          e.preventDefault();
          hotkey.callback();
        }
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeys.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [hotkeys]);
}
