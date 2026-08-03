import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/authenticate';
import * as contactController from './contact.controller';

const router = Router();

// Public route
router.post('/submit', contactController.submitContact);

// Admin routes
router.get('/', authenticate, authorize('ADMIN'), contactController.getAllMessages);
router.get('/:id', authenticate, authorize('ADMIN'), contactController.getMessage);
router.patch('/:id/read', authenticate, authorize('ADMIN'), contactController.markAsRead);
router.post('/:id/reply', authenticate, authorize('ADMIN'), contactController.replyMessage);
router.delete('/:id', authenticate, authorize('ADMIN'), contactController.deleteMessage);

export default router;
