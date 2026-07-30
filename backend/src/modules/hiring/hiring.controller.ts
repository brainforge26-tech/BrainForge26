import { Request, Response } from 'express';
import * as HiringService from './hiring.service';
import type { AuthRequest } from '../../middlewares/authenticate';

export const getApplications = async (req: Request, res: Response) => {
  const apps = await HiringService.getApplications();
  res.status(200).json({ success: true, data: apps });
};

export const getApplication = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const app = await HiringService.getApplicationById(id);
  if (!app) {
    res.status(404).json({ success: false, message: 'Not found' });
    return;
  }
  res.status(200).json({ success: true, data: app });
};

export const apply = async (req: Request, res: Response) => {
  const app = await HiringService.createApplication(req.body);
  res.status(201).json({ success: true, data: app });
};

export const updateStatus = async (req: Request, res: Response) => {
  const { status, notes } = req.body;
  const id = req.params.id as string;
  const app = await HiringService.updateApplicationStatus(id, status, notes);
  res.status(200).json({ success: true, data: app });
};

export const getMyApplications = async (req: Request, res: Response) => {
  const email = (req as AuthRequest).user?.email;
  if (!email) {
    res.status(400).json({ success: false, message: 'User email not found' });
    return;
  }
  const apps = await HiringService.getApplicationsByEmail(email);
  res.status(200).json({ success: true, data: apps });
};
