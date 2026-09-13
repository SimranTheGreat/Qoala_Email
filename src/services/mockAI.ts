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

  const index = Number(emailId.replace("itm_", "")) - 1;

  const mockResponse = aiResponses[index];

  if (!mockResponse) {
    return {
      error: "No mock AI response found for this email.",
    };
  }

  const hash = emailId
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  const shouldFail = hash % 8 === 0;

  if (shouldFail) {
    const failureType = hash % 4;

    let invalidResponse: unknown;

    switch (failureType) {
      case 0:
        invalidResponse = {
          ...mockResponse,
          category: "InvalidCategory",
        };
        break;

      case 1:
        invalidResponse = {
          ...mockResponse,
          priority: "P4",
        };
        break;

      case 2:
        invalidResponse = {
          ...mockResponse,
          confidence: 1.5,
        };
        break;

      default:
        invalidResponse = {
          ...mockResponse,
          summary_bullets: ["Only one summary point"],
        };
        break;
    }

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
