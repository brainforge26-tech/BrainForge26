import { Request, Response } from 'express';
import * as HiringService from './hiring.service';

export const getApplications = async (req: Request, res: Response) => {
  const apps = await HiringService.getApplications();
  res.status(200).json({ success: true, data: apps });
};

export const getApplication = async (req: Request, res: Response) => {
  const app = await HiringService.getApplicationById(req.params.id);
  if (!app) return res.status(404).json({ success: false, message: 'Not found' });
  res.status(200).json({ success: true, data: app });
};

export const apply = async (req: Request, res: Response) => {
  const app = await HiringService.createApplication(req.body);
  res.status(201).json({ success: true, data: app });
};

export const updateStatus = async (req: Request, res: Response) => {
  const { status, notes } = req.body;
  const app = await HiringService.updateApplicationStatus(req.params.id, status, notes);
  res.status(200).json({ success: true, data: app });
};

export const getMyApplications = async (req: Request, res: Response) => {
  const email = req.user?.email;
  if (!email) return res.status(400).json({ success: false, message: 'User email not found' });
  const apps = await HiringService.getApplicationsByEmail(email);
  res.status(200).json({ success: true, data: apps });
};
