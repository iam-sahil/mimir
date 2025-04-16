
export type Theme =
  | "dark"
  | "light"
  | "catppuccin"
  | "tokyo-night"
  | "nord"
  | "monodark"
  | "gruvbox";

export interface Settings {
  openaiApiKey: string;
  geminiApiKey: string;
  defaultModel: Model;
  theme: Theme;
  username: string;
}

export interface Model {
  id: string;
  name: string;
  provider: "openai" | "gemini";
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
}
