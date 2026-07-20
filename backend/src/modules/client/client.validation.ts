import { z } from 'zod';

export const updateClientProfileSchema = z.object({
  companyName:        z.string().min(2).optional(),
  contactPerson:      z.string().min(2).optional(),
  phone:              z.string().optional(),
  website:            z.string().url().optional().or(z.literal('')),
  address:            z.string().optional(),
  companyDescription: z.string().optional(),
});

export const sendMessageSchema = z.object({
  content:           z.string().min(1, 'Message cannot be empty'),
  conversationId:    z.string().uuid().optional(),
});

export type UpdateClientProfileInput = z.infer<typeof updateClientProfileSchema>;
export type SendMessageInput          = z.infer<typeof sendMessageSchema>;
