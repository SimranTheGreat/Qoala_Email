import { z } from "zod";

export const AIResponseSchema = z.object({
  emailId: z.string(),

  summary: z.array(z.string()).min(2).max(4),

  category: z.enum([
    "Billing",
    "Claims",
    "Endorsement",
    "General",
    "Urgent",
    "Spam",
  ]),

  suggestedAction: z.string(),

  draftReply: z.string(),
});

export type AIResponse = z.infer<typeof AIResponseSchema>;
