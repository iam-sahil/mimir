
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

export interface Model {
  id: string;
  name: string;
  provider: "gemini" | "openrouter";
  modelId: string;
  description: string;
  canUseImage: boolean;
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
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
  isPinned?: boolean;
}
