export type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  model?: Model;
  attachments?: {
    id: string;
    type: string;
    file: File;
  }[];
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
  model: Model;
  createdAt: number;
  updatedAt: number;
  isPinned?: boolean;
  folder?: string;
};

export type Model = {
  id: string;
  name: string;
  provider: "gemini" | "openrouter";
  description?: string;
  modelId: string;
  canUseImage?: boolean;
  supportsThinking?: boolean;
  supportsWebSearch?: boolean;
  supportsImageGeneration?: boolean;
  rateLimits?: {
    requestsPerMinute: number;
    requestsPerDay: number;
    tokensPerMinute: number;
    tokensPerDay: number;
  };
  usageTracking?: {
    requestsToday: number;
    tokensToday: number;
    lastResetDate?: string;
  };
  fallbackModelId?: string;
};

export type Theme = 
  | "light-pink" 
  | "light-green"
  | "dark-pink"
  | "dark-green"
  | "github-light"
  | "github-dark"
  | "catppuccin"
  | "tokyo-night"
  | "nord"
  | "gruvbox"
  | "one-dark"
  | "dracula"
  | "ayu"
  | "cyberpunk-2077"
  | "synthwave-84"
  | "neon-synthwave"
  | "panda"
  | "atom-one-dark"
  | "frosted-glass";

export type ThemeConfig = {
  name: string;
  theme: "light" | "dark";
  colors: Record<string, string>;
};

export interface Settings {
  defaultModel: Model;
  geminiApiKey: string;
  openRouterApiKey: string;
  username: string;
  theme: string;
  freeMessagesUsed: number;
  enableThinking: boolean;
  enableWebSearch: boolean;
  enableImageGeneration: boolean;
  mainFont: string;
  codeFont: string;
}

export interface ChatCompletionMessage {
  role: "assistant" | "user" | "system";
  content: string;
  finishReason?: string;
  id: string;
  groundingMetadata?: any; // Grounding metadata from the API
  searchSuggestions?: {
    renderedContent: string;
    queries: string[];
  };
  sources?: {
    uri: string;
    title: string;
  }[];
}

export interface SettingsContextType {
  settings: Settings;
  setSettings: (settings: Settings | ((prev: Settings) => Settings)) => void;
}
