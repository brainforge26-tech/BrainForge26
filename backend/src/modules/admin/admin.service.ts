import bcrypt from 'bcryptjs';
import { prisma } from '../../config/database';
import { ConflictError, NotFoundError } from '../../errors/AppError';
import type { CreateManagerInput, UpdateManagerInput, PaginationInput } from './admin.validation';

const HASH_ROUNDS = 12;

// ─── Include shape reused across queries ─────────────────────────────────────
const managerInclude = {
  managerProfile: true,
} as const;

function sanitize(user: Record<string, unknown>) {
  const { passwordHash, ...safe } = user;
  void passwordHash;
  return safe;
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────
export async function getDashboardStats() {
  const [
    totalManagers,
    totalDevelopers,
    totalClients,
    totalProjects,
    activeProjects,
    completedProjects,
    totalPaymentAgg,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'MANAGER',   isActive: true } }),
    prisma.user.count({ where: { role: 'DEVELOPER', isActive: true } }),
    prisma.user.count({ where: { role: 'CLIENT',    isActive: true } }),
    prisma.project.count(),
    prisma.project.count({ where: { status: 'ACTIVE' } }),
    prisma.project.count({ where: { status: 'COMPLETED' } }),
    prisma.payment.aggregate({
      where:   { status: 'PAID' },
      _sum:    { amount: true },
    }),
  ]);

  return {
    totalManagers,
    totalDevelopers,
    totalClients,
    totalProjects,
    activeProjects,
    completedProjects,
    totalRevenue: Number(totalPaymentAgg._sum.amount ?? 0),
  };
}

// ─── Create manager ───────────────────────────────────────────────────────────
export async function createManager(input: CreateManagerInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new ConflictError('A user with this email already exists');

  const passwordHash = await bcrypt.hash(input.password, HASH_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email:    input.email,
      passwordHash,
      role:     'MANAGER',
      isActive: true,
      managerProfile: {
        create: {
          firstName:  input.firstName,
          lastName:   input.lastName,
          phone:      input.phone,
          department: input.department,
          bio:        input.bio,
        },
      },
    },
    include: managerInclude,
  });

  return sanitize(user as unknown as Record<string, unknown>);
}

// ─── List managers ────────────────────────────────────────────────────────────
export async function listManagers(query: PaginationInput) {
  const { page, limit, search } = query;
  const skip = (page - 1) * limit;

  const where = {
    role: 'MANAGER' as const,
    ...(search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { managerProfile: { firstName: { contains: search, mode: 'insensitive' as const } } },
            { managerProfile: { lastName:  { contains: search, mode: 'insensitive' as const } } },
          ],
        }
      : {}),
  };

  const [managers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take:    limit,
      include: managerInclude,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    managers: managers.map(m => sanitize(m as unknown as Record<string, unknown>)),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

// ─── Get single manager ───────────────────────────────────────────────────────
export async function getManagerById(id: string) {
  const user = await prisma.user.findUnique({
    where:   { id, role: 'MANAGER' },
    include: {
      managerProfile: true,
      managedProjects: {
        select: {
          id: true, name: true, status: true, completionPercent: true,
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  if (!user) throw new NotFoundError('Manager not found');
  return sanitize(user as unknown as Record<string, unknown>);
}

// ─── Update manager ───────────────────────────────────────────────────────────
export async function updateManager(id: string, input: UpdateManagerInput) {
  const user = await prisma.user.findUnique({ where: { id, role: 'MANAGER' } });
  if (!user) throw new NotFoundError('Manager not found');

  const { isActive, ...profileData } = input;

  // Update user active status if provided
  if (isActive !== undefined) {
    await prisma.user.update({ where: { id }, data: { isActive } });
  }

  // Update profile fields if any profile data
  const profileFields = Object.fromEntries(
    Object.entries(profileData).filter(([, v]) => v !== undefined),
  );

  if (Object.keys(profileFields).length > 0) {
    await prisma.managerProfile.upsert({
      where:  { userId: id },
      update: profileFields,
      create: {
        userId:    id,
        firstName: profileFields.firstName as string ?? '',
        lastName:  profileFields.lastName  as string ?? '',
        ...profileFields,
      },
    });
  }

  return getManagerById(id);
}

// ─── Deactivate manager ───────────────────────────────────────────────────────
export async function deactivateManager(id: string) {
  const user = await prisma.user.findUnique({ where: { id, role: 'MANAGER' } });
  if (!user) throw new NotFoundError('Manager not found');

  await prisma.user.update({ where: { id }, data: { isActive: false } });
  return { message: 'Manager deactivated' };
}

// ─── Delete manager ───────────────────────────────────────────────────────────
export async function deleteManager(id: string) {
  const user = await prisma.user.findUnique({ where: { id, role: 'MANAGER' } });
  if (!user) throw new NotFoundError('Manager not found');

  await prisma.user.delete({ where: { id } });
}

// ─── Recent activity log ──────────────────────────────────────────────────────
export async function getRecentActivity(limit = 20) {
  return prisma.activityLog.findMany({
    take:    limit,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { email: true, role: true } } },
  });
}
