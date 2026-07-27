import { prisma } from '../../config/database';
import { NotFoundError, ForbiddenError } from '../../errors/AppError';
import type {
  UpdateProfileInput, PortfolioItemInput, UpdatePortfolioItemInput,
} from './developer.validation';

// ─── Get developer profile ────────────────────────────────────────────────────
export async function getMyProfile(userId: string) {
  const profile = await prisma.developerProfile.findUnique({
    where:   { userId },
    include: { portfolioItems: { orderBy: { order: 'asc' } } },
  });
  if (!profile) throw new NotFoundError('Developer profile not found');
  return profile;
}

// ─── Update developer profile ─────────────────────────────────────────────────
export async function updateMyProfile(userId: string, input: UpdateProfileInput) {
  const profile = await prisma.developerProfile.findUnique({ where: { userId } });
  if (!profile) throw new NotFoundError('Developer profile not found');

  return prisma.developerProfile.update({
    where: { userId },
    data:  input,
    include: { portfolioItems: { orderBy: { order: 'asc' } } },
  });
}

// ─── List all developers (manager/admin) ──────────────────────────────────────
export async function listDevelopers(search?: string) {
  const where = search
    ? {
        role: 'DEVELOPER' as const,
        OR: [
          { email: { contains: search, mode: 'insensitive' as const } },
          { developerProfile: { firstName: { contains: search, mode: 'insensitive' as const } } },
          { developerProfile: { lastName:  { contains: search, mode: 'insensitive' as const } } },
        ],
      }
    : { role: 'DEVELOPER' as const };

  return prisma.user.findMany({
    where,
    include: {
      developerProfile: {
        include: { portfolioItems: false },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// ─── Get single developer (manager/admin) ─────────────────────────────────────
export async function getDeveloperById(id: string) {
  const dev = await prisma.user.findUnique({
    where:   { id, role: 'DEVELOPER' },
    include: {
      developerProfile: {
        include: { portfolioItems: { orderBy: { order: 'asc' } } },
      },
      assignedProjects: {
        include: {
          project: {
            select: { id: true, name: true, status: true, completionPercent: true },
          },
        },
      },
    },
  });
  if (!dev) throw new NotFoundError('Developer not found');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safe } = dev as typeof dev & { passwordHash?: string };
  return safe;
}

// ─── Get assigned projects ────────────────────────────────────────────────────
export async function getMyProjects(userId: string) {
  return prisma.projectDeveloper.findMany({
    where: { userId },
    include: {
      project: {
        include: {
          client:  { select: { companyName: true } },
          manager: { select: { email: true, managerProfile: { select: { firstName: true, lastName: true } } } },
          milestones:     { orderBy: { order: 'asc' }, take: 5 },
          timelineStages: { orderBy: { order: 'asc' } },
          files:          { orderBy: { createdAt: 'desc' } },
          progressUpdates: { orderBy: { createdAt: 'desc' }, take: 5, include: { author: { select: { email: true } } } },
          developers: {
            include: { developer: { select: { email: true, developerProfile: { select: { firstName: true, lastName: true, title: true } } } } },
          },
        },
      },
    },
    orderBy: { joinedAt: 'desc' },
  });
}

// ─── Portfolio CRUD ───────────────────────────────────────────────────────────
export async function addPortfolioItem(userId: string, input: PortfolioItemInput) {
  const profile = await prisma.developerProfile.findUnique({ where: { userId } });
  if (!profile) throw new NotFoundError('Developer profile not found');

  return prisma.portfolioItem.create({
    data: { ...input, developerId: profile.id },
  });
}

export async function updatePortfolioItem(
  itemId: string,
  userId: string,
  input: UpdatePortfolioItemInput,
) {
  const profile = await prisma.developerProfile.findUnique({ where: { userId } });
  if (!profile) throw new NotFoundError('Developer profile not found');

  const item = await prisma.portfolioItem.findUnique({ where: { id: itemId } });
  if (!item) throw new NotFoundError('Portfolio item not found');
  if (item.developerId !== profile.id) throw new ForbiddenError('Access denied');

  return prisma.portfolioItem.update({ where: { id: itemId }, data: input });
}

export async function deletePortfolioItem(itemId: string, userId: string) {
  const profile = await prisma.developerProfile.findUnique({ where: { userId } });
  if (!profile) throw new NotFoundError('Developer profile not found');

  const item = await prisma.portfolioItem.findUnique({ where: { id: itemId } });
  if (!item) throw new NotFoundError('Portfolio item not found');
  if (item.developerId !== profile.id) throw new ForbiddenError('Access denied');

  await prisma.portfolioItem.delete({ where: { id: itemId } });
}

export async function getPortfolioItems(userId: string) {
  const profile = await prisma.developerProfile.findUnique({ where: { userId } });
  if (!profile) throw new NotFoundError('Developer profile not found');

  return prisma.portfolioItem.findMany({
    where:   { developerId: profile.id },
    orderBy: { order: 'asc' },
  });
}

// ─── Update resume URL ─────────────────────────────────────────────────────────
export async function updateResumeUrl(userId: string, resumeUrl: string) {
  const profile = await prisma.developerProfile.findUnique({ where: { userId } });
  if (!profile) throw new NotFoundError('Developer profile not found');

  return prisma.developerProfile.update({
    where: { userId },
    data:  { resumeUrl },
  });
}
