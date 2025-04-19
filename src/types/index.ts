export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  model?: Model;
  attachments?: MessageAttachment[];
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
  customFont?: {
    url: string;
    family: string;
  };
}

// Chat organization types
export type ChatSection = "pinned" | "folders" | "today" | "yesterday" | "older";

export interface MessageAttachment {
  file: File;
  type: string;
  name: string;
}
