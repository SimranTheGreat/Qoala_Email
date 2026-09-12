import { create } from "zustand";
import type { AIResponse } from "../types";

type AIStore = {
  responses: Record<string, AIResponse>;
  setResponse: (emailId: string, response: AIResponse) => void;
  getResponse: (emailId: string) => AIResponse | undefined;
};

export const useAIStore = create<AIStore>((set, get) => ({
  responses: {},

  setResponse: (emailId, response) =>
    set((state) => ({
      responses: {
        ...state.responses,
        [emailId]: response,
      },
    })),

  getResponse: (emailId) => get().responses[emailId],
}));
