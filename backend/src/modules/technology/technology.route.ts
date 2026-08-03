import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/authenticate';
import * as techController from './technology.controller';

const router = Router();

// Public route
router.get('/public', techController.getPublicTechnologies);

// Admin routes
router.get('/', authenticate, authorize('ADMIN'), techController.getAllTechnologies);
router.post('/', authenticate, authorize('ADMIN'), techController.createTechnology);
router.put('/:id', authenticate, authorize('ADMIN'), techController.updateTechnology);
router.patch('/:id', authenticate, authorize('ADMIN'), techController.updateTechnology);
router.delete('/:id', authenticate, authorize('ADMIN'), techController.deleteTechnology);

export default router;
