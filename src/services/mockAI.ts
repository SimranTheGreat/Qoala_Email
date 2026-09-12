import aiResponses from "../aiData.json";
import { AIResponseSchema, type AIResponse } from "../types";

const delay = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);

    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Request aborted", "AbortError"));
      },
      { once: true },
    );
  });

export async function generateAIResponse(
  emailId: string,
  signal?: AbortSignal,
): Promise<{
  response?: AIResponse;
  raw?: unknown;
  error?: string;
}> {
  const latency = Math.floor(Math.random() * 1001) + 200;

  await delay(latency, signal);

  if (signal?.aborted) {
    throw new DOMException("Request aborted", "AbortError");
  }

  const mockResponse = aiResponses.find((item) => item.emailId === emailId);

  if (!mockResponse) {
    return {
      error: "No mock AI response found for this email.",
    };
  }

  const shouldFail =
    emailId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      10 ===
    0;

  if (shouldFail) {
    const invalidResponse = {
      ...mockResponse,
      category: "InvalidCategory",
    };

    const result = AIResponseSchema.safeParse(invalidResponse);

    return {
      raw: invalidResponse,
      error: result.success
        ? undefined
        : "AI response failed schema validation.",
    };
  }

  const result = AIResponseSchema.safeParse(mockResponse);

  if (!result.success) {
    return {
      raw: mockResponse,
      error: "AI response failed schema validation.",
    };
  }

  return {
    response: result.data,
    raw: mockResponse,
  };
}
