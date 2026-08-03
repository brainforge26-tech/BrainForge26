import { prisma } from '../../config/database';
import { NotFoundError } from '../../errors/AppError';

export async function getAllTestimonials(publicOnly = false) {
  return prisma.testimonial.findMany({
    where: publicOnly ? { isActive: true } : {},
    orderBy: { order: 'asc' },
  });
}

export async function getTestimonialById(id: string) {
  const t = await prisma.testimonial.findUnique({ where: { id } });
  if (!t) throw new NotFoundError('Testimonial not found');
  return t;
}

export async function createTestimonial(data: any) {
  return prisma.testimonial.create({ data });
}

export async function updateTestimonial(id: string, data: any) {
  await getTestimonialById(id);
  return prisma.testimonial.update({ where: { id }, data });
}

export async function deleteTestimonial(id: string) {
  await getTestimonialById(id);
  return prisma.testimonial.delete({ where: { id } });
}
