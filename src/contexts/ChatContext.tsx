import { createContext, useContext, useEffect, useState } from "react";
import { Chat, Message, Model } from "@/types";
import { v4 as uuidv4 } from "uuid";
import {
  hasReachedDailyLimit,
  getFallbackModel,
  getModelForPrompt,
  shouldUseImageGenerationModel,
  getModelById,
} from "@/lib/models";
import { useSettings } from "./SettingsContext";
import { toast } from "sonner";
import { generateImage as callGenerateImage } from "@/pages/services/gemini";
import { useRateLimit } from "@/contexts/RateLimitContext";

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  createNewChat: () => Chat;
  selectChat: (id: string) => void;
  addMessage: (
    content: string,
    role: "user" | "assistant",
    attachments?: { id: string; file: File; type: string; name?: string }[]
  ) => void;
  renameChat: (id: string, title: string) => void;
  deleteChat: (id: string) => void;
  setCurrentChatModel: (model: Model) => void;
  addChatToFolder: (id: string, folder: string) => void;
  pinChat: (id: string) => void;
  unpinChat: (id: string) => void;
  checkModelRateLimits: (model: Model) => {
    hasReachedLimit: boolean;
    fallbackModel: Model | null;
  };
  generateImage: (prompt: string) => Promise<string | null>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { settings, hasValidKey } = useSettings();
  const [chats, setChats] = useState<Chat[]>(() => {
    const savedChats = localStorage.getItem("mimir-chats");
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);

        // Restore complete model objects for all chats
        return parsedChats.map((chat: Chat) => {
          if (chat.model && chat.model.id) {
            const modelId = chat.model.id;
            const completeModel = getModelById(modelId);
            return {
              ...chat,
              model: completeModel || settings.defaultModel,
            };
          }
          return chat;
        });
      } catch (e) {
        console.error("Error parsing chats:", e);
        return [];
      }
    }
    return [];
  });
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const currentChat = currentChatId
    ? chats.find((chat) => chat.id === currentChatId) || null
    : null;

  // Save chats to localStorage, ensuring we don't store circular references
  useEffect(() => {
    // Only save chats with messages to localStorage to avoid empty chat accumulation
    const chatsToSave = chats
      .filter((chat) => chat.messages.length > 0)
      .map((chat) => {
        // Create a safe copy of each chat for localStorage
        return {
          ...chat,
          // Only store essential model data
          model: {
            id: chat.model.id,
            name: chat.model.name,
            provider: chat.model.provider,
            modelId: chat.model.modelId,
          },
        };
      });

    localStorage.setItem("mimir-chats", JSON.stringify(chatsToSave));
  }, [chats]);

  // This prevents creating multiple empty chats on page reload
  useEffect(() => {
    if (!hasInitialized && chats.length === 0) {
      setHasInitialized(true);
      createNewChat();
    }
  }, [hasInitialized, chats.length]);

  // Make sure selected model is available with current API keys
  useEffect(() => {
    if (currentChat && !hasValidKey(currentChat.model.provider)) {
      // Get the complete model object using ID
      const fullModelId = settings.defaultModel.id;
      const fullModel = getModelById(fullModelId);
      setCurrentChatModel(fullModel);
    }
  }, [
    settings.geminiApiKey,
    settings.openRouterApiKey,
    settings.defaultModel?.id,
    currentChat,
  ]);

  const checkModelRateLimits = (model: Model) => {
    if (hasReachedDailyLimit(model.id)) {
      const fallbackModel = getFallbackModel(model.id);
      return {
        hasReachedLimit: true,
        fallbackModel,
      };
    }
    return { hasReachedLimit: false, fallbackModel: null };
  };

  const createNewChat = () => {
    const timestamp = Date.now();

    // Always use the complete model object from allModels
    const defaultModelId = settings.defaultModel.id;
    let modelToUse = getModelById(defaultModelId);

    // Check if the model has reached its limits
    const checkRateLimitResults = checkModelRateLimits(modelToUse);
    const { hasReachedLimit, fallbackModel } = checkRateLimitResults;

    if (hasReachedLimit && fallbackModel) {
      modelToUse = fallbackModel;
      toast(
        `Daily limit reached. Using ${fallbackModel.name} as fallback model for this chat`
      );
    }

    const newChat: Chat = {
      id: uuidv4(),
      title: "New Chat",
      messages: [],
      model: modelToUse,
      createdAt: timestamp,
      updatedAt: timestamp,
      folder: undefined,
      isPinned: false,
    };

    setChats((prev) => [
      newChat,
      ...prev.filter(
        (chat) => chat.messages.length > 0 || chat.id === currentChatId
      ),
    ]);
    setCurrentChatId(newChat.id);
    return newChat;
  };

  const selectChat = (id: string) => {
    setCurrentChatId(id);
  };

  const addMessage = (
    content: string,
    role: "user" | "assistant",
    attachments?: { id: string; file: File; type: string; name?: string }[]
  ) => {
    if (!currentChatId) return;

    const message: Message = {
      id: uuidv4(),
      role,
      content,
      timestamp: Date.now(),
      attachments: attachments?.map((attachment) => ({
        id: attachment.id || uuidv4(),
        type: attachment.type,
        file: attachment.file,
      })),
    };

    setChats((prevChats) => {
      return prevChats.map((chat) => {
        if (chat.id === currentChatId) {
          // Check if this is an image generation request
          let currentModel = chat.model;

          if (role === "user" && shouldUseImageGenerationModel(content)) {
            const imageGenModel = getModelForPrompt(content, chat.model.id);
            if (imageGenModel.id !== chat.model.id) {
              toast(`Switching to ${imageGenModel.name} for image generation`);
              currentModel = imageGenModel;
            }
          }

          // Check if model has reached limits before adding user message
          if (role === "user") {
            const checkRateLimitResults = checkModelRateLimits(currentModel);
            const { hasReachedLimit, fallbackModel } = checkRateLimitResults;
            if (hasReachedLimit && fallbackModel) {
              toast(
                `Daily limit reached for ${currentModel.name}. Switching to ${fallbackModel.name} as fallback model`
              );
              currentModel = fallbackModel;
            }
          }

          // Update the chat title based on the first user message if it's "New Chat"
          let title = chat.title;
          if (
            (title === "New Chat" || !title) &&
            role === "user" &&
            chat.messages.length === 0
          ) {
            // Create a summary title from the first message
            title =
              content.length > 30 ? `${content.substring(0, 30)}...` : content;
          }

          return {
            ...chat,
            title,
            model: currentModel,
            messages: [...chat.messages, message],
            updatedAt: Date.now(),
          };
        }
        return chat;
      });
    });
  };

  const renameChat = (id: string, title: string) => {
    setChats((prevChats) => {
      return prevChats.map((chat) => {
        if (chat.id === id) {
          return {
            ...chat,
            title,
            updatedAt: Date.now(),
          };
        }
        return chat;
      });
    });
  };

  const deleteChat = (id: string) => {
    setChats((prevChats) => {
      return prevChats.filter((chat) => chat.id !== id);
    });

    if (currentChatId === id) {
      // If we deleted the current chat, select another one or create a new one
      if (chats.length > 1) {
        const remainingChats = chats.filter((chat) => chat.id !== id);
        setCurrentChatId(remainingChats[0].id);
      } else {
        createNewChat();
      }
    }
  };

  const setCurrentChatModel = (model: Model) => {
    if (!currentChatId) return;

    // Check if the model has reached its limits
    const checkRateLimitResults = checkModelRateLimits(model);
    const { hasReachedLimit, fallbackModel } = checkRateLimitResults;

    if (hasReachedLimit && fallbackModel) {
      toast(
        `Daily limit reached. Using ${fallbackModel.name} instead of ${model.name}`
      );
      model = fallbackModel;
    }

    setChats((prevChats) => {
      return prevChats.map((chat) => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            model,
            updatedAt: Date.now(),
          };
        }
        return chat;
      });
    });
  };

  const addChatToFolder = (id: string, folder: string) => {
    setChats((prevChats) => {
      return prevChats.map((chat) => {
        if (chat.id === id) {
          return {
            ...chat,
            folder,
            updatedAt: Date.now(),
          };
        }
        return chat;
      });
    });
  };

  const pinChat = (id: string) => {
    setChats((prevChats) => {
      return prevChats.map((chat) => {
        if (chat.id === id) {
          return {
            ...chat,
            isPinned: true,
            updatedAt: Date.now(),
          };
        }
        return chat;
      });
    });
  };

  const unpinChat = (id: string) => {
    setChats((prevChats) => {
      return prevChats.map((chat) => {
        if (chat.id === id) {
          return {
            ...chat,
            isPinned: false,
            updatedAt: Date.now(),
          };
        }
        return chat;
      });
    });
  };

  const generateImage = async (prompt: string): Promise<string | null> => {
    if (!currentChat) return null;

    try {
      if (!hasValidKey(currentChat.model.provider)) {
        toast(
          `Missing API key for ${currentChat.model.provider}. Please add your API key in the Settings dialog`
        );
        return null;
      }

      // Check model rate limits before generating image
      const checkRateLimitResults = checkModelRateLimits(currentChat.model);
      const { hasReachedLimit, fallbackModel } = checkRateLimitResults;

      // If we've hit limits, switch to a fallback model
      if (hasReachedLimit && fallbackModel) {
        toast(
          `Daily limit reached for ${currentChat.model.name}. Switching to ${fallbackModel.name} for image generation`
        );

        // Update current chat model
        setCurrentChatModel(fallbackModel);
      }

      // For image generation, we should explicitly use an image-capable model
      const imageGenModel = getModelForPrompt(prompt, currentChat.model.id);

      if (imageGenModel.id !== currentChat.model.id) {
        toast(`Using ${imageGenModel.name} for better image generation`);
        setCurrentChatModel(imageGenModel);
      }

      let imageUrl: string | null = null;

      if (imageGenModel.provider === "gemini") {
        imageUrl = await callGenerateImage(
          settings.geminiApiKey,
          imageGenModel,
          prompt
        );
      } else {
        toast(
          `Image generation not supported by ${imageGenModel.provider}. Please switch to a Gemini model for image generation`
        );
        return null;
      }

      return imageUrl;
    } catch (error) {
      console.error("Error generating image:", error);
      toast(
        `Failed to generate image: ${error.message}. Please try again with a different prompt or model`
      );
      return null;
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        createNewChat,
        selectChat,
        addMessage,
        renameChat,
        deleteChat,
        setCurrentChatModel,
        addChatToFolder,
        pinChat,
        unpinChat,
        checkModelRateLimits,
        generateImage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
