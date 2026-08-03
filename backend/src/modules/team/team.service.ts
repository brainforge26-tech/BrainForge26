import { prisma } from '../../config/database';
import { NotFoundError } from '../../errors/AppError';

export async function getAllTeamMembers(publicOnly = false) {
  return prisma.teamMember.findMany({
    where: publicOnly ? { isActive: true } : {},
    orderBy: [
      { displayOrder: 'asc' },
      { createdAt: 'desc' },
    ],
  });
}

export async function getTeamMemberById(id: string) {
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) throw new NotFoundError('Team member not found');
  return member;
}

export async function createTeamMember(data: any) {
  return prisma.teamMember.create({ data });
}

export async function updateTeamMember(id: string, data: any) {
  await getTeamMemberById(id);
  return prisma.teamMember.update({
    where: { id },
    data,
  });
}

export async function deleteTeamMember(id: string) {
  await getTeamMemberById(id);
  return prisma.teamMember.delete({ where: { id } });
}

export async function toggleFeatureTeamMember(id: string) {
  const member = await getTeamMemberById(id);
  return prisma.teamMember.update({
    where: { id },
    data: { isFeatured: !member.isFeatured },
  });
}
