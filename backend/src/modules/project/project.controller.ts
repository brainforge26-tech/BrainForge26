import { Request, Response, NextFunction } from 'express';
import * as ProjectService from './project.service';
import {
  createProjectSchema, updateProjectSchema,
  assignDevelopersSchema, progressUpdateSchema, paginationSchema,
} from './project.validation';
import { sendSuccess, sendCreated } from '../../utils/response';
import { BadRequestError } from '../../errors/AppError';
import type { AuthRequest } from '../../middlewares/authenticate';

function auth(req: Request) { return (req as AuthRequest).user; }

export async function listPublicProjects(req: Request, res: Response, next: NextFunction) {
  try {
    const projects = await ProjectService.listPublicProjects();
    sendSuccess(res, { projects });
  } catch (err) { next(err); }
}

export async function listProjects(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, role } = auth(req);
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);
    const result = await ProjectService.listProjects(userId, role, parsed.data);
    sendSuccess(res, result);
  } catch (err) { next(err); }
}

export async function getProject(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, role } = auth(req);
    const project = await ProjectService.getProjectById(req.params.id as string, userId, role);
    sendSuccess(res, { project });
  } catch (err) { next(err); }
}

export async function createProject(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = auth(req);
    const parsed = createProjectSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);
    const project = await ProjectService.createProject(userId, parsed.data);
    sendCreated(res, { project }, 'Project created');
  } catch (err) { next(err); }
}

export async function updateProject(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = auth(req);
    const parsed = updateProjectSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);
    const project = await ProjectService.updateProject(req.params.id as string, userId, parsed.data);
    sendSuccess(res, { project }, 'Project updated');
  } catch (err) { next(err); }
}

export async function deleteProject(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, role } = auth(req);
    await ProjectService.deleteProject(req.params.id as string, userId, role);
    sendSuccess(res, null, 'Project deleted');
  } catch (err) { next(err); }
}

export async function assignDevelopers(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = auth(req);
    const parsed = assignDevelopersSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);
    const project = await ProjectService.assignDevelopers(req.params.id as string, userId, parsed.data);
    sendSuccess(res, { project }, 'Developers assigned');
  } catch (err) { next(err); }
}

export async function removeDeveloper(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = auth(req);
    await ProjectService.removeDeveloper(req.params.id as string, req.params.devId as string, userId);
    sendSuccess(res, null, 'Developer removed');
  } catch (err) { next(err); }
}

export async function postProgressUpdate(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = auth(req);
    const parsed = progressUpdateSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);
    const update = await ProjectService.postProgressUpdate(req.params.id as string, userId, parsed.data);
    sendCreated(res, { update }, 'Progress update posted');
  } catch (err) { next(err); }
}

export async function listProgressUpdates(req: Request, res: Response, next: NextFunction) {
  try {
    const updates = await ProjectService.listProgressUpdates(req.params.id as string);
    sendSuccess(res, { updates });
  } catch (err) { next(err); }
}
