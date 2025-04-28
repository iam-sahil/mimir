import { ChatCompletionMessage, Message, Model } from "@/types";
import { getModelById, trackModelUsage } from "@/lib/models";
import { toast } from "@/components/ui/use-toast";

interface GeminiCompletionRequest {
  contents: {
    role: string;
    parts: Array<
      | { text: string }
      | { inlineData: { mimeType: string; data: string } }
      | { fileData: { mimeType: string; fileUri: string; data: string } }
    >;
  }[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
    topP?: number;
    topK?: number;
  };
  safetySettings?: {
    category: string;
    threshold: string;
  }[];
  tools?: any[];
}

// Helper function to convert file to base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

// Helper function to read file as text
async function readFileAsText(file: File): Promise<string | null> {
  // Only process text files
  if (!file.type.startsWith('text/') && 
      file.type !== 'application/pdf' && 
      file.type !== 'application/json' &&
      !file.type.includes('document')) {
    return null;
  }
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => {
      console.error("Error reading file as text:", error);
      resolve(null); // Resolve with null rather than rejecting
    };
  });
}

export async function callGemini(
  apiKey: string,
  modelId: string, 
  messages: Message[], 
  options?: {
    temperature?: number;
    maxOutputTokens?: number;
    topP?: number;
    topK?: number;
    withThinking?: boolean;
    withTools?: any[];
    enableWebSearch?: boolean;
    enableImageGeneration?: boolean;
  }
) {
  const model = getModelById(modelId);
  
  if (!apiKey) {
    throw new Error("Missing Gemini API key");
  }
  
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model.modelId}:generateContent?key=${apiKey}`;

  // Convert our message format to Gemini format
  const geminiMessages = [];
  
  // Process messages
  for (const message of messages) {
    // Handle different roles
    let role = "user";
    if (message.role === "assistant") {
      role = "model";
    }
    
    // Prepare parts array
    const parts = [];
    
    // Add text content
    if (message.content) {
      // Explicitly check for system role as a string
      if (message.role === "system") {
        parts.push({ text: `System: ${message.content}` });
      } else {
        parts.push({ text: message.content });
      }
    }
    
    // Add attachments if any
    if (message.attachments && message.attachments.length > 0) {
      for (const attachment of message.attachments) {
        try {
          if (attachment.type.startsWith('image/')) {
            // Convert image attachment to base64
            const base64Data = await fileToBase64(attachment.file);
            
            // Extract MIME type and base64 content
            const mimeType = base64Data.split(';')[0].split(':')[1];
            const base64Content = base64Data.split(',')[1];
            
            // Add image part
            parts.push({
              inlineData: {
                mimeType,
                data: base64Content
              }
            });
          } else if (attachment.type === 'application/pdf' || 
                    attachment.type === 'text/plain' ||
                    attachment.type === 'text/markdown' ||
                    attachment.type === 'text/html' ||
                    attachment.type.includes('document')) {
            // For document understanding
            // Read file as text if possible
            const fileContent = await readFileAsText(attachment.file);
            if (fileContent) {
              parts.push({ text: `[Document content from ${attachment.file.name}]: ${fileContent}` });
            } else {
              // If we can't read as text, convert to base64 for binary files
              const base64Data = await fileToBase64(attachment.file);
              const mimeType = base64Data.split(';')[0].split(':')[1];
              const base64Content = base64Data.split(',')[1];
              
              parts.push({
                fileData: {
                  mimeType,
                  fileUri: attachment.file.name,
                  data: base64Content
                }
              });
            }
          }
        } catch (error) {
          console.error("Error processing attachment:", error);
        }
      }
    }
    
    // Add the complete message with all parts
    if (parts.length > 0) {
      geminiMessages.push({ role, parts });
    }
  }

  // Build the request
  const request: GeminiCompletionRequest = {
    contents: geminiMessages,
    generationConfig: {
      temperature: options?.temperature || 0.7,
      maxOutputTokens: options?.maxOutputTokens || 8192,
      topP: options?.topP,
      topK: options?.topK,
    }
  };

  // Add safety settings if needed (default settings)
  request.safetySettings = [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_NONE"
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_NONE"
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_NONE"
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_NONE"
    }
  ];

  // Add tools if provided
  if (options?.withTools || options?.enableWebSearch) {
    request.tools = request.tools || [];
    
    // Add web search tool if enabled
    if (options?.enableWebSearch) {
      // Different approach based on model version
      if (model.modelId.includes("gemini-2")) {
        // For Gemini 2.0 models, use googleSearch
        request.tools.push({
          googleSearch: {}
        });
      } else if (model.modelId.includes("gemini-1.5")) {
        // For Gemini 1.5 models, use googleSearchRetrieval
        request.tools.push({
          googleSearchRetrieval: {
            dynamicRetrievalConfig: {
              dynamicThreshold: 0.3, // Default value, can be configured
              mode: "MODE_DYNAMIC" // Can be MODE_DYNAMIC or MODE_ALWAYS
            }
          }
        });
      }
    }
    
    // Add any other tools
    if (options?.withTools) {
      request.tools.push(...options.withTools);
    }
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    
    // Check if we have candidate responses
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      
      // Get response content - handle different response structures
      let content = "";
      
      if (candidate.content && candidate.content.parts) {
        // Handle text or function calls
        const parts = candidate.content.parts;
        for (const part of parts) {
          if (part.text) {
            content += part.text;
          } else if (part.functionCall) {
            // Handle function calls like web search
            content += `[Executing: ${part.functionCall.name}]\n`;
            if (part.functionCall.args) {
              content += `Arguments: ${JSON.stringify(part.functionCall.args)}\n`;
            }
          }
        }
      }
      
      // If content is still empty, provide a fallback message
      if (!content) {
        content = "I received your message but there was an issue processing the response.";
      }
      
      // Check for finish reason
      const finishReason = candidate.finishReason || "unknown";
      
      // Estimate token usage (approximate calculation)
      const estimatedInputTokens = Math.ceil(JSON.stringify(request).length / 4);
      const estimatedOutputTokens = Math.ceil(content.length / 4);
      const estimatedTotalTokens = estimatedInputTokens + estimatedOutputTokens;
      
      // Track model usage
      trackModelUsage(modelId, estimatedTotalTokens);
      
      // Create a chat completion message to return
      const completionMessage: ChatCompletionMessage = {
        role: "assistant",
        content,
        finishReason,
        id: `gemini-${Date.now()}`
      };

      // Add grounding metadata if available
      if (candidate.groundingMetadata) {
        completionMessage.groundingMetadata = candidate.groundingMetadata;

        // If there are search suggestions, add them to the response
        if (candidate.groundingMetadata.searchEntryPoint && 
            candidate.groundingMetadata.searchEntryPoint.renderedContent) {
          completionMessage.searchSuggestions = {
            renderedContent: candidate.groundingMetadata.searchEntryPoint.renderedContent,
            queries: candidate.groundingMetadata.webSearchQueries || []
          };
        }

        // If there are grounding chunks (sources), add them to the response
        if (candidate.groundingMetadata.groundingChunks) {
          completionMessage.sources = candidate.groundingMetadata.groundingChunks.map(chunk => ({
            uri: chunk.web?.uri || '',
            title: chunk.web?.title || 'Source'
          }));
        }
      }
      
      return completionMessage;
    } else {
      throw new Error("No response generated from the model");
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}

// Generate image using Gemini API
export async function generateImage(
  apiKey: string,
  model: Model,
  prompt: string
) {
  if (!model.supportsImageGeneration) {
    throw new Error('The selected model does not support image generation');
  }

  // Updated to use gemini-2.0-flash-exp-image-generation
  const modelId = "gemini-2.0-flash-exp-image-generation";
  
  // Updated request format based on Gemini API documentation
  const requestBody = {
    contents: [{
      parts: [
        { text: prompt }
      ]
    }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"]
    }
  };

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Image generation API error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to generate image');
    }

    const data = await response.json();
    console.log('Image generation response:', data);
    
    // Track model usage (image generation consumes tokens too)
    trackModelUsage(model.id, 1000); // Estimate for image generation
    
    // Extract the base64 image data from the response for the new API format
    if (data.candidates && 
        data.candidates[0] && 
        data.candidates[0].content && 
        data.candidates[0].content.parts) {
      
      // Find the part that contains image data
      for (const part of data.candidates[0].content.parts) {
        if (part.inlineData) {
          // Return the base64 data with the data URL prefix
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error('No image data found in the response');
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
}
