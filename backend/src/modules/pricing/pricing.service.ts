import { prisma } from '../../config/database';
import { NotFoundError } from '../../errors/AppError';
import type { CreatePricingInput, UpdatePricingInput } from './pricing.validation';

export async function listPlans(activeOnly = false) {
  return prisma.pricingPlan.findMany({
    where:   activeOnly ? { isActive: true } : {},
    orderBy: { order: 'asc' },
  });
}

export async function getPlanById(id: string) {
  const plan = await prisma.pricingPlan.findUnique({ where: { id } });
  if (!plan) throw new NotFoundError('Pricing plan not found');
  return plan;
}

export async function createPlan(input: CreatePricingInput) {
  return prisma.pricingPlan.create({ data: input });
}

export async function updatePlan(id: string, input: UpdatePricingInput) {
  await getPlanById(id);
  return prisma.pricingPlan.update({ where: { id }, data: input });
}

export async function deletePlan(id: string) {
  await getPlanById(id);
  await prisma.pricingPlan.delete({ where: { id } });
}

export async function reorderPlans(ids: string[]) {
  await Promise.all(
    ids.map((id, i) => prisma.pricingPlan.update({ where: { id }, data: { order: i } })),
  );
}
