
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
        const isMatch = hotkey.keys.every(key => {
          if (key === 'Control' || key === 'Ctrl') {
            return e.ctrlKey;
          } else if (key === 'Shift') {
            return e.shiftKey;
          } else if (key === 'Alt') {
            return e.altKey;
          } else if (key === 'Meta' || key === 'Command' || key === 'Cmd') {
            return e.metaKey;
          } else if (key === '/') {
            return e.key === '/' || e.key === '?';
          } else {
            return pressedKeys.current[key] || 
                   pressedKeys.current[key.toLowerCase()] ||
                   pressedKeys.current[key.charAt(0).toUpperCase() + key.slice(1)];
          }
        });
        
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

export const KEYBOARD_SHORTCUTS = [
  {
    name: 'Toggle Sidebar',
    keys: ['Ctrl', 'B'],
    description: 'Show or hide the sidebar'
  },
  {
    name: 'Focus Search',
    keys: ['Ctrl', 'K'],
    description: 'Focus the search input or open search modal'
  },
  {
    name: 'New Chat',
    keys: ['Ctrl', 'Shift', 'O'],
    description: 'Create a new chat'
  },
  {
    name: 'Cycle Theme',
    keys: ['Ctrl', 'Shift', '/'],
    description: 'Switch to next theme'
  },
  {
    name: 'Attach Files',
    keys: ['Ctrl', 'Shift', 'A'],
    description: 'Open file picker to attach files'
  }
];
