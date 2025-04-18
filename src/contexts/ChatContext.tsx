
import { createContext, useContext, useEffect, useState } from "react";
import { Chat, Message, Model } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { defaultModel } from "@/lib/models";
import { useSettings } from "./SettingsContext";

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  createNewChat: () => Chat;
  selectChat: (id: string) => void;
  addMessage: (content: string, role: "user" | "assistant") => void;
  renameChat: (id: string, title: string) => void;
  deleteChat: (id: string) => void;
  setCurrentChatModel: (model: Model) => void;
  addChatToFolder: (id: string, folder: string) => void;
  pinChat: (id: string) => void;
  unpinChat: (id: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { settings, hasValidKey } = useSettings();
  const [chats, setChats] = useState<Chat[]>(() => {
    const savedChats = localStorage.getItem("mimir-chats");
    if (savedChats) {
      return JSON.parse(savedChats);
    }
    return [];
  });
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const currentChat = currentChatId 
    ? chats.find(chat => chat.id === currentChatId) || null 
    : null;

  useEffect(() => {
    // Only save chats with messages to localStorage to avoid empty chat accumulation
    const chatsToSave = chats.filter(chat => chat.messages.length > 0);
    localStorage.setItem("mimir-chats", JSON.stringify(chatsToSave));
  }, [chats]);

  useEffect(() => {
    // This prevents creating multiple empty chats on page reload
    if (!hasInitialized && chats.length === 0) {
      setHasInitialized(true);
      createNewChat();
    }
  }, [hasInitialized, chats.length]);

  // Make sure selected model is available with current API keys
  useEffect(() => {
    if (currentChat && !hasValidKey(currentChat.model.provider)) {
      // Switch to default model if current model is not available
      setCurrentChatModel(defaultModel);
    }
  }, [settings.geminiApiKey, settings.openRouterApiKey]);

  const createNewChat = () => {
    const timestamp = Date.now();
    const newChat: Chat = {
      id: uuidv4(),
      title: "New Chat",
      messages: [],
      model: settings.defaultModel,
      createdAt: timestamp,
      updatedAt: timestamp,
      folder: undefined,
      isPinned: false,
    };
    
    setChats(prev => [newChat, ...prev.filter(chat => chat.messages.length > 0 || chat.id === currentChatId)]);
    setCurrentChatId(newChat.id);
    return newChat;
  };

  const selectChat = (id: string) => {
    setCurrentChatId(id);
  };

  const addMessage = (content: string, role: "user" | "assistant") => {
    if (!currentChatId) return;

    const message: Message = {
      id: uuidv4(),
      role,
      content,
      timestamp: Date.now(),
    };

    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === currentChatId) {
          // Update the chat title based on the first user message if it's "New Chat"
          let title = chat.title;
          if ((title === "New Chat" || !title) && role === "user" && chat.messages.length === 0) {
            // Create a summary title from the first message
            title = content.length > 30 ? `${content.substring(0, 30)}...` : content;
          }
          
          return {
            ...chat,
            title,
            messages: [...chat.messages, message],
            updatedAt: Date.now(),
          };
        }
        return chat;
      });
    });
  };

  const renameChat = (id: string, title: string) => {
    setChats(prevChats => {
      return prevChats.map(chat => {
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
    setChats(prevChats => {
      return prevChats.filter(chat => chat.id !== id);
    });

    if (currentChatId === id) {
      // If we deleted the current chat, select another one or create a new one
      if (chats.length > 1) {
        const remainingChats = chats.filter(chat => chat.id !== id);
        setCurrentChatId(remainingChats[0].id);
      } else {
        createNewChat();
      }
    }
  };

  const setCurrentChatModel = (model: Model) => {
    if (!currentChatId) return;

    setChats(prevChats => {
      return prevChats.map(chat => {
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
    setChats(prevChats => {
      return prevChats.map(chat => {
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
    setChats(prevChats => {
      return prevChats.map(chat => {
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
    setChats(prevChats => {
      return prevChats.map(chat => {
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
