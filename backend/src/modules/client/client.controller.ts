import { Request, Response, NextFunction } from 'express';
import * as ClientService from './client.service';
import { updateClientProfileSchema, sendMessageSchema } from './client.validation';
import { sendSuccess } from '../../utils/response';
import { BadRequestError } from '../../errors/AppError';
import type { AuthRequest } from '../../middlewares/authenticate';

function uid(req: Request) { return (req as AuthRequest).user.userId; }

export async function getMyProfile(req: Request, res: Response, next: NextFunction) {
  try { sendSuccess(res, { profile: await ClientService.getMyProfile(uid(req)) }); } catch (e) { next(e); }
}

export async function updateMyProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = updateClientProfileSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);
    sendSuccess(res, { profile: await ClientService.updateMyProfile(uid(req), parsed.data) }, 'Profile updated');
  } catch (e) { next(e); }
}

export async function getMyProjects(req: Request, res: Response, next: NextFunction) {
  try { sendSuccess(res, { projects: await ClientService.getMyProjects(uid(req)) }); } catch (e) { next(e); }
}

export async function getMyProjectById(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await ClientService.getMyProjectById(uid(req), req.params.id as string);
    sendSuccess(res, { project });
  } catch (e) { next(e); }
}

export async function getMyPayments(req: Request, res: Response, next: NextFunction) {
  try { sendSuccess(res, { payments: await ClientService.getMyPayments(uid(req)) }); } catch (e) { next(e); }
}

export async function getMyFiles(req: Request, res: Response, next: NextFunction) {
  try { sendSuccess(res, { files: await ClientService.getMyFiles(uid(req)) }); } catch (e) { next(e); }
}

export async function getConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const conv = await ClientService.getOrCreateConversation(uid(req));
    sendSuccess(res, { conversation: conv });
  } catch (e) { next(e); }
}

export async function getMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const messages = await ClientService.getConversationMessages(uid(req), req.params.conversationId as string);
    sendSuccess(res, { messages });
  } catch (e) { next(e); }
}

export async function sendMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = sendMessageSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);
    const message = await ClientService.sendMessage(uid(req), parsed.data);
    sendSuccess(res, { message }, 'Message sent');
  } catch (e) { next(e); }
}

export async function markRead(req: Request, res: Response, next: NextFunction) {
  try {
    await ClientService.markMessagesRead(uid(req), req.params.conversationId as string);
    sendSuccess(res, null, 'Messages marked as read');
  } catch (e) { next(e); }
}

export async function getDashboardStats(req: Request, res: Response, next: NextFunction) {
  try { sendSuccess(res, await ClientService.getDashboardStats(uid(req))); } catch (e) { next(e); }
}
