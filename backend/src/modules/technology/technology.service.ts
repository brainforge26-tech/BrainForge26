import { prisma } from '../../config/database';
import { NotFoundError } from '../../errors/AppError';

export async function getAllTechnologies(publicOnly = false) {
  return prisma.technology.findMany({
    where: publicOnly ? { isActive: true } : {},
    orderBy: { order: 'asc' },
  });
}

export async function getTechnologyById(id: string) {
  const item = await prisma.technology.findUnique({ where: { id } });
  if (!item) throw new NotFoundError('Technology not found');
  return item;
}

export async function createTechnology(data: any) {
  if (!data.slug && data.name) {
    data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  return prisma.technology.create({ data });
}

export async function updateTechnology(id: string, data: any) {
  await getTechnologyById(id);
  if (data.name && !data.slug) {
    data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  return prisma.technology.update({ where: { id }, data });
}

export async function deleteTechnology(id: string) {
  await getTechnologyById(id);
  return prisma.technology.delete({ where: { id } });
}
