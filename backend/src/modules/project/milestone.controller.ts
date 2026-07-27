import { Request, Response, NextFunction } from 'express';
import * as MS from './milestone.service';
import { sendSuccess, sendCreated } from '../../utils/response';
import { BadRequestError } from '../../errors/AppError';
import type { AuthRequest } from '../../middlewares/authenticate';

function auth(req: Request) { return (req as AuthRequest).user; }
const pid  = (req: Request) => req.params.projectId as string;
const mid  = (req: Request) => req.params.milestoneId as string;
const sid  = (req: Request) => req.params.stageId as string;
const imgId = (req: Request) => req.params.imageId as string;

// ── Milestones ────────────────────────────────────────────────────────────────
export async function createMilestone(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, role } = auth(req);
    const parsed = MS.createMilestoneSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);
    const m = await MS.createMilestone(pid(req), userId, role, parsed.data);
    sendCreated(res, { milestone: m }, 'Milestone created');
  } catch (e) { next(e); }
}

export async function updateMilestone(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, role } = auth(req);
    const parsed = MS.updateMilestoneSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);
    const m = await MS.updateMilestone(mid(req), userId, role, parsed.data);
    sendSuccess(res, { milestone: m }, 'Milestone updated');
  } catch (e) { next(e); }
}

export async function deleteMilestone(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, role } = auth(req);
    await MS.deleteMilestone(mid(req), userId, role);
    sendSuccess(res, null, 'Milestone deleted');
  } catch (e) { next(e); }
}

export async function reorderMilestones(req: Request, res: Response, next: NextFunction) {
  try {
    const { ids } = req.body as { ids: string[] };
    if (!Array.isArray(ids)) throw new BadRequestError('ids must be an array');
    await MS.reorderMilestones(pid(req), ids);
    sendSuccess(res, null, 'Milestones reordered');
  } catch (e) { next(e); }
}

// ── Timeline ──────────────────────────────────────────────────────────────────
export async function updateTimelineStage(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, role } = auth(req);
    const parsed = MS.updateTimelineStageSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);
    const stage = await MS.updateTimelineStage(sid(req), userId, role, parsed.data);
    sendSuccess(res, { stage }, 'Stage updated');
  } catch (e) { next(e); }
}

export async function addTimelineStage(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, role } = auth(req);
    const parsed = MS.addTimelineStageSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);
    const stage = await MS.addTimelineStage(pid(req), userId, role, parsed.data);
    sendCreated(res, { stage }, 'Stage added');
  } catch (e) { next(e); }
}

// ── Gallery ───────────────────────────────────────────────────────────────────
export async function getGallery(req: Request, res: Response, next: NextFunction) {
  try {
    const images = await MS.getGallery(pid(req));
    sendSuccess(res, { images });
  } catch (e) { next(e); }
}

export async function addGalleryImage(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, role } = auth(req);
    const parsed = MS.addGallerySchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);
    const img = await MS.addGalleryImage(pid(req), userId, role, parsed.data);
    sendCreated(res, { image: img }, 'Image added');
  } catch (e) { next(e); }
}

export async function deleteGalleryImage(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, role } = auth(req);
    await MS.deleteGalleryImage(imgId(req), userId, role);
    sendSuccess(res, null, 'Image deleted');
  } catch (e) { next(e); }
}
