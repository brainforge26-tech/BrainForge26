import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/authenticate';
import * as testimonialController from './testimonial.controller';

const router = Router();

// Public route
router.get('/public', testimonialController.getPublicTestimonials);

// Admin routes
router.get('/', authenticate, authorize('ADMIN'), testimonialController.getAllTestimonials);
router.post('/', authenticate, authorize('ADMIN'), testimonialController.createTestimonial);
router.put('/:id', authenticate, authorize('ADMIN'), testimonialController.updateTestimonial);
router.patch('/:id', authenticate, authorize('ADMIN'), testimonialController.updateTestimonial);
router.delete('/:id', authenticate, authorize('ADMIN'), testimonialController.deleteTestimonial);

export default router;
