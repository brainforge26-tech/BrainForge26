import { prisma } from '../../config/database';

export async function getDashboardStats() {
  const [
    totalServices,
    totalPortfolioProjects,
    totalTeamMembers,
    totalJobApplications,
    unreadContactMessages,
    totalActiveJobs,
    totalBlogs,
    totalTestimonials,
    totalTechnologies,
    totalClients,
    totalFaqs,
  ] = await Promise.all([
    prisma.service.count(),
    prisma.portfolioProject.count(),
    prisma.teamMember.count(),
    prisma.jobApplication.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.job.count({ where: { isActive: true } }),
    prisma.blog.count(),
    prisma.testimonial.count(),
    prisma.technology.count(),
    prisma.clientLogo.count(),
    prisma.faq.count(),
  ]);

  const recentApplications = await prisma.jobApplication.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { job: { select: { title: true } } },
  });

  const recentMessages = await prisma.contactMessage.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  return {
    totalServices,
    totalPortfolioProjects,
    totalTeamMembers,
    totalJobApplications,
    unreadContactMessages,
    totalActiveJobs,
    totalBlogs,
    totalTestimonials,
    totalTechnologies,
    totalClients,
    totalFaqs,
    recentApplications,
    recentMessages,
  };
}
