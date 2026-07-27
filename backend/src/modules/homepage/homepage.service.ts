import { prisma } from '../../config/database';

export const getHomepageContent = async () => {
  const content = await prisma.homepageContent.findMany({
    where: { isActive: true },
  });
  const data = content.reduce((acc, curr) => {
    acc[curr.section] = curr.content;
    return acc;
  }, {} as Record<string, any>);
  return data;
};

export const updateHomepageContent = async (section: string, content: any) => {
  return await prisma.homepageContent.upsert({
    where: { section },
    update: { content },
    create: { section, content },
  });
};

export const getTestimonials = async () => {
  return await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });
};
