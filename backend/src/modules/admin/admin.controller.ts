import { Request, Response, NextFunction } from 'express';
import * as AdminService from './admin.service';
import {
  createManagerSchema,
  updateManagerSchema,
  paginationSchema,
} from './admin.validation';
import { sendSuccess, sendCreated } from '../../utils/response';
import { BadRequestError } from '../../errors/AppError';

// GET /api/v1/admin/stats
export async function getDashboardStats(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await AdminService.getDashboardStats();
    sendSuccess(res, stats);
  } catch (err) { next(err); }
}

// GET /api/v1/admin/managers
export async function listManagers(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);
    const result = await AdminService.listManagers(parsed.data);
    sendSuccess(res, result);
  } catch (err) { next(err); }
}

// GET /api/v1/admin/managers/:id
export async function getManager(req: Request, res: Response, next: NextFunction) {
  try {
    const manager = await AdminService.getManagerById(req.params.id as string);
    sendSuccess(res, { manager });
  } catch (err) { next(err); }
}

// POST /api/v1/admin/managers
export async function createManager(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createManagerSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);
    const manager = await AdminService.createManager(parsed.data);
    sendCreated(res, { manager }, 'Manager created successfully');
  } catch (err) { next(err); }
}

// PATCH /api/v1/admin/managers/:id
export async function updateManager(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = updateManagerSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);
    const manager = await AdminService.updateManager(req.params.id as string, parsed.data);
    sendSuccess(res, { manager }, 'Manager updated');
  } catch (err) { next(err); }
}

// DELETE /api/v1/admin/managers/:id
export async function deleteManager(req: Request, res: Response, next: NextFunction) {
  try {
    await AdminService.deleteManager(req.params.id as string);
    sendSuccess(res, null, 'Manager deleted');
  } catch (err) { next(err); }
}

// PATCH /api/v1/admin/managers/:id/deactivate
export async function deactivateManager(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await AdminService.deactivateManager(req.params.id as string);
    sendSuccess(res, result);
  } catch (err) { next(err); }
}

// GET /api/v1/admin/activity
export async function getRecentActivity(req: Request, res: Response, next: NextFunction) {
  try {
    const limit   = Number(req.query.limit) || 20;
    const activity = await AdminService.getRecentActivity(limit);
    sendSuccess(res, { activity });
  } catch (err) { next(err); }
}
