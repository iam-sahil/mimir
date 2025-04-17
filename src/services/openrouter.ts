
import { Message } from "@/types";

interface OpenRouterCompletionRequest {
  model: string;
  messages: Array<{
    role: string;
    content: string;
  }>;
}

export async function callOpenRouter(apiKey: string, model: string, messages: Message[]) {
  const formattedMessages = messages.map(msg => ({
    role: msg.role,
    content: msg.content,
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
