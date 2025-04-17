
import { Theme } from "@/types";

export const themes: Record<Theme, { name: string; className: string }> = {
  "light-pink": {
    name: "Light (Pink accent)",
    className: "light-pink",
  },
  "dark-green": {
    name: "Dark (Green accent)",
    className: "dark-green",
  },
  "dark-mono": {
    name: "Dark mono (White accent)",
    className: "dark-mono",
  },
  "catppuccin": {
    name: "Catppuccin Mocha",
    className: "catppuccin",
  },
  "tokyo-night": {
    name: "Tokyo Night",
    className: "tokyo-night",
  },
  "nord": {
    name: "Nord",
    className: "nord",
  },
  "gruvbox": {
    name: "Gruvbox Dark",
    className: "gruvbox",
  },
  "one-dark": {
    name: "One Dark",
    className: "one-dark",
  },
  "dracula": {
    name: "Dracula",
    className: "dracula",
  },
  "github-light": {
    name: "Github Light",
    className: "github-light",
  },
};
