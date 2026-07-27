import { Router } from 'express';
import * as SC from './service.controller';
import { authenticate, authorize } from '../../middlewares/authenticate';

const router = Router();

// Public — homepage reads active services
router.get('/',          SC.listServices);
router.get('/:id',       SC.getService);

// Manager / Admin — write operations
router.post('/',         authenticate, authorize('MANAGER', 'ADMIN'), SC.createService);
router.patch('/:id',     authenticate, authorize('MANAGER', 'ADMIN'), SC.updateService);
router.delete('/:id',    authenticate, authorize('MANAGER', 'ADMIN'), SC.deleteService);
router.post('/reorder',  authenticate, authorize('MANAGER', 'ADMIN'), SC.reorderServices);

export default router;
