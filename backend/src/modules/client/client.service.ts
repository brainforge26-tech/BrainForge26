import { prisma } from '../../config/database';
import { NotFoundError } from '../../errors/AppError';

export async function getAllClients(publicOnly = false) {
  return prisma.clientLogo.findMany({
    where: publicOnly ? { isActive: true } : {},
    orderBy: { order: 'asc' },
  });
}

export async function getClientById(id: string) {
  const item = await prisma.clientLogo.findUnique({ where: { id } });
  if (!item) throw new NotFoundError('Client logo not found');
  return item;
}

export async function createClient(data: any) {
  return prisma.clientLogo.create({ data });
}

export async function updateClient(id: string, data: any) {
  await getClientById(id);
  return prisma.clientLogo.update({ where: { id }, data });
}

export async function deleteClient(id: string) {
  await getClientById(id);
  return prisma.clientLogo.delete({ where: { id } });
}
