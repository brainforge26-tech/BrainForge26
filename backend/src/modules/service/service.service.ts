import { prisma } from '../../config/database';
import { NotFoundError } from '../../errors/AppError';

// ─── SERVICES ─────────────────────────────────────────────────────────────

export async function getAllServices(publicOnly = false, featuredOnly = false) {
  const where: any = {};
  if (publicOnly) where.isActive = true;
  if (featuredOnly) where.isFeatured = true;

  return prisma.service.findMany({
    where,
    include: { category: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function getServiceBySlugOrId(identifier: string) {
  const service = await prisma.service.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
    },
    include: { category: true },
  });
  if (!service) throw new NotFoundError('Service not found');
  return service;
}

export async function createService(data: any) {
  if (!data.slug && data.title) {
    data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  return prisma.service.create({ data, include: { category: true } });
}

export async function updateService(id: string, data: any) {
  await getServiceBySlugOrId(id);
  if (data.title && !data.slug) {
    data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  return prisma.service.update({
    where: { id },
    data,
    include: { category: true },
  });
}

export async function deleteService(id: string) {
  await getServiceBySlugOrId(id);
  return prisma.service.delete({ where: { id } });
}

export async function toggleFeaturedService(id: string) {
  const current = await getServiceBySlugOrId(id);
  return prisma.service.update({
    where: { id },
    data: { isFeatured: !current.isFeatured },
    include: { category: true },
  });
}

// ─── SERVICE CATEGORIES ───────────────────────────────────────────────────

export async function getAllServiceCategories() {
  return prisma.serviceCategory.findMany({
    include: {
      services: {
        where: { isActive: true },
        orderBy: { order: 'asc' }
      }
    },
    orderBy: { order: 'asc' },
  });
}

export async function createServiceCategory(data: any) {
  if (!data.slug && data.name) {
    data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  return prisma.serviceCategory.create({ data });
}

export async function updateServiceCategory(id: string, data: any) {
  return prisma.serviceCategory.update({ where: { id }, data });
}

export async function deleteServiceCategory(id: string) {
  return prisma.serviceCategory.delete({ where: { id } });
}
