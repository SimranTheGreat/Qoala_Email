import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Email } from "../types";
type DraftEmailStore = {
  draftEmails: Email[];
  addDraftEmail: (email: Email) => void;
  updateDraftEmail: (id: string, updates: Partial<Email>) => void;
  deleteDraftEmail: (id: string) => void;
};

export const useDraftEmailStore = create<DraftEmailStore>()(
  persist(
    (set) => ({
      draftEmails: [],

      addDraftEmail: (email) =>
        set((state) => ({
          draftEmails: [...state.draftEmails, email],
        })),

      updateDraftEmail: (id, updates) =>
        set((state) => ({
          draftEmails: state.draftEmails.map((email) =>
            email.id === id ? { ...email, ...updates } : email,
          ),
        })),

      deleteDraftEmail: (id) =>
        set((state) => ({
          draftEmails: state.draftEmails.filter((email) => email.id !== id),
        })),
    }),
    {
      name: "draft-emails",
    },
  ),
);
