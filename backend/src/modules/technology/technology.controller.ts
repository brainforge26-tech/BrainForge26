import { Request, Response, NextFunction } from 'express';
import * as techService from './technology.service';

export async function getPublicTechnologies(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await techService.getAllTechnologies(true);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getAllTechnologies(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await techService.getAllTechnologies(false);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createTechnology(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await techService.createTechnology(req.body);
    res.status(201).json({ success: true, data, message: 'Technology added' });
  } catch (err) {
    next(err);
  }
}

export async function updateTechnology(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const data = await techService.updateTechnology(id, req.body);
    res.json({ success: true, data, message: 'Technology updated' });
  } catch (err) {
    next(err);
  }
}

export async function deleteTechnology(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    await techService.deleteTechnology(id);
    res.json({ success: true, message: 'Technology deleted' });
  } catch (err) {
    next(err);
  }
}
