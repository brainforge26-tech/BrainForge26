import { z } from 'zod';

export const serviceSchema = z.object({
  icon:     z.string().optional(),
  title:    z.string().min(1, 'Title is required'),
  features: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  order:    z.number().int().default(0),
});

export const updateServiceSchema = serviceSchema.partial();

export type CreateServiceInput = z.infer<typeof serviceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
