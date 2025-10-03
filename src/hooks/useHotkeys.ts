import { useEffect, useRef } from "react";

interface Hotkey {
  keys: string[];
  callback: () => void;
  description?: string;
}

export function useHotkeys(hotkeys: Hotkey[]) {
  const pressedKeys = useRef<Set<string>>(new Set());
  const isProcessing = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent multiple rapid firings
      if (isProcessing.current) return;

      // Normalize key names
      const key = e.key;
      pressedKeys.current.add(key);

      // Add modifier keys
      if (e.ctrlKey) pressedKeys.current.add("Control");
      if (e.shiftKey) pressedKeys.current.add("Shift");
      if (e.altKey) pressedKeys.current.add("Alt");
      if (e.metaKey) pressedKeys.current.add("Meta");

      // Check each hotkey
      hotkeys.forEach((hotkey) => {
        // Count required modifier keys
        const requiredModifiers = hotkey.keys.filter((k) =>
          [
            "Control",
            "Ctrl",
            "Shift",
            "Alt",
            "Meta",
            "Command",
            "Cmd",
          ].includes(k),
        );

        // Count required non-modifier keys
        const requiredKeys = hotkey.keys.filter(
          (k) =>
            ![
              "Control",
              "Ctrl",
              "Shift",
              "Alt",
              "Meta",
              "Command",
              "Cmd",
            ].includes(k),
        );

        // If there are no non-modifier keys, this is invalid (e.g., just "Ctrl")
        if (requiredKeys.length === 0) return;

        // Check if all required keys match
        const allKeysMatch = hotkey.keys.every((key) => {
          if (key === "Control" || key === "Ctrl") {
            return e.ctrlKey;
          } else if (key === "Shift") {
            return e.shiftKey;
          } else if (key === "Alt") {
            return e.altKey;
          } else if (key === "Meta" || key === "Command" || key === "Cmd") {
            return e.metaKey;
          } else if (key === "/") {
            return e.key === "/" || e.key === "?";
          } else {
            // For regular keys, check exact match (case-insensitive)
            return e.key.toLowerCase() === key.toLowerCase();
          }
        });

        // Only trigger if all keys match AND we have the correct number of modifiers
        if (allKeysMatch) {
          // Verify exact modifier state
          const ctrlRequired = hotkey.keys.some(
            (k) => k === "Control" || k === "Ctrl",
          );
          const shiftRequired = hotkey.keys.some((k) => k === "Shift");
          const altRequired = hotkey.keys.some((k) => k === "Alt");
          const metaRequired = hotkey.keys.some(
            (k) => k === "Meta" || k === "Command" || k === "Cmd",
          );

          // Check that we don't have extra modifiers
          const modifiersMatch =
            e.ctrlKey === ctrlRequired &&
            e.shiftKey === shiftRequired &&
            e.altKey === altRequired &&
            e.metaKey === metaRequired;

          if (modifiersMatch) {
            e.preventDefault();
            e.stopPropagation();

            isProcessing.current = true;
            hotkey.callback();

            // Reset processing flag after a short delay
            setTimeout(() => {
              isProcessing.current = false;
            }, 100);
          }
        }
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Clear the pressed keys set on key up
      pressedKeys.current.delete(e.key);

      // Clear modifiers
      if (!e.ctrlKey) pressedKeys.current.delete("Control");
      if (!e.shiftKey) pressedKeys.current.delete("Shift");
      if (!e.altKey) pressedKeys.current.delete("Alt");
      if (!e.metaKey) pressedKeys.current.delete("Meta");
    };

    const handleBlur = () => {
      // Clear all keys when window loses focus
      pressedKeys.current.clear();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [hotkeys]);
}

export const KEYBOARD_SHORTCUTS = [
  {
    name: "Toggle Sidebar",
    keys: ["Ctrl", "B"],
    description: "Show or hide the sidebar",
  },
  {
    name: "Focus Search",
    keys: ["Ctrl", "K"],
    description: "Focus the search input or open search modal",
  },
  {
    name: "New Chat",
    keys: ["Ctrl", "Shift", "O"],
    description: "Create a new chat",
  },
  {
    name: "Cycle Theme",
    keys: ["Ctrl", "Shift", "/"],
    description: "Switch to next theme",
  },
  {
    name: "Attach Files",
    keys: ["Ctrl", "Shift", "A"],
    description: "Open file picker to attach files",
  },
  {
    name: "Rename Chat",
    keys: ["Ctrl", "R"],
    description: "Rename the current chat",
  },
];
