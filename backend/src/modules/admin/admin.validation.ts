import { z } from 'zod';

export const createManagerSchema = z.object({
  email:      z.string().email('Invalid email'),
  password:   z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  firstName:  z.string().min(1, 'First name is required'),
  lastName:   z.string().min(1, 'Last name is required'),
  phone:      z.string().optional(),
  department: z.string().optional(),
  bio:        z.string().optional(),
});

export const updateManagerSchema = z.object({
  firstName:  z.string().min(1).optional(),
  lastName:   z.string().min(1).optional(),
  phone:      z.string().optional(),
  department: z.string().optional(),
  bio:        z.string().optional(),
  isActive:   z.boolean().optional(),
});

export const paginationSchema = z.object({
  page:   z.coerce.number().int().min(1).default(1),
  limit:  z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
});

export type CreateManagerInput = z.infer<typeof createManagerSchema>;
export type UpdateManagerInput = z.infer<typeof updateManagerSchema>;
export type PaginationInput    = z.infer<typeof paginationSchema>;
