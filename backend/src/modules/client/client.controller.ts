import { Request, Response, NextFunction } from 'express';
import * as clientService from './client.service';

export async function getPublicClients(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await clientService.getAllClients(true);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getAllClients(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await clientService.getAllClients(false);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createClient(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await clientService.createClient(req.body);
    res.status(201).json({ success: true, data, message: 'Client logo added' });
  } catch (err) {
    next(err);
  }
}

export async function updateClient(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const data = await clientService.updateClient(id, req.body);
    res.json({ success: true, data, message: 'Client logo updated' });
  } catch (err) {
    next(err);
  }
}

export async function deleteClient(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    await clientService.deleteClient(id);
    res.json({ success: true, message: 'Client logo deleted' });
  } catch (err) {
    next(err);
  }
}
