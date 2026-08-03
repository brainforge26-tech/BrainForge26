import { Request, Response, NextFunction } from 'express';
import * as mediaService from './media.service';

export async function getAllMedia(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await mediaService.getAllMediaFiles();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function uploadMedia(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }
    const { category } = req.body;
    const data = await mediaService.uploadMediaFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      category || 'general'
    );
    res.status(201).json({ success: true, data, message: 'Media file uploaded successfully' });
  } catch (err) {
    next(err);
  }
}

export async function deleteMedia(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    await mediaService.deleteMediaFile(id);
    res.json({ success: true, message: 'Media file deleted successfully' });
  } catch (err) {
    next(err);
  }
}
