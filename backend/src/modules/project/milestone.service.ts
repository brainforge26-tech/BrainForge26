import { prisma } from '../../config/database';
import { NotFoundError, ForbiddenError } from '../../errors/AppError';
import { z } from 'zod';

export const createMilestoneSchema = z.object({
  name:        z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  dueDate:     z.string().datetime().optional(),
  order:       z.number().int().default(0),
});

export const updateMilestoneSchema = z.object({
  name:        z.string().min(1).optional(),
  description: z.string().optional(),
  dueDate:     z.string().datetime().optional().nullable(),
  status:      z.enum(['PENDING','IN_PROGRESS','COMPLETED','DELAYED']).optional(),
  order:       z.number().int().optional(),
});

export const updateTimelineStageSchema = z.object({
  status:      z.enum(['PENDING','IN_PROGRESS','COMPLETED','SKIPPED']),
  completedAt: z.string().datetime().optional(),
});

export const addTimelineStageSchema = z.object({
  name:  z.string().min(1, 'Stage name is required'),
  order: z.number().int().optional(),
});

export const addGallerySchema = z.object({
  url:      z.string().url('Invalid URL'),
  publicId: z.string().min(1),
  caption:  z.string().optional(),
  order:    z.number().int().default(0),
});

// ─── Verify manager owns project ──────────────────────────────────────────────
async function verifyManagerOwns(projectId: string, managerId: string, role: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new NotFoundError('Project not found');
  if (role === 'MANAGER' && project.managerId !== managerId) throw new ForbiddenError('Access denied');
  return project;
}

// ─── Milestones ───────────────────────────────────────────────────────────────
export async function createMilestone(
  projectId: string, managerId: string, role: string,
  input: z.infer<typeof createMilestoneSchema>,
) {
  await verifyManagerOwns(projectId, managerId, role);
  return prisma.milestone.create({
    data: {
      projectId,
      name:        input.name,
      description: input.description,
      dueDate:     input.dueDate ? new Date(input.dueDate) : undefined,
      order:       input.order,
    },
  });
}

export async function updateMilestone(
  milestoneId: string, managerId: string, role: string,
  input: z.infer<typeof updateMilestoneSchema>,
) {
  const milestone = await prisma.milestone.findUnique({ where: { id: milestoneId } });
  if (!milestone) throw new NotFoundError('Milestone not found');
  await verifyManagerOwns(milestone.projectId, managerId, role);

  return prisma.milestone.update({
    where: { id: milestoneId },
    data: {
      ...input,
      dueDate:     input.dueDate ? new Date(input.dueDate) : input.dueDate === null ? null : undefined,
      completedAt: input.status === 'COMPLETED' ? new Date() : undefined,
    },
  });
}

export async function deleteMilestone(milestoneId: string, managerId: string, role: string) {
  const milestone = await prisma.milestone.findUnique({ where: { id: milestoneId } });
  if (!milestone) throw new NotFoundError('Milestone not found');
  await verifyManagerOwns(milestone.projectId, managerId, role);
  await prisma.milestone.delete({ where: { id: milestoneId } });
}

export async function reorderMilestones(projectId: string, ids: string[]) {
  await Promise.all(
    ids.map((id, i) => prisma.milestone.update({ where: { id }, data: { order: i } })),
  );
}

// ─── Timeline Stages ──────────────────────────────────────────────────────────
export async function updateTimelineStage(
  stageId: string, managerId: string, role: string,
  input: z.infer<typeof updateTimelineStageSchema>,
) {
  const stage = await prisma.timelineStage.findUnique({ where: { id: stageId } });
  if (!stage) throw new NotFoundError('Timeline stage not found');
  await verifyManagerOwns(stage.projectId, managerId, role);

  return prisma.timelineStage.update({
    where: { id: stageId },
    data: {
      status:      input.status,
      completedAt: input.status === 'COMPLETED'
        ? (input.completedAt ? new Date(input.completedAt) : new Date())
        : undefined,
    },
  });
}

export async function addTimelineStage(
  projectId: string, managerId: string, role: string,
  input: z.infer<typeof addTimelineStageSchema>,
) {
  await verifyManagerOwns(projectId, managerId, role);
  const count = await prisma.timelineStage.count({ where: { projectId } });
  return prisma.timelineStage.create({
    data: {
      projectId,
      name:  input.name,
      order: input.order ?? count,
    },
  });
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
export async function addGalleryImage(
  projectId: string, managerId: string, role: string,
  input: z.infer<typeof addGallerySchema>,
) {
  await verifyManagerOwns(projectId, managerId, role);
  return prisma.projectGallery.create({
    data: { projectId, ...input },
  });
}

export async function deleteGalleryImage(
  imageId: string, managerId: string, role: string,
) {
  const img = await prisma.projectGallery.findUnique({ where: { id: imageId } });
  if (!img) throw new NotFoundError('Gallery image not found');
  await verifyManagerOwns(img.projectId, managerId, role);
  await prisma.projectGallery.delete({ where: { id: imageId } });
}

export async function getGallery(projectId: string) {
  return prisma.projectGallery.findMany({
    where:   { projectId },
    orderBy: { order: 'asc' },
  });
}
