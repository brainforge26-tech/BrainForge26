import { Request, Response } from 'express';
import * as HPService from './homepage.service';

export const getContent = async (req: Request, res: Response) => {
  const content = await HPService.getHomepageContent();
  res.status(200).json({ success: true, data: content });
};

export const updateContent = async (req: Request, res: Response) => {
  const { section, content } = req.body;
  const updated = await HPService.updateHomepageContent(section, content);
  res.status(200).json({ success: true, data: updated });
};

export const getTestimonials = async (req: Request, res: Response) => {
  const data = await HPService.getTestimonials();
  res.status(200).json({ success: true, data });
};
