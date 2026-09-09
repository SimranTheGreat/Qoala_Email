import { z } from "zod";

export const EmailSchema = z.object({
  id: z.string(),
  received_at: z.string(),
  sender: z.object({
    name: z.string(),
    email: z.email(),
  }),
  subject: z.string(),
  channel: z.string(),
  status: z.string(),
  priority: z.string(),
  body: z.string(),
  tags: z.array(z.string()),
});

export type Email = z.infer<typeof EmailSchema>;