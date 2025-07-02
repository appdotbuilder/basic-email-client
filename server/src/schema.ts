
import { z } from 'zod';

// Email schema
export const emailSchema = z.object({
  id: z.number(),
  sender: z.string(),
  recipient: z.string(),
  subject: z.string(),
  body: z.string(),
  sent_at: z.coerce.date()
});

export type Email = z.infer<typeof emailSchema>;

// Input schema for creating emails
export const createEmailInputSchema = z.object({
  sender: z.string().min(1, "Sender is required"),
  recipient: z.string().min(1, "Recipient is required"), 
  subject: z.string().min(1, "Subject is required"),
  body: z.string()
});

export type CreateEmailInput = z.infer<typeof createEmailInputSchema>;

// Input schema for getting emails by recipient
export const getEmailsByRecipientInputSchema = z.object({
  recipient: z.string().min(1, "Recipient is required")
});

export type GetEmailsByRecipientInput = z.infer<typeof getEmailsByRecipientInputSchema>;

// Input schema for getting email by ID
export const getEmailByIdInputSchema = z.object({
  id: z.number().int().positive()
});

export type GetEmailByIdInput = z.infer<typeof getEmailByIdInputSchema>;
