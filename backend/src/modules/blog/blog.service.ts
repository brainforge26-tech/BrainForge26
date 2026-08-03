import { prisma } from '../../config/database';
import { NotFoundError } from '../../errors/AppError';

export async function getAllBlogs(publicOnly = false) {
  return prisma.blog.findMany({
    where: publicOnly ? { isPublished: true } : {},
    orderBy: { publishedAt: 'desc' },
  });
}

export async function getBlogBySlugOrId(identifier: string) {
  const blog = await prisma.blog.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
    },
  });
  if (!blog) throw new NotFoundError('Blog post not found');
  return blog;
}

export async function createBlog(data: any) {
  if (!data.slug && data.title) {
    data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  return prisma.blog.create({ data });
}

export async function updateBlog(id: string, data: any) {
  await getBlogBySlugOrId(id);
  if (data.title && !data.slug) {
    data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  return prisma.blog.update({ where: { id }, data });
}

export async function deleteBlog(id: string) {
  await getBlogBySlugOrId(id);
  return prisma.blog.delete({ where: { id } });
}
