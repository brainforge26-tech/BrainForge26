import { Request, Response, NextFunction } from 'express';
import * as FileService from './file.service';
import { sendSuccess } from '../../utils/response';
import { BadRequestError, NotFoundError } from '../../errors/AppError';
import type { AuthRequest } from '../../middlewares/authenticate';
import { FileCategory } from '@prisma/client';

export async function uploadFile(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file;
    if (!file) throw new BadRequestError('No file uploaded');

    const projectId = req.params.projectId as string;
    const category = (req.body.category as FileCategory) || 'OTHER';
    const userId = (req as AuthRequest).user.userId;

    const uploadedFile = await FileService.uploadProjectFile(projectId, userId, file, category);
    sendSuccess(res, { file: uploadedFile }, 'File uploaded successfully', 201);
  } catch (e) {
    next(e);
  }
}

export async function getFiles(req: Request, res: Response, next: NextFunction) {
  try {
    const files = await FileService.getProjectFiles(req.params.projectId as string);
    sendSuccess(res, { files });
  } catch (e) {
    next(e);
  }
}

export async function deleteFile(req: Request, res: Response, next: NextFunction) {
  try {
    await FileService.deleteProjectFile(req.params.fileId as string);
    sendSuccess(res, null, 'File deleted successfully');
  } catch (e) {
    next(e);
  }
}
