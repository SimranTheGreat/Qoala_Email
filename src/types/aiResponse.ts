import { z } from "zod";

export const AIResponseSchema = z.object({
  summary_bullets: z.array(z.string()).min(2).max(4),

  category: z.enum([
    "Billing",
    "Claims",
    "Endorsement",
    "General",
    "Urgent",
    "Spam",
  ]),

  priority: z.enum([
    "P1",
    "P2",
    "P3",
  ]),

  suggested_action: z.string(),

  draft_reply: z.string(),

  confidence: z.number().min(0).max(1),
});

export type AIResponse = z.infer<typeof AIResponseSchema>;