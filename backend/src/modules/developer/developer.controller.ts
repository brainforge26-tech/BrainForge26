import { Request, Response, NextFunction } from 'express';
import * as DevService from './developer.service';
import {
  updateProfileSchema, portfolioItemSchema, updatePortfolioItemSchema,
} from './developer.validation';
import { sendSuccess } from '../../utils/response';
import { BadRequestError } from '../../errors/AppError';
import type { AuthRequest } from '../../middlewares/authenticate';

function auth(req: Request) { return (req as AuthRequest).user; }

// GET /api/v1/developer/me
export async function getMyProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await DevService.getMyProfile(auth(req).userId);
    sendSuccess(res, { profile });
  } catch (err) { next(err); }
}

// PATCH /api/v1/developer/me
export async function updateMyProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);
    const profile = await DevService.updateMyProfile(auth(req).userId, parsed.data);
    sendSuccess(res, { profile }, 'Profile updated');
  } catch (err) { next(err); }
}

// GET /api/v1/developer/me/projects
export async function getMyProjects(req: Request, res: Response, next: NextFunction) {
  try {
    const projects = await DevService.getMyProjects(auth(req).userId);
    sendSuccess(res, { projects });
  } catch (err) { next(err); }
}

// GET /api/v1/developer/me/portfolio
export async function getPortfolioItems(req: Request, res: Response, next: NextFunction) {
  try {
    const items = await DevService.getPortfolioItems(auth(req).userId);
    sendSuccess(res, { items });
  } catch (err) { next(err); }
}

// POST /api/v1/developer/me/portfolio
export async function addPortfolioItem(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = portfolioItemSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);
    const item = await DevService.addPortfolioItem(auth(req).userId, parsed.data);
    sendSuccess(res, { item }, 'Portfolio item added');
  } catch (err) { next(err); }
}

// PATCH /api/v1/developer/me/portfolio/:itemId
export async function updatePortfolioItem(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = updatePortfolioItemSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);
    const item = await DevService.updatePortfolioItem(req.params.itemId as string, auth(req).userId, parsed.data);
    sendSuccess(res, { item }, 'Portfolio item updated');
  } catch (err) { next(err); }
}

// DELETE /api/v1/developer/me/portfolio/:itemId
export async function deletePortfolioItem(req: Request, res: Response, next: NextFunction) {
  try {
    await DevService.deletePortfolioItem(req.params.itemId as string, auth(req).userId);
    sendSuccess(res, null, 'Portfolio item deleted');
  } catch (err) { next(err); }
}

// PATCH /api/v1/developer/me/resume
export async function updateResume(req: Request, res: Response, next: NextFunction) {
  try {
    const { resumeUrl } = req.body as { resumeUrl: string };
    if (!resumeUrl) throw new BadRequestError('resumeUrl is required');
    const profile = await DevService.updateResumeUrl(auth(req).userId, resumeUrl);
    sendSuccess(res, { profile }, 'Resume updated');
  } catch (err) { next(err); }
}

// GET /api/v1/users/developers  (used by manager/admin)
export async function listDevelopers(req: Request, res: Response, next: NextFunction) {
  try {
    const search = req.query.search as string | undefined;
    const developers = await DevService.listDevelopers(search);
    sendSuccess(res, { developers });
  } catch (err) { next(err); }
}

// GET /api/v1/users/developers/:id
export async function getDeveloperById(req: Request, res: Response, next: NextFunction) {
  try {
    const dev = await DevService.getDeveloperById(req.params.id as string);
    sendSuccess(res, { developer: dev });
  } catch (err) { next(err); }
}
