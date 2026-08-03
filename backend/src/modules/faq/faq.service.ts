import { prisma } from '../../config/database';
import { NotFoundError } from '../../errors/AppError';

export async function getAllFaqs(publicOnly = false) {
  return prisma.faq.findMany({
    where: publicOnly ? { isActive: true } : {},
    orderBy: { order: 'asc' },
  });
}

export async function getFaqById(id: string) {
  const item = await prisma.faq.findUnique({ where: { id } });
  if (!item) throw new NotFoundError('FAQ not found');
  return item;
}

export async function createFaq(data: any) {
  return prisma.faq.create({ data });
}

export async function updateFaq(id: string, data: any) {
  await getFaqById(id);
  return prisma.faq.update({ where: { id }, data });
}

export async function deleteFaq(id: string) {
  await getFaqById(id);
  return prisma.faq.delete({ where: { id } });
}
