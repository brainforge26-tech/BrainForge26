import { prisma } from '../../config/database';
import { NotFoundError } from '../../errors/AppError';

// ─── JOBS ───────────────────────────────────────────────────────────────────

export async function getAllJobs(publicOnly = false) {
  return prisma.job.findMany({
    where: publicOnly ? { isActive: true } : {},
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getJobBySlugOrId(identifier: string) {
  const job = await prisma.job.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
    },
  });
  if (!job) throw new NotFoundError('Job posting not found');
  return job;
}

export async function createJob(data: any) {
  if (!data.slug && data.title) {
    data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  return prisma.job.create({ data });
}

export async function updateJob(id: string, data: any) {
  await getJobBySlugOrId(id);
  if (data.title && !data.slug) {
    data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  return prisma.job.update({ where: { id }, data });
}

export async function deleteJob(id: string) {
  await getJobBySlugOrId(id);
  return prisma.job.delete({ where: { id } });
}

// ─── JOB APPLICATIONS ────────────────────────────────────────────────────────

export async function submitJobApplication(data: any) {
  return prisma.jobApplication.create({
    data,
    include: { job: { select: { title: true } } },
  });
}

export async function getAllJobApplications() {
  return prisma.jobApplication.findMany({
    include: { job: { select: { title: true, department: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getJobApplicationById(id: string) {
  const application = await prisma.jobApplication.findUnique({
    where: { id },
    include: { job: true },
  });
  if (!application) throw new NotFoundError('Job application not found');
  return application;
}

export async function updateJobApplicationStatus(id: string, status: any, notes?: string) {
  await getJobApplicationById(id);
  return prisma.jobApplication.update({
    where: { id },
    data: { status, ...(notes !== undefined && { notes }) },
  });
}

export async function deleteJobApplication(id: string) {
  await getJobApplicationById(id);
  return prisma.jobApplication.delete({ where: { id } });
}
