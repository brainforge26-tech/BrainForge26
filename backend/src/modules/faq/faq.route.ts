import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/authenticate';
import * as faqController from './faq.controller';

const router = Router();

// Public route
router.get('/public', faqController.getPublicFaqs);

// Admin routes
router.get('/', authenticate, authorize('ADMIN'), faqController.getAllFaqs);
router.post('/', authenticate, authorize('ADMIN'), faqController.createFaq);
router.put('/:id', authenticate, authorize('ADMIN'), faqController.updateFaq);
router.patch('/:id', authenticate, authorize('ADMIN'), faqController.updateFaq);
router.delete('/:id', authenticate, authorize('ADMIN'), faqController.deleteFaq);

export default router;
