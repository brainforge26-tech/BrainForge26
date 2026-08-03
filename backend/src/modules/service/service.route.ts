import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/authenticate';
import * as serviceController from './service.controller';

const router = Router();

// Public routes
router.get('/public', serviceController.getPublicServices);
router.get('/categories', serviceController.getCategories);
router.get('/slug/:id', serviceController.getService);

// Admin Service Categories management
router.post('/categories', authenticate, authorize('ADMIN'), serviceController.createCategory);
router.put('/categories/:id', authenticate, authorize('ADMIN'), serviceController.updateCategory);
router.delete('/categories/:id', authenticate, authorize('ADMIN'), serviceController.deleteCategory);

// Admin Services CRUD
router.get('/', authenticate, authorize('ADMIN'), serviceController.getAllServices);
router.get('/:id', serviceController.getService);
router.post('/', authenticate, authorize('ADMIN'), serviceController.createService);
router.put('/:id', authenticate, authorize('ADMIN'), serviceController.updateService);
router.patch('/:id/toggle-feature', authenticate, authorize('ADMIN'), serviceController.toggleFeaturedService);
router.patch('/:id', authenticate, authorize('ADMIN'), serviceController.updateService);
router.delete('/:id', authenticate, authorize('ADMIN'), serviceController.deleteService);

export default router;
