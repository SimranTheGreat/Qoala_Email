import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Email } from "../types";

type StarredEmailStore = {
  starredEmails: Email[];

  addStarredEmail: (email: Email) => void;
  removeStarredEmail: (id: string) => void;
  isStarred: (id: string) => boolean;
  toggleStarredEmail: (email: Email) => void;
};

export const useStarredEmailStore = create<StarredEmailStore>()(
  persist(
    (set, get) => ({
      starredEmails: [],

      addStarredEmail: (email) =>
        set((state) => {
          if (state.starredEmails.some((item) => item.id === email.id)) {
            return state;
          }

          return {
            starredEmails: [...state.starredEmails, email],
          };
        }),

      removeStarredEmail: (id) =>
        set((state) => ({
          starredEmails: state.starredEmails.filter((email) => email.id !== id),
        })),

      isStarred: (id) => get().starredEmails.some((email) => email.id === id),

      toggleStarredEmail: (email) =>
        set((state) => {
          const exists = state.starredEmails.some(
            (item) => item.id === email.id,
          );

          if (exists) {
            return {
              starredEmails: state.starredEmails.filter(
                (item) => item.id !== email.id,
              ),
            };
          }

          return {
            starredEmails: [...state.starredEmails, email],
          };
        }),
    }),
    {
      name: "starred-emails",
    },
  ),
);
