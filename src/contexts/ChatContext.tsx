
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
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [chats, setChats] = useState<Chat[]>(() => {
    const savedChats = localStorage.getItem("mimir-chats");
    if (savedChats) {
      return JSON.parse(savedChats);
    }
    return [];
  });
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const currentChat = currentChatId 
    ? chats.find(chat => chat.id === currentChatId) || null 
    : null;

  useEffect(() => {
    localStorage.setItem("mimir-chats", JSON.stringify(chats));
  }, [chats]);

  const createNewChat = () => {
    const timestamp = Date.now();
    const newChat: Chat = {
      id: uuidv4(),
      title: "New Chat",
      messages: [],
      model: settings.defaultModel,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    
    setChats(prev => [newChat, ...prev]);
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
          if (title === "New Chat" && role === "user") {
            // Limit title to first ~30 chars
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
      setCurrentChatId(null);
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
