import aiResponses from "../aiData.json";
import { AIResponseSchema, type AIResponse } from "../types";

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function generateAIResponse(
  emailId: string,
): Promise<{
  response?: AIResponse;
  raw?: unknown;
  error?: string;
}> {
  const latency = Math.floor(Math.random() * 1000) + 200;

  await delay(latency);

  const mockResponse = aiResponses.find(
    (item) => item.emailId === emailId,
  );

  if (!mockResponse) {
    return {
      error: "No mock AI response found for this email.",
    };
  }

  if (Math.random() < 0.1) {
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