import { useState, useEffect } from "react";
import { useChat } from "@/contexts/ChatContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Message, ChatCompletionMessage } from "@/types";
import { sendChatRequest, generateImageRequest } from "@/lib/api";
import { toast } from "sonner";
import { hasReachedDailyLimit, getFallbackModel, allModels } from "@/lib/models";

export function useChatState() {
  const { currentChat, addMessage, createNewChat } = useChat();
  const { settings, hasValidKey, getActiveApiKey, incrementFreeMessagesUsed } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [completeResponse, setCompleteResponse] = useState<ChatCompletionMessage | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingText, setThinkingText] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!currentChat) {
      createNewChat();
    }
  }, [currentChat, createNewChat]);

  useEffect(() => {
    if (!isTyping || !completeResponse) return;

    let i = 0;
    const responseText = completeResponse.content || "";
    // Calculate typing speed based on response length
    const baseSpeed = 10; // base speed in ms
    const lengthFactor = Math.max(1, Math.min(3, responseText.length / 1000)); // scale factor based on length
    const speed = Math.max(2, baseSpeed / lengthFactor); // minimum speed of 2ms
    
    const typeWriter = () => {
      if (i < responseText.length) {
        setTypingText(responseText.substring(0, i + 1));
        i++;
        setTimeout(typeWriter, speed);
      } else {
        setIsTyping(false);
        addMessage(responseText, "assistant");
        setCompleteResponse(null);
        setTypingText("");
      }
    };

    // Store the typing state in localStorage
    const typingState = {
      text: responseText,
      position: i,
      speed,
      timestamp: Date.now()
    };
    localStorage.setItem('typingState', JSON.stringify(typingState));
    
    typeWriter();

    // Cleanup function to remove the stored state
    return () => {
      localStorage.removeItem('typingState');
    };
  }, [isTyping, completeResponse, addMessage]);

  // Restore typing state when component mounts
  useEffect(() => {
    const storedState = localStorage.getItem('typingState');
    if (storedState) {
      const { text, position, speed, timestamp } = JSON.parse(storedState);
      // Only restore if the state is less than 5 minutes old
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        setTypingText(text.substring(0, position));
        setIsTyping(true);
        setCompleteResponse({
          id: `temp-${Date.now()}`,
          content: text,
          role: 'assistant',
          finishReason: 'stop'
        });
        
        const typeWriter = () => {
          if (position < text.length) {
            setTypingText(text.substring(0, position + 1));
            setTimeout(typeWriter, speed);
          } else {
            setIsTyping(false);
            addMessage(text, "assistant");
            setCompleteResponse(null);
            setTypingText("");
            localStorage.removeItem('typingState');
          }
        };
        
        typeWriter();
      } else {
        localStorage.removeItem('typingState');
      }
    }
  }, [addMessage]);

  useEffect(() => {
    if (!isLoading || isTyping) {
      setThinkingText("");
      return;
    }
    
    // Set thinking indicators based on the model used
    if (currentChat?.model.supportsThinking && settings.enableThinking) {
      setThinkingText("Thinking...");
    } else {
      setThinkingText("Just a second...");
    }
  }, [isLoading, isTyping, currentChat, settings.enableThinking]);

  const handleSendMessage = async (message: string, attachments?: File[]) => {
    if (!currentChat) return;

    // Check for rate limits
    if (hasReachedDailyLimit(currentChat.model.id)) {
      const fallbackModel = getFallbackModel(currentChat.model.id);
      toast(`Daily limit reached for ${currentChat.model.name}. Switching to ${fallbackModel.name}.`);
    }

    const messageAttachments = attachments?.map(file => ({
      id: `attachment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      file,
      type: file.type,
      name: file.name
    }));

    // Add user message to chat
    addMessage(message, "user", messageAttachments);

    const apiKey = getActiveApiKey(currentChat.model.provider);
        
    if (!apiKey) {
      toast.error("Error: No API key available");
      addMessage(
        `Sorry, I couldn't process your request. No API key found for ${currentChat.model.provider === "openrouter" ? "OpenRouter" : "Gemini"}. Please add your API key in the settings.`,
        "assistant"
      );
      return;
    }

    // Check if this is an image generation request
    if (
      message.toLowerCase().startsWith("generate image:") && 
      settings.enableImageGeneration
    ) {
      // Extract the image prompt and handle it separately
      const imagePrompt = message.substring("generate image:".length).trim();
      await handleImageGeneration(imagePrompt);
      return;
    }

    // Process regular text message
    setIsLoading(true);
    try {
      if (currentChat.model.provider === "gemini" && !settings.geminiApiKey) {
        incrementFreeMessagesUsed();
        
        const freeLimit = parseInt(import.meta.env.VITE_FREE_MESSAGE_LIMIT || "10", 10);
        const remaining = freeLimit - settings.freeMessagesUsed;
        
        if (remaining <= 3 && remaining > 0) {
          toast.warning(`${remaining} free message${remaining === 1 ? '' : 's'} remaining`);
        } else if (remaining <= 0) {
          toast.error("Free message limit reached. Please add your API key in settings.");
        }
      }
      
      const tempUserMessage: Message = { 
        id: "temp", 
        role: "user", 
        content: message, 
        timestamp: Date.now(),
        attachments: messageAttachments 
      };
      
      const response = await sendChatRequest(
        currentChat.model,
        [...currentChat.messages, tempUserMessage]
      );

      setCompleteResponse(response);
      setIsTyping(true);
      
    } catch (error) {
      console.error("Error sending message:", error);
      
      let errorMessage = "Sorry, there was an error processing your request.";
      
      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          errorMessage = `Invalid ${currentChat.model.provider === "openrouter" ? "OpenRouter" : "Gemini"} API key. Please check your settings.`;
          toast.error("API Error");
        } else if (error.message.includes("429")) {
          errorMessage = `You've reached the rate limit for ${currentChat.model.provider === "openrouter" ? "OpenRouter" : "Gemini"}. Please try again later.`;
          toast.error("Rate Limit");
        } else {
          toast.error("Connection Error");
        }
      }
      
      addMessage(errorMessage, "assistant");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageGeneration = async (prompt: string) => {
    if (!currentChat) return;
    
    // Check if the current model supports image generation
    if (!currentChat.model.supportsImageGeneration) {
      // Find the image generation model
      const imageModel = allModels.find(m => m.id === "gemini-2-0-flash-exp-image-generation");
      
      if (imageModel) {
        toast.info("Switching to an image-capable model");
        
        // Update the current chat model to the image generation model
        currentChat.model = imageModel;
        
        // Let the user know we're switching models
        addMessage(
          "I've switched to a model that supports image generation for this request.",
          "assistant"
        );
      } else {
        toast.error("No image generation model available");
        addMessage(
          "Sorry, no image generation model is available. Please check your settings.",
          "assistant"
        );
        return;
      }
    }

    const apiKey = getActiveApiKey(currentChat.model.provider);
    if (!apiKey) {
      toast.error("Error: No API key available");
      return;
    }
    
    setIsLoading(true);
    setIsGeneratingImage(true);
    try {
      // Use the dedicated image generation endpoint
      toast.info("Generating image...");
      
      const imageResponse = await generateImageRequest(currentChat.model, prompt);
      
      // Add a message with the generated image
      addMessage(`Generated image for prompt: "${prompt}"`, "assistant");
      setGeneratedImageUrl(imageResponse);
      
    } catch (error) {
      console.error("Error generating image:", error);
      let errorMessage = "Sorry, there was an error generating the image.";
      
      if (error instanceof Error) {
        errorMessage += " " + error.message;
      }
      
      addMessage(errorMessage, "assistant");
      toast.error("Image Generation Failed");
    } finally {
      setIsLoading(false);
      setIsGeneratingImage(false);
    }
  };

  return {
    isLoading,
    typingText,
    thinkingText,
    isTyping,
    editingMessageId,
    setEditingMessageId,
    handleSendMessage,
    isGeneratingImage,
    generatedImageUrl,
    handleImageGeneration
  };
}
