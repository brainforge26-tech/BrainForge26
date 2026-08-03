import { Request, Response, NextFunction } from 'express';
import * as testimonialService from './testimonial.service';

export async function getPublicTestimonials(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await testimonialService.getAllTestimonials(true);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getAllTestimonials(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await testimonialService.getAllTestimonials(false);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createTestimonial(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await testimonialService.createTestimonial(req.body);
    res.status(201).json({ success: true, data, message: 'Testimonial created' });
  } catch (err) {
    next(err);
  }
}

export async function updateTestimonial(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const data = await testimonialService.updateTestimonial(id, req.body);
    res.json({ success: true, data, message: 'Testimonial updated' });
  } catch (err) {
    next(err);
  }
}

export async function deleteTestimonial(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    await testimonialService.deleteTestimonial(id);
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (err) {
    next(err);
  }
}
