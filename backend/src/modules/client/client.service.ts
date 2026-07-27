import { prisma } from '../../config/database';
import { NotFoundError, ForbiddenError } from '../../errors/AppError';
import type { UpdateClientProfileInput, SendMessageInput } from './client.validation';

// ─── helpers ─────────────────────────────────────────────────────────────────
async function getClientProfile(userId: string) {
  const profile = await prisma.clientProfile.findUnique({ 
    where: { userId },
    include: { user: { select: { email: true, createdAt: true } } }
  });
  if (!profile) throw new NotFoundError('Client profile not found');
  return profile;
}

// ─── Get/Update profile ───────────────────────────────────────────────────────
export async function getMyProfile(userId: string) {
  return getClientProfile(userId);
}

export async function updateMyProfile(userId: string, input: UpdateClientProfileInput) {
  await getClientProfile(userId);
  return prisma.clientProfile.update({
    where: { userId },
    data:  input,
  });
}

// ─── Projects (client can only see their own) ─────────────────────────────────
export async function getMyProjects(userId: string) {
  const profile = await getClientProfile(userId);
  return prisma.project.findMany({
    where: { clientId: profile.id },
    include: {
      manager:  { select: { email: true, managerProfile: { select: { firstName: true, lastName: true } } } },
      developers: {
        include: { developer: { select: { email: true, developerProfile: { select: { firstName: true, lastName: true, title: true } } } } },
      },
      milestones:     { orderBy: { order: 'asc' } },
      timelineStages: { orderBy: { order: 'asc' } },
      progressUpdates: { orderBy: { createdAt: 'desc' }, take: 5, include: { author: { select: { email: true } } } },
      files:    { orderBy: { createdAt: 'desc' } },
      payments: { orderBy: { createdAt: 'desc' } },
      _count:   { select: { progressUpdates: true, files: true, payments: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getMyProjectById(userId: string, projectId: string) {
  const profile = await getClientProfile(userId);
  const project = await prisma.project.findFirst({
    where: { id: projectId, clientId: profile.id },
    include: {
      manager:  { select: { email: true, managerProfile: { select: { firstName: true, lastName: true } } } },
      developers: {
        include: { developer: { select: { email: true, developerProfile: { select: { firstName: true, lastName: true, title: true } } } } },
      },
      milestones:     { orderBy: { order: 'asc' } },
      timelineStages: { orderBy: { order: 'asc' } },
      progressUpdates: {
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { email: true, role: true } } },
      },
      files:    { orderBy: { createdAt: 'desc' } },
      payments: { orderBy: { createdAt: 'desc' } },
    },
  });
  if (!project) throw new NotFoundError('Project not found');
  return project;
}

// ─── Payments ─────────────────────────────────────────────────────────────────
export async function getMyPayments(userId: string) {
  const profile = await getClientProfile(userId);
  return prisma.payment.findMany({
    where:   { project: { clientId: profile.id } },
    include: { project: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

// ─── Files ────────────────────────────────────────────────────────────────────
export async function getMyFiles(userId: string) {
  const profile = await getClientProfile(userId);
  return prisma.projectFile.findMany({
    where:   { project: { clientId: profile.id } },
    include: { project: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

// ─── Messages / Conversations ─────────────────────────────────────────────────
export async function getOrCreateConversation(userId: string) {
  const profile = await getClientProfile(userId);
  const existing = await prisma.conversation.findFirst({ where: { clientId: profile.id } });
  if (existing) return existing;
  return prisma.conversation.create({ data: { clientId: profile.id } });
}

export async function getConversationMessages(userId: string, conversationId: string) {
  const profile = await getClientProfile(userId);
  const conv = await prisma.conversation.findFirst({ where: { id: conversationId, clientId: profile.id } });
  if (!conv) throw new ForbiddenError('Access denied');
  return prisma.message.findMany({
    where:   { conversationId },
    orderBy: { createdAt: 'asc' },
    include: { sender: { select: { email: true, role: true } } },
  });
}

export async function sendMessage(userId: string, input: SendMessageInput) {
  const profile = await getClientProfile(userId);

  let conversationId = input.conversationId;
  if (!conversationId) {
    const conv = await getOrCreateConversation(userId);
    conversationId = conv.id;
  } else {
    const conv = await prisma.conversation.findFirst({ where: { id: conversationId, clientId: profile.id } });
    if (!conv) throw new ForbiddenError('Access denied');
  }

  return prisma.message.create({
    data: { conversationId, senderId: userId, content: input.content },
    include: { sender: { select: { email: true, role: true } } },
  });
}

export async function markMessagesRead(userId: string, conversationId: string) {
  const profile = await getClientProfile(userId);
  const conv = await prisma.conversation.findFirst({ where: { id: conversationId, clientId: profile.id } });
  if (!conv) throw new ForbiddenError('Access denied');

  await prisma.message.updateMany({
    where: { conversationId, senderId: { not: userId }, isRead: false },
    data:  { isRead: true },
  });
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────
export async function getDashboardStats(userId: string) {
  const profile = await getClientProfile(userId);
  const [active, completed, pending, totalPayment, unreadMessages] = await Promise.all([
    prisma.project.count({ where: { clientId: profile.id, status: 'ACTIVE'    } }),
    prisma.project.count({ where: { clientId: profile.id, status: 'COMPLETED' } }),
    prisma.project.count({ where: { clientId: profile.id, status: 'PENDING'   } }),
    prisma.payment.aggregate({
      where:  { project: { clientId: profile.id }, status: 'PAID' },
      _sum:   { amount: true },
    }),
    prisma.message.count({
      where: { conversation: { clientId: profile.id }, senderId: { not: userId }, isRead: false },
    }),
  ]);

  return {
    activeProjects:    active,
    completedProjects: completed,
    pendingProjects:   pending,
    totalPayments:     Number(totalPayment._sum.amount ?? 0),
    unreadMessages,
  };
}

export async function listAllClients() {
  return prisma.clientProfile.findMany({
    include: {
      user: {
        select: { email: true, isActive: true, createdAt: true }
      }
    },
    orderBy: {
      companyName: 'asc'
    }
  });
}
