
import { Message, Model } from "@/types";
import { callGemini } from "@/services/gemini";

export async function sendChatRequest(
  model: Model,
  messages: Message[],
  apiKey?: string
): Promise<string> {
  if (!apiKey) {
    throw new Error(`Missing API key for ${model.provider}`);
  }

  try {
    if (model.provider === "gemini") {
      return await callGemini(apiKey, model.modelId, messages);
    } else {
      throw new Error(`Unsupported model provider: ${model.provider}`);
    }
  } catch (error) {
    console.error("Error in chat request:", error);
    throw error;
  }
}
