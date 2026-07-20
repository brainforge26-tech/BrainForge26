import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName:    z.string().min(1).optional(),
  lastName:     z.string().min(1).optional(),
  phone:        z.string().optional(),
  bio:          z.string().optional(),
  title:        z.string().optional(),
  githubUrl:    z.string().url().optional().or(z.literal('')),
  linkedinUrl:  z.string().url().optional().or(z.literal('')),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
  skills:       z.array(z.string()).optional(),
  experience:   z.number().int().min(0).max(50).optional(),
  isAvailable:  z.boolean().optional(),
});

export const portfolioItemSchema = z.object({
  title:        z.string().min(1, 'Title is required'),
  description:  z.string().optional(),
  url:          z.string().url().optional().or(z.literal('')),
  imageUrl:     z.string().optional(),
  technologies: z.array(z.string()).default([]),
  order:        z.number().int().default(0),
});

export const updatePortfolioItemSchema = portfolioItemSchema.partial();

export type UpdateProfileInput      = z.infer<typeof updateProfileSchema>;
export type PortfolioItemInput      = z.infer<typeof portfolioItemSchema>;
export type UpdatePortfolioItemInput = z.infer<typeof updatePortfolioItemSchema>;
