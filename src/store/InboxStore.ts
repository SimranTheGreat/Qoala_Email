import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Email } from "../types";

type InboxEmailStore = {
  inboxEmails: Email[];
  addInboxEmail: (email: Email) => void;
  setInboxEmails: (emails: Email[]) => void;
  deleteInboxEmail: (id: string) => void;
};

export const useInboxEmailStore = create<InboxEmailStore>()(
  persist(
    (set) => ({
      inboxEmails: [],

      addInboxEmail: (email) =>
        set((state) => ({
          inboxEmails: [...state.inboxEmails, email],
        })),

      setInboxEmails: (emails) =>
        set({
          inboxEmails: emails,
        }),

      deleteInboxEmail: (id) =>
        set((state) => ({
          inboxEmails: state.inboxEmails.filter(
            (email) => email.id !== id,
          ),
        })),
    }),
    {
      name: "inbox-emails",
    },
  ),
);