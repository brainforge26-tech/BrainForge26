import { Request, Response, NextFunction } from 'express';
import * as adminService from './admin.service';

export async function getStats(_req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await adminService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}
