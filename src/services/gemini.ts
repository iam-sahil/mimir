
import { Message } from "@/types";

interface GeminiCompletionRequest {
  contents: Array<{
    role: string;
    parts: Array<{
      text: string;
    }>;
  }>;
}

export async function callGemini(apiKey: string, model: string, messages: Message[]) {
  const formattedMessages = messages.map(msg => ({
    role: msg.role === "assistant" ? "model" : msg.role,
    parts: [{ text: msg.content }]
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
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}
