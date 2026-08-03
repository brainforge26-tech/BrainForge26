import { Request, Response, NextFunction } from 'express';
import * as hiringService from './hiring.service';

export async function getPublicJobs(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await hiringService.getAllJobs(true);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getAllJobs(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await hiringService.getAllJobs(false);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getJob(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const data = await hiringService.getJobBySlugOrId(id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createJob(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await hiringService.createJob(req.body);
    res.status(201).json({ success: true, data, message: 'Job created' });
  } catch (err) {
    next(err);
  }
}

export async function updateJob(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const data = await hiringService.updateJob(id, req.body);
    res.json({ success: true, data, message: 'Job updated' });
  } catch (err) {
    next(err);
  }
}

export async function deleteJob(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    await hiringService.deleteJob(id);
    res.json({ success: true, message: 'Job deleted' });
  } catch (err) {
    next(err);
  }
}

// Applications
export async function submitApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await hiringService.submitJobApplication(req.body);
    res.status(201).json({ success: true, data, message: 'Job application submitted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function getAllApplications(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await hiringService.getAllJobApplications();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const data = await hiringService.getJobApplicationById(id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function updateApplicationStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const { status, notes } = req.body;
    const data = await hiringService.updateJobApplicationStatus(id, status, notes);
    res.json({ success: true, data, message: 'Application status updated' });
  } catch (err) {
    next(err);
  }
}

export async function deleteApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    await hiringService.deleteJobApplication(id);
    res.json({ success: true, message: 'Application deleted' });
  } catch (err) {
    next(err);
  }
}
