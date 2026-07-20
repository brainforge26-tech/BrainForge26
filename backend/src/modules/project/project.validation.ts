import { z } from 'zod';

export const createProjectSchema = z.object({
  name:               z.string().min(2, 'Project name is required'),
  description:        z.string().optional(),
  projectType:        z.string().optional(),
  technologies:       z.array(z.string()).default([]),
  priority:           z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  clientId:           z.string().uuid('Invalid client ID'),
  startDate:          z.string().datetime().optional(),
  estimatedDelivery:  z.string().datetime().optional(),
  budget:             z.number().positive().optional(),
  managerNotes:       z.string().optional(),
});

export const updateProjectSchema = z.object({
  name:               z.string().min(2).optional(),
  description:        z.string().optional(),
  projectType:        z.string().optional(),
  technologies:       z.array(z.string()).optional(),
  status:             z.enum(['PENDING','ACTIVE','ON_HOLD','COMPLETED','CANCELLED']).optional(),
  priority:           z.enum(['LOW','MEDIUM','HIGH','URGENT']).optional(),
  completionPercent:  z.number().int().min(0).max(100).optional(),
  startDate:          z.string().datetime().optional(),
  estimatedDelivery:  z.string().datetime().optional(),
  managerNotes:       z.string().optional(),
  budget:             z.number().positive().optional(),
});

export const assignDevelopersSchema = z.object({
  developerIds: z.array(z.string().uuid()).min(1, 'At least one developer required'),
});

export const progressUpdateSchema = z.object({
  title:           z.string().min(1, 'Title is required'),
  description:     z.string().min(1, 'Description is required'),
  progressPercent: z.number().int().min(0).max(100),
});

export const paginationSchema = z.object({
  page:    z.coerce.number().int().min(1).default(1),
  limit:   z.coerce.number().int().min(1).max(100).default(10),
  search:  z.string().optional(),
  status:  z.enum(['PENDING','ACTIVE','ON_HOLD','COMPLETED','CANCELLED']).optional(),
});

export type CreateProjectInput     = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput     = z.infer<typeof updateProjectSchema>;
export type AssignDevelopersInput  = z.infer<typeof assignDevelopersSchema>;
export type ProgressUpdateInput    = z.infer<typeof progressUpdateSchema>;
export type ProjectPaginationInput = z.infer<typeof paginationSchema>;
