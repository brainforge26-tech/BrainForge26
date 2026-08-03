import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/authenticate';
import * as clientController from './client.controller';

const router = Router();

// Public route
router.get('/public', clientController.getPublicClients);

// Admin routes
router.get('/', authenticate, authorize('ADMIN'), clientController.getAllClients);
router.post('/', authenticate, authorize('ADMIN'), clientController.createClient);
router.put('/:id', authenticate, authorize('ADMIN'), clientController.updateClient);
router.patch('/:id', authenticate, authorize('ADMIN'), clientController.updateClient);
router.delete('/:id', authenticate, authorize('ADMIN'), clientController.deleteClient);

export default router;
