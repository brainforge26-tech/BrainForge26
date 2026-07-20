import { Request, Response, NextFunction } from 'express';
import * as PricingService from './pricing.service';
import { pricingPlanSchema, updatePricingSchema } from './pricing.validation';
import { sendSuccess, sendCreated } from '../../utils/response';
import { BadRequestError } from '../../errors/AppError';

export async function listPlans(req: Request, res: Response, next: NextFunction) {
  try {
    const activeOnly = req.query.active === 'true';
    const plans = await PricingService.listPlans(activeOnly);
    sendSuccess(res, { plans });
  } catch (err) { next(err); }
}

export async function getPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const plan = await PricingService.getPlanById(req.params.id as string);
    sendSuccess(res, { plan });
  } catch (err) { next(err); }
}

export async function createPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = pricingPlanSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);
    const plan = await PricingService.createPlan(parsed.data);
    sendCreated(res, { plan }, 'Pricing plan created');
  } catch (err) { next(err); }
}

export async function updatePlan(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = updatePricingSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);
    const plan = await PricingService.updatePlan(req.params.id as string, parsed.data);
    sendSuccess(res, { plan }, 'Pricing plan updated');
  } catch (err) { next(err); }
}

export async function deletePlan(req: Request, res: Response, next: NextFunction) {
  try {
    await PricingService.deletePlan(req.params.id as string);
    sendSuccess(res, null, 'Pricing plan deleted');
  } catch (err) { next(err); }
}

export async function reorderPlans(req: Request, res: Response, next: NextFunction) {
  try {
    const { ids } = req.body as { ids: string[] };
    if (!Array.isArray(ids)) throw new BadRequestError('ids must be an array');
    await PricingService.reorderPlans(ids);
    sendSuccess(res, null, 'Plans reordered');
  } catch (err) { next(err); }
}
