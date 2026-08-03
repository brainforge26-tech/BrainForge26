import { Request, Response, NextFunction } from 'express';
import * as portfolioService from './portfolio.service';

export async function getPublicProjects(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await portfolioService.getAllProjects(true);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getAllProjects(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await portfolioService.getAllProjects(false);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getProject(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const data = await portfolioService.getProjectBySlugOrId(id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createProject(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await portfolioService.createProject(req.body);
    res.status(201).json({ success: true, data, message: 'Portfolio project created' });
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const data = await portfolioService.updateProject(id, req.body);
    res.json({ success: true, data, message: 'Portfolio project updated' });
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    await portfolioService.deleteProject(id);
    res.json({ success: true, message: 'Portfolio project deleted' });
  } catch (err) {
    next(err);
  }
}

// Industries
export async function getIndustries(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await portfolioService.getAllIndustries();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createIndustry(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await portfolioService.createIndustry(req.body);
    res.status(201).json({ success: true, data, message: 'Industry created' });
  } catch (err) {
    next(err);
  }
}

export async function updateIndustry(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const data = await portfolioService.updateIndustry(id, req.body);
    res.json({ success: true, data, message: 'Industry updated' });
  } catch (err) {
    next(err);
  }
}

export async function deleteIndustry(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    await portfolioService.deleteIndustry(id);
    res.json({ success: true, message: 'Industry deleted' });
  } catch (err) {
    next(err);
  }
}
