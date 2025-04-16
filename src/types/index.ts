
export type Theme = 
  | "dark" 
  | "light" 
  | "catppuccin" 
  | "tokyo-night" 
  | "nord" 
  | "monodark" 
  | "gruvbox";

export type ModelProvider = "openai" | "gemini";

export type OpenAIModel = "gpt-4o" | "gpt-4o-mini" | "gpt-4.5-preview";

export type GeminiModel = "gemini-1.5-pro" | "gemini-1.5-flash" | "gemini-1.0-pro";

export type Model = {
  id: string;
  name: string;
  provider: ModelProvider;
  modelId: OpenAIModel | GeminiModel;
  description?: string;
  canUseImage?: boolean;
};

export type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
  model: Model;
  createdAt: number;
  updatedAt: number;
};

export type Settings = {
  openaiApiKey?: string;
  geminiApiKey?: string;
  defaultModel: Model;
  theme: Theme;
};
