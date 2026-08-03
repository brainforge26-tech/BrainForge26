import { prisma } from '../../config/database';
import { NotFoundError } from '../../errors/AppError';

export async function submitContactMessage(data: any) {
  return prisma.contactMessage.create({ data });
}

export async function getAllContactMessages() {
  return prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getContactMessageById(id: string) {
  const msg = await prisma.contactMessage.findUnique({ where: { id } });
  if (!msg) throw new NotFoundError('Contact message not found');
  return msg;
}

export async function markAsRead(id: string, isRead = true) {
  await getContactMessageById(id);
  return prisma.contactMessage.update({
    where: { id },
    data: { isRead },
  });
}

export async function deleteContactMessage(id: string) {
  await getContactMessageById(id);
  return prisma.contactMessage.delete({ where: { id } });
}
