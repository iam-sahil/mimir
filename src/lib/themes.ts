
import { Theme } from "@/types";

export const themes: Record<Theme, { name: string; className: string }> = {
  dark: {
    name: "Dark",
    className: "dark",
  },
  light: {
    name: "Light",
    className: "light",
  },
  catppuccin: {
    name: "Catppuccin",
    className: "catppuccin",
  },
  "tokyo-night": {
    name: "Tokyo Night",
    className: "tokyo-night",
  },
  nord: {
    name: "Nord",
    className: "nord",
  },
  monodark: {
    name: "Monodark",
    className: "monodark",
  },
  gruvbox: {
    name: "Gruvbox Dark",
    className: "gruvbox",
  },
  "one-dark-pro": {
    name: "One Dark Pro",
    className: "one-dark-pro",
  },
  "dracula": {
    name: "Dracula",
    className: "dracula",
  },
  "shades-of-purple": {
    name: "Shades of Purple",
    className: "shades-of-purple",
  },
  "monokai": {
    name: "Monokai",
    className: "monokai",
  },
};
