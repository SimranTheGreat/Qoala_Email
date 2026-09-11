import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Email } from "../types";

type SentEmailStore = {
  sentEmails: Email[];
  addSentEmail: (email: Email) => void;
  deleteSentEmail: (id: string) => void;
};

export const useSentEmailStore = create<SentEmailStore>()(
  persist(
    (set) => ({
      sentEmails: [],

      addSentEmail: (email) =>
        set((state) => ({
          sentEmails: [...state.sentEmails, email],
        })),

      deleteSentEmail: (id) =>
        set((state) => ({
          sentEmails: state.sentEmails.filter(
            (email) => email.id !== id,
          ),
        })),
    }),
    {
      name: "sent-emails",
    },
  ),
);