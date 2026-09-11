import { z } from "zod";

export const EmailSchema = z.object({
  id: z.string(),

  folder: z.enum(["inbox", "sent", "draft"]).optional(),

  received_at: z.string().optional(),
  sent_at: z.string().optional(),

  sender: z.object({
    name: z.string(),
    email: z.email(),
  }),

  recipients: z
    .array(
      z.object({
        name: z.string(),
        email: z.email(),
      }),
    )
    .optional(),

  subject: z.string(),

  channel: z.enum(["email", "chat", "phone"]),

  status: z.enum(["New", "In Progress", "Done", "Draft"]),

  priority: z.enum(["P1", "P2", "P3"]),

  body: z.string(),

  tags: z.array(z.string()),
});

export type Email = z.infer<typeof EmailSchema>;
