import { Request, Response, NextFunction } from 'express';
import * as ServiceSvc from './service.service';
import { serviceSchema, updateServiceSchema } from './service.validation';
import { sendSuccess, sendCreated } from '../../utils/response';
import { BadRequestError } from '../../errors/AppError';

export async function listServices(req: Request, res: Response, next: NextFunction) {
  try {
    const activeOnly = req.query.active === 'true';
    const services = await ServiceSvc.listServices(activeOnly);
    sendSuccess(res, { services });
  } catch (err) { next(err); }
}

export async function getService(req: Request, res: Response, next: NextFunction) {
  try {
    const service = await ServiceSvc.getServiceById(req.params.id as string);
    sendSuccess(res, { service });
  } catch (err) { next(err); }
}

export async function createService(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = serviceSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);
    const service = await ServiceSvc.createService(parsed.data);
    sendCreated(res, { service }, 'Service created');
  } catch (err) { next(err); }
}

export async function updateService(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = updateServiceSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);
    const service = await ServiceSvc.updateService(req.params.id as string, parsed.data);
    sendSuccess(res, { service }, 'Service updated');
  } catch (err) { next(err); }
}

export async function deleteService(req: Request, res: Response, next: NextFunction) {
  try {
    await ServiceSvc.deleteService(req.params.id as string);
    sendSuccess(res, null, 'Service deleted');
  } catch (err) { next(err); }
}

export async function reorderServices(req: Request, res: Response, next: NextFunction) {
  try {
    const { ids } = req.body as { ids: string[] };
    if (!Array.isArray(ids)) throw new BadRequestError('ids must be an array');
    await ServiceSvc.reorderServices(ids);
    sendSuccess(res, null, 'Services reordered');
  } catch (err) { next(err); }
}
