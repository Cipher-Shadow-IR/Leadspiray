import { z } from "zod";

export const createLeadSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(6).max(20),
  city: z.string().trim().min(1).max(100),
  serviceId: z.coerce.number().int().min(1).max(3),
  description: z.string().trim().min(1).max(1000)
});

export const resetQuotaWebhookSchema = z.object({
  eventId: z.string().trim().min(1).max(120),
  type: z.literal("provider.quota.reset")
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
