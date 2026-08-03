import { Request, Response, NextFunction } from 'express';
import * as blogService from './blog.service';

export async function getPublicBlogs(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await blogService.getAllBlogs(true);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getAllBlogs(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await blogService.getAllBlogs(false);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getBlog(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const data = await blogService.getBlogBySlugOrId(id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createBlog(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await blogService.createBlog(req.body);
    res.status(201).json({ success: true, data, message: 'Blog created' });
  } catch (err) {
    next(err);
  }
}

export async function updateBlog(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const data = await blogService.updateBlog(id, req.body);
    res.json({ success: true, data, message: 'Blog updated' });
  } catch (err) {
    next(err);
  }
}

export async function deleteBlog(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    await blogService.deleteBlog(id);
    res.json({ success: true, message: 'Blog deleted' });
  } catch (err) {
    next(err);
  }
}
