import { Router } from 'express';
import * as HC from './hiring.controller';
import { authenticate, authorize } from '../../middlewares/authenticate';

const router = Router();

// Public route for candidates to apply
router.post('/apply', HC.apply);

// Developer route
router.get('/my-applications', authenticate, authorize('DEVELOPER'), HC.getMyApplications);

// Manager/Admin routes
router.use(authenticate, authorize('MANAGER', 'ADMIN'));
router.get('/', HC.getApplications);
router.get('/:id', HC.getApplication);
router.patch('/:id/status', HC.updateStatus);

export default router;
