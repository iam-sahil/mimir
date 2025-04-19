
import { Message } from "@/types";

interface GeminiCompletionRequest {
  contents: Array<{
    role: string;
    parts: Array<{
      text?: string;
      inline_data?: {
        mime_type: string;
        data: string;
      };
    }>;
  }>;
}

export async function callGemini(apiKey: string, model: string, messages: Message[]) {
  // Format messages for Gemini API
  const formattedMessages = await Promise.all(messages.map(async (msg) => {
    const parts = [];
    
    // Add text content
    if (msg.content) {
      parts.push({ text: msg.content });
    }
    
    // Add image attachments if any
    if (msg.attachments && msg.attachments.length > 0) {
      for (const attachment of msg.attachments) {
        if (attachment.type.startsWith('image/')) {
          try {
            // Convert the image to base64
            const base64Data = await fileToBase64(attachment.file);
            parts.push({
              inline_data: {
                mime_type: attachment.type,
                data: base64Data.split(',')[1] // Remove the data URL prefix
              }
            });
          } catch (error) {
            console.error('Error processing image:', error);
          }
        }
      }
    }

    return {
      role: msg.role === "assistant" ? "model" : msg.role,
      parts
    };
  }));

  const requestBody: GeminiCompletionRequest = {
    contents: formattedMessages,
  };

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to call Gemini API');
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from Gemini API');
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API error:', error);
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
