import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Email } from "../types";

type SentEmailStore = {
  sentEmails: Email[];
  addSentEmail: (email: Email) => void;
};

export const useSentEmailStore = create<SentEmailStore>()(
  persist(
    (set) => ({
      sentEmails: [],

      addSentEmail: (email) =>
        set((state) => ({
          sentEmails: [...state.sentEmails, email],
        })),
    }),
    {
      name: "sent-emails",
    }
  )
);