
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
    name: "Gruvbox",
    className: "gruvbox",
  },
};
