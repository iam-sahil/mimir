import React, { createContext, useContext, useState, useCallback } from "react";

// --- Gemini Model Config ---
export type GeminiModelId =
  | "gemini-2.5-pro-exp-03-25"
  | "gemini-2.5-flash-preview-04-17"
  | "gemini-2.0-flash";

export interface GeminiModelConfig {
  id: GeminiModelId;
  name: string;
  description: string;
  rateLimits: { rpm: number; rpd: number; tpm: number; tpd: number };
  features: {
    thinking: boolean;
    imageGeneration: boolean;
    fileAttachment: boolean;
    webSearch: boolean;
  };
  hierarchyOrder: number;
}

export const geminiModelsConfig: GeminiModelConfig[] = [
  {
    id: "gemini-2.5-pro-exp-03-25",
    name: "Gemini 2.5 Pro Experimental 03-25",
    description:
      "Audio, images, videos, and text, Enhanced thinking and reasoning, multimodal understanding, advanced coding, and more",
    rateLimits: { rpm: 5, rpd: 25, tpm: 250_000, tpd: 1_000_000 },
    features: {
      thinking: true,
      imageGeneration: true,
      fileAttachment: true,
      webSearch: true,
    },
    hierarchyOrder: 1,
  },
  {
    id: "gemini-2.5-flash-preview-04-17",
    name: "Gemini 2.5 Flash Preview 04-17",
    description:
      "Audio, images, videos, and text, Adaptive thinking, cost efficiency",
    rateLimits: { rpm: 10, rpd: 500, tpm: 250_000, tpd: 1_000_000 },
    features: {
      thinking: true,
      imageGeneration: true,
      fileAttachment: true,
      webSearch: true,
    },
    hierarchyOrder: 2,
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash (Default)",
    description:
      "Audio, images, videos, and text, images (experimental), Next generation features, speed, thinking, realtime streaming, and multimodal generation",
    rateLimits: { rpm: 15, rpd: 1500, tpm: 1_000_000, tpd: 1_000_000 },
    features: {
      thinking: true,
      imageGeneration: true,
      fileAttachment: true,
      webSearch: true,
    },
    hierarchyOrder: 3,
  },
];

// --- Usage State ---
export interface GeminiUsage {
  rpm: number;
  rpd: number;
  tpm: number;
  tpd: number;
}

export type GeminiUsageState = {
  [modelId in GeminiModelId]: GeminiUsage;
};

const initialUsage: GeminiUsageState = {
  "gemini-2.5-pro-exp-03-25": { rpm: 0, rpd: 0, tpm: 0, tpd: 0 },
  "gemini-2.5-flash-preview-04-17": { rpm: 0, rpd: 0, tpm: 0, tpd: 0 },
  "gemini-2.0-flash": { rpm: 0, rpd: 0, tpm: 0, tpd: 0 },
};

// --- Context ---
interface RateLimitContextType {
  usage: GeminiUsageState;
  selectedModelId: GeminiModelId;
  setSelectedModelId: (id: GeminiModelId) => void;
  incrementUsage: (modelId: GeminiModelId, usage: Partial<GeminiUsage>) => void;
  checkRateLimit: (modelId: GeminiModelId) => { ok: boolean; reason?: string };
  switchToNextAvailableModel: () => void;
  resetUsage: (modelId: GeminiModelId, type: keyof GeminiUsage) => void;
}

const RateLimitContext = createContext<RateLimitContextType | undefined>(
  undefined
);

export const RateLimitProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [usage, setUsage] = useState<GeminiUsageState>(initialUsage);
  const [selectedModelId, setSelectedModelId] =
    useState<GeminiModelId>("gemini-2.0-flash");

  // Increment usage counters
  const incrementUsage = useCallback(
    (modelId: GeminiModelId, inc: Partial<GeminiUsage>) => {
      setUsage((prev) => ({
        ...prev,
        [modelId]: {
          rpm: prev[modelId].rpm + (inc.rpm || 0),
          rpd: prev[modelId].rpd + (inc.rpd || 0),
          tpm: prev[modelId].tpm + (inc.tpm || 0),
          tpd: prev[modelId].tpd + (inc.tpd || 0),
        },
      }));
    },
    []
  );

  // Check if within rate limits
  const checkRateLimit = useCallback(
    (modelId: GeminiModelId) => {
      const config = geminiModelsConfig.find((m) => m.id === modelId)!;
      const u = usage[modelId];
      if (u.rpm >= config.rateLimits.rpm) return { ok: false, reason: "RPM" };
      if (u.rpd >= config.rateLimits.rpd) return { ok: false, reason: "RPD" };
      if (u.tpm >= config.rateLimits.tpm) return { ok: false, reason: "TPM" };
      if (u.tpd >= config.rateLimits.tpd) return { ok: false, reason: "TPD" };
      return { ok: true };
    },
    [usage]
  );

  // Switch to next available model in hierarchy
  const switchToNextAvailableModel = useCallback(() => {
    const sorted = geminiModelsConfig.sort(
      (a, b) => a.hierarchyOrder - b.hierarchyOrder
    );
    const currentIdx = sorted.findIndex((m) => m.id === selectedModelId);
    for (let i = currentIdx + 1; i < sorted.length; i++) {
      if (checkRateLimit(sorted[i].id).ok) {
        setSelectedModelId(sorted[i].id);
        return;
      }
    }
    // If none available, stay on current and let UI show all-limits-reached
  }, [selectedModelId, checkRateLimit]);

  // Reset usage counters (to be called by timer logic elsewhere)
  const resetUsage = useCallback(
    (modelId: GeminiModelId, type: keyof GeminiUsage) => {
      setUsage((prev) => ({
        ...prev,
        [modelId]: {
          ...prev[modelId],
          [type]: 0,
        },
      }));
    },
    []
  );

  return (
    <RateLimitContext.Provider
      value={{
        usage,
        selectedModelId,
        setSelectedModelId,
        incrementUsage,
        checkRateLimit,
        switchToNextAvailableModel,
        resetUsage,
      }}
    >
      {children}
    </RateLimitContext.Provider>
  );
};

export const useRateLimit = () => {
  const ctx = useContext(RateLimitContext);
  if (!ctx)
    throw new Error("useRateLimit must be used within RateLimitProvider");
  return ctx;
};
