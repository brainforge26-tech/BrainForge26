import { prisma } from '../../config/database';
import { NotFoundError } from '../../errors/AppError';
import type { CreateServiceInput, UpdateServiceInput } from './service.validation';

export async function listServices(activeOnly = false) {
  return prisma.specializedService.findMany({
    where:   activeOnly ? { isActive: true } : {},
    orderBy: { order: 'asc' },
  });
}

export async function getServiceById(id: string) {
  const service = await prisma.specializedService.findUnique({ where: { id } });
  if (!service) throw new NotFoundError('Service not found');
  return service;
}

export async function createService(input: CreateServiceInput) {
  return prisma.specializedService.create({ data: input });
}

export async function updateService(id: string, input: UpdateServiceInput) {
  await getServiceById(id);
  return prisma.specializedService.update({ where: { id }, data: input });
}

export async function deleteService(id: string) {
  await getServiceById(id);
  await prisma.specializedService.delete({ where: { id } });
}

export async function reorderServices(ids: string[]) {
  await Promise.all(
    ids.map((id, i) => prisma.specializedService.update({ where: { id }, data: { order: i } })),
  );
}
