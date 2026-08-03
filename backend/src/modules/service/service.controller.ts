import { Request, Response, NextFunction } from 'express';
import * as serviceService from './service.service';

export async function getPublicServices(req: Request, res: Response, next: NextFunction) {
  try {
    const featured = req.query.featured === 'true';
    const data = await serviceService.getAllServices(true, featured);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getAllServices(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await serviceService.getAllServices(false);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getService(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const data = await serviceService.getServiceBySlugOrId(id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createService(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await serviceService.createService(req.body);
    res.status(201).json({ success: true, data, message: 'Service created successfully' });
  } catch (err) {
    next(err);
  }
}

export async function updateService(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const data = await serviceService.updateService(id, req.body);
    res.json({ success: true, data, message: 'Service updated successfully' });
  } catch (err) {
    next(err);
  }
}

export async function deleteService(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    await serviceService.deleteService(id);
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function toggleFeaturedService(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const data = await serviceService.toggleFeaturedService(id);
    res.json({ success: true, data, message: 'Service featured status updated' });
  } catch (err) {
    next(err);
  }
}

// Categories
export async function getCategories(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await serviceService.getAllServiceCategories();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await serviceService.createServiceCategory(req.body);
    res.status(201).json({ success: true, data, message: 'Service category created' });
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const data = await serviceService.updateServiceCategory(id, req.body);
    res.json({ success: true, data, message: 'Service category updated' });
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    await serviceService.deleteServiceCategory(id);
    res.json({ success: true, message: 'Service category deleted' });
  } catch (err) {
    next(err);
  }
}
