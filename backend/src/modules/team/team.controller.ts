import { Request, Response, NextFunction } from 'express';
import * as teamService from './team.service';

export async function getPublicTeamMembers(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await teamService.getAllTeamMembers(true);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getAllTeamMembers(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await teamService.getAllTeamMembers(false);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getTeamMemberById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const data = await teamService.getTeamMemberById(id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createTeamMember(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await teamService.createTeamMember(req.body);
    res.status(201).json({ success: true, data, message: 'Developer team member added successfully' });
  } catch (err) {
    next(err);
  }
}

export async function updateTeamMember(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const data = await teamService.updateTeamMember(id, req.body);
    res.json({ success: true, data, message: 'Developer team member updated successfully' });
  } catch (err) {
    next(err);
  }
}

export async function deleteTeamMember(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    await teamService.deleteTeamMember(id);
    res.json({ success: true, message: 'Developer team member deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function toggleFeature(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const data = await teamService.toggleFeatureTeamMember(id);
    res.json({ success: true, data, message: 'Featured status updated' });
  } catch (err) {
    next(err);
  }
}
