import { z } from 'zod';

export const pricingPlanSchema = z.object({
  name:         z.string().min(1, 'Name is required'),
  description:  z.string().optional(),
  price:        z.number().nonnegative('Price must be 0 or positive'),
  currency:     z.string().default('USD'),
  billingCycle: z.string().default('one-time'),
  features:     z.array(z.string()).default([]),
  isPopular:    z.boolean().default(false),
  isActive:     z.boolean().default(true),
  order:        z.number().int().default(0),
});

export const updatePricingSchema = pricingPlanSchema.partial();

export type CreatePricingInput = z.infer<typeof pricingPlanSchema>;
export type UpdatePricingInput = z.infer<typeof updatePricingSchema>;
