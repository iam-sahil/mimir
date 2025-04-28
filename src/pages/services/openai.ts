
import { Message } from "@/types";

interface OpenAICompletionRequest {
  model: string;
  messages: Array<{
    role: string;
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

export async function callOpenAI(apiKey: string, model: string, messages: Message[]) {
  const formattedMessages = messages.map(msg => ({
    role: msg.role,
    content: msg.content,
  }));

  const requestBody: OpenAICompletionRequest = {
    model,
    messages: formattedMessages,
    temperature: 0.7,
    max_tokens: 2000,
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to call OpenAI API');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}
