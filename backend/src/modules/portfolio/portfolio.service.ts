import { prisma } from '../../config/database';
import { NotFoundError } from '../../errors/AppError';

// ─── PORTFOLIO PROJECTS ───────────────────────────────────────────────────

export async function getAllProjects(publicOnly = false) {
  return prisma.portfolioProject.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function getProjectBySlugOrId(identifier: string) {
  const project = await prisma.portfolioProject.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
    },
  });
  if (!project) throw new NotFoundError('Portfolio project not found');
  return project;
}

export async function createProject(data: any) {
  if (!data.slug && data.title) {
    data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  return prisma.portfolioProject.create({ data });
}

export async function updateProject(id: string, data: any) {
  await getProjectBySlugOrId(id);
  if (data.title && !data.slug) {
    data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  return prisma.portfolioProject.update({
    where: { id },
    data,
  });
}

export async function deleteProject(id: string) {
  await getProjectBySlugOrId(id);
  return prisma.portfolioProject.delete({ where: { id } });
}

// ─── INDUSTRIES ───────────────────────────────────────────────────────────

export async function getAllIndustries() {
  return prisma.industry.findMany({
    orderBy: { order: 'asc' },
  });
}

export async function createIndustry(data: any) {
  if (!data.slug && data.name) {
    data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  return prisma.industry.create({ data });
}

export async function updateIndustry(id: string, data: any) {
  return prisma.industry.update({ where: { id }, data });
}

export async function deleteIndustry(id: string) {
  return prisma.industry.delete({ where: { id } });
}
