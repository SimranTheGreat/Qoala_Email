import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Email } from "../types";

type InboxEmailStore = {
  inboxEmails: Email[];
  addInboxEmail: (email: Email) => void;
};

export const useInboxEmailStore = create<InboxEmailStore>()(
  persist(
    (set) => ({
      inboxEmails: [],

      addInboxEmail: (email) =>
        set((state) => ({
          inboxEmails: [...state.inboxEmails, email],
        })),
    }),
    {
      name: "inbox-emails",
    }
  )
);