
import { Message } from "@/types";

interface OpenRouterCompletionRequest {
  model: string;
  messages: Array<{
    role: string;
    content: string | Array<{
      type: string;
      text?: string;
      image_url?: {
        url: string;
      };
    }>;
  }>;
}

export async function callOpenRouter(apiKey: string, model: string, messages: Message[]) {
  // Format messages for OpenRouter API
  const formattedMessages = await Promise.all(messages.map(async (msg) => {
    // Handle messages with attachments
    if (msg.attachments && msg.attachments.length > 0) {
      const content = [];
      
      // Add text content if any
      if (msg.content) {
        content.push({
          type: "text",
          text: msg.content
        });
      }
      
      // Add image attachments if any
      for (const attachment of msg.attachments) {
        if (attachment.type.startsWith('image/')) {
          try {
            // Convert the image to base64
            const base64Data = await fileToBase64(attachment.file);
            content.push({
              type: "image_url",
              image_url: {
                url: base64Data
              }
            });
          } catch (error) {
            console.error('Error processing image:', error);
          }
        }
      }
      
      return {
        role: msg.role,
        content
      };
    } else {
      // Simple text message
      return {
        role: msg.role,
        content: msg.content
      };
    }
  }));

  const requestBody: OpenRouterCompletionRequest = {
    model,
    messages: formattedMessages,
  };

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Mimir Chat',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to call OpenRouter API');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw error;
  }
}

// Helper function to convert a File object to a base64 string
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}
