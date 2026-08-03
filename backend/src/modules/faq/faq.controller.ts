import { Request, Response, NextFunction } from 'express';
import * as faqService from './faq.service';

export async function getPublicFaqs(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await faqService.getAllFaqs(true);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getAllFaqs(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await faqService.getAllFaqs(false);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createFaq(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await faqService.createFaq(req.body);
    res.status(201).json({ success: true, data, message: 'FAQ created' });
  } catch (err) {
    next(err);
  }
}

export async function updateFaq(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const data = await faqService.updateFaq(id, req.body);
    res.json({ success: true, data, message: 'FAQ updated' });
  } catch (err) {
    next(err);
  }
}

export async function deleteFaq(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    await faqService.deleteFaq(id);
    res.json({ success: true, message: 'FAQ deleted' });
  } catch (err) {
    next(err);
  }
}
