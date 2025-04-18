
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  model: Model;
  createdAt: number;
  updatedAt: number;
  folder?: string;
  isPinned: boolean;
}

export interface Model {
  id: string;
  name: string;
  modelId: string;
  provider: "gemini" | "openrouter";
  description?: string;
  canUseImage?: boolean;
}

export type Theme =
  | "light-pink"
  | "dark-green"
  | "dark-mono"
  | "catppuccin"
  | "tokyo-night"
  | "nord"
  | "gruvbox"
  | "one-dark"
  | "dracula"
  | "github-light";

export interface Settings {
  geminiApiKey: string;
  openRouterApiKey: string;
  defaultModel: Model;
  theme: Theme;
  username: string;
  freeMessagesUsed: number;
}
